#!/bin/bash
# CDN Image Optimiser
# Processes everything inside ../portfolio-images

set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
IMAGES_DIR="$SCRIPT_DIR/../portfolio-images"

MAX_THUMB=800
MAX_FULL=1920
QUALITY=85

shopt -s globstar nullglob

TMP_FILES=()

cleanup() {
    rm -f "${TMP_FILES[@]}" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

get_max_width() {
    local img="$1"

    if [[ "$img" == *"-thumb."* ]] || [[ "$img" == *"-profile."* ]]; then
        echo "$MAX_THUMB"
    elif [[ "$img" == *"-full."* ]]; then
        echo "$MAX_FULL"
    else
        echo "$MAX_FULL"
    fi
}

process_image() {
    local img="$1"
    local ext="${img##*.}"
    local ext_lower
    ext_lower=$(echo "$ext" | tr '[:upper:]' '[:lower:]')

    local dir base output tmp max_width
    dir=$(dirname "$img")
    base=$(basename "$img" ."$ext")
    output="$dir/$base.jpg"
    max_width=$(get_max_width "$img")

    tmp=$(mktemp "${output}.XXXXXX")
    TMP_FILES+=("$tmp")

    if [[ "$ext_lower" == "png" ]]; then
        convert "$img" \
            -strip \
            -resize "${max_width}x>" \
            -background white \
            -flatten \
            -quality "$QUALITY" \
            "$tmp"

        mv -f "$tmp" "$output"
        rm -f "$img"
        echo "PNG → JPG | ${max_width}px | $img"
    else
        convert "$img" \
            -strip \
            -resize "${max_width}x>" \
            -quality "$QUALITY" \
            "$tmp"

        mv -f "$tmp" "$output"
        echo "Optimised | ${max_width}px | $img"
    fi
}

echo "📁 Processing images in: $IMAGES_DIR"

for img in "$IMAGES_DIR"/**/*.{jpg,JPG,jpeg,JPEG,png,PNG}; do
    [[ -f "$img" ]] || continue
    process_image "$img"
done

echo "✅ Optimisation complete"
