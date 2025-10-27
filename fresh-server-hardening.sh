#!/bin/bash
################################################################################
# VPS Hardening Script
# Purpose: Automated security hardening for fresh VPS installations
# Features:
#   - Dynamic username
#   - Custom hostname
#   - Time zone setup
#   - SSH key integration
#   - SSH & sudo hardening
#   - Fail2Ban & UFW setup
#   - Rollback support
# Usage: sudo bash vps-harden.sh
################################################################################

set -o pipefail

# Terminal colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Initial config
USERNAME=""
SCRIPT_NAME="$(basename "$0")"
ROLLBACK_LOG="/tmp/${SCRIPT_NAME}.rollback"
CHANGES_MADE=()
ROLLBACK_COMMANDS=()
SSH_KEYS_ADDED=0

################################################################################
# Helper Functions
################################################################################
print_header()     { echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"; echo -e "${BLUE}▶ $1${NC}"; echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"; }
print_success()    { echo -e "${GREEN}✓ $1${NC}"; }
print_warning()    { echo -e "${YELLOW}⚠ $1${NC}"; }
print_error()      { echo -e "${RED}✗ $1${NC}"; }
print_info()       { echo -e "${BLUE}ℹ $1${NC}"; }

confirm() {
    local prompt="$1"
    local response
    while true; do
        read -rp "$(echo -e "${YELLOW}${prompt}${NC} (yes/no): ")" response
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
    if [[ ${#ROLLBACK_COMMANDS[@]} -eq 0 ]]; then
        print_warning "No changes to rollback"
        return 0
    fi
    confirm "Proceed with rollback?" || { print_warning "Rollback cancelled."; return 0; }
    for ((i=${#ROLLBACK_COMMANDS[@]}-1; i>=0; i--)); do
        eval "${ROLLBACK_COMMANDS[$i]}" \
        && print_success "Rolled back: ${CHANGES_MADE[$i]}" \
        || print_error "Failed to rollback: ${CHANGES_MADE[$i]}"
    done
}

trap 'error_handler ${LINENO}' ERR

error_handler() {
    print_error "An error occurred at line $1"
    rollback
    exit 1
}

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
    print_header "Step 1/13: Set Non-Root Username"
    while [[ -z "$USERNAME" ]]; do
        read -rp "$(echo -e ${YELLOW}Enter new username:${NC}) " USERNAME
        USERNAME=$(echo "$USERNAME" | tr -cd 'a-zA-Z0-9_')
        [[ -z "$USERNAME" ]] && print_error "Invalid username"
    done
    print_success "Username set to: $USERNAME"
}

step_system_updates() {
    print_header "Step 2/13: System Updates"
    execute_cmd "apt update && apt upgrade -y" "System package upgrade" ""
}

step_create_user() {
    print_header "Step 3/13: Create User"
    id "$USERNAME" &>/dev/null && { print_warning "User exists"; return 0; }
    confirm "Create user '$USERNAME'?" || return 1
    execute_cmd "useradd -m -s /bin/bash -G sudo $USERNAME" "Create user $USERNAME" "userdel -r $USERNAME"
}

step_set_friendly_hostname() {
    print_header "Step 4/13: Set Hostname"
    local current_host
    current_host=$(hostname)
    print_info "Current hostname: $current_host"
    if confirm "Set a custom hostname?"; then
        read -rp "$(echo -e ${YELLOW}Enter new hostname (e.g. web-01): ${NC})" NEW_HOSTNAME
        hostnamectl set-hostname "$NEW_HOSTNAME"
        track_change "Set hostname" "hostnamectl set-hostname $current_host"
        sed -i "s/^127.0.1.1.*/127.0.1.1\t$NEW_HOSTNAME/" /etc/hosts || echo "127.0.1.1 $NEW_HOSTNAME" >> /etc/hosts
        print_success "Hostname updated to $NEW_HOSTNAME"
    fi
}

step_set_timezone() {
    print_header "Step 5/13: Set Time Zone"
    timedatectl | grep "Time zone"
    if confirm "Would you like to change the system time zone?"; then
        read -rp "$(echo -e ${YELLOW}Enter time zone (e.g. Europe/London): ${NC})" TIMEZONE
        curr_tz=$(timedatectl | awk '/Time zone:/ { print $3 }')
        if timedatectl list-timezones | grep -Fxq "$TIMEZONE"; then
            timedatectl set-timezone "$TIMEZONE"
            track_change "Timezone updated to $TIMEZONE" "timedatectl set-timezone '$curr_tz'"
            print_success "Timezone set to $TIMEZONE"
        else
            print_error "Invalid timezone specified"
            return 1
        fi
    fi
}

step_configure_ssh_keys() {
    print_header "Step 6/13: SSH Key Setup"
    confirm "Add SSH key(s) for $USERNAME?" || return 0
    local key_count=1
    while true; do
        add_ssh_key "$key_count" || print_warning "Could not add key #$key_count"
        confirm "Add another SSH key?" || break
        ((key_count++))
    done
    [[ $SSH_KEYS_ADDED -eq 0 ]] && print_error "No SSH keys added!"
}

step_set_user_password() {
    print_header "Step 7/13: Optional Password"
    confirm "Set a password for user '$USERNAME'?" || return 0
    passwd "$USERNAME" && track_change "Set user password" "passwd -d $USERNAME"
}

step_configure_sudo() {
    print_header "Step 8/13: Sudo Configuration"
    confirm "Enable passwordless sudo?" && {
        echo "$USERNAME ALL=(ALL) NOPASSWD:ALL" > "/etc/sudoers.d/$USERNAME"
        chmod 440 "/etc/sudoers.d/$USERNAME"
        track_change "Passwordless sudo for $USERNAME" "rm -f /etc/sudoers.d/$USERNAME"
        print_success "User now has passwordless sudo"
    }
}

step_install_security() {
    print_header "Step 9/13: Install fail2ban and UFW"
    apt install -y fail2ban ufw
    print_success "Tools installed"
}

step_harden_ssh() {
    print_header "Step 10/13: SSH Hardening"
    local ssh_conf="/etc/ssh/sshd_config.d/harden.conf"
    tee "$ssh_conf" > /dev/null <<EOF
PermitRootLogin no
PasswordAuthentication no
AllowUsers ${USERNAME}
EOF
    systemctl restart ssh && print_success "SSH hardened and restarted"
}

step_configure_fail2ban() {
    print_header "Step 11/13: Configure Fail2Ban"
    systemctl enable fail2ban
    systemctl restart fail2ban
    print_success "Fail2Ban enabled and running"
}

step_configure_firewall() {
    print_header "Step 12/13: Set UFW Rules"
    ufw default deny incoming
    ufw default allow outgoing
    ufw allow ssh
    ufw allow http
    ufw allow https
    ufw --force enable
    print_success "Firewall configured and enabled"
}

step_lock_root() {
    print_header "Step 13/13: Lock Root Account"
    confirm "Lock root user account?" && {
        passwd -l root
        print_success "Root account locked"
    }
}

################################################################################
# Main Execution
################################################################################

main() {
    print_header "VPS Hardening Script"
    confirm "Do you wish to proceed?" || exit 1
    check_root

    step_prompt_username
    step_system_updates
    step_create_user
    step_set_friendly_hostname
    step_set_timezone
    step_configure_ssh_keys
    step_set_user_password
    step_configure_sudo
    step_install_security
    step_harden_ssh
    step_configure_fail2ban
    step_configure_firewall
    step_lock_root

    # 🔚 Final Summary (your original payout message)
    print_header "✅ Setup Complete"
    local hn; hn=$(hostname)
    echo "$hn has been hardened successfully:"
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