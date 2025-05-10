# gigaplex-main
4 Raspberry Pis on a journey

## INFRARR

## GIT
Install Git
```
sudo apt install git
```

Configure Your Name, replace your name, obviously
```
git config --global user.name "Full Name"
```
Configure Email, replace your email, obviously
```
git config --global user.email "Email"
```
Set Push Style
```
git config --global push.default simple
```
```
git config --global gc.auto 0
```
```
git config --global gc.pruneExpire "2 weeks"
```
```
git config --global merge.tool vimdiff
```
```
git config --global credential.helper cache
```
Set the specific branch in your repo
```
git config --global init.defaultBranch branch
```
Initialise Git inithe folder
```
git init
```

Replace with the address of your repository
```
git remote add origin https://github.com/specific-git.git
```

```
git pull origin branch-name
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

