// ==UserScript==
// @name         🛠️ ChatGPT Custom Instructions Sidebar
// @namespace    https://github.com/jkindrix/userscripts
// @version      1.0.0
// @description  A userscript to add a sidebar to ChatGPT with checkboxes for custom instructions
// @author       Justin Kindrix
// @match        *://chat.openai.com/*
// @match        *://chatgpt.com/*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/@kudoai/chatgpt.js@2.9.3/dist/chatgpt.min.js
// @updateURL    https://raw.githubusercontent.com/jkindrix/userscripts/main/chat-gpt/custom-instructions/custom-instructions.js
// @downloadURL  https://raw.githubusercontent.com/jkindrix/userscripts/main/chat-gpt/custom-instructions/custom-instructions.js
// ==/UserScript==

(async function () {
    'use strict';

    const enableLogging = false; // Set to true to enable logging, false to disable

    // Function for logging
    function log(message) {
        if (enableLogging) {
            console.log(message);
        }
    }

    // Ensure chatgpt.js is loaded
    // Wait for chatgpt.js to be ready
    await chatgpt.isLoaded();

    function addSideMenu() {
        // Select the element using the given CSS selector
        const parentElement = document.querySelector('#__next > div.relative.z-0.flex.h-full.w-full.overflow-hidden');

        // Create the new div element with the provided HTML structure
        const newDivElement = document.createElement('div');
        newDivElement.className = "flex-shrink-0 overflow-x-hidden bg-token-sidebar-surface-primary";
        newDivElement.style.width = "200px";
        newDivElement.innerHTML = `
            <div class="h-full w-[200px]">
                <div class="flex h-full min-h-0 flex-col">
                    <div class="flex h-full min-h-0 flex-col">
                        <div class="relative h-full w-full flex-1 items-start border-white/20">
                            <h2
                                style="position: absolute; border: 0px; width: 1px; height: 1px; padding: 0px; margin: -1px; overflow: hidden; clip: rect(0px, 0px, 0px, 0px); white-space: nowrap; overflow-wrap: normal;">
                                Custom Instructions</h2>
                            <div class="flex h-full w-full flex-col px-3 pb-3.5 juice:pb-0" aria-label="Custom Instructions">
                                <div class="flex-col flex-1 transition-opacity duration-500 -mr-2 pr-2 overflow-y-auto">
                                    <div class="flex flex-col gap-2 pb-2 text-token-text-primary text-sm juice:mt-5">
                                        <div>
                                            <div class="relative mt-5 empty:mt-0 empty:hidden juice:first:mt-0 juice:last:mb-5"
                                                style="height: auto;opacity: 1;bottom: 0px;">
                                                <div
                                                    class="juice:sticky juice:top-0 juice:z-20 juice:bg-token-sidebar-surface-primary">
                                                    <span class="flex h-9 items-center">
                                                        <h3
                                                            class="pb-2 pt-3 px-2 text-xs font-semibold text-ellipsis overflow-hidden break-all text-token-text-secondary">
                                                            Custom Instructions</h3>
                                                    </span></div>
                                                <ol>
                                                    <li class="relative" style="opacity: 1; height: auto;">
                                                        <div>
                                                            <input id="cb-10-words-or-less" type="checkbox" style="margin-left: 10px; transform: scale(0.75)">
                                                            <span style="margin-left: 10px;">10 words or less</span>
                                                        </div>
                                                    </li>
                                                </ol>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Check if the parent element exists
        if (parentElement) {
            // Insert the new div as the second child
            if (parentElement.children.length > 1) {
                // If there are already children, insert before the second child
                parentElement.insertBefore(newDivElement, parentElement.children[1]);
                document.querySelector('#cb-10-words-or-less').addEventListener('change', async function (event) {
                    if (event.target.checked) {
                        await chatgpt.instructions.add('Respond to every request with 10 words or less', 'chatgpt');
                    } else {
                        await chatgpt.instructions.clear('chatgpt');
                    }
                });
            } else {
                // If there are no children or only one child, append the new div
                parentElement.appendChild(newDivElement);
            }
        } else {
            console.error('Parent element not found.');
        }
    }

    // Initialize the script
    function init() {
        log('Initializing script...');
        addSideMenu();
        log('Script initialized.');
    }

    // Run the initialization
    init();

    // Log when the script has loaded
    log('ChatGPT custom-instructions script loaded and running.');
})();
