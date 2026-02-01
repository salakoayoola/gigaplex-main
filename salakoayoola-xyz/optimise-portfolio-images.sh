#!/bin/bash
# ------------------------------------------------------------
# Portfolio image optimizer with size reporting
# ------------------------------------------------------------

set -euo pipefail
shopt -s globstar nullglob

BASE_DIR="$HOME/docker/salakoayoola-xyz/portfolio-images"
PHOTOS_DIR="$BASE_DIR/portfolio/photos"
MAX_WIDTH=1920
JPEG_QUALITY=85
MAX_PHOTOS=20

DRY_RUN="${DRY_RUN:-0}"

TOTAL_BEFORE=0
TOTAL_AFTER=0
FILES_PROCESSED=0

run() {
  if [[ "$DRY_RUN" == "1" ]]; then
    echo "[DRY-RUN] $*"
  else
    "$@"
  fi
}

file_size() {
  stat -c "%s" "$1" 2>/dev/null || echo 0
}

human() {
  numfmt --to=iec --suffix=B "$1"
}

is_optimized_jpg() {
  local img="$1"
  local width
  width=$(identify -format "%w" "$img" 2>/dev/null || echo 99999)
  [[ "$width" -le "$MAX_WIDTH" ]]
}

convert_to_jpg() {
  local src="$1"
  local dest="$2"
  local tmp="$dest.tmp"

  run convert "$src" \
    -strip \
    -resize "${MAX_WIDTH}x" \
    -background white \
    -flatten \
    -quality "$JPEG_QUALITY" \
    "$tmp"

  run mv -f "$tmp" "$dest"
}

log_sizes() {
  local before="$1"
  local after="$2"
  local name="$3"

  TOTAL_BEFORE=$((TOTAL_BEFORE + before))
  TOTAL_AFTER=$((TOTAL_AFTER + after))
  FILES_PROCESSED=$((FILES_PROCESSED + 1))

  printf "✔ %-40s %8s → %8s (saved %8s)\n" \
    "$name" \
    "$(human "$before")" \
    "$(human "$after")" \
    "$(human $((before - after)))"
}

echo "Base directory: $BASE_DIR"
[[ "$DRY_RUN" == "1" ]] && echo "⚠️  DRY RUN ENABLED"

# ------------------------------------------------------------
# 1. portfolio/photos (max 20)
# ------------------------------------------------------------

echo
echo "Processing portfolio/photos …"

counter=1

for img in "$PHOTOS_DIR"/*.{jpg,JPG,jpeg,JPEG,png,PNG,webp,WEBP,heic,HEIC}; do
  [[ "$img" == *"/portfolio/photos/"* || "$img" == *"/favicon/"* ]] && continue
  [[ $counter -gt $MAX_PHOTOS ]] && break

  new_name=$(printf "photo-%03d.jpg" "$counter")
  output="$PHOTOS_DIR/$new_name"

  if [[ -f "$output" ]]; then
    echo "Skipping existing $output"
    counter=$((counter + 1))
    continue
  fi

  before=$(file_size "$img")
  echo "Processing $img → $output"
  convert_to_jpg "$img" "$output"
  after=$(file_size "$output")

  log_sizes "$before" "$after" "$new_name"
  counter=$((counter + 1))
done

# ------------------------------------------------------------
# 2. All other images
# ------------------------------------------------------------

echo
echo "Processing all other images …"

for img in "$BASE_DIR"/**/*.{jpg,JPG,jpeg,JPEG,png,PNG,webp,WEBP,heic,HEIC}; do
  [[ -f "$img" ]] || continue
  [[ "$img" == *"/portfolio/photos/"* ]] && continue

  ext="${img##*.}"
  ext_lower="${ext,,}"
  dir="$(dirname "$img")"
  base="$(basename "$img" ."$ext")"
  output="$dir/$base.jpg"

  if [[ "$ext_lower" =~ ^(jpg|jpeg)$ ]] && is_optimized_jpg "$img"; then
    continue
  fi

  if [[ "$ext_lower" != "jpg" && -f "$output" ]]; then
    continue
  fi

  before=$(file_size "$img")
  convert_to_jpg "$img" "$output"
  after=$(file_size "$output")

  log_sizes "$before" "$after" "$(basename "$output")"

  if [[ "$ext_lower" != "jpg" && "$ext_lower" != "jpeg" ]]; then
    run rm -f "$img"
  fi
done

# ------------------------------------------------------------
# Summary
# ------------------------------------------------------------

echo
echo "────────────── SUMMARY ──────────────"
printf "Files processed : %d\n" "$FILES_PROCESSED"
printf "Total before    : %s\n" "$(human "$TOTAL_BEFORE")"
printf "Total after     : %s\n" "$(human "$TOTAL_AFTER")"
printf "Total saved     : %s\n" "$(human $((TOTAL_BEFORE - TOTAL_AFTER)))"
echo "─────────────────────────────────────"

[[ "$DRY_RUN" == "1" ]] && echo "ℹ️  Dry-run mode: no files modified"
