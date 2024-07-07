// ==UserScript==
// @name         🛠️ ChatGPT Custom Input Menu
// @namespace    https://github.com/jkindrix/tampermonkey-scripts
// @version      2.0.5
// @description  Creates a custom right-click menu for ChatGPT message input area with chatgpt.js integration
// @author       Justin Kindrix
// @match        *://chat.openai.com/*
// @match        *://chatgpt.com/*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/@kudoai/chatgpt.js@2.9.3/dist/chatgpt.min.js
// @updateURL    https://raw.githubusercontent.com/jkindrix/tampermonkey-scripts/main/scripts/chat-gpt/custom-input-menu/custom-input-menu.js
// @downloadURL  https://raw.githubusercontent.com/jkindrix/tampermonkey-scripts/main/scripts/chat-gpt/custom-input-menu/custom-input-menu.js
// ==/UserScript==

(async function () {
    'use strict';

    try {
        // Wait for chatgpt.js to be ready
        console.log('Waiting for chatgpt.js to be ready...');
        await chatgpt.isReady();
        console.log('chatgpt.js is ready.');

        const menuConfig = {
            "Code": {
                "Add": {
                    "File Header": "openFileHeaderModal",
                    "Comments": "appendText('Add comments')",
                    "Docstring": "appendText('Add docstring')"
                },
                "Create": {
                    "Application": {
                        "Desktop": "appendText('Create desktop application')",
                        "Mobile": "appendText('Create mobile application')",
                        "Web": "appendText('Create web application')"
                    },
                    "Class/Object": "appendText('Create class/object')",
                    "Function/Method": "appendText('Create function/method')",
                    "Script": "appendText('Create script')"
                },
                "Refactor": {
                    "Modularize": {
                        "Classes": "appendText('Modularize classes')",
                        "Functions": "appendText('Modularize functions')",
                        "Files": "appendText('Modularize files')"
                    }
                },
                "Remove": {
                    "Comments": "appendText('Remove comments')",
                    "Redundancy": "appendText('Remove redundancy')"
                },
                "Optimize": {
                    "Performance": "appendText('Optimize performance')",
                    "Readability": "appendText('Optimize readability')"
                },
                "Translate": {
                    "Language": {
                        "Human": "appendText('Translate to human language')",
                        "Programming": "appendText('Translate to programming language')"
                    }
                }
            },
            "Explain": {
                "Concept": "appendText('Explain concept')",
                "Interaction": "appendText('Explain interaction')",
                "Relationship": "appendText('Explain relationship')"
            },
            "List": {
                "Verbs (Actions)": "appendText('Generate a list of verbs (actions)')",
                "Nouns (Objects)": "appendText('Generate a list of nouns (objects)')",
                "Adjectives (Properties)": "appendText('Generate a list of adjectives (properties)')"
            }
        };

        // Append text to the input textarea using chatgpt.js
        function appendText(text) {
            console.log(`Appending text: ${text}`);
            const textarea = chatgpt.getInputField();
            if (textarea) {
                textarea.value += `\n${text}`;
                chatgpt.focusInputField(); // Focus the input field after appending text
            } else {
                console.log('Input field not found.');
            }
        }

        // Open the modal dialog for File Header
        function openFileHeaderModal() {
            console.log('Opening file header modal...');
            const modal = document.createElement('div');
            modal.id = 'fileHeaderModal';
            modal.style.position = 'fixed';
            modal.style.top = '50%';
            modal.style.left = '50%';
            modal.style.transform = 'translate(-50%, -50%)';
            modal.style.backgroundColor = '#fff';
            modal.style.border = '1px solid #ccc';
            modal.style.padding = '20px';
            modal.style.zIndex = '1001';
            modal.style.boxShadow = '0px 0px 10px rgba(0,0,0,0.1)';
            modal.innerHTML = `
                <h2>Add File Header</h2>
                <form id="fileHeaderForm">
                    <!-- ... (form elements unchanged) -->
                    <button type="button" id="submitFileHeader">Submit</button>
                    <button type="button" id="cancelFileHeader">Cancel</button>
                </form>
            `;
            document.body.appendChild(modal);

            document.getElementById('cancelFileHeader').addEventListener('click', () => {
                console.log('File header modal canceled.');
                modal.remove();
            });

            document.getElementById('submitFileHeader').addEventListener('click', () => {
                const form = document.getElementById('fileHeaderForm');
                let headerText = 'Generate a header for this code file which includes the following properties:\n\n';
                const checkboxes = form.querySelectorAll('input[type="checkbox"]:checked');
                checkboxes.forEach(checkbox => {
                    headerText += `- ${checkbox.name}\n`;
                });
                appendText(headerText);
                console.log('File header modal submitted.');
                modal.remove();
            });
        }

        // Create and configure the context menu
        function createContextMenu() {
            console.log('Creating context menu...');
            const menu = document.createElement('ul');
            menu.id = 'customContextMenu';
            menu.style.position = 'absolute';
            menu.style.display = 'none';
            menu.style.zIndex = '1000';
            menu.style.backgroundColor = '#fff';
            menu.style.border = '1px solid #ccc';
            menu.style.padding = '10px';
            menu.style.boxShadow = '0px 0px 10px rgba(0,0,0,0.1)';
            document.body.appendChild(menu);

            console.log('Building menu...');
            buildMenu(menu, menuConfig);
            console.log('Menu built.');

            document.addEventListener('click', () => {
                menu.style.display = 'none';
            });

            const inputField = chatgpt.getInputField();
            if (inputField) {
                inputField.addEventListener('contextmenu', (event) => {
                    event.preventDefault();
                    menu.style.top = `${event.pageY}px`;
                    menu.style.left = `${event.pageX}px`;
                    menu.style.display = 'block';
                });
            } else {
                console.log('Input field not found.');
            }
        }

        // Build the menu from the configuration object
        function buildMenu(container, config) {
            for (const key in config) {
                if (typeof config[key] === 'object') {
                    const submenu = document.createElement('li');
                    submenu.textContent = key;
                    const subcontainer = document.createElement('ul');
                    subcontainer.style.display = 'none';
                    subcontainer.style.position = 'absolute';
                    subcontainer.style.backgroundColor = '#fff';
                    subcontainer.style.border = '1px solid #ccc';
                    subcontainer.style.padding = '10px';
                    submenu.appendChild(subcontainer);
                    container.appendChild(submenu);

                    submenu.addEventListener('mouseover', () => {
                        subcontainer.style.display = 'block';
                    });

                    submenu.addEventListener('mouseout', () => {
                        subcontainer.style.display = 'none';
                    });

                    buildMenu(subcontainer, config[key]);
                } else {
                    const item = document.createElement('li');
                    item.textContent = key;
                    item.style.cursor = 'pointer';
                    item.addEventListener('click', () => {
                        console.log(`Executing action for ${key}`);
                        try {
                            eval(config[key]);  // Using eval to execute the string function names
                        } catch (error) {
                            console.error(`Error executing action for ${key}:`, error);
                        }
                    });
                    container.appendChild(item);
                }
            }
        }

        // Initialize the script
        function init() {
            console.log('Initializing script...');
            createContextMenu();
            console.log('Script initialized.');
        }

        // Run the initialization
        init();

        // Log when the script has loaded
        console.log('ChatGPT Custom Input Menu script loaded and running.');
    } catch (error) {
        console.error('Error in script execution:', error);
    }
})();
