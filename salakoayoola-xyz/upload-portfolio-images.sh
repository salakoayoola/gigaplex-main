#!/bin/bash
# ------------------------------------------------------------
# Upload local portfolio images to Cloudflare R2
# with pre-sync snapshot + simulated transfer report
# ------------------------------------------------------------

set -euo pipefail

LOCAL_PATH="$HOME/docker/salakoayoola-xyz/portfolio-images/"
REMOTE="salakoayoola-images-cloudflare:salakoayoola-xyz-website/portfolio-images"
RCLONE_CONFIG="$HOME/.config/rclone/rclone.conf"

TIMESTAMP="$(date +"%Y-%m-%d_%H-%M-%S")"
SNAPSHOT_DIR="$HOME/rclone-snapshots"
SIMULATION_DIR="$HOME/rclone-simulations"

mkdir -p "$SNAPSHOT_DIR" "$SIMULATION_DIR"

SNAPSHOT_FILE="$SNAPSHOT_DIR/r2-snapshot-$TIMESTAMP.json"
SIMULATION_FILE="$SIMULATION_DIR/r2-dryrun-$TIMESTAMP.log"

echo "Local  : $LOCAL_PATH"
echo "Remote : $REMOTE"
echo

# ------------------------------------------------------------
# 1. Snapshot current bucket state
# ------------------------------------------------------------

echo "📸 Taking Cloudflare R2 snapshot…"

rclone lsjson "$REMOTE" \
  --recursive \
  --config "$RCLONE_CONFIG" \
  > "$SNAPSHOT_FILE"

echo "Snapshot saved to:"
echo "  $SNAPSHOT_FILE"
echo

# ------------------------------------------------------------
# 2. Simulate sync (dry-run preview)
# ------------------------------------------------------------

echo "🧪 Simulating sync (no changes will be made)…"
echo "Simulation log:"
echo "  $SIMULATION_FILE"
echo

rclone sync "$LOCAL_PATH" "$REMOTE" \
  --config "$RCLONE_CONFIG" \
  --dry-run \
  --checksum \
  --fast-list \
  --progress \
  --stats-one-line \
  --log-level INFO \
  > "$SIMULATION_FILE"

echo
echo "──── Simulated transfer summary ────"
grep -E "NOTICE:|Transferred:|Checks:" "$SIMULATION_FILE" || true
echo "────────────────────────────────────"
echo

# ------------------------------------------------------------
# 3. Real sync
# ------------------------------------------------------------

echo "🚀 Starting real sync…"

rclone sync "$LOCAL_PATH" "$REMOTE" \
  --config "$RCLONE_CONFIG" \
  --checksum \
  --fast-list \
  --progress \
  --log-level INFO

echo
echo "✅ Sync completed successfully"
