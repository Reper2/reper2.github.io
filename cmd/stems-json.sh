#!/bin/zsh

# Define paths relative to project root
MUSIC_DIR="../assets/music"
# 💡 FIX: Resolve the absolute path immediately so changes in working directory won't break it
mkdir -p "../app/databases/music"
OUTPUT_DIR=$(cd "../app/databases/music" && pwd)

echo "🧹 Clearing old stems databases..."
rm -rf "$OUTPUT_DIR"/*

echo "🚀 Scanning category folders for hidden stem layers..."

# Find all directories that start with .stems_
find "$MUSIC_DIR" -type d -name ".stems_*" | while read -r stems_path; do
    # Extract folder properties
    folder_name=$(basename "$stems_path")
    category_dir=$(dirname "$stems_path")
    category_name=$(basename "$category_dir")
    
    echo "📦 Indexing: $category_name -> $folder_name"
    
    # Target directory matching your destination architecture requirements
    target_json_dir="$OUTPUT_DIR/$category_name"
    mkdir -p "$target_json_dir"
    
    # Execute tree inside the context of the asset folder safely
    (
      cd "$category_dir" || exit
      tree -J -L 1 -P "*.mp3" --noreport "$folder_name" > "$target_json_dir/$folder_name.json"
    )
done

echo "✅ Generation complete! Stem trees securely written to $OUTPUT_DIR"