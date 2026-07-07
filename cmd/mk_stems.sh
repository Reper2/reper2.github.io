#!/bin/zsh

# Navigate up from /cmd/ and target the asset music path cleanly
MUSIC_DIR="$(dirname "$0")/../assets/music"
TARGET_DIR="${MUSIC_DIR}/Hyrule Warriors Age of Imprisonment"

if [ ! -d "$TARGET_DIR" ]; then
    echo "❌ Error: Directory '$TARGET_DIR' does not exist."
    exit 1
fi

cd "$TARGET_DIR" || exit 1

# Step 1: Count occurrences using a Zsh associative array
typeset -A base_counts

# Force explicit null-globbing so spaces don't choke the loop expansion
setopt local_options nullglob

for file in *.(mp3|flac); do
    [ -e "$file" ] || continue
    
    clean_name="${file%.*}"
    
    # Strip Disc-Track hyphenated numerical prefixes cleanly (e.g., "1-01. ")
    clean_name=$(echo "${clean_name}" | sed -E 's/^[0-9]+-[0-9]+\.[[:space:]]*//')
    clean_name=$(echo "${clean_name}" | sed -E 's/^[0-9]+x?[0-9]*\.[[:space:]]*//')
    clean_name=$(echo "${clean_name}" | sed -E 's/^[0-9]+[[:space:]]+//')
    
    # Strip variant descriptors to find the common track base name
    clean_name=$(echo "${clean_name}" | sed -E 's/[[:space:]]*\((Medley|Prelude|Final Lap|Section [0-9]+|Phase [0-9]+|Final Section|Battle|Water Section|Movie Screen|Enemy Outpost|Critical Hit|Conclusion)\)//g')
    clean_name=$(echo "${clean_name}" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')
    
    if [ -n "$clean_name" ]; then
        current_count=${base_counts[$clean_name]:-0}
        base_counts[$clean_name]=$((current_count + 1))
    fi
done

# Step 2: Route variant files and rename base tracks at the root
for file in *.(mp3|flac); do
    [ -e "$file" ] || continue
    
    raw_base="${file%.*}"
    ext="${file##*.}"
    
    # Strip ONLY track numbers to see what the actual track name is with tags intact
    no_prefix=$(echo "${raw_base}" | sed -E 's/^[0-9]+-[0-9]+\.[[:space:]]*//')
    no_prefix=$(echo "${no_prefix}" | sed -E 's/^[0-9]+x?[0-9]*\.[[:space:]]*//')
    no_prefix=$(echo "${no_prefix}" | sed -E 's/^[0-9]+[[:space:]]+//' | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')

    # Strip tags entirely to get the pure base name
    clean_name=$(echo "${no_prefix}" | sed -E 's/[[:space:]]*\((Medley|Prelude|Final Lap|Section [0-9]+|Phase [0-9]+|Final Section|Battle|Water Section|Movie Screen|Enemy Outpost|Critical Hit|Conclusion)\)//g')
    clean_name=$(echo "${clean_name}" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')
    
    total_count=${base_counts[$clean_name]:-0}
    
    if [ "$total_count" -ge 2 ]; then
        hidden_dir=".stems_${clean_name}"
        
        if [ ! -d "$hidden_dir" ]; then
            mkdir -p "$hidden_dir"
            echo "📁 Created stems base container: $hidden_dir"
        fi
        
        if [ "$no_prefix" != "$clean_name" ]; then
            # Move variants inside the hidden folder, cleaning up just the track number prefix
            mv "$file" "$hidden_dir/${no_prefix}.${ext}"
            echo "  ➡️ Moved Variant: $file -> $hidden_dir/${no_prefix}.${ext}"
        else
            # This is the true base file (e.g., "7-15. Calamity Ganon.mp3")
            new_base_name="${clean_name}.${ext}"
            
            if [ "$file" != "$new_base_name" ]; then
                mv "$file" "$new_base_name"
                echo "  🏷️ Renamed Root Base Track: $file -> $new_base_name"
            else
                echo "  📌 Base Track already clean at Root: $file"
            fi
        fi
    fi
done

echo "✅ Stem grouping and base file cleanups complete!"