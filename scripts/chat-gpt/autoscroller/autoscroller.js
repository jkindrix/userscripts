// ==UserScript==
// @name         🔄 ChatGPT Autoscroller
// @namespace    https://github.com/jkindrix/tampermonkey-scripts
// @version      1.0.0
// @description  Continuously monitor and click an element in ChatGPT when it appears on the page
// @author       Justin Kindrix
// @match        *://chat.openai.com/*
// @match        *://chatgpt.com/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/jkindrix/tampermonkey-scripts/main/scripts/chat-gpt/autoscroller/autoscroller.js
// @downloadURL  https://raw.githubusercontent.com/jkindrix/tampermonkey-scripts/main/scripts/chat-gpt/autoscroller/autoscroller.js
// ==/UserScript==

(function () {
    'use strict';

    // Configuration
    const enableLogging = false; // Set to true to enable logging, false to disable

    // CSS selectors
    const BUTTON_SELECTOR = "button[data-testid='fruitjuice-send-button']";
    const ELEMENT_SELECTOR = "button.bg-token-main-surface-primary";

    let domObserver;
    let buttonObserver;
    let isScriptEnabled = true; // Initially enable the script

    // Function for logging
    function log(message) {
        if (enableLogging) {
            console.log(message);
        }
    }

    // Function to click the element if it exists
    function clickElement() {
        const element = document.querySelector(ELEMENT_SELECTOR);
        if (element) {
            element.click();
            log("Element clicked");
        } else {
            log("Element not found");
        }
    }

    // Function to start observing the DOM for changes
    function startDomObserver() {
        if (!domObserver) {
            domObserver = new MutationObserver(clickElement);

            domObserver.observe(document.body, {
                childList: true,
                subtree: true
            });

            // Initial check in case the element is already present
            clickElement();
            log("DOM Observer started");
        }
    }

    // Function to stop observing the DOM for changes
    function stopDomObserver() {
        if (domObserver) {
            domObserver.disconnect();
            domObserver = null;
            log("DOM Observer stopped");
        }
    }

    // Function to monitor the button's state
    function monitorButton() {
        const button = document.querySelector(BUTTON_SELECTOR);
        if (button) {
            log("Button found, disabled:", button.disabled);
            if (!button.disabled && isScriptEnabled) {
                startDomObserver();
            } else {
                stopDomObserver();
            }
        } else {
            log("Button not found in monitorButton");
        }
    }

    // Function to handle mutations
    function handleMutations(mutations) {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes') {
                log("Attribute mutation detected");
                monitorButton();
            }
        });
    }

    // Use MutationObserver to watch for changes in the button's state
    function observeButton() {
        const targetButton = document.querySelector(BUTTON_SELECTOR);
        if (targetButton) {
            log("Target button found, setting up observer");
            buttonObserver = new MutationObserver(handleMutations);
            buttonObserver.observe(targetButton, {
                attributes: true // Watch for attribute changes (e.g., disabled)
            });

            // Initial check in case the button is already enabled
            monitorButton();
        } else {
            log("Target button not found in observeButton");
        }
    }

    // Function to toggle the script's state
    function toggleScript() {
        isScriptEnabled = !isScriptEnabled;
        if (isScriptEnabled) {
            log("Script enabled manually");
            observeButton();
        } else {
            log("Script disabled manually");
            stopDomObserver();
        }
    }

    // Function to create a toggle button
    function createToggleButton() {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.bottom = '32px';
        container.style.right = '60px';
        container.style.zIndex = '1000';

        const toggleButton = document.createElement('button');
        toggleButton.textContent = 'Toggle Autoscroller';
        toggleButton.style.padding = '8px';
        toggleButton.style.cursor = 'pointer';
        toggleButton.style.backgroundColor = isScriptEnabled ? '#4CAF50' : '#f44336'; // Green when enabled, red when disabled
        toggleButton.style.color = 'white';
        toggleButton.style.border = 'none';
        toggleButton.style.borderRadius = '4px';
        toggleButton.style.outline = 'none';
        toggleButton.style.transition = 'background-color 0.3s ease';

        toggleButton.addEventListener('click', () => {
            toggleScript();
            toggleButton.style.backgroundColor = isScriptEnabled ? '#4CAF50' : '#f44336'; // Update color on click
        });

        container.appendChild(toggleButton);
        document.body.appendChild(container);
    }

    // Function to start the whole process
    function init() {
        log("Initializing script");
        observeButton();
        createToggleButton();

        // Fallback to ensure the button state is checked periodically
        setInterval(() => {
            log("Periodic button state check");
            monitorButton();
        }, 2000); // Check every 2 seconds
    }

    // Start observing the button
    init();

    console.log('ChatGPT Autoscroller script loaded and running.');
})();