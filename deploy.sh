#!/bin/bash

# Define last build log file
last_build_log="./last_build.log"

# Function to record build timestamps
record_build_timestamps() {
    # Remove entries for deleted files
    while IFS= read -r line; do
        file=$(echo "$line" | cut -d ' ' -f2-)
        if [ -f "$file" ]; then
            echo "$line"
        fi
    done < "$last_build_log" > "$last_build_log.tmp"

    # Find and update timestamps only for existing files
    find ./src -type f -name '*.ts' -exec stat -c "%Y %n" {} + | while read -r ts file; do
        if [ -e "$file" ]; then
            echo "$ts $file"
        fi
    done >> "$last_build_log.tmp"

    # Replace the original last_build.log with the updated one
    mv "$last_build_log.tmp" "$last_build_log"
}

# Function to calculate checksum of a file
calculate_checksum() {
    md5sum "$1" | awk '{ print $1 }'
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
        return 0  # Files updated as this is the first build
    fi

    # Read last build timestamps from the log file
    updated_files=()
    while IFS= read -r line; do
        last_build_ts=$(echo "$line" | awk '{print $1}')
        file=$(echo "$line" | cut -d ' ' -f2-)

        current_ts=$(stat -c "%Y" "$file" 2>/dev/null || echo "0")
        if [ "$last_build_ts" -ne "$current_ts" ]; then
            updated_files+=("$file")
        fi
    done < "$last_build_log"

    if [ ${#updated_files[@]} -gt 0 ]; then
        echo "Files have been updated:"
        for file in "${updated_files[@]}"; do
            echo "$file"
        done
        read -p "Deploy lov ort boss? (y/n): " choice
        case "$choice" in
            [Yy]* ) return 0 ;;
            * ) echo "OK Boss"; exit ;;
        esac
    else
        echo "No files have been updated. No need to deploy boss."
        return 1
    fi
}

# Check if any files have been updated since last build
if any_files_updated; then
    echo "Proceeding with deployment..."

    # Run npm build
    echo "Building project..."
    npm run build

    # Check if npm build was successful
    if [ $? -eq 0 ]; then
        echo "Build successful."

        # Deploy to Vercel production
        echo "Deploying to Vercel production..."
        vercel --prod

        # Check if Vercel deployment was successful
        if [ $? -eq 0 ]; then
            echo "Deployment to Vercel production successful."

            # Send message using curl
            echo "Sending message..."
            curl --location 'https://daraboth-personalai.vercel.app/telegram/send-message' \
            --header 'Content-Type: application/x-www-form-urlencoded' \
            --data-urlencode 'chatId=485397124' \
            --data-urlencode 'message=Personal-ai is ready on production boss!'
            
            echo "Message sent."

            ./savetogit.sh

        else
            echo "Deployment to Vercel production failed. Please check the logs manually."
        fi
    else
        echo "Build failed. Please check the logs manually."
    fi
else
    echo "No files have been updated. No need to deploy boss."
fi