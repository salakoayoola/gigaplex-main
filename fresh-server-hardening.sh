#!/bin/bash
################################################################################
# VPS Hardening Script
# Purpose: Automated security hardening for fresh VPS installations
# Features: Error handling, automatic rollback, UFW web ports, interactive SSH
#           keys, Tailscale integration, unattended-upgrades
# Usage: sudo bash fresh-server-hardening.sh
#        curl one-liner: bash <(curl -fsSL https://raw.githubusercontent.com/
#                         YOUR_USERNAME/gigaplex-main/main/scripts/
#                         fresh-server-hardening.sh)
# Updated: Tailscale support, SSH port config, unattended-upgrades,
#          hostname summary fix, optional step safety, DEBIAN_FRONTEND
################################################################################

# IMPORTANT: Always invoke with bash, never sh.
# sh (dash) on Ubuntu/Debian does not support $() inside read -p and will error.

set -o pipefail
export DEBIAN_FRONTEND=noninteractive

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
USERNAME=""
NEW_HOSTNAME=""
SSH_PORT=22
SCRIPT_NAME="$(basename "$0")"
ROLLBACK_LOG="/tmp/${SCRIPT_NAME}.rollback"

# State tracking
CHANGES_MADE=()
ROLLBACK_COMMANDS=()
SSH_KEYS_ADDED=0

################################################################################
# Helper Functions
################################################################################

print_header()  { echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n${BLUE}▶ $1${NC}\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"; }
print_success() { echo -e "${GREEN}✓ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠ $1${NC}"; }
print_error()   { echo -e "${RED}✗ $1${NC}"; }
print_info()    { echo -e "${BLUE}ℹ $1${NC}"; }

confirm() {
    local prompt="$1"
    local response
    while true; do
        read -rp "$(echo -e "${YELLOW}${prompt}${NC}") (yes/no): " response
        case "$response" in
            [yY]|[yY][eE][sS]) return 0 ;;
            [nN]|[nN][oO])     return 1 ;;
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
        eval "${ROLLBACK_COMMANDS[$i]}" \
            && print_success "Rolled back: ${CHANGES_MADE[$i]}" \
            || print_error "Failed to rollback: ${CHANGES_MADE[$i]}"
    done
}

error_handler() {
    print_error "Script failed at line $1"
    print_header "ERROR HANDLING"
    confirm "Would you like to rollback the changes made so far?" \
        && rollback \
        || print_warning "Manual intervention may be required"
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

    validate_ssh_key "$SSH_KEY" || { print_error "Invalid SSH key format"; return 1; }

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
    print_header "Step 1/13: Set Non-Root User"
    while [[ -z "$USERNAME" ]]; do
        read -rp "$(echo -e "${YELLOW}Enter username for non-root user:${NC}") " USERNAME
        USERNAME=$(echo "$USERNAME" | tr -cd 'a-zA-Z0-9_')
        [[ -z "$USERNAME" ]] && print_error "Invalid username"
    done
    print_success "Username set to: $USERNAME"
}

step_system_updates() {
    print_header "Step 2/13: System Updates"
    execute_cmd "apt update && apt upgrade -y" "System updates" "echo 'No rollback for updates'"
}

step_create_user() {
    print_header "Step 3/13: Create User"
    if id "$USERNAME" &>/dev/null; then
        print_warning "User '$USERNAME' already exists, skipping"
        return 0
    fi
    confirm "Create user '$USERNAME'?" || return 0
    execute_cmd "useradd -m -s /bin/bash -G sudo \"$USERNAME\"" \
        "Create user $USERNAME" \
        "userdel -r \"$USERNAME\""
}

step_set_friendly_hostname() {
    print_header "Step 4/13: Set Hostname"
    local current_host
    current_host=$(hostname)
    print_info "Current hostname: $current_host"
    confirm "Set a custom hostname?" || return 0
    read -rp "$(echo -e "${YELLOW}Enter new hostname (e.g. web-01):${NC}") " NEW_HOSTNAME
    NEW_HOSTNAME=$(echo "$NEW_HOSTNAME" | tr -cd 'a-zA-Z0-9-')
    [[ -z "$NEW_HOSTNAME" ]] && { print_error "Invalid hostname"; return 1; }
    hostnamectl set-hostname "$NEW_HOSTNAME"
    track_change "Set hostname" "hostnamectl set-hostname $current_host"
    [[ -f /etc/hosts ]] && cp /etc/hosts "/etc/hosts.bak.$(date +%s)"
    grep -q "127.0.1.1" /etc/hosts \
        && sed -i "s/^127.0.1.1.*/127.0.1.1\t$NEW_HOSTNAME/" /etc/hosts \
        || echo -e "127.0.1.1\t$NEW_HOSTNAME" >> /etc/hosts
    print_success "Hostname updated to $NEW_HOSTNAME"
}

step_configure_ssh_keys() {
    print_header "Step 5/13: SSH Keys"
    confirm "Add SSH key(s) for $USERNAME?" || return 0
    local key_count=1
    while true; do
        add_ssh_key "$key_count" || print_warning "Could not add key #$key_count"
        confirm "Add another SSH key?" || break
        ((key_count++))
    done
    [[ $SSH_KEYS_ADDED -eq 0 ]] && { print_error "No valid SSH keys added — cannot safely disable password auth"; return 1; }
    print_success "$SSH_KEYS_ADDED SSH key(s) added"
}

step_set_user_password() {
    print_header "Step 6/13: Password (optional)"
    if confirm "Set a fallback password for $USERNAME?"; then
        passwd "$USERNAME" && track_change "Set user password" "passwd -d $USERNAME" || true
    else
        print_info "Password skipped"
    fi
    return 0
}

step_configure_sudo() {
    print_header "Step 7/13: Sudo Options"
    if confirm "Enable passwordless sudo for $USERNAME?"; then
        echo "$USERNAME ALL=(ALL) NOPASSWD:ALL" > "/etc/sudoers.d/$USERNAME"
        chmod 440 "/etc/sudoers.d/$USERNAME"
        track_change "Passwordless sudo enabled" "rm -f /etc/sudoers.d/$USERNAME"
        print_success "Passwordless sudo set"
    fi
    return 0
}

step_install_security() {
    print_header "Step 8/13: Install Security Tools"
    execute_cmd "apt install -y fail2ban ufw" \
        "Install fail2ban and ufw" \
        "apt purge -y fail2ban ufw"
}

step_harden_ssh() {
    print_header "Step 9/13: SSH Hardening"
    confirm "Apply SSH hardening config?" || return 0

    # Optional: change SSH port (obscurity, reduces log noise)
    SSH_PORT=22
    if confirm "Change SSH port from default 22? (reduces brute-force noise)"; then
        read -rp "$(echo -e "${YELLOW}Enter new SSH port (1024–65535):${NC}") " SSH_PORT
        if ! [[ "$SSH_PORT" =~ ^[0-9]+$ ]] || (( SSH_PORT < 1024 || SSH_PORT > 65535 )); then
            print_warning "Invalid port, defaulting to 22"
            SSH_PORT=22
        fi
    fi

    local ssh_conf="/etc/ssh/sshd_config.d/ssh-harden.conf"
    [[ -f $ssh_conf ]] && cp "$ssh_conf" "$ssh_conf.bak"

    tee "$ssh_conf" > /dev/null <<EOF
# Generated by fresh-server-hardening.sh
PermitRootLogin no
PasswordAuthentication no
Port ${SSH_PORT}
MaxAuthTries 3
X11Forwarding no
AllowAgentForwarding no

# TCP and stream local forwarding required for VS Code Remote SSH
AllowTcpForwarding yes
AllowStreamLocalForwarding yes

KbdInteractiveAuthentication no
ChallengeResponseAuthentication no
AuthorizedKeysFile .ssh/authorized_keys
AllowUsers ${USERNAME}
EOF

    sshd -t && systemctl restart ssh \
        && print_success "SSH hardened (port ${SSH_PORT}, key-only, user: ${USERNAME})" \
        || { print_error "SSH config test failed — reverting"; cp "$ssh_conf.bak" "$ssh_conf"; systemctl restart ssh; return 1; }
}

step_configure_fail2ban() {
    print_header "Step 10/13: Fail2ban Setup"
    tee /etc/fail2ban/jail.local > /dev/null <<EOF
[sshd]
enabled  = true
port     = ${SSH_PORT}
maxretry = 5
bantime  = 3600
findtime = 600
EOF
    systemctl enable fail2ban && systemctl restart fail2ban
    track_change "Fail2ban configured" "systemctl disable fail2ban && systemctl stop fail2ban"
    print_success "Fail2ban enabled (watching port ${SSH_PORT})"
}

step_configure_firewall() {
    print_header "Step 11/13: UFW Firewall"
    execute_cmd "ufw default deny incoming" "Deny incoming traffic" ""
    execute_cmd "ufw default allow outgoing" "Allow outgoing traffic" ""

    # SSH — use configured port
    execute_cmd "ufw allow ${SSH_PORT}/tcp" "Allow SSH on port ${SSH_PORT}" ""

    # Web ports
    for port in 80 443; do
        execute_cmd "ufw allow ${port}/tcp" "Allow port $port" ""
    done

    # Allow all traffic on Tailscale interface (added before enable, in case Tailscale is already up)
    if ip link show tailscale0 &>/dev/null; then
        execute_cmd "ufw allow in on tailscale0" "Allow Tailscale interface" ""
    fi

    execute_cmd "ufw --force enable" "Enable UFW" ""
    print_info "UFW Status:"
    ufw status verbose
}

step_install_tailscale() {
    print_header "Step 12/13: Tailscale"
    confirm "Install Tailscale?" || return 0

    execute_cmd "curl -fsSL https://tailscale.com/install.sh | sh" \
        "Install Tailscale" \
        "apt purge -y tailscale"

    read -rp "$(echo -e "${YELLOW}Tailscale auth key (tskey-auth-...):${NC}") " TS_AUTHKEY
    read -rp "$(echo -e "${YELLOW}Preferred Tailscale hostname for this device:${NC}") " TS_HOSTNAME
    TS_HOSTNAME=$(echo "$TS_HOSTNAME" | tr -cd 'a-zA-Z0-9-')

    execute_cmd "tailscale up \
        --authkey \"$TS_AUTHKEY\" \
        --hostname \"$TS_HOSTNAME\" \
        --accept-dns \
        --accept-routes" \
        "Bring Tailscale up" \
        "tailscale down"

    # Allow Tailscale interface in UFW (UFW may already be active by this point)
    ufw allow in on tailscale0 &>/dev/null || true
    track_change "UFW Tailscale rule" "ufw delete allow in on tailscale0"

    local ts_ip
    ts_ip=$(tailscale ip -4 2>/dev/null || echo "unknown")
    print_success "Tailscale up — this device's IP: ${ts_ip}"

    if confirm "Restrict SSH to Tailscale interface only? (removes public port ${SSH_PORT})"; then
        ufw delete allow "${SSH_PORT}/tcp"
        ufw allow in on tailscale0 to any port "${SSH_PORT}" proto tcp
        track_change "SSH restricted to tailscale0" \
            "ufw delete allow in on tailscale0 to any port ${SSH_PORT} proto tcp && ufw allow ${SSH_PORT}/tcp"
        print_success "SSH now only reachable via Tailscale"
        print_warning "Connect going forward with: ssh ${USERNAME}@${ts_ip}"
    fi

    return 0
}

step_unattended_upgrades() {
    print_header "Step 12b: Unattended Security Upgrades"
    confirm "Enable automatic security updates (unattended-upgrades)?" || return 0

    execute_cmd "apt install -y unattended-upgrades" \
        "Install unattended-upgrades" \
        "apt purge -y unattended-upgrades"

    tee /etc/apt/apt.conf.d/20auto-upgrades > /dev/null <<EOF
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
APT::Periodic::AutocleanInterval "7";
EOF

    tee /etc/apt/apt.conf.d/50unattended-upgrades > /dev/null <<'EOF'
Unattended-Upgrade::Allowed-Origins {
    "${distro_id}:${distro_codename}-security";
    "${distro_id}ESMApps:${distro_codename}-apps-security";
    "${distro_id}ESM:${distro_codename}-infra-security";
};
Unattended-Upgrade::AutoFixInterruptedDpkg "true";
Unattended-Upgrade::MinimalSteps "true";
Unattended-Upgrade::Remove-Unused-Dependencies "true";
Unattended-Upgrade::Automatic-Reboot "true";
Unattended-Upgrade::Automatic-Reboot-Time "03:00";
EOF

    systemctl enable unattended-upgrades && systemctl restart unattended-upgrades
    track_change "Unattended upgrades enabled" "systemctl disable unattended-upgrades"
    print_success "Auto security updates enabled (reboots at 03:00 if needed)"
}

step_lock_root() {
    print_header "Step 13/13: Lock Root"
    print_warning "Ensure you have tested SSH access as $USERNAME before locking root."
    confirm "Lock root account?" || return 0
    execute_cmd "passwd -l root" "Lock root account" "passwd -u root"
}

################################################################################
# Main Execution
################################################################################

main() {
    print_header "VPS Hardening Script"
    print_info "Always invoke with: sudo bash fresh-server-hardening.sh"
    confirm "Do you want to proceed?" || exit 0
    check_root

    step_prompt_username       || exit 1
    step_system_updates        || exit 1
    step_create_user           || exit 1
    step_set_friendly_hostname || exit 1
    step_configure_ssh_keys    || exit 1
    step_set_user_password     # optional — never exits on skip
    step_configure_sudo        # optional — never exits on skip
    step_install_security      || exit 1
    step_harden_ssh            || exit 1
    step_configure_fail2ban    || exit 1
    step_configure_firewall    || exit 1
    step_unattended_upgrades   # optional — never exits on skip
    step_install_tailscale     # optional — never exits on skip
    step_lock_root             # optional — never exits on skip

    print_header "✅ Setup Complete"
    local hn
    hn=$(hostname)
    echo -e "${GREEN}${hn}${NC} has been hardened successfully:"
    echo -e "  ▸ User:               ${GREEN}${USERNAME}${NC}"
    echo -e "  ▸ Hostname:           ${GREEN}${hn}${NC}"
    echo -e "  ▸ SSH keys installed: ${GREEN}${SSH_KEYS_ADDED}${NC}"
    echo -e "  ▸ SSH port:           ${GREEN}${SSH_PORT}${NC}"
    echo -e "  ▸ Root login:         ${GREEN}Disabled${NC}"
    echo -e "  ▸ Firewall:           ${GREEN}UFW active${NC}"
    echo -e "  ▸ Fail2ban:           ${GREEN}Active${NC}"
    echo ""
    echo -e "SSH in with: ${YELLOW}ssh -p ${SSH_PORT} ${USERNAME}@<your-ip>${NC}"
    if tailscale ip -4 &>/dev/null; then
        echo -e "Or via Tailscale: ${YELLOW}ssh ${USERNAME}@$(tailscale ip -4)${NC}"
    fi
}

main
