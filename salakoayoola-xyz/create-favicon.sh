#!/bin/bash
# ------------------------------------------------------------
# Interactive Favicon Generator
# Converts any image (jpg, png, webp, etc.) to favicon-ready formats
# ------------------------------------------------------------

set -euo pipefail

# Prompt user for source image
read -rp "Enter the path to the source image: " SRC
if [[ ! -f "$SRC" ]]; then
  echo "❌ Source file does not exist: $SRC"
  exit 1
fi

# Prompt user for output directory
read -rp "Enter the output directory (will be created if it doesn't exist): " OUT_DIR
mkdir -p "$OUT_DIR"

# Base filename (without extension)
BASE_NAME="$(basename "$SRC" | sed 's/\.[^.]*$//')"

echo "Generating favicons from: $SRC"
echo "Output directory: $OUT_DIR"
echo

# Standard favicon sizes (pixels)
PNG_SIZES=(16 32 48 180)

for size in "${PNG_SIZES[@]}"; do
  OUT_FILE="$OUT_DIR/${BASE_NAME}-${size}.png"
  echo "→ PNG $size x $size: $OUT_FILE"
  convert "$SRC" -strip -resize "${size}x${size}" "$OUT_FILE"
done

# Generate ICO (multi-size)
ICO_FILE="$OUT_DIR/${BASE_NAME}.ico"
echo "→ ICO (16,32,48) multi-size: $ICO_FILE"
convert "${OUT_DIR}/${BASE_NAME}-16.png" \
        "${OUT_DIR}/${BASE_NAME}-32.png" \
        "${OUT_DIR}/${BASE_NAME}-48.png" \
        -strip "$ICO_FILE"

# Optional: generate SVG if source is already SVG
EXT="${SRC##*.}"
EXT_LOWER="${EXT,,}"
if [[ "$EXT_LOWER" == "svg" ]]; then
  OUT_SVG="$OUT_DIR/${BASE_NAME}.svg"
  echo "→ SVG copy: $OUT_SVG"
  cp "$SRC" "$OUT_SVG"
fi

# Summary
echo
echo "✅ Favicon generation complete. Files:"
ls -1 "$OUT_DIR"

echo
echo "Recommended HTML to include in your <head>:"
cat <<EOF
<link rel="icon" type="image/svg+xml" href="$OUT_DIR/${BASE_NAME}.svg">
<link rel="icon" type="image/png" sizes="32x32" href="$OUT_DIR/${BASE_NAME}-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="$OUT_DIR/${BASE_NAME}-16.png">
<link rel="icon" type="image/png" sizes="48x48" href="$OUT_DIR/${BASE_NAME}-48.png">
<link rel="apple-touch-icon" href="$OUT_DIR/${BASE_NAME}-180.png">
EOF
