#!/bin/bash

################################################################################
# Git Initialization Script for Hetzner Servers
# Purpose: Initialize and configure Git with SSH authentication
# Features: SSH key management, GitHub connection testing, interactive setup
# Usage: bash git-init.sh
################################################################################

set -o pipefail

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_NAME="$(basename "$0")"
CURRENT_USER=$(whoami)
SSH_DIR="$HOME/.ssh"
SSH_KEY_NAME="github"
SSH_KEY_PATH="$SSH_DIR/id_ed25519_${SSH_KEY_NAME}"
SSH_TEST_TIMEOUT=10

# State tracking
CHANGES_MADE=()
ROLLBACK_COMMANDS=()
DEFAULT_BRANCH=""

################################################################################
# Helper Functions
################################################################################

print_header() {
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}▶ $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

print_step() {
    echo -e "${MAGENTA}➜ $1${NC}"
}

confirm() {
    local prompt="$1"
    local response
    
    while true; do
        read -p "$(echo -e ${YELLOW}${prompt}${NC}) (y/n): " response
        case "$response" in
            [yY])
                return 0
                ;;
            [nN])
                return 1
                ;;
            *)
                echo "Please answer y or n."
                ;;
        esac
    done
}

# Track changes for rollback
track_change() {
    local description="$1"
    local rollback_cmd="$2"
    
    CHANGES_MADE+=("$description")
    ROLLBACK_COMMANDS+=("$rollback_cmd")
    print_info "Tracked: $description"
}

# Execute command with error handling
execute_cmd() {
    local cmd="$1"
    local description="$2"
    local rollback_cmd="$3"
    
    print_step "Executing: $description"
    
    if eval "$cmd"; then
        print_success "$description completed"
        if [ -n "$rollback_cmd" ]; then
            track_change "$description" "$rollback_cmd"
        fi
        return 0
    else
        print_error "Failed: $description"
        return 1
    fi
}

# Rollback function
rollback() {
    print_header "⚠️  ROLLING BACK CHANGES"
    print_warning "This will attempt to undo the changes made by this script"
    echo ""
    
    if [ ${#ROLLBACK_COMMANDS[@]} -eq 0 ]; then
        print_warning "No changes to rollback"
        return 0
    fi
    
    if ! confirm "Proceed with rollback?"; then
        print_warning "Rollback cancelled"
        return 0
    fi
    
    # Rollback in reverse order
    for ((i=${#ROLLBACK_COMMANDS[@]}-1; i>=0; i--)); do
        local cmd="${ROLLBACK_COMMANDS[$i]}"
        local desc="${CHANGES_MADE[$i]}"
        
        print_warning "Rolling back: $desc"
        if eval "$cmd" 2>/dev/null; then
            print_success "Rolled back: $desc"
        else
            print_error "Failed to rollback: $desc"
        fi
    done
    
    print_warning "Rollback completed"
}

# Error handler
error_handler() {
    local line_number=$1
    print_error "Script failed at line $line_number"
    print_header "ERROR HANDLING"
    
    if confirm "Would you like to rollback the changes made so far?"; then
        rollback
    else
        print_warning "Changes were NOT rolled back"
        print_warning "Manual intervention may be required"
    fi
    
    exit 1
}

trap 'error_handler ${LINENO}' ERR

# Prompt for input with validation
prompt_input() {
    local prompt="$1"
    local var_name="$2"
    local validation_regex="$3"
    local response
    
    while true; do
        read -p "$(echo -e ${YELLOW}${prompt}${NC}): " response
        
        if [ -z "$response" ]; then
            print_error "Input cannot be empty"
            continue
        fi
        
        if [ -n "$validation_regex" ] && ! [[ $response =~ $validation_regex ]]; then
            print_error "Invalid input format"
            continue
        fi
        
        eval "$var_name='$response'"
        return 0
    done
}

################################################################################
# Step Functions
################################################################################

step_install_git() {
    print_header "Step 1/7: Install Git"
    
    if command -v git &> /dev/null; then
        local version=$(git --version)
        print_warning "Git is already installed: $version"
        return 0
    fi
    
    execute_cmd \
        "sudo apt update && sudo apt install -y git" \
        "Install Git" \
        "sudo apt remove -y git"
}

step_check_ssh_key() {
    print_header "Step 2/7: Check/Generate SSH Key"
    
    echo ""
    print_info "Current User: $CURRENT_USER"
    print_info "SSH Directory: $SSH_DIR"
    print_info "SSH Key Path: $SSH_KEY_PATH"
    echo ""
    
    # Create SSH directory if needed
    if [ ! -d "$SSH_DIR" ]; then
        print_step "Creating SSH directory..."
        mkdir -p "$SSH_DIR"
        chmod 700 "$SSH_DIR"
        print_success "SSH directory created: $SSH_DIR"
    fi
    
    # Check if key exists
    if [ -f "$SSH_KEY_PATH" ]; then
        print_warning "SSH key already exists"
        
        # Show key fingerprint
        local fingerprint=$(ssh-keygen -l -f "$SSH_KEY_PATH" 2>/dev/null | awk '{print $2}')
        if [ -n "$fingerprint" ]; then
            print_info "Key fingerprint: $fingerprint"
        fi
        
        if confirm "Use existing SSH key?"; then
            return 0
        fi
    fi
    
    # Generate new key
    echo ""
    print_info "Generating new SSH key (ed25519)"
    echo ""
    
    # Prompt for GitHub email
    prompt_input "Enter your GitHub registered email address" "GITHUB_EMAIL" "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    
    echo ""
    print_step "Generating SSH key with email: $GITHUB_EMAIL"
    
    if ssh-keygen -t ed25519 -C "$GITHUB_EMAIL" -f "$SSH_KEY_PATH" -N ""; then
        track_change "Generate SSH key" "rm -f '$SSH_KEY_PATH' '$SSH_KEY_PATH.pub'"
        print_success "SSH key generated successfully"
        print_info "Private key: $SSH_KEY_PATH"
        print_info "Public key: $SSH_KEY_PATH.pub"
        
        # Set correct permissions
        chmod 600 "$SSH_KEY_PATH"
        chmod 644 "$SSH_KEY_PATH.pub"
        
        # Show public key for user to add to GitHub
        echo ""
        print_warning "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        print_warning "Add this public key to your GitHub account"
        print_warning "https://github.com/settings/keys (New SSH Key)"
        print_warning "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        cat "$SSH_KEY_PATH.pub"
        echo ""
        print_warning "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        
        if ! confirm "Have you added the public key to your GitHub account?"; then
            print_error "Cannot proceed without key added to GitHub"
            print_error "Please add the key above to GitHub and run the script again"
            return 1
        fi
    else
        print_error "Failed to generate SSH key"
        return 1
    fi
}

step_configure_ssh_config() {
    print_header "Step 3/7: Configure SSH Config"
    
    local ssh_config="$SSH_DIR/config"
    
    # Check if GitHub entry already exists
    if [ -f "$ssh_config" ] && grep -q "Host github.com" "$ssh_config"; then
        print_warning "GitHub SSH config already exists"
        
        if ! confirm "Reconfigure GitHub SSH settings?"; then
            return 0
        fi
        
        # Remove old config
        sed -i '/^Host github\.com$/,/^$/d' "$ssh_config"
    fi
    
    if confirm "Configure SSH for GitHub?"; then
        # Backup existing config
        if [ -f "$ssh_config" ]; then
            cp "$ssh_config" "${ssh_config}.backup.$(date +%s)"
            print_info "Backed up existing SSH config"
        fi
        
        echo ""
        print_info "GitHub SSH Connection Methods:"
        echo "  1. Port 443 (HTTPS alternative - recommended, more reliable)"
        echo "  2. Port 22 (standard SSH - may be blocked by ISP/firewall)"
        echo ""
        
        local git_hostname="ssh.github.com"
        local git_port="443"
        
        if confirm "Use GitHub SSH over HTTPS port 443 (recommended)?"; then
            git_hostname="ssh.github.com"
            git_port="443"
            print_info "Selected: ssh.github.com:443"
        else
            git_hostname="github.com"
            git_port="22"
            print_info "Selected: github.com:22"
        fi
        
        echo ""
        
        # Add GitHub SSH config with all necessary options
        cat >> "$ssh_config" <<EOF

# GitHub SSH Configuration
Host github.com
    HostName $git_hostname
    User git
    Port $git_port
    IdentityFile $SSH_KEY_PATH
    AddKeysToAgent yes
    StrictHostKeyChecking accept-new
    ProxyUseFdpass no

EOF
        
        chmod 600 "$ssh_config"
        print_success "SSH config updated for GitHub"
        print_info "Using $git_hostname:$git_port"
        
        echo ""
        print_info "SSH config content:"
        grep -A 8 "Host github.com" "$ssh_config"
        echo ""
        
        track_change "Configure SSH for GitHub" "sed -i '/^# GitHub SSH Configuration/,/^$/d' '$ssh_config'"
    fi
}

step_test_github_connection() {
    print_header "Step 4/7: Test GitHub Connection"
    
    echo ""
    print_step "Preparing SSH connection test..."
    echo ""
    
    # Start SSH agent if not running
    if [ -z "$SSH_AUTH_SOCK" ]; then
        print_info "Starting SSH agent..."
        eval "$(ssh-agent -s)" > /dev/null 2>&1
    fi
    
    # Add key to SSH agent
    print_step "Adding SSH key to agent..."
    if ssh-add "$SSH_KEY_PATH" 2>/dev/null; then
        print_success "SSH key added to agent"
    else
        print_warning "Could not add key to agent (continuing anyway)"
    fi
    
    echo ""
    print_step "Testing SSH connection to GitHub (${SSH_TEST_TIMEOUT} second timeout)..."
    echo ""
    
    # Test with timeout to prevent hanging
    local ssh_output
    local ssh_exit_code
    
    # Use proper alias for github.com that uses the config we set up
    ssh_output=$(timeout $SSH_TEST_TIMEOUT ssh -T git@github.com 2>&1)
    ssh_exit_code=$?
    
    case $ssh_exit_code in
        0)
            # Successfully authenticated
            print_success "Successfully authenticated with GitHub!"
            print_info "$ssh_output"
            return 0
            ;;
        1)
            # Exit code 1 with "authenticated" in output = success
            if echo "$ssh_output" | grep -q "authenticated\|Hi "; then
                print_success "Successfully authenticated with GitHub!"
                print_info "$ssh_output"
                return 0
            else
                print_warning "SSH connection returned:"
                echo "$ssh_output"
                echo ""
            fi
            ;;
        124)
            # Timeout (SIGTERM)
            print_error "SSH connection timed out (${SSH_TEST_TIMEOUT} seconds)"
            print_warning "Possible causes:"
            echo "  • GitHub server is unreachable"
            echo "  • Port is blocked by firewall/ISP"
            echo "  • Network connectivity issue"
            echo "  • SSH key not added to GitHub account"
            echo ""
            print_info "Try the following:"
            echo "  1. Check SSH config: cat ~/.ssh/config | grep -A 8 'Host github.com'"
            echo "  2. Run verbose test: ssh -vvv git@github.com 2>&1 | grep -i 'connecting\\|port'"
            echo "  3. Check SSH key: ssh-add -l"
            echo ""
            if ! confirm "Continue without GitHub verification?"; then
                print_error "Cannot proceed - GitHub connection required"
                return 1
            fi
            print_warning "Proceeding without GitHub verification"
            ;;
        *)
            print_warning "SSH connection test returned exit code: $ssh_exit_code"
            echo "$ssh_output"
            echo ""
            if ! confirm "Continue anyway?"; then
                return 1
            fi
            ;;
    esac
    
    return 0
}

step_configure_git_global() {
    print_header "Step 5/7: Configure Git Global Settings"
    
    echo ""
    print_info "Configuring global Git settings..."
    echo ""
    
    # CRITICAL: Clean up any existing problematic SSH command config
    # This can interfere with SSH config file reading
    if git config --global core.sshCommand &>/dev/null; then
        print_warning "Found existing core.sshCommand setting"
        print_step "Removing problematic core.sshCommand (it disables SSH config)..."
        
        if git config --global --unset core.sshCommand; then
            print_success "Removed core.sshCommand"
            track_change "Remove core.sshCommand" "git config --global core.sshCommand 'ssh -F /dev/null'"
        fi
    fi
    
    # Check if user already configured
    local existing_user=$(git config --global user.name 2>/dev/null)
    
    if [ -n "$existing_user" ]; then
        print_warning "Git user already configured: $existing_user"
        if ! confirm "Reconfigure Git user settings?"; then
            print_info "Skipping Git user configuration"
            return 0
        fi
    fi
    
    # Prompt for user information
    prompt_input "Enter your full name (for Git commits)" "GIT_NAME"
    prompt_input "Enter your email (for Git commits)" "GIT_EMAIL" "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    
    echo ""
    print_step "Applying Git configuration..."
    echo ""
    
    # User settings
    execute_cmd \
        "git config --global user.name '$GIT_NAME'" \
        "Set Git user name: $GIT_NAME" \
        "git config --global --unset user.name"
    
    execute_cmd \
        "git config --global user.email '$GIT_EMAIL'" \
        "Set Git user email: $GIT_EMAIL" \
        "git config --global --unset user.email"
    
    # Core editor (nano for server safety)
    execute_cmd \
        "git config --global core.editor nano" \
        "Set core editor to nano" \
        "git config --global --unset core.editor"
    
    # Garbage collection
    execute_cmd \
        "git config --global gc.auto 256" \
        "Configure garbage collection (auto after 256 objects)" \
        "git config --global --unset gc.auto"
    
    execute_cmd \
        "git config --global gc.autodetach true" \
        "Enable background garbage collection" \
        "git config --global --unset gc.autodetach"
    
    # UI and output
    execute_cmd \
        "git config --global color.ui auto" \
        "Enable colored output" \
        "git config --global --unset color.ui"
    
    execute_cmd \
        "git config --global push.default simple" \
        "Set push default to simple" \
        "git config --global --unset push.default"
    
    execute_cmd \
        "git config --global fetch.prune true" \
        "Auto-prune remote tracking branches" \
        "git config --global --unset fetch.prune"
    
    # Whitespace handling
    execute_cmd \
        "git config --global core.whitespace 'space-before-tab,-indent-with-non-tab,trailing-space'" \
        "Configure whitespace handling" \
        "git config --global --unset core.whitespace"
    
    # Better diffs
    execute_cmd \
        "git config --global diff.algorithm histogram" \
        "Configure histogram diff algorithm" \
        "git config --global --unset diff.algorithm"
    
    print_success "Git global configuration completed"
}

step_clone_repository() {
    print_header "Step 6/7: Clone Repository"
    
    echo ""
    print_info "You can clone an existing repository or skip for now"
    echo ""
    
    if ! confirm "Clone a repository now?"; then
        print_info "Repository cloning skipped"
        print_info "You can clone later with: git clone --branch <branch> <url> <directory>"
        return 0
    fi
    
    echo ""
    
    # Ensure SSH agent is running and key is added
    print_step "Preparing SSH for cloning..."
    
    if [ -z "$SSH_AUTH_SOCK" ]; then
        print_info "Starting SSH agent..."
        eval "$(ssh-agent -s)" > /dev/null 2>&1
    fi
    
    # Add key to SSH agent
    if ! ssh-add -l 2>/dev/null | grep -q "$(ssh-keygen -l -f "$SSH_KEY_PATH" 2>/dev/null | awk '{print $2}')"; then
        print_info "Adding SSH key to agent..."
        ssh-add "$SSH_KEY_PATH" 2>/dev/null
    fi
    
    # Verify SSH config
    if ! grep -q "Host github.com" "$SSH_DIR/config" 2>/dev/null; then
        print_error "SSH config for GitHub not found"
        print_error "Please configure SSH first"
        return 1
    fi
    
    echo ""
    
    # Prompt for repository URL
    prompt_input "Enter repository URL (SSH format: git@github.com:user/repo.git)" "REPO_URL" "^git@github\.com:.+/.+\.git$"
    
    # Prompt for branch
    read -p "$(echo -e ${YELLOW}Enter branch name${NC}) (default: main): " REPO_BRANCH
    REPO_BRANCH=${REPO_BRANCH:-main}
    DEFAULT_BRANCH="$REPO_BRANCH"
    
    # Prompt for directory - REQUIRED
    echo ""
    print_warning "Clone into which directory?"
    print_info "Examples: my-project, ,my-app"
    read -p "$(echo -e ${YELLOW}Enter directory path${NC}): " CLONE_DIR
    
    # Validate directory input
    if [ -z "$CLONE_DIR" ]; then
        print_error "Directory path cannot be empty"
        return 1
    fi
    
    # Expand ~ to home directory if needed
    CLONE_DIR="${CLONE_DIR/#\~/$HOME}"
    
    echo ""
    print_step "Clone Configuration:"
    print_info "Repository URL: $REPO_URL"
    print_info "Branch: $REPO_BRANCH"
    print_info "Directory: $CLONE_DIR"
    echo ""
    
    if ! confirm "Proceed with cloning?"; then
        print_warning "Repository cloning cancelled"
        return 0
    fi
    
    echo ""
    
    # Check if directory already exists and is not empty
    if [ -d "$CLONE_DIR" ] && [ "$(ls -A "$CLONE_DIR" 2>/dev/null | wc -l)" -gt 0 ]; then
        print_error "Directory already exists and is not empty: $CLONE_DIR"
        
        print_warning "Files in $CLONE_DIR:"
        ls -A "$CLONE_DIR" | sed 's/^/  /'
        echo ""
        
        if ! confirm "Delete and recreate directory?"; then
            print_warning "Repository cloning cancelled"
            return 0
        fi
        
        print_warning "Deleting existing directory..."
        if rm -rf "$CLONE_DIR"; then
            print_success "Directory deleted"
        else
            print_error "Failed to delete directory"
            return 1
        fi
    fi
    
    # Clone into directory
    print_step "Running: git clone --branch \"$REPO_BRANCH\" \"$REPO_URL\" \"$CLONE_DIR\""
    echo ""
    
    if git clone --branch "$REPO_BRANCH" "$REPO_URL" "$CLONE_DIR" 2>&1; then
        print_success "Repository cloned to: $CLONE_DIR"
        
        # Set the default branch for the repository
        if git -C "$CLONE_DIR" symbolic-ref refs/remotes/origin/HEAD refs/remotes/origin/"$REPO_BRANCH" 2>/dev/null; then
            print_success "Default branch set to: $REPO_BRANCH"
        fi
        
        # Verify we're on the correct branch
        local current_branch=$(git -C "$CLONE_DIR" symbolic-ref --short HEAD 2>/dev/null)
        if [ "$current_branch" = "$REPO_BRANCH" ]; then
            print_success "Currently on branch: $current_branch"
        fi
        
        track_change "Clone repository" "rm -rf '$CLONE_DIR'"
    else
        print_error "Failed to clone repository"
        print_error ""
        print_error "Troubleshooting:"
        echo "  1. Verify SSH connection:"
        echo "     ssh -vvv git@github.com 2>&1 | grep -i 'connecting\\|port'"
        echo ""
        echo "  2. Verify SSH config:"
        echo "     cat ~/.ssh/config | grep -A 8 'Host github.com'"
        echo ""
        echo "  3. Verify SSH key in agent:"
        echo "     ssh-add -l"
        echo ""
        echo "  4. Try manual clone:"
        echo "     git clone --branch $REPO_BRANCH $REPO_URL $CLONE_DIR"
        return 1
    fi
}

step_verify_setup() {
    print_header "Step 7/7: Verify Setup"
    
    echo ""
    print_info "Git Configuration:"
    git config --global --list | grep -E "user\.|core\.editor|push\.default|gc\."
    
    echo ""
    print_info "SSH Configuration:"
    if [ -f "$SSH_KEY_PATH" ]; then
        ssh-keygen -l -f "$SSH_KEY_PATH" 2>/dev/null
    else
        print_warning "SSH key not found at $SSH_KEY_PATH"
    fi
    
    echo ""
    print_info "GitHub SSH Config:"
    grep -A 8 "Host github.com" "$SSH_DIR/config" 2>/dev/null || print_warning "No GitHub config found"
    
    echo ""
    print_info "Next: Clone a repository or use Git normally"
    echo "Example: git clone --branch main git@github.com:user/repo.git ~/my-project"
}

################################################################################
# Main Script
################################################################################

main() {
    print_header "Git Initialization Script for Hetzner Servers"
    echo "This script will initialize Git with SSH authentication and configure:"
    echo "  • Install Git (if needed)"
    echo "  • Generate SSH key (ed25519) with your GitHub email"
    echo "  • Configure Git SSH settings"
    echo "  • Test GitHub SSH connection"
    echo "  • Optionally clone a repository into a specific directory"
    echo ""
    echo "Features:"
    echo "  • SSH-based authentication (secure for servers)"
    echo "  • Support for GitHub SSH on port 443 (more reliable)"
    echo "  • Error handling with automatic rollback"
    echo "  • GitHub connection testing with timeout"
    echo "  • Interactive setup prompts"
    echo "  • SSH config file for port routing"
    echo ""
    echo "Current User: $CURRENT_USER"
    echo "SSH Directory: $SSH_DIR"
    echo ""
    
    if ! confirm "Do you want to proceed?"; then
        print_error "Script cancelled"
        exit 0
    fi
    
    echo ""
    
    # Execute all steps
    step_install_git || return 1
    step_check_ssh_key || return 1
    step_configure_ssh_config || return 1
    step_test_github_connection || return 1
    step_configure_git_global || return 1
    step_clone_repository || return 1
    step_verify_setup || return 1
    
    # Summary
    print_header "Setup Complete! ✓"
    echo "Your Git environment has been configured with:"
    echo -e "  ${GREEN}✓${NC} Git installed"
    echo -e "  ${GREEN}✓${NC} SSH key (ed25519) generated"
    echo -e "  ${GREEN}✓${NC} SSH config configured for GitHub"
    echo -e "  ${GREEN}✓${NC} GitHub SSH connection tested"
    echo -e "  ${GREEN}✓${NC} Global Git settings applied"
    echo -e "  ${GREEN}✓${NC} Problematic core.sshCommand cleaned up"
    
    if [ -n "$DEFAULT_BRANCH" ]; then
        echo -e "  ${GREEN}✓${NC} Repository cloned"
        echo -e "  ${GREEN}✓${NC} Default branch set to: $DEFAULT_BRANCH"
    else
        echo -e "  ${YELLOW}⊘${NC} Repository cloning skipped"
    fi
    
    echo ""
    echo "SSH Key Details:"
    echo "  • Private key: $SSH_KEY_PATH"
    echo "  • Public key: $SSH_KEY_PATH.pub"
    echo ""
    
    echo "Next steps:"
    echo "  1. Verify SSH works: ssh -T git@github.com"
    echo "  2. Make your first commit: git add . && git commit -m 'initial commit'"
    echo "  3. Push to GitHub: git push origin main"
    echo ""
    echo "Useful commands:"
    echo "  • View all config: git config --global --list"
    echo "  • Clone repository: git clone --branch <branch> git@github.com:user/repo.git <directory>"
    echo "  • Check status: git status"
    echo ""
}

# Run main function
main