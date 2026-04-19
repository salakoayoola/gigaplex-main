# gigaplex-main
Infrastructure management for 4 Raspberry Pis and x VPS

## Server Setup

### 1. Harden the Server

**One-liner (recommended):**
```bash
curl -fsSL https://raw.githubusercontent.com/salakoayoola/gigaplex-main/main/fresh-server-hardening.sh -o /tmp/harden.sh && sudo bash /tmp/harden.sh
```

> ⚠️ Always use `bash`, never `sh` — `sh` (dash) on Ubuntu/Debian doesn't support `$()` inside `read -p` and will throw a syntax error on line 159.

Or clone the repo and run locally:
```bash
sudo bash scripts/fresh-server-hardening.sh
```

**What it does (in order):**
1. Creates a non-root user with sudo
2. Updates system packages (`DEBIAN_FRONTEND=noninteractive`)
3. Sets a friendly hostname
4. Installs SSH public key(s)
5. Optionally sets a fallback password
6. Configures passwordless sudo (optional)
7. Installs `fail2ban` + `ufw`
8. Hardens SSH — key-only auth, optional port change, VS Code TCP forwarding preserved
9. Configures fail2ban on your chosen SSH port
10. Configures UFW — denies all inbound except SSH, 80, 443 (+ Tailscale if active)
11. Enables unattended security upgrades with auto-reboot at 03:00 (optional)
12. Installs and connects Tailscale, optionally restricts SSH to Tailscale interface only (optional)
13. Locks the root account

---

### 2. Initialize Git & SSH

**One-liner (recommended):**
```bash
curl -fsSL https://raw.githubusercontent.com/salakoayoola/gigaplex-main/main/git-init.sh -o /tmp/git-init.sh && bash /tmp/git-init.sh
```

> 💡 Run this as your regular user (not root) after the hardening script creates your account.

Or clone the repo and run locally:
```bash
bash git-init.sh
```

**What it does (in order):**
1. Installs Git (if not already present)
2. Generates SSH key pair (ed25519) with your GitHub email
3. Configures SSH for GitHub (supports both port 22 and 443)
4. Tests GitHub SSH connection with timeout protection
5. Configures global Git settings (user, email, editor, diff, etc.)
6. Cleans up any problematic `core.sshCommand` configs
7. Optionally clones a repository with branch selection
8. Verifies the complete setup

> 💡 The script supports SSH over HTTPS port 443 which is more reliable when port 22 is blocked by ISP/firewall.

---

### Nice Git-to-know
```bash
# Create a safe worktree for the destination branch
git worktree add ../ovh-cloud-work ovh-cloud

# Copy the target file from your current branch
cp scripts/hardening.sh ../ovh-cloud-work/scripts/hardening.sh

# Commit the change in the destination branch
cd ../ovh-cloud-work
git add scripts/hardening.sh
git commit -m "Update hardening.sh from main"
git push origin ovh-cloud

# Go back and clean up
cd -
git worktree remove ../ovh-cloud-work --force
```

---

### 3. Tailscale

Tailscale is now included in the hardening script (Step 12). If you need to install it separately:

```bash
curl -fsSL https://tailscale.com/install.sh | sh
```

```bash
sudo tailscale up \
  --authkey tskey-auth-XXXX \
  --hostname preferred_device_name \
  --advertise-tags=tag:tailscale_tag \
  --accept-dns \
  --accept-routes
```

To restrict SSH to Tailscale only after the fact:
```bash
# Remove public SSH port
sudo ufw delete allow <SSH_PORT>/tcp

# Allow SSH only on Tailscale interface
sudo ufw allow in on tailscale0 to any port <SSH_PORT> proto tcp
sudo ufw reload
```

---

### 4. Install Docker

https://pimylifeup.com/raspberry-pi-docker/

```bash
curl -sSL https://get.docker.com | sh
```

Add your user to the docker group:
```bash
sudo usermod -aG docker $USER
newgrp docker
```

Logout and login again. On VS Code, you may need:
```bash
sudo docker pull cloudflare/cloudflared:latest
```
