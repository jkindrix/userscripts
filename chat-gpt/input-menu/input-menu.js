// ==UserScript==
// @name         🛠️ ChatGPT Input Menu
// @namespace    https://github.com/jkindrix/userscripts
// @version      2.0.21
// @description  Creates a custom right-click menu for ChatGPT message input area with chatgpt.js integration
// @author       Justin Kindrix
// @match        *://chat.openai.com/*
// @match        *://chatgpt.com/*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/@kudoai/chatgpt.js@2.9.3/dist/chatgpt.min.js
// @updateURL    https://raw.githubusercontent.com/jkindrix/userscripts/main/chat-gpt/input-menu/input-menu.js
// @downloadURL  https://raw.githubusercontent.com/jkindrix/userscripts/main/chat-gpt/input-menu/input-menu.js
// ==/UserScript==

(async function () {
    'use strict';

    try {
        // Ensure chatgpt.js is loaded
        console.log('Waiting for chatgpt.js to load...');
        await new Promise((resolve) => {
            const checkLoaded = () => {
                if (typeof chatgpt !== 'undefined') resolve();
                else setTimeout(checkLoaded, 50);
            };
            checkLoaded();
        });
        console.log('chatgpt.js loaded.');

        const menuConfig = {
            "Code": {
                "Add": {
                    "File Header": "openFileHeaderModal",
                    "Comments": "addComments",
                    "Docstring": "addDocstring"
                },
                "Create": {
                    "Application": {
                        "Desktop": "createDesktopApp",
                        "Mobile": "createMobileApp",
                        "Web": "createWebApp"
                    },
                    "Class/Object": "createClassObject",
                    "Function/Method": "createFunctionMethod",
                    "Script": "createScript"
                },
                "Refactor": {
                    "Modularize": {
                        "Classes": "modularizeClasses",
                        "Functions": "modularizeFunctions",
                        "Files": "modularizeFiles"
                    },
                    "Remove": {
                        "Comments": "removeComments",
                        "Redundancy": "removeRedundancy"
                    },
                    "Optimize": {
                        "Performance": "optimizePerformance",
                        "Readability": "optimizeReadability"
                    },
                    "Translate": {
                        "Language": {
                            "Human": "translateToHumanLanguage",
                            "Programming": "translateToProgrammingLanguage"
                        }
                    }
                },
            },
            "Explain": {
                "Concept": "explainConcept",
                "Interaction": "explainInteraction",
                "Relationship": "explainRelationship"
            },
            "List": {
                "Verbs (Actions)": "listVerbs",
                "Nouns (Objects)": "listNouns",
                "Adjectives (Properties)": "listAdjectives"
            }
        };

        const functionMap = {
            "openFileHeaderModal": openFileHeaderModal,
            "addComments": addComments,
            "addDocstring": addDocstring,
            "createDesktopApp": createDesktopApp,
            "createMobileApp": createMobileApp,
            "createWebApp": createWebApp,
            "createClassObject": createClassObject,
            "createFunctionMethod": createFunctionMethod,
            "createScript": createScript,
            "modularizeClasses": modularizeClasses,
            "modularizeFunctions": modularizeFunctions,
            "modularizeFiles": modularizeFiles,
            "removeComments": removeComments,
            "removeRedundancy": removeRedundancy,
            "optimizePerformance": optimizePerformance,
            "optimizeReadability": optimizeReadability,
            "translateToHumanLanguage": translateToHumanLanguage,
            "translateToProgrammingLanguage": translateToProgrammingLanguage,
            "explainConcept": explainConcept,
            "explainInteraction": explainInteraction,
            "explainRelationship": explainRelationship,
            "listVerbs": listVerbs,
            "listNouns": listNouns,
            "listAdjectives": listAdjectives
        };

        function createContextMenu() {
            console.log('Creating context menu...');
            const menu = document.createElement('ul');
            menu.id = 'customContextMenu';
            menu.style.position = 'absolute';
            menu.style.display = 'none';
            menu.style.zIndex = '1000';
            menu.style.backgroundColor = '#171717';
            menu.style.border = '1px solid #ccc';
            menu.style.padding = '5px';
            menu.style.boxShadow = '0px 0px 10px rgba(0,0,0,0.1)';
            document.body.appendChild(menu);

            console.log('Building menu...');
            buildMenu(menu, menuConfig, 1000); // Pass the starting z-index
            console.log('Menu built.');

            document.addEventListener('click', () => {
                menu.style.display = 'none';
            });

            function attachContextMenu() {
                const inputField = chatgpt.getChatBox();
                if (inputField) {
                    inputField.addEventListener('contextmenu', (event) => {
                        event.preventDefault();

                        // Ensure the menu is briefly displayed to measure its dimensions
                        menu.style.display = 'block';
                        const menuWidth = menu.offsetWidth;
                        const menuHeight = menu.offsetHeight;
                        menu.style.display = 'none';

                        // Get the viewport dimensions
                        const viewportWidth = window.innerWidth;
                        const viewportHeight = window.innerHeight;

                        // Calculate the desired position
                        let top = event.pageY;
                        let left = event.pageX;

                        console.log('Viewport dimensions:', { viewportWidth, viewportHeight });
                        console.log('Initial menu position:', { top, left });

                        // Adjust position if menu overflows off the page
                        if (top + menuHeight > viewportHeight - 10) {
                            top = viewportHeight - menuHeight - 10;
                            console.log('Adjusted top for overflow:', top);
                        }
                        if (left + menuWidth > viewportWidth) {
                            left = viewportWidth - menuWidth;
                            console.log('Adjusted left for overflow:', left);
                        }

                        // Ensure the menu does not go off the top, bottom, left, or right edge
                        top = Math.max(0, Math.min(top, viewportHeight - menuHeight));
                        left = Math.max(0, Math.min(left, viewportWidth - menuWidth));

                        // Apply the position to the menu
                        menu.style.top = `${top}px`;
                        menu.style.left = `${left}px`;
                        menu.style.display = 'block';

                        console.log('Final menu position:', { top, left });

                        // Recalculate submenu positions
                        const submenus = menu.querySelectorAll('ul');
                        submenus.forEach(submenu => {
                            const parent = submenu.parentElement;
                            submenu.style.display = 'block';

                            // Get the submenu dimensions
                            const subWidth = submenu.offsetWidth;
                            const subHeight = submenu.offsetHeight;

                            // Calculate the desired position
                            let subTop = parent.getBoundingClientRect().top;
                            let subLeft = parent.getBoundingClientRect().right;

                            console.log('Initial submenu position:', { subTop, subLeft });

                            // Adjust position if submenu overflows off the page
                            if (subTop + subHeight > viewportHeight) {
                                subTop = viewportHeight - subHeight - 10;
                                console.log('Adjusted subTop for overflow:', subTop);
                            }
                            if (subLeft + subWidth > viewportWidth) {
                                subLeft = parent.getBoundingClientRect().left - subWidth;
                                console.log('Adjusted subLeft for overflow:', subLeft);
                            }

                            // Ensure the submenu does not go off the top, bottom, left, or right edge
                            subTop = Math.max(0, Math.min(subTop, viewportHeight - subHeight));
                            subLeft = Math.max(0, Math.min(subLeft, viewportWidth - subWidth));

                            // Apply the position to the submenu
                            submenu.style.top = `${subTop}px`;
                            submenu.style.left = `${subLeft}px`;
                            submenu.style.display = 'none';

                            console.log('Final submenu position:', { subTop, subLeft });
                        });
                    });
                } else {
                    console.log('Input field not found.');
                }
            }

            attachContextMenu();

            // Re-attach the context menu when navigating between chats
            const observer = new MutationObserver(() => {
                attachContextMenu();
            });
            observer.observe(document.querySelector('main'), { childList: true, subtree: true });
        }

        // Update the buildMenu function to make only leaf nodes clickable and remove submenus when not hovered
        function buildMenu(container, config, zIndex = 1000) {
            for (const key in config) {
                if (typeof config[key] === 'object') {
                    const submenu = document.createElement('li');
                    submenu.textContent = key;
                    submenu.style.position = 'relative';
                    submenu.style.cursor = 'default';
                    submenu.style.padding = '5px';

                    submenu.addEventListener('mouseenter', () => {
                        console.log('Entering submenu for:', key);

                        submenu.style.backgroundColor = '#333333'; // Slightly lighter background on hover
                        submenu.style.boxShadow = '0px 0px 5px rgba(0,0,0,0.3)'; // Add shadow on hover

                        if (!submenu.querySelector('ul')) {
                            const subcontainer = document.createElement('ul');
                            subcontainer.style.position = 'fixed';
                            subcontainer.style.backgroundColor = '#171717';
                            subcontainer.style.border = '1px solid #ccc';
                            subcontainer.style.padding = '5px';
                            subcontainer.style.boxShadow = '0px 0px 10px rgba(0,0,0,0.1)';
                            subcontainer.style.zIndex = zIndex + 1; // Increment z-index for submenu
                            submenu.appendChild(subcontainer);

                            buildMenu(subcontainer, config[key], zIndex + 1); // Pass the incremented z-index

                            // Ensure the submenu is displayed to calculate dimensions
                            subcontainer.style.display = 'block';

                            // Get the submenu dimensions
                            const subWidth = subcontainer.offsetWidth;
                            const subHeight = subcontainer.offsetHeight;

                            // Get the viewport dimensions
                            const viewportWidth = window.innerWidth;
                            const viewportHeight = window.innerHeight;

                            // Calculate the desired position
                            let subTop = submenu.getBoundingClientRect().top;
                            let subLeft = submenu.getBoundingClientRect().right;

                            console.log('Initial submenu position:', { subTop, subLeft });

                            // Adjust position if submenu overflows off the page
                            if (subTop + subHeight > viewportHeight) {
                                subTop = viewportHeight - subHeight - 10;
                                console.log('Adjusted subTop for overflow:', subTop);
                            }
                            if (subLeft + subWidth > viewportWidth) {
                                subLeft = submenu.getBoundingClientRect().left - subWidth;
                                console.log('Adjusted subLeft for overflow:', subLeft);
                            }

                            // Ensure the submenu does not go off the top, bottom, left, or right edge
                            subTop = Math.max(0, Math.min(subTop, viewportHeight - subHeight));
                            subLeft = Math.max(0, Math.min(subLeft, viewportWidth - subWidth));

                            // Apply the position to the submenu
                            subcontainer.style.top = `${subTop}px`;
                            subcontainer.style.left = `${subLeft}px`;
                            subcontainer.style.display = 'block';

                            console.log('Final submenu position:', { subTop, subLeft });
                        } else {
                            const subcontainer = submenu.querySelector('ul');
                            subcontainer.style.display = 'block';
                        }
                    });

                    submenu.addEventListener('mouseleave', () => {
                        console.log('Leaving submenu for:', key);
                        const subcontainer = submenu.querySelector('ul');

                        submenu.style.backgroundColor = '#171717';
                        submenu.style.boxShadow = 'none'; // Remove shadow on leave

                        if (subcontainer) {
                            subcontainer.remove();
                        }
                    });

                    container.appendChild(submenu);
                } else {
                    const item = document.createElement('li');
                    item.textContent = key;
                    item.style.cursor = 'pointer';
                    item.style.padding = '5px';
                    item.addEventListener('mouseenter', () => {
                        item.style.backgroundColor = '#333333'; // Slightly lighter background on hover
                        item.style.boxShadow = '0px 0px 5px rgba(0,0,0,0.3)'; // Add shadow on hover
                    });
                    item.addEventListener('mouseleave', () => {
                        item.style.backgroundColor = '#171717';
                        item.style.boxShadow = 'none'; // Remove shadow on leave
                    });

                    item.addEventListener('click', () => {
                        console.log(`Executing action for ${key}`);
                        try {
                            const func = functionMap[config[key]];
                            if (typeof func === 'function') {
                                func();
                            } else {
                                console.error(`Function ${config[key]} not found in function map.`);
                            }
                        } catch (error) {
                            console.error(`Error executing action for ${key}:`, error);
                        }
                    });
                    container.appendChild(item);
                }
            }
        }

        function openFileHeaderModal() {
            console.log('Opening file header modal...');
            const modal = document.createElement('div');
            modal.id = 'fileHeaderModal';
            modal.style.position = 'fixed';
            modal.style.top = '50%';
            modal.style.left = '50%';
            modal.style.transform = 'translate(-50%, -50%)';
            modal.style.backgroundColor = '#171717';
            modal.style.border = '1px solid #ccc';
            modal.style.padding = '20px';
            modal.style.zIndex = '1001';
            modal.style.boxShadow = '0px 0px 10px rgba(0,0,0,0.1)';
            modal.innerHTML = `
                <h2>Add File Header</h2>
                <form id="fileHeaderForm">
                    <input type="checkbox" name="Title" id="title"><label for="title">Title</label><br>
                    <input type="checkbox" name="Author" id="author"><label for="author">Author</label><br>
                    <input type="checkbox" name="Date" id="date"><label for="date">Date</label><br>
                    <input type="checkbox" name="Description" id="description"><label for="description">Description</label><br>
                    <button type="button" id="submitFileHeader">Submit</button>
                    <button type="button" id="cancelFileHeader">Cancel</button>
                </form>
            `;
            document.body.appendChild(modal);

            document.getElementById('cancelFileHeader').addEventListener('click', () => {
                console.log('File header modal canceled.');
                modal.remove();
            });

            document.getElementById('submitFileHeader').addEventListener('click', async () => {
                const form = document.getElementById('fileHeaderForm');
                let headerText = 'Generate a header for this code file which includes the following properties:\n\n';
                const checkboxes = form.querySelectorAll('input[type="checkbox"]:checked');
                checkboxes.forEach(checkbox => {
                    headerText += `- ${checkbox.name}\n`;
                });
                await appendText(headerText);
                console.log('File header modal submitted.');
                modal.remove();
            });
        }

        // Define functions for each leaf node in the function map
        async function addComments() {
            await appendText('Add comments');
        }

        async function addDocstring() {
            await appendText('Add docstring');
        }

        async function createDesktopApp() {
            await appendText('Create desktop application');
        }

        async function createMobileApp() {
            await appendText('Create mobile application');
        }

        async function createWebApp() {
            await appendText('Create web application');
        }

        async function createClassObject() {
            await appendText('Create class/object');
        }

        async function createFunctionMethod() {
            await appendText('Create function/method');
        }

        async function createScript() {
            await appendText('Create script');
        }

        async function modularizeClasses() {
            await appendText('Modularize classes');
        }

        async function modularizeFunctions() {
            await appendText('Modularize functions');
        }

        async function modularizeFiles() {
            await appendText('Modularize files');
        }

        async function removeComments() {
            await appendText('Remove comments');
        }

        async function removeRedundancy() {
            await appendText('Remove redundancy');
        }

        async function optimizePerformance() {
            await appendText('Optimize performance');
        }

        async function optimizeReadability() {
            await appendText('Optimize readability');
        }

        async function translateToHumanLanguage() {
            await appendText('Translate to human language');
        }

        async function translateToProgrammingLanguage() {
            await appendText('Translate to programming language');
        }

        async function explainConcept() {
            await appendText('Explain concept');
        }

        async function explainInteraction() {
            await appendText('Explain interaction');
        }

        async function explainRelationship() {
            await appendText('Explain relationship');
        }

        async function listVerbs() {
            await appendText('Generate a list of verbs (actions)');
        }

        async function listNouns() {
            await appendText('Generate a list of nouns (objects)');
        }

        async function listAdjectives() {
            await appendText('Generate a list of adjectives (properties)');
        }

        async function appendText(text) {
            console.log(`Appending text: ${text}`);
            const textarea = chatgpt.getChatBox();
            if (textarea) {
                textarea.value += text;
                textarea.focus(); // Focus the input field after appending text

                // Trigger input event to resize textarea
                const event = new Event('input', { bubbles: true });
                textarea.dispatchEvent(event);
            } else {
                console.log('Input field not found.');
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
