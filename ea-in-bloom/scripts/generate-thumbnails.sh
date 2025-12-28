#!/bin/bash
# Generate thumbnail images alongside originals
# Appends: -thumb.jpg
# Processes ../portfolio-images

set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
IMAGES_DIR="$SCRIPT_DIR/../portfolio-images"

THUMB_WIDTH=800
QUALITY=80

shopt -s globstar nullglob

TMP_FILES=()

cleanup() {
    rm -f "${TMP_FILES[@]}" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

process_image() {
    local img="$1"

    # Skip thumbnails themselves
    [[ "$img" == *"-thumb."* ]] && return

    local ext="${img##*.}"
    local ext_lower
    ext_lower=$(echo "$ext" | tr '[:upper:]' '[:lower:]')

    local dir base thumb tmp
    dir=$(dirname "$img")
    base=$(basename "$img" ."$ext")
    thumb="$dir/$base-thumb.jpg"

    # Skip if thumbnail already exists
    [[ -f "$thumb" ]] && return

    tmp=$(mktemp "${thumb}.XXXXXX")
    TMP_FILES+=("$tmp")

    if [[ "$ext_lower" == "png" ]]; then
        convert "$img" \
            -strip \
            -resize "${THUMB_WIDTH}x>" \
            -background white \
            -flatten \
            -quality "$QUALITY" \
            "$tmp"
    else
        convert "$img" \
            -strip \
            -resize "${THUMB_WIDTH}x>" \
            -quality "$QUALITY" \
            "$tmp"
    fi

    mv -f "$tmp" "$thumb"
    echo "🖼️  Thumbnail created: $thumb"
}

echo "📁 Generating thumbnails in: $IMAGES_DIR"

for img in "$IMAGES_DIR"/**/*.{jpg,JPG,jpeg,JPEG,png,PNG}; do
    [[ -f "$img" ]] || continue
    process_image "$img"
done

echo "✅ Thumbnail generation complete"
