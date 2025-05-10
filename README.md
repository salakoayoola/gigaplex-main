# gigaplex-main
4 Raspberry Pis on a journey

## MEDIARR

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
Initialise Git in the folder
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

Clone a specific branch from a repository, the dot [.] tells git not to create a subfolder for the clone
```
git clone --branch <branch_name> --single-branch <repository_url> .
```

## Docker


# Media Stack

## Plex
Deploy the docker compose file, then head to *<Your Server's IP Address>*:32400/web to configure Plex.

### [PlexTraktSync](https://github.com/Taxel/PlexTraktSync)

Instead of using the standard [docker compose up -d] to push, use:

```docker
docker compose run --rm plextraktsync sync
```
Be sure to have created your Trakt API app already, you'll need:
* Your Plex email
* Your Plex password
* Client ID for your Trakt App
* Client Secret for your Trakt App. 

All of that goes on in your CLI

Use the code you get to [Activate your Device](https://github.com/Taxel/PlexTraktSync)

### Tautulli

### Kometa

## Arrs
I've chosen to create a network for my arr stack
```docker
docker network create arr-stack
```
### Bazarr
### Sonarr
### Prowlarr
### Radarr
### Huntarr