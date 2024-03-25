#!/bin/bash

# Define your GitHub repository URL
repo_url="https://github.com/your-username/your-repo.git"

# Function to add updated files to the GitHub repository
add_to_github() {
    local commit_message="$1"

    # Check if there are any changes to commit
    if git diff-index --quiet HEAD --; then
        echo "No changes to commit."
        exit 0
    fi

    # List updated files
    echo "Files updated tmey boss:"
    git status --short

    # Prompt user to confirm if they want to push changes
    echo "Push file ler ng tov GitHub ort boss? (y/n)"
    read -t 5 -n 1 choice  # Wait for 5 seconds for user input
    if [ "$choice" == "y" ] || [ "$choice" == "Y" ]; then
        echo "Ok Boss jam tic jeng"
    else
        echo "Auto-confirming after 5 seconds boss..."
        sleep 5
        choice="y"  # Auto-confirm after 5 seconds
    fi

    if [ "$choice" == "y" ] || [ "$choice" == "Y" ]; then
        # Add all modified and new files
        git add .

        # Commit changes
        git commit -m "$commit_message"

        # Push changes to GitHub
        git push origin master  # Replace 'master' with your branch name if necessary
    else
        echo "Changes not pushed to GitHub."
    fi
}

# Call the function with the commit message
add_to_github "Update: Added new feature"
