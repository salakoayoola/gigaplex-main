# gigaplex-main
Infrastructure management for 4 Raspberry Pis and x VPS

## Server Setup

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
### 5. Traefik
Christian Lempa's guide: https://youtu.be/-hfejNXqOzA?si=46xTN3w6upY9FIrR

Generate Dashboard Credentials
Replace 'admin' with your username
```bash
echo $(htpasswd -nB $USER) | sed -e s/\\$/\\$\\$/g
```

### 6. RClone
Insalling Bare Metal
##### 1. Install RClone
```bash
curl https://rclone.org/install.sh | sudo bash
```
##### 2. Create RClone config
```bash
rclone config
```
##### 3. Follow the Prompts to create
I had permission issues accessing the config, when I used Docker. Nevertheless, this is how to access the terminal.
Or, you can consider 
```bash
docker exec -it rclone /bin/sh
```

### 7. Portfolio Website

#### Install Node JS and dependencies
Pull the website's repo into a folder, say 'web' locally
Install NPM first
```bash
sudo apt install npm
```
cd to the 'web' folder to install dependencies, this will generate *node_modules*.
```bash
npm install
```

In my case, I use RClone to sync the portfolio media between my local and cloud storage repositories
#### RClone

