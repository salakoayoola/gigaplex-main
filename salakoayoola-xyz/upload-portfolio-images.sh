#!/bin/bash
# Upload from local to Cloudflare R2

LOCAL_PATH="$USER/docker/salakoayoola-xyz/portfolio-images"
REMOTE="portfolio-images-cloudflare:salakoayoola-xyz-website/portfolio-images"

# Optional: export your rclone password if you use an encrypted remote
# export RCLONE_CONFIG_PASS="your_password_here"

rclone sync "$LOCAL_PATH" "$REMOTE" --progress --config $HOME/.config/rclone/rclone.conf 