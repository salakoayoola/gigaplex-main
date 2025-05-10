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

## Docker
