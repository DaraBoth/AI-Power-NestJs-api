#!/bin/bash

# Define your GitHub repository URL
repo_url="https://github.com/your-username/your-repo.git"

# Function to add updated files to the GitHub repository
add_to_github() {
    local commit_message="$1"

    # Check if there are any changes to commit
    if git diff-index --quiet HEAD --; then
        echo "Up to date hz boss."
        exit 0
    fi

    # List updated files
    echo "Files updated tmey boss:"
    git status --short

    # Prompt user to confirm if they want to push changes
    read -p "Push ort boss? (y/n): " choice
    case "$choice" in
        [Yy]* )
            # Add all modified and new files
            git add .

            # Remove deleted files from the Git index
            git ls-files --deleted -z | xargs -0 git rm

            # Commit changes
            git commit -m "$commit_message"

            # Push changes to GitHub
            git push origin master  # Replace 'master' with your branch name if necessary
            ;;
        * )
            echo "Ok boss."
            ;;
    esac
}

# Call the function with the commit message
add_to_github "Update: Added new feature"
