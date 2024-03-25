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
    echo "Updated files:"
    git status --short

    # Prompt user to confirm if they want to push changes
    echo "Push file nis tov GitHub men boss? (y/n)"
    read -t 3 -n 1 choice  # Wait for 3 seconds for user input
    if [ "$choice" == "y" ] || [ "$choice" == "Y" ]; then
        echo "Ok Boss jam tic jeng"
    else
        echo "Auto-confirming after 3 seconds boss..."
        sleep 3
        choice="y"  # Auto-confirm after 3 seconds
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
