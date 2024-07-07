import { createContextMenu } from './menu-functions.js';

(async function () {
    'use strict';

    try {
        console.log('Waiting for chatgpt.js to load...');
        await new Promise((resolve) => {
            const checkLoaded = () => {
                if (typeof chatgpt !== 'undefined') resolve();
                else setTimeout(checkLoaded, 50);
            };
            checkLoaded();
        });
        console.log('chatgpt.js loaded.');

        function init() {
            console.log('Initializing script...');
            createContextMenu();
            console.log('Script initialized.');
        }

        init();
        console.log('ChatGPT Custom Input Menu script loaded and running.');
    } catch (error) {
        console.error('Error in script execution:', error);
    }
})();
