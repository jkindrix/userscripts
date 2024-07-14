#!/bin/sh

# Exit immediately if a command exits with a non-zero status
set -e

# Function to check for remote changes and handle stashing and pulling
update_branch() {
    echo "Fetching remote updates..."
    git fetch origin

    LOCAL=$(git rev-parse @)
    REMOTE=$(git rev-parse @{u})
    BASE=$(git merge-base @ @{u})

    if [ $LOCAL = $REMOTE ]; then
        echo "Local branch is up to date with remote."
    elif [ $LOCAL = $BASE ]; then
        echo "Local branch is behind remote. Stashing changes and pulling updates..."
        
        # Stash local changes with a specific message to avoid confusion
        git stash push -m "pre-commit-$(date +%Y%m%d%H%M%S)" -u
        echo "Changes stashed."

        git pull --rebase
        echo "Pulled remote changes."

        # Prompt user to manually pop the stash
        read -p "Do you want to apply stashed changes? (y/n): " response
        if [ "$response" = "y" ]; then
            git stash pop
            echo "Stash popped."
        else
            echo "Stashed changes not applied. You can apply them later using 'git stash pop'."
        fi
    elif [ $REMOTE = $BASE ]; then
        echo "Local branch is ahead of remote. No need to pull changes."
    else
        echo "Local and remote branches have diverged. Please resolve manually."
        exit 1
    fi
}

# Ensure we are on the correct branch
BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "Current branch: $BRANCH"

# Check if the branch has an upstream
if ! git rev-parse --abbrev-ref @{u} >/dev/null 2>&1; then
    echo "No upstream branch set for the current branch. Please set the upstream branch."
    exit 1
fi

# Call the function to update branch
update_branch

echo "Branch updated successfully. Proceeding with the commit."
exit 0