// ==UserScript==
// @name         🛠️ ChatGPT Input Menu
// @namespace    https://github.com/jkindrix/userscripts
// @version      2.0.16
// @description  Creates a custom right-click menu for ChatGPT message input area with chatgpt.js integration
// @author       Justin Kindrix
// @match        *://chat.openai.com/*
// @match        *://chatgpt.com/*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/@kudoai/chatgpt.js@2.9.3/dist/chatgpt.min.js
// @updateURL    https://raw.githubusercontent.com/jkindrix/userscripts/main/chat-gpt/input-menu/dist/input-menu.js
// @downloadURL  https://raw.githubusercontent.com/jkindrix/userscripts/main/chat-gpt/input-menu/dist/input-menu.js
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