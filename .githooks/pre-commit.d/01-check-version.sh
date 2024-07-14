#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# ANSI color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to extract the version number from a file
get_version() {
  local file="$1"
  grep -Eo '// @version\s+[0-9]+\.[0-9]+\.[0-9]+' "$file" | awk '{print $3}'
}

# Function to get the last committed version of a file
get_last_committed_version() {
  local file="$1"
  git show HEAD:"$file" 2>/dev/null | grep -Eo '// @version\s+[0-9]+\.[0-9]+\.[0-9]+' | awk '{print $3}' || echo "0.0.0"
}

# Function to increment the version number
increment_version() {
  local version="$1"
  IFS='.' read -r -a parts <<< "$version"
  parts[2]=$((parts[2] + 1))
  echo "${parts[0]}.${parts[1]}.${parts[2]}"
}

# Determine the project root directory
PROJECT_ROOT="$(git rev-parse --show-toplevel)"
if [ $? -ne 0 ]; then
  echo -e "${RED}Failed to determine project root directory.${NC}"
  exit 1
fi

# Get the list of staged .js files
STAGED_JS_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep '\.js$' || true)

# Debug: Print the list of staged JS files
echo -e "${CYAN}Staged JS files:${NC}"
echo "$STAGED_JS_FILES"

# Check if any JS files are staged
if [ -z "$STAGED_JS_FILES" ]; then
  echo -e "${YELLOW}No JavaScript files staged for commit.${NC}"
  exit 0
fi

# Process each staged JS file
for file in $STAGED_JS_FILES; do
  if [ -f "$file" ]; then
    if grep -q '// @version' "$file"; then
      echo -e "${CYAN}Processing file: $file${NC}"

      LAST_VERSION=$(get_last_committed_version "$file")
      CURRENT_VERSION=$(get_version "$file")

      # Debug: Print the versions
      echo -e "${CYAN}Last committed version: $LAST_VERSION${NC}"
      echo -e "${CYAN}Current version: $CURRENT_VERSION${NC}"

      # Compare the versions
      if [ "$CURRENT_VERSION" = "$LAST_VERSION" ]; then
        echo -e "${YELLOW}The version number has not been incremented in $file${NC}"
        read -p "Would you like to increment the version number? (y/n): " choice
        if [ "$choice" = "y" ]; then
          NEW_VERSION=$(increment_version "$CURRENT_VERSION")
          sed -i "" "s|// @version $CURRENT_VERSION|// @version $NEW_VERSION|" "$file"
          git add "$file"
          echo -e "${GREEN}Version number in $file updated to $NEW_VERSION and staged.${NC}"
        else
          echo -e "${RED}Error: Version number has not been incremented in $file${NC}"
          exit 1
        fi
      fi
    else
      echo -e "${YELLOW}No version header found in $file${NC}"
    fi
  else
    echo -e "${RED}File $file does not exist.${NC}"
  fi
done

# Allow the commit
echo -e "${GREEN}Commit allowed.${NC}"
exit 0
