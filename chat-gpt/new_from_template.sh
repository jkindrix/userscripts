#!/bin/bash

# Function to prompt the user for input if no arguments are provided
prompt_for_input() {
    read -p "Enter the script name: " script_name
    read -p "Enter the description: " description
}

# Check if arguments are passed, if not prompt for input
if [ "$#" -eq 0 ]; then
    prompt_for_input
else
    script_name="$1"
    description="$2"
fi

# Check if the template file exists
template_file="template.js"
if [ ! -f "$template_file" ]; then
    echo "Error: $template_file does not exist."
    exit 1
fi

# Create the folder and file
folder_name="$script_name"
file_name="$script_name.js"

mkdir -p "$folder_name"

# Copy the template file contents and replace placeholders
sed -e "s/\[\%script-name\%\]/$script_name/g" -e "s/\[\%description\%\]/$description/g" "$template_file" > "$folder_name/$file_name"

echo "Folder and file created successfully."
echo "Folder: $folder_name"
echo "File: $folder_name/$file_name"
