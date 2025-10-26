#!/bin/bash
################################################################################
# VPS Hardening Script
# Purpose: Automated security hardening for fresh VPS installations
# Features: Error handling, automatic rollback, UFW web ports, interactive SSH keys
# Usage: sudo bash fresh-server-hardening.sh
# Updated: Dynamic username, dynamic hostname, clean SSH config, rollback safe
################################################################################

set -o pipefail

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
USERNAME=""
SCRIPT_NAME="$(basename "$0")"
ROLLBACK_LOG="/tmp/${SCRIPT_NAME}.rollback"

# State tracking
CHANGES_MADE=()
ROLLBACK_COMMANDS=()
SSH_KEYS_ADDED=0

################################################################################
# Helper Functions
################################################################################

print_header()     { echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n${BLUE}▶ $1${NC}\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"; }
print_success()    { echo -e "${GREEN}✓ $1${NC}"; }
print_warning()    { echo -e "${YELLOW}⚠ $1${NC}"; }
print_error()      { echo -e "${RED}✗ $1${NC}"; }
print_info()       { echo -e "${BLUE}ℹ $1${NC}"; }

confirm() {
    local prompt="$1"
    local response
    while true; do
        read -p "$(echo -e ${YELLOW}${prompt}${NC}) (yes/no): " response
        case "$response" in
            [yY]|[yY][eE][sS]) return 0 ;;
            [nN]|[nN][oO]) return 1 ;;
            *) echo "Please answer yes or no." ;;
        esac
    done
}

check_root() {
    if [[ $EUID -ne 0 ]]; then
        print_error "This script must be run as root"
        exit 1
    fi
}

track_change() {
    CHANGES_MADE+=("$1")
    ROLLBACK_COMMANDS+=("$2")
    print_info "Tracked: $1"
}

execute_cmd() {
    local cmd="$1"
    local desc="$2"
    local rollback_cmd="$3"
    print_info "Executing: $desc"
    if eval "$cmd"; then
        print_success "$desc completed"
        [[ -n "$rollback_cmd" ]] && track_change "$desc" "$rollback_cmd"
        return 0
    else
        print_error "Failed: $desc"
        return 1
    fi
}

rollback() {
    print_header "⚠️  ROLLING BACK CHANGES"
    print_warning "This will attempt to undo any tracked changes"
    [[ ${#ROLLBACK_COMMANDS[@]} -eq 0 ]] && { print_warning "Nothing to rollback"; return 0; }
    confirm "Proceed with rollback?" || { print_warning "Rollback cancelled"; return 0; }
    for ((i=${#ROLLBACK_COMMANDS[@]}-1; i>=0; i--)); do
        eval "${ROLLBACK_COMMANDS[$i]}" && print_success "Rolled back: ${CHANGES_MADE[$i]}" || print_error "Failed to rollback: ${CHANGES_MADE[$i]}"
    done
}

error_handler() {
    print_error "Script failed at line $1"
    print_header "ERROR HANDLING"
    confirm "Would you like to rollback the changes made so far?" && rollback || print_warning "Manual intervention may be required"
    exit 1
}
trap 'error_handler ${LINENO}' ERR

validate_ssh_key() {
    [[ $1 =~ ^(ssh-rsa|ssh-ed25519|ecdsa-sha2|ssh-dss) ]] && return 0 || return 1
}

add_ssh_key() {
    local key_number="$1"
    local ssh_dir="/home/${USERNAME}/.ssh"
    local auth_keys="${ssh_dir}/authorized_keys"

    print_info "SSH Key #${key_number}"
    print_warning "Paste your public SSH key:"
    read -r SSH_KEY

    validate_ssh_key "$SSH_KEY" || { print_error "Invalid SSH key"; return 1; }

    mkdir -p "$ssh_dir" && chmod 700 "$ssh_dir" && chown "$USERNAME:$USERNAME" "$ssh_dir"
    touch "$auth_keys" && chmod 600 "$auth_keys" && chown "$USERNAME:$USERNAME" "$auth_keys"

    grep -q "$(echo "$SSH_KEY" | awk '{print $2}')" "$auth_keys" && {
        print_warning "This key already exists"
        return 1
    }

    echo "$SSH_KEY" >> "$auth_keys"
    ((SSH_KEYS_ADDED++))
    print_success "SSH key added"
    return 0
}

################################################################################
# Step Functions
################################################################################

step_prompt_username() {
    print_header "Step 1/12: Set Non-Root User"
    while [[ -z "$USERNAME" ]]; do
        read -rp "$(echo -e ${YELLOW}Enter username for non-root user:${NC}) " USERNAME
        USERNAME=$(echo "$USERNAME" | tr -cd 'a-zA-Z0-9_')
        [[ -z "$USERNAME" ]] && print_error "Invalid username"
    done
    print_success "Username set to: $USERNAME"
}

step_system_updates() {
    print_header "Step 2/12: System Updates"
    execute_cmd "apt update && apt upgrade -y" "System updates" "echo 'No rollback for updates'"
}

step_create_user() {
    print_header "Step 3/12: Create User"
    id "$USERNAME" &>/dev/null && { print_warning "User exists"; return 0; }
    confirm "Create user '$USERNAME'?" || return 1
    execute_cmd "useradd -m -s /bin/bash -G sudo \"$USERNAME\"" "Create user $USERNAME" "userdel -r \"$USERNAME\""
}

step_set_friendly_hostname() {
    print_header "Step 4/12: Set Hostname"
    local current_host
    current_host=$(hostname)
    print_info "Current hostname: $current_host"
    confirm "Set a custom hostname?" || return 0
    read -rp "$(echo -e ${YELLOW}Enter new hostname (e.g. web-01)${NC}): " NEW_HOSTNAME
    NEW_HOSTNAME=$(echo "$NEW_HOSTNAME" | tr -cd 'a-zA-Z0-9-')
    hostnamectl set-hostname "$NEW_HOSTNAME" && track_change "Set hostname" "hostnamectl set-hostname $current_host"
    [[ -f /etc/hosts ]] && cp /etc/hosts "/etc/hosts.bak.$(date +%s)"
    grep -q "127.0.1.1" /etc/hosts && sed -i "s/^127.0.1.1.*/127.0.1.1\t$NEW_HOSTNAME/" /etc/hosts || echo -e "127.0.1.1\t$NEW_HOSTNAME" >> /etc/hosts
    print_success "Hostname updated to $NEW_HOSTNAME"
}

step_configure_ssh_keys() {
    print_header "Step 5/12: SSH Keys"
    confirm "Add SSH key(s) for $USERNAME?" || return 0
    local key_count=1
    while true; do
        add_ssh_key "$key_count" || print_warning "Could not add key #$key_count"
        confirm "Add another SSH key?" || break
        ((key_count++))
    done
    [[ $SSH_KEYS_ADDED -eq 0 ]] && { print_error "No keys added"; return 1; }
    print_success "$SSH_KEYS_ADDED SSH key(s) added"
}

step_set_user_password() {
    print_header "Step 6/12: Password (optional)"
    confirm "Set a fallback password for $USERNAME?" || { print_info "Password skipped"; return 0; }
    passwd "$USERNAME" && track_change "Set user password" "passwd -d $USERNAME"
}

step_configure_sudo() {
    print_header "Step 7/12: Sudo Options"
    confirm "Enable passwordless sudo for $USERNAME?" && {
        echo "$USERNAME ALL=(ALL) NOPASSWD:ALL" > "/etc/sudoers.d/$USERNAME"
        chmod 440 "/etc/sudoers.d/$USERNAME"
        track_change "Passwordless sudo enabled" "rm -f /etc/sudoers.d/$USERNAME"
        print_success "Passwordless sudo set"
    }
}

step_install_security() {
    print_header "Step 8/12: Install security tools"
    execute_cmd "apt install -y fail2ban ufw" "Install fail2ban and ufw" "apt purge -y fail2ban ufw"
}

step_harden_ssh() {
    print_header "Step 9/12: SSH Hardening"
    confirm "Apply SSH hardening config?" || return 0
    local ssh_conf="/etc/ssh/sshd_config.d/ssh-harden.conf"
    [[ -f $ssh_conf ]] && cp "$ssh_conf" "$ssh_conf.bak"
    tee "$ssh_conf" > /dev/null <<EOF
PermitRootLogin no
PasswordAuthentication no
Port 22
MaxAuthTries 3
X11Forwarding no
AllowAgentForwarding no
AllowTcpForwarding yes
AllowStreamLocalForwarding yes
KbdInteractiveAuthentication no
ChallengeResponseAuthentication no
AuthorizedKeysFile .ssh/authorized_keys
AllowUsers ${USERNAME}
EOF
    sshd -t && systemctl restart ssh && print_success "SSH hardened"
}

step_configure_fail2ban() {
    print_header "Step 10/12: Fail2ban Setup"
    tee /etc/fail2ban/jail.local > /dev/null <<EOF
[sshd]
enabled = true
port = ssh
maxretry = 5
bantime = 3600
findtime = 600
EOF
    systemctl enable fail2ban && systemctl start fail2ban && print_success "Fail2ban enabled"
}

step_configure_firewall() {
    print_header "Step 11/12: UFW Firewall"
    execute_cmd "ufw default deny incoming" "Deny incoming traffic" ""
    execute_cmd "ufw default allow outgoing" "Allow outgoing traffic" ""
    for port in 22 80 443; do
        execute_cmd "ufw allow ${port}/tcp" "Allow port $port" ""
    done
    execute_cmd "ufw --force enable" "Enable UFW" ""
    print_info "UFW Status:"
    ufw status verbose
}

step_lock_root() {
    print_header "Step 12/12: Lock Root"
    confirm "Lock root account? Ensure you tested SSH access." || return 0
    execute_cmd "passwd -l root" "Lock root account" "passwd -u root"
}

################################################################################
# Main Execution
################################################################################

main() {
    print_header "VPS Hardening Script"
    confirm "Do you want to proceed?" || exit 0
    check_root
    step_prompt_username || exit 1
    step_system_updates || exit 1
    step_create_user || exit 1
    step_set_friendly_hostname || exit 1
    step_configure_ssh_keys || exit 1
    step_set_user_password || exit 1
    step_configure_sudo || exit 1
    step_install_security || exit 1
    step_harden_ssh || exit 1
    step_configure_fail2ban || exit 1
    step_configure_firewall || exit 1
    step_lock_root || exit 1

    print_header "✅ Setup Complete"
    local hn; hn=$(hostname)
    echo "$NEW_HOSTNAME has been hardened successfully:"
    echo -e "  ▸ Hostname: ${GREEN}${hn}${NC}"
    echo -e "  ▸ User: ${GREEN}${USERNAME}${NC}"
    echo -e "  ▸ SSH keys installed: ${GREEN}${SSH_KEYS_ADDED}${NC}"
    echo -e "  ▸ SSH root login disabled: ${GREEN}Yes${NC}"
    echo -e "  ▸ Firewall: ${GREEN}Enabled (22, 80, 443)${NC}"
    echo -e "  ▸ Fail2ban: ${GREEN}Active${NC}"
    echo ""
    echo "SSH into your box with: ${YELLOW}ssh ${USERNAME}@<your-ip>${NC}"
}

main