// ==UserScript==
// @name         🛠️ ChatGPT Custom Input Menu
// @namespace    https://github.com/jkindrix/tampermonkey-scripts
// @version      2.0.14
// @description  Creates a custom right-click menu for ChatGPT message input area with chatgpt.js integration
// @author       Justin Kindrix
// @match        *://chat.openai.com/*
// @match        *://chatgpt.com/*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/@kudoai/chatgpt.js@2.9.3/dist/chatgpt.min.js
// @require      https://raw.githubusercontent.com/jkindrix/tampermonkey-scripts/main/scripts/chat-gpt/custom-input-menu/menu-config.js
// @require      https://raw.githubusercontent.com/jkindrix/tampermonkey-scripts/main/scripts/chat-gpt/custom-input-menu/function-map.js
// @require      https://raw.githubusercontent.com/jkindrix/tampermonkey-scripts/main/scripts/chat-gpt/custom-input-menu/utility-functions.js
// @require      https://raw.githubusercontent.com/jkindrix/tampermonkey-scripts/main/scripts/chat-gpt/custom-input-menu/menu-functions.js
// @updateURL    https://raw.githubusercontent.com/jkindrix/tampermonkey-scripts/main/scripts/chat-gpt/custom-input-menu/main.js
// @downloadURL  https://raw.githubusercontent.com/jkindrix/tampermonkey-scripts/main/scripts/chat-gpt/custom-input-menu/main.js
// ==/UserScript==

import { createContextMenu } from './menu-functions.js';

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
