#!/bin/bash

# Directory containing the images
IMAGE_DIR="public/images/products"

# Create a temporary directory
mkdir -p "${IMAGE_DIR}/temp"

# Convert all images to jpg and rename them consistently
for file in "${IMAGE_DIR}"/*.*; do
  if [[ $file =~ product_([0-9]+)\.(jpg|jpeg)$ ]]; then
    number="${BASH_REMATCH[1]}"
    # Pad number with zeros
    padded_number=$(printf "%03d" $number)
    # Convert and rename
    convert "$file" "${IMAGE_DIR}/temp/product_${padded_number}.jpg"
  fi
done

# Move converted files back
mv "${IMAGE_DIR}/temp/"* "${IMAGE_DIR}/"

# Remove temporary directory
rmdir "${IMAGE_DIR}/temp"

echo "✅ All images have been normalized to .jpg format" 