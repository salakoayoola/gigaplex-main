#!/bin/bash
# Optimize all images under portfolio-images
# - /portfolio/photos → optimize + rename 001-020.jpg
# - All other images → optimize + convert PNG → JPG in-place
# - Converts PNG → JPG, strips metadata, resizes, sets quality

BASE_DIR="$USER/docker/salakoayoola-xyz/portfolio-images"
MAX_WIDTH=1920

shopt -s globstar

echo "Processing portfolio/photos ..."

PHOTOS_DIR="$BASE_DIR/portfolio/photos"
counter=1

# Limit processing to 20 images
for img in "$PHOTOS_DIR"/*.{jpg,JPG,jpeg,JPEG,png,PNG}; do
    [ -f "$img" ] || continue
    if [ $counter -gt 20 ]; then
        break
    fi

    new_name=$(printf "photo-%03d.jpg" "$counter")
    tmp_file="$PHOTOS_DIR/$new_name.tmp"

    ext="${img##*.}"
    ext_lower=$(echo "$ext" | tr '[:upper:]' '[:lower:]')

    if [[ "$ext_lower" == "png" ]]; then
        convert "$img" -strip -resize "${MAX_WIDTH}x" -background white -flatten -quality 85 "$tmp_file"
    else
        convert "$img" -strip -resize "${MAX_WIDTH}x" -quality 85 "$tmp_file"
    fi

    mv -f "$tmp_file" "$PHOTOS_DIR/$new_name"
    echo "Processed $img → $PHOTOS_DIR/$new_name"
    counter=$((counter + 1))
done

echo "Processing all other images ..."

# Optimize all other images recursively (exclude photos folder)
for img in "$BASE_DIR"/**/*.{jpg,JPG,jpeg,JPEG,png,PNG}; do
    [ -f "$img" ] || continue
    [[ "$img" == *"/portfolio/photos/"* ]] && continue  # skip photos

    ext="${img##*.}"
    ext_lower=$(echo "$ext" | tr '[:upper:]' '[:lower:]')
    dir_name=$(dirname "$img")
    base_name=$(basename "$img" ."$ext")

    output_file="$dir_name/$base_name.jpg"  # convert everything to .jpg
    tmp_file="$output_file.tmp"

    if [[ "$ext_lower" == "png" ]]; then
        convert "$img" -strip -resize "${MAX_WIDTH}x" -background white -flatten -quality 85 "$tmp_file"
        mv -f "$tmp_file" "$output_file"
        echo "Converted $img → $output_file"
        rm -f "$img"  # remove original PNG
    else
        convert "$img" -strip -resize "${MAX_WIDTH}x" -quality 85 "$tmp_file"
        mv -f "$tmp_file" "$output_file"
        echo "Optimized $img → $output_file"
    fi
done

echo "All images optimized and converted to JPG successfully!"
