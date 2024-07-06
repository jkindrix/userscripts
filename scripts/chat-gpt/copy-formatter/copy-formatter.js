// ==UserScript==
// @name         📋 ChatGPT Copy Formatter
// @namespace    https://github.com/jkindrix/tampermonkey-scripts
// @version      1.0.0
// @description  Format ChatGPT response messages in the clipboard when copied using Prettier
// @author       Justin Kindrix
// @match        *://chat.openai.com/*
// @match        *://chatgpt.com/c/*
// @grant        none
// @run-at       document-end
// @require      https://unpkg.com/prettier@2.7.1/standalone.js
// @require      https://unpkg.com/prettier@2.7.1/parser-markdown.js
// @updateURL    https://raw.githubusercontent.com/jkindrix/tampermonkey-scripts/main/scripts/chat-gpt/copy-formatter/copy-formatter.js
// @downloadURL  https://raw.githubusercontent.com/jkindrix/tampermonkey-scripts/main/scripts/chat-gpt/copy-formatter/copy-formatter.js
// ==/UserScript==

(function () {
    'use strict';

    const processedButtons = new Set();

    // Function to format the text using Prettier
    function formatText(text) {
        // Use Prettier to format the text
        let formattedText = prettier.format(text, {
            parser: "markdown",
            plugins: prettierPlugins,
            tabWidth: 4, // Set tab width to 4 spaces
            proseWrap: "never" // Disable wrapping
        });

        // Custom post-processing for nested lists and spacing
        formattedText = formattedText
            .replace(/^(\s*\d+\.\s+.+?)(?=\n\s*\d+\.|\n*$)/gms, (match) => {
                return match.replace(/\n(?!\s*[-+*])/g, '\n\n'); // Add a newline before nested lists
            })
            .replace(/^( {0,3})([-+*] .+)/gm, (match, p1, p2) => {
                return `${' '.repeat(4)}${p2}`; // Ensure nested lists have 4 spaces
            })
            .replace(/(\d+\.\s+.+)\n( {4}[-+*])/g, '$1\n\n$2'); // Ensure blank line between numbered list items and nested bullet list items

        return formattedText;
    }

    // Function to read from the clipboard
    function readFromClipboard() {
        return navigator.clipboard.readText();
    }

    // Function to write to the clipboard
    function writeToClipboard(text) {
        navigator.clipboard.writeText(text).then(function () {
            console.log('Clipboard successfully set');
        }, function () {
            console.error('Failed to set clipboard content');
        });
    }

    // Function to handle the copy button click
    function handleCopyButtonClick(event) {
        console.log('Button clicked:', event.target);

        // Delay to allow the page's JavaScript to complete its clipboard operation
        setTimeout(() => {
            readFromClipboard().then(function (text) {
                console.log('Original clipboard text:', text); // Log the original clipboard text
                const formattedText = formatText(text);
                console.log('Formatted clipboard text:', formattedText); // Log the formatted clipboard text
                writeToClipboard(formattedText);
            }).catch(function (err) {
                console.error('Failed to read from clipboard:', err);
            });
        }, 100); // Adjust the delay if necessary
    }

    // Function to add event listeners to all matching buttons
    function addEventListenersToButtons() {
        const buttons = document.querySelectorAll("div[data-testid^='conversation-turn-'] .items-center span:nth-of-type(2) button.rounded-lg");
        let newButtonsFound = false;

        buttons.forEach(button => {
            if (!processedButtons.has(button)) {
                button.addEventListener('click', handleCopyButtonClick);
                processedButtons.add(button);
                newButtonsFound = true;
            }
        });

        if (newButtonsFound) {
            console.log('Found new buttons:', buttons);
        }
    }

    // Debounce function to limit the rate of addEventListenersToButtons calls
    function debounce(fn, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    // Debounced version of addEventListenersToButtons
    const debouncedAddEventListenersToButtons = debounce(addEventListenersToButtons, 300);

    // Initial attachment of event listeners
    addEventListenersToButtons();

    // Monitor for changes in the DOM and add event listeners to new buttons
    const observer = new MutationObserver(mutations => {
        let added = false;
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length || mutation.removedNodes.length) {
                added = true;
            }
        });
        if (added) {
            debouncedAddEventListenersToButtons();
        }
    });

    // Start observing the document for changes
    observer.observe(document.body, { childList: true, subtree: true });

    // Log when the script has loaded
    console.log('ChatGPT Copy Formatter script loaded and running.');

})();