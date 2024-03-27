#!/bin/bash

# Define last build log file
last_build_log="./last_build.log"

# Function to record build timestamps
record_build_timestamps() {
    # Find and update timestamps only for existing files
    find ./src -type f -name '*.ts' -exec stat -c "%Y %n" {} + | while read -r ts file; do
        if [ -e "$file" ]; then
            echo "$ts $file"
        fi
    done > "$last_build_log.tmp"

    # Replace the original last_build.log with the updated one
    mv "$last_build_log.tmp" "$last_build_log"
}

# Function to check if any files have been updated since last build
any_files_updated() {
    local last_build_ts
    local current_ts
    local file_checksum

    # Check if last build log file exists
    if [ ! -f "$last_build_log" ]; then
        echo "Last build log file not found. Creating..."
        record_build_timestamps
        return 1  # No files updated as this is the first build
    fi

    # Read last build timestamps from the log file
    updated_files=()
    while IFS= read -r line; do
        last_build_ts=$(echo "$line" | awk '{print $1}')
        file=$(echo "$line" | cut -d ' ' -f2-)

        if [ ! -e "$file" ]; then
            updated_files+=("\e[1;31m$file (deleted)\e[0m")  # Red color for deleted files
            continue
        fi

        current_ts=$(stat -c "%Y" "$file" 2>/dev/null || echo "0")
        if [ "$last_build_ts" -ne "$current_ts" ]; then
            updated_files+=("\e[1;32m$file\e[0m")  # Green color for updated files
        fi
    done < "$last_build_log"

    if [ ${#updated_files[@]} -gt 0 ]; then
        echo "Files changes:"
        for file in "${updated_files[@]}"; do
            echo -e "$file"
        done
        return 0
    else
        return 1
    fi
}

# Function to update last_build.log file with new timestamps
update_last_build_log() {
    record_build_timestamps
}

# Check if any files have been updated since last build
if any_files_updated; then
    echo "Deploy lov ort boss? (y/n):"
    read -r choice
    case "$choice" in
        [Yy]* )
            ./tovercel.sh
            update_last_build_log # after finish build jam run ah nis if build fail kom run 
            ./savetogit.sh
            ;;
        * )
            echo "OK Boss. No deployment will be done."
            ;;
    esac
else
    echo "No updated files. No need to deploy boss."
fi