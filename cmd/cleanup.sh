#!/bin/bash

# Define the target directory (default is current directory)
TARGET_DIR=${1:-"../app/dist"}

echo "🔍 Searching for .map files in $TARGET_DIR..."

# Find and delete all files ending in .map
# -type f ensures we only look for files
# -name "*.map" filters the extension
# -delete performs the removal
find "$TARGET_DIR" -type f -name "*.map" -delete

if [ $? -eq 0 ]; then
    echo "✔ All .map files have been purged."
else
    echo "❌ An error occurred during cleanup."
fi