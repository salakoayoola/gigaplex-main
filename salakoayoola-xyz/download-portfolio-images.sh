#!/bin/bash
# Download from Cloudflare R2 to local

REMOTE="portfolio-images-cloudflare:salakoayoola-xyz-website"
LOCAL_PATH="/home/ayoola/docker/salakoayoola-xyz/portfolio-images"

# Optional: export your rclone password if you use an encrypted remote
# export RCLONE_CONFIG_PASS="your_password_here"

rclone sync "$REMOTE" "$LOCAL_PATH" --progress --config /home/ayoola/.config/rclone/rclone.conf
