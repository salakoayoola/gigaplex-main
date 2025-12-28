#!/bin/bash
# Upload from local to Cloudflare R2 (via rclone)
# Run from anywhere

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOCAL_PATH="$SCRIPT_DIR/../portfolio-images"

REMOTE="eainbloom-images-cloudflare:ea-in-bloom/portfolio-images"
RCLONE_CONFIG="$HOME/.config/rclone/rclone.conf"

echo "☁️ Syncing:"
echo "  Local : $LOCAL_PATH"
echo "  Remote: $REMOTE"

rclone sync "$LOCAL_PATH" "$REMOTE" \
  --progress \
  --config "$RCLONE_CONFIG"
echo "✅ Upload complete."