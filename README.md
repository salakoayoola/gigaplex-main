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

### LinkWarden
Easy to install - https://youtu.be/novI6QX9LBY?si=Z7f28VWk67c63qa3

If you're migrating from the Pocket App, you can use the [pocket2linkwarden](https://github.com/fmhall/pocket2linkwarden)

### Karakeep
Shortly after trying out Linkwarden, I moved to Karakeep straight up.
I prefer how it manages thumbnails

Revisit LocalAI, Lite LLM at a later time

### Umami
For page analytics
https://umami.is/docs/install
https://plugins.traefik.io/plugins/65d4cc8e769af9e5f2251e09/umami-analytics


### n8n
https://github.com/sapochat/brand-mcp/
https://youtu.be/awh6OnY2to8?si=jANw9v5ENx6n0f9n

## Mealie
## Paperless
## Beszel
## Dawrich
## Dumbassets
## Channels-DVR server


### Project Management

https://appflowy.com/

Baserow

https://developers.plane.so/self-hosting/methods/docker-compose#install-community-edition
### Docmost

### Wedding Share

### Drive in the Cloud

https://github.com/hudikhq/hoodik

### Ghost

### Documenso
https://documenso.com/

### Rally
https://rallly.co/

### Home Management
https://grocy.info/

### Grafana
### Heyform
### Homepage
### Homer
### Immich
### Influx DB
### Maria DB
### Nextcloud
### Node RED
### Postal
### Postgres
### Telegraf