# gigaplex-main
4 Raspberry Pis on a journey
## Applications

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

### Traefik
https://youtu.be/CmUzMi5QLzI?si=GdKapwqWX5IgosjW

```bash
sudo apt install apache2-utils
```
Generate Dashboard Credentials
Replace 'admin' with your username
```bash
echo $(htpasswd -nB admin) | sed -e s/\\$/\\$\\$/g
```
Adjust permission of the certificate file
```bash
chmod 600 data/acme.json
```
### CloudFlare Tunnels
Expose your Traefik instance to the internet with Cloudflare tunnels
https://youtu.be/yMmxw-DZ5Ec?si=AcjKgrSa9d1nWUyn

### Omni Tools

### Authentik
https://www.youtube.com/watch?v=N5unsATNpJk
https://www.youtube.com/watch?v=_I3hUI1JQP4

### Docmost
### Ghost
### Grafana
### Heyform
### Homepage
### Homer
### Immich
### Influx DB
### Kometa
### Maria DB
### n8n
https://github.com/sapochat/brand-mcp/
https://youtu.be/awh6OnY2to8?si=jANw9v5ENx6n0f9n

### Nextcloud
### Node RED
### Postal
### Postgres
### Telegraf
### Wedding Share