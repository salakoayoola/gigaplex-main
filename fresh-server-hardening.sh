#!/bin/bash

################################################################################
# Hetzner Cloud Server Hardening Script
# Purpose: Automated security hardening for fresh Hetzner installations
# Features: Error handling, automatic rollback, UFW web ports, interactive SSH keys
# Usage: sudo bash hetzner-hardening.sh
################################################################################

set -o pipefail

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
USERNAME="ayoola"
SCRIPT_NAME="$(basename "$0")"
ROLLBACK_LOG="/tmp/${SCRIPT_NAME}.rollback"

# State tracking
CHANGES_MADE=()
ROLLBACK_COMMANDS=()
SSH_KEYS_ADDED=0

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

confirm() {
    local prompt="$1"
    local response
    
    while true; do
        read -p "$(echo -e ${YELLOW}${prompt}${NC}) (yes/no): " response
        case "$response" in
            [yY][eE][sS]|[yY])
                return 0
                ;;
            [nN][oO]|[nN])
                return 1
                ;;
            *)
                echo "Please answer yes or no."
                ;;
        esac
    done
}

check_root() {
    if [[ $EUID -ne 0 ]]; then
        print_error "This script must be run as root"
        exit 1
    fi
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
    
    print_info "Executing: $description"
    
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
    
    print_warning "Rollback completed (some changes may require manual intervention)"
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

# Validate SSH public key format
validate_ssh_key() {
    local key="$1"
    
    # Check if key starts with ssh-rsa, ssh-ed25519, ecdsa-sha2, or ssh-dss
    if [[ $key =~ ^(ssh-rsa|ssh-ed25519|ecdsa-sha2-nistp256|ecdsa-sha2-nistp384|ecdsa-sha2-nistp521|ssh-dss) ]]; then
        return 0
    else
        return 1
    fi
}

# Add SSH key with validation
add_ssh_key() {
    local key_number="$1"
    local ssh_dir="/home/${USERNAME}/.ssh"
    local auth_keys="${ssh_dir}/authorized_keys"
    
    echo ""
    print_info "SSH Key #${key_number}"
    print_warning "Paste your public SSH key (the entire line starting with ssh-rsa, ssh-ed25519, ecdsa-sha2, etc.):"
    print_warning "Paste now and press Enter:"
    
    read -r SSH_KEY
    
    # Validate key format
    if ! validate_ssh_key "$SSH_KEY"; then
        print_error "Invalid SSH key format!"
        print_error "Key must start with: ssh-rsa, ssh-ed25519, ecdsa-sha2-*, or ssh-dss"
        print_error "Received: $(echo "$SSH_KEY" | cut -d' ' -f1-2)"
        return 1
    fi
    
    # Create SSH directory if it doesn't exist
    if [ ! -d "$ssh_dir" ]; then
        print_info "Creating SSH directory: $ssh_dir"
        mkdir -p "$ssh_dir"
        chown "$USERNAME:$USERNAME" "$ssh_dir"
        chmod 700 "$ssh_dir"
        track_change "Create SSH directory for ${USERNAME}" "rmdir '$ssh_dir'"
    fi
    
    # Create authorized_keys if it doesn't exist
    if [ ! -f "$auth_keys" ]; then
        print_info "Creating authorized_keys file"
        touch "$auth_keys"
        chmod 600 "$auth_keys"
        chown "$USERNAME:$USERNAME" "$auth_keys"
        track_change "Create authorized_keys for ${USERNAME}" "rm -f '$auth_keys'"
    fi
    
    # Check if key already exists
    if grep -q "$(echo "$SSH_KEY" | awk '{print $2}')" "$auth_keys" 2>/dev/null; then
        print_warning "This key is already added!"
        return 1
    fi
    
    # Add the key
    echo "$SSH_KEY" >> "$auth_keys"
    
    # Ensure correct permissions
    chown "$USERNAME:$USERNAME" "$auth_keys"
    chmod 600 "$auth_keys"
    
    print_success "SSH key #${key_number} added"
    ((SSH_KEYS_ADDED++))
    
    # Show key fingerprint
    local fingerprint=$(echo "$SSH_KEY" | ssh-keygen -l -f /dev/stdin 2>/dev/null | awk '{print $2}')
    if [ -n "$fingerprint" ]; then
        print_info "Key fingerprint: $fingerprint"
    fi
    
    return 0
}

################################################################################
# Step Functions
################################################################################

step_system_updates() {
    print_header "Step 1/11: System Updates"
    execute_cmd \
        "apt update && apt upgrade -y" \
        "System updates" \
        "echo 'Cannot safely rollback system updates'"
}

step_create_user() {
    print_header "Step 2/11: Create Non-Root User"
    
    if id "$USERNAME" &>/dev/null; then
        print_warning "User ${USERNAME} already exists, skipping creation"
        return 0
    fi
    
    if ! confirm "Create user ${USERNAME}?"; then
        print_error "User creation cancelled"
        return 1
    fi
    
    execute_cmd \
        "useradd -m -s /bin/bash -G sudo \"$USERNAME\"" \
        "Create user ${USERNAME}" \
        "userdel -r \"$USERNAME\""
}

step_configure_ssh_keys() {
    print_header "Step 3/11: Configure SSH Public Keys"
    
    echo ""
    print_info "You need at least ONE SSH public key to access the server"
    print_warning "SSH password authentication will be DISABLED for security"
    echo ""
    
    if ! confirm "Add SSH public key(s) for ${USERNAME}?"; then
        print_error "No SSH keys added - you will be locked out!"
        if ! confirm "Continue anyway? (NOT RECOMMENDED)"; then
            print_error "Setup cancelled"
            return 1
        fi
        print_warning "⚠️  You must manually add SSH keys before locking root!"
        return 0
    fi
    
    local key_count=1
    while true; do
        if ! add_ssh_key "$key_count"; then
            print_warning "Failed to add key #${key_count}, retrying..."
            if ! confirm "Retry adding SSH key #${key_count}?"; then
                print_warning "Skipped SSH key #${key_count}"
            else
                continue
            fi
        fi
        
        echo ""
        if ! confirm "Add another SSH public key?"; then
            break
        fi
        ((key_count++))
    done
    
    if [ $SSH_KEYS_ADDED -eq 0 ]; then
        print_error "⚠️  NO SSH keys were added!"
        print_error "You will be LOCKED OUT when root is disabled"
        if ! confirm "Continue anyway? (NOT RECOMMENDED)"; then
            print_error "Setup cancelled"
            return 1
        fi
    else
        print_success "$SSH_KEYS_ADDED SSH key(s) added for ${USERNAME}"
    fi
    
    return 0
}

step_configure_user_password() {
    print_header "Step 4/11: Configure User Password"
    
    echo ""
    print_info "Password options for ${USERNAME}:"
    echo "  1. Set a password (for emergency/fallback access)"
    echo "  2. Skip password (SSH keys only - recommended)"
    echo ""
    print_warning "Note: Password authentication will still be DISABLED in SSH"
    print_info "This password is only for local console or 'su' access"
    echo ""
    
    if confirm "Set a password for ${USERNAME}?"; then
        print_warning "You will be prompted to enter a password twice"
        
        if passwd "$USERNAME"; then
            track_change "User password set for ${USERNAME}" "passwd -d \"$USERNAME\""
            print_success "Password set for ${USERNAME}"
            echo ""
            print_info "Password details:"
            echo "  • Can be used for local console access"
            echo "  • Can be used with 'su' or 'sudo su'"
            echo "  • SSH password login is still disabled"
        else
            print_error "Failed to set password"
            return 1
        fi
    else
        print_info "Password skipped - ${USERNAME} will use SSH keys only"
    fi
}

step_configure_sudo() {
    print_header "Step 5/11: Configure Sudo Privileges"
    
    echo ""
    print_info "Current configuration:"
    echo "  • ${USERNAME} is a member of the 'sudo' group (via useradd -G sudo)"
    echo "  • This grants full sudo access with password requirement"
    echo ""
    print_warning "Note: Passwordless sudo is OPTIONAL"
    echo ""
    
    if confirm "Enable passwordless sudo for ${USERNAME}?"; then
        execute_cmd \
            "echo '${USERNAME} ALL=(ALL) NOPASSWD:ALL' | tee /etc/sudoers.d/'${USERNAME}' > /dev/null && chmod 440 /etc/sudoers.d/'${USERNAME}'" \
            "Enable passwordless sudo for ${USERNAME}" \
            "rm -f /etc/sudoers.d/'${USERNAME}'"
        print_success "${USERNAME} now has passwordless sudo access"
    else
        print_warning "${USERNAME} has sudo access with password requirement"
        print_info "To use sudo: sudo <command> (will prompt for password)"
    fi
}

step_install_security_tools() {
    print_header "Step 6/11: Install Security Tools"
    
    execute_cmd \
        "apt install -y fail2ban ufw" \
        "Install fail2ban and ufw" \
        "apt remove -y fail2ban ufw"
}

step_configure_ssh() {
    print_header "Step 7/11: Configure SSH Hardening"
    
    if ! confirm "Apply SSH hardening configuration?"; then
        print_warning "SSH hardening skipped"
        return 0
    fi
    
    local ssh_config="/etc/ssh/sshd_config.d/ssh-hardening.conf"
    local ssh_config_backup="${ssh_config}.backup.$(date +%s)"
    
    # Backup existing config if it exists
    if [ -f "$ssh_config" ]; then
        cp "$ssh_config" "$ssh_config_backup"
        print_info "Backed up existing SSH config to $ssh_config_backup"
    fi
    
    # Write new config
    tee "$ssh_config" > /dev/null <<'SSHCONFIG'
PermitRootLogin no
PasswordAuthentication no
Port 22
KbdInteractiveAuthentication no
ChallengeResponseAuthentication no
MaxAuthTries 5
AllowTcpForwarding yes
AllowStreamLocalForwarding yes
X11Forwarding no
AllowAgentForwarding no
AuthorizedKeysFile .ssh/authorized_keys
AllowUsers ayoola
SSHCONFIG
    
    # Verify SSH config syntax
    if ! sshd -t; then
        print_error "SSH configuration syntax error!"
        print_error "Restoring previous configuration..."
        if [ -f "$ssh_config_backup" ]; then
            mv "$ssh_config_backup" "$ssh_config"
            sshd -t
        fi
        return 1
    fi
    
    # Restart SSH
    if systemctl restart ssh; then
        track_change "SSH hardening applied" "mv '$ssh_config_backup' '$ssh_config' 2>/dev/null || true"
        print_success "SSH hardening applied and SSH restarted"
    else
        print_error "Failed to restart SSH"
        if [ -f "$ssh_config_backup" ]; then
            mv "$ssh_config_backup" "$ssh_config"
        fi
        return 1
    fi
}

step_configure_fail2ban() {
    print_header "Step 8/11: Configure Fail2Ban"
    
    if ! confirm "Configure fail2ban?"; then
        print_warning "Fail2ban configuration skipped"
        return 0
    fi
    
    local fail2ban_config="/etc/fail2ban/jail.local"
    local fail2ban_backup="${fail2ban_config}.backup.$(date +%s)"
    
    if [ -f "$fail2ban_config" ]; then
        cp "$fail2ban_config" "$fail2ban_backup"
        track_change "Fail2ban backup" "mv '$fail2ban_backup' '$fail2ban_config'"
    fi
    
    tee "$fail2ban_config" > /dev/null <<'FAIL2BAN'
[sshd]
enabled = true
port = ssh, 22
banaction = iptables-multiport
maxretry = 5
findtime = 600
bantime = 3600
FAIL2BAN
    
    track_change "Fail2ban configuration" "rm -f '$fail2ban_config'"
    
    execute_cmd \
        "systemctl enable fail2ban && systemctl start fail2ban" \
        "Enable and start fail2ban" \
        "systemctl disable fail2ban && systemctl stop fail2ban"
    
    print_success "Fail2ban configured and started"
}

step_configure_firewall() {
    print_header "Step 9/11: Configure UFW Firewall"
    
    if ! confirm "Configure UFW firewall?"; then
        print_warning "UFW firewall configuration skipped"
        return 0
    fi
    
    print_info "UFW Rules to be applied:"
    echo "  • Default: Deny incoming, Allow outgoing"
    echo "  • Port 22/tcp (SSH)"
    echo "  • Port 80/tcp (HTTP - Traefik)"
    echo "  • Port 443/tcp (HTTPS - Traefik)"
    echo ""
    
    execute_cmd \
        "ufw default deny incoming" \
        "Set UFW default deny incoming" \
        "ufw default allow incoming"
    
    execute_cmd \
        "ufw default allow outgoing" \
        "Set UFW default allow outgoing" \
        "ufw default deny outgoing"
    
    execute_cmd \
        "ufw allow 22/tcp" \
        "Allow SSH (port 22)" \
        "ufw delete allow 22/tcp"
    
    execute_cmd \
        "ufw allow 80/tcp" \
        "Allow HTTP (port 80 - Traefik)" \
        "ufw delete allow 80/tcp"
    
    execute_cmd \
        "ufw allow 443/tcp" \
        "Allow HTTPS (port 443 - Traefik)" \
        "ufw delete allow 443/tcp"
    
    execute_cmd \
        "ufw enable" \
        "Enable UFW firewall" \
        "ufw disable"
    
    print_success "UFW firewall configured"
    echo ""
    print_info "Firewall Status:"
    ufw status verbose
}

step_verify_ssh_access() {
    print_header "Step 10/11: Verify SSH Access"
    
    if [ $SSH_KEYS_ADDED -eq 0 ]; then
        print_error "⚠️  NO SSH keys are configured!"
        print_error "You CANNOT proceed - you will be locked out"
        print_error "Aborting script to prevent lockout"
        return 1
    fi
    
    echo ""
    print_warning "CRITICAL: Test SSH access BEFORE locking root!"
    print_warning "Open a NEW terminal and run:"
    echo -e "  ${YELLOW}ssh ${USERNAME}@46.224.24.10${NC}"
    echo ""
    print_warning "Verify you can:"
    echo "  • Login without a password"
    echo "  • Get a shell prompt"
    echo ""
    
    if ! confirm "Have you successfully SSH'd in as ${USERNAME}?"; then
        print_error "SSH access NOT verified!"
        print_error "Do NOT proceed - you will be locked out"
        print_error "Please fix SSH access and try again"
        return 1
    fi
    
    print_success "SSH access verified!"
    return 0
}

step_secure_root() {
    print_header "Step 11/11: Secure Root Account"
    
    print_warning "⚠️  FINAL WARNING: Root account will be locked after this"
    print_warning "Ensure you have verified SSH access as ${USERNAME} first!"
    echo ""
    
    if ! confirm "Lock root account? (This cannot be easily reversed)"; then
        print_warning "Root account locking cancelled"
        return 0
    fi
    
    execute_cmd \
        "passwd -l root" \
        "Lock root account" \
        "passwd -u root"
    
    print_success "Root account locked"
    echo ""
    print_warning "Root account status:"
    passwd -S root
}

################################################################################
# Main Script
################################################################################

main() {
    print_header "Hetzner Cloud Server Hardening Script"
    echo "This script will harden your server with:"
    echo "  • Create non-root user: ${USERNAME}"
    echo "  • Interactive SSH public key setup"
    echo "  • Optional password configuration"
    echo "  • Configure SSH hardening"
    echo "  • Install and configure fail2ban"
    echo "  • Setup UFW firewall (SSH, HTTP, HTTPS)"
    echo "  • Lock root account"
    echo ""
    echo "Features:"
    echo "  • Error handling with automatic rollback"
    echo "  • SSH key validation before use"
    echo "  • All sensitive operations require confirmation"
    echo "  • Change tracking for debugging"
    echo ""
    
    if ! confirm "Do you want to proceed?"; then
        print_error "Script cancelled"
        exit 0
    fi
    
    check_root
    
    # Execute all steps
    step_system_updates || return 1
    step_create_user || return 1
    step_configure_ssh_keys || return 1
    step_configure_user_password || return 1
    step_configure_sudo || return 1
    step_install_security_tools || return 1
    step_configure_ssh || return 1
    step_configure_fail2ban || return 1
    step_configure_firewall || return 1
    step_verify_ssh_access || return 1
    step_secure_root || return 1
    
    # Summary
    print_header "Setup Complete! ✓"
    echo "Your server has been hardened with:"
    echo -e "  ${GREEN}✓${NC} System updates applied"
    echo -e "  ${GREEN}✓${NC} Non-root user created: ${USERNAME}"
    echo -e "  ${GREEN}✓${NC} $SSH_KEYS_ADDED SSH key(s) configured"
    echo -e "  ${GREEN}✓${NC} SSH hardened (password auth disabled)"
    echo -e "  ${GREEN}✓${NC} Fail2ban configured"
    echo -e "  ${GREEN}✓${NC} UFW firewall enabled (ports 22, 80, 443)"
    echo -e "  ${GREEN}✓${NC} Root account secured"
    echo ""
    echo "Access methods for ${USERNAME}:"
    echo "  • SSH with keys: ssh ${USERNAME}@<server-ip>"
    echo "  • Local console with password (if set)"
    echo "  • 'su - ${USERNAME}' with password (if set)"
    echo ""
    echo "Firewall ports:"
    echo "  • Port 22/tcp - SSH"
    echo "  • Port 80/tcp - HTTP (Traefik)"
    echo "  • Port 443/tcp - HTTPS (Traefik)"
    echo ""
    echo "Next steps:"
    echo "  1. Keep SSH session open to verify continued access"
    echo "  2. Deploy Traefik or other web applications"
    echo "  3. Monitor fail2ban: sudo fail2ban-client status"
    echo "  4. Check firewall: sudo ufw status verbose"
    echo ""
}

# Run main function
main