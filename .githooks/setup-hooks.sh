#!/bin/bash

# ANSI color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Determine the project root directory
PROJECT_ROOT="$(git rev-parse --show-toplevel)"
if [ $? -ne 0 ]; then
  echo -e "${RED}Failed to determine project root directory.${NC}"
  exit 1
fi

# Change to the project root directory
cd "$PROJECT_ROOT" || exit

# Ensure the .git/hooks directory exists
echo -e "${CYAN}Ensuring the .git/hooks directory exists...${NC}"
mkdir -p .git/hooks
if [ $? -eq 0 ]; then
  echo -e "${GREEN}.git/hooks directory is ready.${NC}"
else
  echo -e "${RED}Failed to create .git/hooks directory.${NC}"
  exit 1
fi

# Remove existing pre-commit hook if it exists
echo -e "${CYAN}Removing existing pre-commit hook...${NC}"
rm -f .git/hooks/pre-commit

# Copy the actual pre-commit script from .githooks to .git/hooks
echo -e "${CYAN}Copying pre-commit script...${NC}"
cp .githooks/pre-commit .git/hooks/pre-commit

# Make it executable
echo -e "${CYAN}Setting executable permissions for pre-commit script...${NC}"
chmod +x .git/hooks/pre-commit

# Make sure all hook scripts in .githooks/pre-commit.d are executable
echo -e "${CYAN}Making all hook scripts in .githooks/pre-commit.d executable...${NC}"
if [ -d ".githooks/pre-commit.d" ]; then
  chmod +x .githooks/pre-commit.d/*
fi

if [ $? -eq 0 ]; then
  echo -e "${GREEN}All hook scripts are now executable.${NC}"
else
  echo -e "${RED}Failed to make hook scripts executable.${NC}"
  exit 1
fi

echo -e "${GREEN}Git hooks have been set up successfully.${NC}"
