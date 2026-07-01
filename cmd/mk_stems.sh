#!/bin/bash

# Navigate up from /cmd/ and target the asset music path cleanly
MUSIC_DIR="$(dirname "$0")/../assets/music"
TARGET_DIR="${MUSIC_DIR}/Mario Kart World"

# Check if the target directory actually exists before entering
if [ ! -d "$TARGET_DIR" ]; then
    echo "❌ Error: Directory '$TARGET_DIR' does not exist."
    exit 1
fi

# Change into the target directory safely
cd "$TARGET_DIR" || exit 1

# Loop through all files containing "(Medley)"
for file in *"(Medley)"*; do
    # Check if it's a regular file
    if [ -f "$file" ]; then
        # 1. Remove the extension
        track_name="${file%.*}"
        
        # 2. Strip out " (Medley)" from the name
        track_name="${track_name// (Medley)/}"
        
        # 3. Trim any leftover leading/trailing spaces
        track_name=$(echo "$track_name" | xargs)
        
        # Define the hidden directory name
        hidden_dir=".stems_${track_name}"
        
        # Create the directory if it doesn't exist
        if [ ! -d "$hidden_dir" ]; then
            mkdir "$hidden_dir"
            echo "Created hidden folder: $hidden_dir"
        else
            echo "Folder already exists: $hidden_dir"
        fi
    fi
done