// ==UserScript==
// @name         🔄 ChatGPT Autoscroller
// @namespace    https://github.com/jkindrix/userscripts
// @version      2.0.2
// @description  Continuously monitor and click an element in ChatGPT when it appears on the page with chatgpt.js integration
// @author       Justin Kindrix
// @match        *://chat.openai.com/*
// @match        *://chatgpt.com/*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/@kudoai/chatgpt.js@2.9.3/dist/chatgpt.min.js
// @updateURL    https://raw.githubusercontent.com/jkindrix/userscripts/main/chat-gpt/autoscroller/autoscroller.js
// @downloadURL  https://raw.githubusercontent.com/jkindrix/userscripts/main/chat-gpt/autoscroller/autoscroller.js
// ==/UserScript==

(async function () {
    'use strict';

    // Wait for chatgpt.js to be ready
    await chatgpt.isLoaded();

    // Configuration
    const enableLogging = true; // Set to true to enable logging, false to disable

    let domObserver;
    let buttonObserver;
    let isScriptEnabled = true; // Initially enable the script

    const isGPT4oUI = document.documentElement.className.includes(' ');
    const firstLink = chatgpt.getNewChatLink();

    // Function for logging
    function log(message) {
        if (enableLogging) {
            console.log(message);
        }
    }

    // Function to click the element if it exists
    function clickElement() {
        const element = chatgpt.getScrollToBottomButton();
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
        const button = chatgpt.getScrollToBottomButton();
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
        const targetButton = chatgpt.getScrollToBottomButton();
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
        updateToggleHTML();
    }

    // Function to create a toggle button in the sidebar
    async function insertToggle() {
        log("Creating NAV TOGGLE div");
        const navToggleDiv = document.createElement('div');
        navToggleDiv.id = 'autoscroll-toggle-div';
        navToggleDiv.className = 'group flex h-10 items-center gap-2 rounded-lg bg-token-sidebar-surface-primary px-2 font-semibold juice:gap-2.5 juice:font-normal hover:bg-token-sidebar-surface-secondary grow overflow-hidden text-ellipsis whitespace-nowrap text-sm text-token-text-primary';
        navToggleDiv.style.height = '37px';
        navToggleDiv.style.margin = '2px 0'; // add v-margins
        navToggleDiv.style.userSelect = 'none'; // prevent highlighting
        navToggleDiv.style.cursor = 'pointer'; // add finger cursor
        navToggleDiv.style.display = 'flex';
        navToggleDiv.style.flexGrow = 'unset';
        navToggleDiv.style.paddingLeft = '8px';

        log("Inserting toggle into the sidebar");
        const parentToInsertInto = document.querySelector('nav ' +
            (isGPT4oUI ? '' : '> div:not(.invisible)')); // upper nav div
        if (parentToInsertInto) {
            if (!parentToInsertInto.contains(navToggleDiv)) {
                parentToInsertInto.insertBefore(navToggleDiv, parentToInsertInto.children[1]);
                log("NAV TOGGLE div inserted");
            } else {
                log("NAV TOGGLE div already present");
            }
        } else {
            log("Parent nav element not found");
        }

        // Tweak styles
        if (isGPT4oUI) navToggleDiv.style.flexGrow = 'unset'; // overcome OpenAI .grow
        if (!firstLink && parentToInsertInto && parentToInsertInto.children[0]) {
            parentToInsertInto.children[0].style.marginBottom = '5px';
        }

        // Add LISTENER to toggle switch/label/config/menu/auto-refresh
        navToggleDiv.onclick = () => {
            log("Toggle clicked");
            const toggleInput = document.getElementById('autoscroll-toggle-input');
            if (toggleInput) {
                toggleInput.checked = !toggleInput.checked;
                isScriptEnabled = toggleInput.checked;
                updateToggleHTML();
                if (isScriptEnabled) {
                    observeButton();
                    log("Script enabled manually");
                } else {
                    stopDomObserver();
                    log("Script disabled manually");
                }
            } else {
                log("Toggle input not found");
            }
        };

        // Now call updateToggleHTML after the toggle div is added to the DOM
        updateToggleHTML();
    }

    function updateToggleHTML() {
        log("Updating toggle HTML content");
        const toggleInput = document.getElementById('autoscroll-toggle-input') || document.createElement('input');
        toggleInput.id = 'autoscroll-toggle-input';
        toggleInput.type = 'checkbox';
        toggleInput.style.display = 'none';
        toggleInput.disabled = true;
        toggleInput.checked = isScriptEnabled;

        const switchSpan = document.getElementById('autoscroll-switch-span') || document.createElement('span');
        switchSpan.id = 'autoscroll-switch-span';
        switchSpan.style.position = 'relative';
        switchSpan.style.left = '147px';
        switchSpan.style.backgroundColor = '#ccc';
        switchSpan.style.bottom = '0em';
        switchSpan.style.width = '30px';
        switchSpan.style.height = '15px';
        switchSpan.style.transition = 'all 0.4s ease';
        switchSpan.style.borderRadius = '28px';
        switchSpan.style.boxShadow = 'none';

        const knobSpan = document.getElementById('autoscroll-toggle-knob-span') || document.createElement('span');
        knobSpan.id = 'autoscroll-toggle-knob-span';
        knobSpan.style.position = 'absolute';
        knobSpan.style.left = '3px';
        knobSpan.style.bottom = '0.055em';
        knobSpan.style.width = '13px';
        knobSpan.style.height = '13px';
        knobSpan.style.content = '';
        knobSpan.style.borderRadius = '28px';
        knobSpan.style.backgroundColor = 'white';
        knobSpan.style.transition = 'all 0.4s ease';
        knobSpan.style.transform = 'translateX(0px)';

        switchSpan.appendChild(knobSpan);

        const toggleLabel = document.getElementById('autoscroll-toggle-label') || document.createElement('label');
        toggleLabel.id = 'autoscroll-toggle-label';
        toggleLabel.style.marginLeft = '-41px';
        toggleLabel.style.cursor = 'pointer';
        toggleLabel.style.width = '145px';
        toggleLabel.style.overflow = 'hidden';
        toggleLabel.style.textOverflow = 'ellipsis';

        toggleLabel.textContent = `Autoscroll Mode ${toggleInput.checked ? 'enabled' : 'disabled'}`;

        const navicon = document.getElementById('autoscroll-toggle-navicon') || document.createElement('img');
        navicon.id = 'autoscroll-toggle-navicon';
        navicon.src = `https://github.com/jkindrix/userscripts/blob/main/icons/autoscroll-down-arrow.png?raw=true`;
        navicon.style.width = '1.25rem';
        navicon.style.height = '1.25rem';
        navicon.style.marginLeft = '2px';
        navicon.style.marginRight = '4px';

        const navToggleDiv = document.getElementById('autoscroll-toggle-div');
        if (navToggleDiv) {
            navToggleDiv.innerHTML = ''; // Clear existing content
            navToggleDiv.appendChild(navicon);
            navToggleDiv.appendChild(toggleInput);
            navToggleDiv.appendChild(switchSpan);
            navToggleDiv.appendChild(toggleLabel);
            log("Toggle HTML content updated");
        } else {
            log("NAV TOGGLE div not found for updating HTML content");
        }
    }

    // Function to start the whole process
    function init() {
        log("Initializing script");
        observeButton();
        insertToggle();

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
