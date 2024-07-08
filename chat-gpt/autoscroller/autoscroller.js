// ==UserScript==
// @name         🔄 ChatGPT Autoscroller
// @namespace    https://github.com/jkindrix/userscripts
// @version      2.0.3
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
    const enableLogging = false; // Set to true to enable logging, false to disable

    let domObserver;
    let buttonObserver;
    let isScriptEnabled = false; // Initially enable the script

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

    async function insertToggle() {
        log("Creating NAV TOGGLE div");
        const navToggleDiv = getOrCreateElementById('autoscroll-toggle-div', 'div', {
            height: '37px',
            margin: '2px 0',
            userSelect: 'none',
            cursor: 'pointer',
            display: 'flex',
            flexGrow: 'unset',
            paddingLeft: '8px'
        });
        navToggleDiv.className = 'group flex h-10 items-center gap-2 rounded-lg bg-token-sidebar-surface-primary px-2 font-semibold juice:gap-2.5 juice:font-normal hover:bg-token-sidebar-surface-secondary grow overflow-hidden text-ellipsis whitespace-nowrap text-sm text-token-text-primary';

        log("Inserting toggle into the sidebar");
        const parentToInsertInto = getParentToInsertInto();
        if (parentToInsertInto) {
            insertNavToggleDiv(parentToInsertInto, navToggleDiv);
        } else {
            log("Parent nav element not found");
        }

        tweakStyles(navToggleDiv, parentToInsertInto);
        addToggleListener(navToggleDiv);

        updateToggleHTML();
    }


    function getParentToInsertInto() {
        return document.querySelector('nav ' + (isGPT4oUI ? '' : '> div:not(.invisible)'));
    }

    function insertNavToggleDiv(parent, navToggleDiv) {
        if (!parent.contains(navToggleDiv)) {
            parent.insertBefore(navToggleDiv, parent.children[1]);
            log("NAV TOGGLE div inserted");
        } else {
            log("NAV TOGGLE div already present");
        }
    }

    function tweakStyles(navToggleDiv, parentToInsertInto) {
        if (isGPT4oUI) navToggleDiv.style.flexGrow = 'unset';
        if (!firstLink && parentToInsertInto && parentToInsertInto.children[0]) {
            parentToInsertInto.children[0].style.marginBottom = '5px';
        }
    }

    function addToggleListener(navToggleDiv) {
        navToggleDiv.onclick = () => {
            log("Toggle clicked");
            const toggleInput = getOrCreateElementById('autoscroll-toggle-input', 'input')
            if (toggleInput) {
                toggleInput.checked = !toggleInput.checked;
                isScriptEnabled = toggleInput.checked;
                updateToggleHTML();
                handleScriptToggle(toggleInput.checked);
                setTimeout(() => {
                    updateToggleStyles(toggleInput.checked);
                }, 1);
            } else {
                log("Toggle input not found");
            }
        };
    }

    function handleScriptToggle(isEnabled) {
        if (isEnabled) {
            observeButton();
            log("Script enabled manually");
        } else {
            stopDomObserver();
            log("Script disabled manually");
        }
    }

    function updateToggleStyles(isChecked) {
        const switchSpan = document.getElementById('autoscroll-switch-span');
        const knobSpan = document.getElementById('autoscroll-toggle-knob-span');
        const knobWidth = 13;

        switchSpan.style.backgroundColor = isChecked ? '#ad68ff' : '#ccc';
        switchSpan.style.boxShadow = isChecked ? '2px 1px 9px #d8a9ff' : 'none';
        knobSpan.style.transform = isChecked ? `translateX(${knobWidth}px) translateY(0)` : 'translateX(0)';
    }


    function updateToggleHTML() {
        log("Updating toggle HTML content");

        const toggleInput = getOrCreateElementById('autoscroll-toggle-input', 'input', {
            type: 'checkbox',
            display: 'none',
            disabled: true,
            checked: isScriptEnabled
        });

        const switchSpan = getOrCreateElementById('autoscroll-switch-span', 'span', {
            position: 'relative',
            left: '147px',
            backgroundColor: '#ccc',
            bottom: '0em',
            width: '30px',
            height: '15px',
            transition: 'all 0.4s ease',
            borderRadius: '28px',
            boxShadow: 'none'
        });

        const knobSpan = getOrCreateElementById('autoscroll-toggle-knob-span', 'span', {
            position: 'absolute',
            left: '3px',
            bottom: '0.055em',
            width: '13px',
            height: '13px',
            content: '',
            borderRadius: '28px',
            backgroundColor: 'white',
            transition: 'all 0.4s ease',
            transform: 'translateX(0px)'
        });

        switchSpan.appendChild(knobSpan);

        const toggleLabel = getOrCreateElementById('autoscroll-toggle-label', 'label', {
            marginLeft: '-41px',
            cursor: 'pointer',
            width: '145px',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
        });

        toggleLabel.textContent = `Auto-Scroll ${toggleInput.checked ? 'enabled' : 'disabled'}`;

        const navicon = getOrCreateElementById('autoscroll-toggle-navicon', 'img', {
            width: '1.25rem',
            height: '1.25rem',
            marginLeft: '2px',
            marginRight: '4px'
        });
        navicon.src = `https://github.com/jkindrix/userscripts/blob/main/icons/autoscroll-down-arrow.png?raw=true`;

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

    function getOrCreateElementById(id, tagName, styles) {
        let element = document.getElementById(id);
        if (!element) {
            element = document.createElement(tagName);
            element.id = id;
        }
        if (styles) {
            applyStyles(element, styles);
        }
        return element;
    }

    function applyStyles(element, styles) {
        for (const [key, value] of Object.entries(styles)) {
            element.style[key] = value;
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
