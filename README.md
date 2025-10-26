# gigaplex-main
Infrastructure management for 4 Raspberry Pis and x VPS

## Server Setup

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

### 1. Harden the Server
Run the server hardening script to secure your VPS instance:
- [fresh-server-hardening.sh](fresh-server-hardening.sh)
  - Updates system packages
  - Configures UFW firewall
  - Sets up fail2ban
  - Hardens SSH configuration

### 2. Initialize the Git Repository
Set up git configuration and clone necessary repositories:
- [git-init.sh](./git-init.sh)
  - Configures git credentials
  - Sets up SSH keys
  - Initializes main repository

### 3. Install Tailscale Natively
```bash
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up
```
Be sure to add the relevant flags
```bash
 \
  --authkey tskey-auth-XXXX \
  --hostname preferred_device_name \
  --advertise-tags=tag:tailscale_tag \
  --accept-dns \
  --accept-routes
```
### 4. Install Docker
https://pimylifeup.com/raspberry-pi-docker/

```bash
curl -sSL https://get.docker.com | sh
```
Add your user account to run as a privileged docker user
```bash
sudo usermod -aG docker $USER
```
```bash
newgrp docker
sudo groupadd docker
sudo usermod -aG docker $USER
```
Logout and login again.
On VS Code, you may need these additional steps
```bash
sudo docker pull cloudflare/cloudflared:latest
```
