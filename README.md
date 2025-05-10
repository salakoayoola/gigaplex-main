# gigaplex-main
4 Raspberry Pis on a journey

## INFRARR

## GIT
Install Git
```bash
sudo apt install git
```

Configure Your Name, replace your name, obviously
```bash
git config --global user.name "Full Name"
```
Configure Email, replace your email, obviously
```bash
git config --global user.email "Email"
```
Set Push Style
```bash
git config --global push.default simple
```
```bash
git config --global gc.auto 0
```
```bash
git config --global gc.pruneExpire "2 weeks"
```
```bash
git config --global merge.tool vimdiff
```
```bash
git config --global credential.helper store
```
Set the specific branch in your repo
```bash
git config --global init.defaultBranch branch
```
Initialise Git in the folder
```bash
git init
```

Replace with the address of your repository
```bash
git remote add origin https://github.com/specific-git.git
```

```bash
git pull origin branch-name
```
Clone a specific branch from a repository, the dot [.] tells git not to create a subfolder for the clone
```bash
git clone --branch <branch_name> --single-branch <repository_url> .
```

## Docker
https://pimylifeup.com/raspberry-pi-docker/

```bash
curl -sSL https://get.docker.com | sh
```
Add your admin account to run as a privileged docker user
```bash
sudo usermod -aG docker $USER
```
Logout and login again.
On VS Code, you may need these additional steps
```bash
sudo docker pull cloudflare/cloudflared:latest
```
```bash
sudo groupadd docker
sudo usermod -aG docker $USER
newgrp docker
```


### Bind9 
For Local Domain Name resolution - nameservers
Based on Christian Lempa's tutorial https://youtu.be/syzwLwE3Xq4?si=NBE4-UiBnJsOe-C1

### Tailscale
The issue I experienced earlier was with at router level, where I couldn't resolve .local domanins locally, hence, needing 
I finaly got this working, thanks to : https://www.youtube.com/watch?v=Y7Z-RnM77tA

By installing a docker version of firefox, I was able to troubleshoot at server level, this is why I've had to use Tailscale, because I can't do this with my router at the moment

### Cloudflared (Cloudflare zero trust)
More Thomas Wilde: https://www.youtube.com/watch?v=TB2bnASgJV4

### NGINX


### Traefik
Based on these:
https://youtu.be/n1vOfdz5Nm8

To generate hashed login
First install Apache2Uils

```cmd
sudo apt-get install apache2-utils
```

Then proceed to, be sure to replace admin with your actual username

```cmd
echo $(htpasswd -nB admin) | sed -e s/\\$/\\$\\$/g
```

