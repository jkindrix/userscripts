// ==UserScript==
// @name         🛠️ ChatGPT Input Menu
// @namespace    https://github.com/jkindrix/userscripts
// @version      2.0.31
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

    const menuConfig = {
        "Behavior": {
            "Continue": "continueResponding",
            "Use Best Practices": "ensureBestPractices",
        },
        "Code": {
            "Add": {
                "File Header": "openFileHeaderModal",
                "Comments": "addComments",
                "Docstring": "addDocstring"
            },
            "Analyze": {
                "Identify Code Smells": "identifyCodeSmells"
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
                "Organize": {
                    "Alphabetically": "organizeAlphabetically",
                    "Consolidate": "consolidateContent"
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
            "Update": {
                "Copy Example": "copyExample"
            }
        },
        "Explain": {
            "Concept": "explainConcept",
            "Interaction": "explainInteraction",
            "Relationship": "explainRelationship",
            "Summarize": "summarize",
            "Walkthrough": "explainWalkthrough"
        },
        "List": {
            "Verbs (Actions)": "listVerbs",
            "Nouns (Objects)": "listNouns",
            "Adjectives (Properties)": "listAdjectives"
        },
        "Prompt Engineering": {
            "Expert Prompt Creator": "expertPromptCreator",
            "Enhance Prompt": "enhancePrompt",
            "Prompt for Prompts": "promptForPrompts"
        },
        "Roles": {
            "UX/UI Developer": "actAsUxUiDeveloper",
            "Fullstack Software Developer": "actAsFullstackSoftwareDeveloper",
            "Senior Frontend Developer": "actAsSeniorFrontendDeveloper",
            "Machine Learning Engineer": "actAsMachineLearningEngineer",
            "Software QA Tester": "actAsSoftwareQaTester",
            "Tech Writer": "actAsTechWriter",
            "StoryBot": "actAsStoryBot",
            "Teacher": "actAsTeacher"
        }
    };

    const functionMap = {
        "continueResponding": continueResponding,
        "openFileHeaderModal": openFileHeaderModal,
        "addComments": addComments,
        "addDocstring": addDocstring,
        "consolidateContent": consolidateContent,
        "createDesktopApp": createDesktopApp,
        "createMobileApp": createMobileApp,
        "createWebApp": createWebApp,
        "createClassObject": createClassObject,
        "createFunctionMethod": createFunctionMethod,
        "createScript": createScript,
        "ensureBestPractices": ensureBestPractices,
        "identifyCodeSmells": identifyCodeSmells,
        "modularizeClasses": modularizeClasses,
        "modularizeFunctions": modularizeFunctions,
        "modularizeFiles": modularizeFiles,
        "removeComments": removeComments,
        "removeRedundancy": removeRedundancy,
        "optimizePerformance": optimizePerformance,
        "optimizeReadability": optimizeReadability,
        "organizeAlphabetically": organizeAlphabetically,
        "translateToHumanLanguage": translateToHumanLanguage,
        "translateToProgrammingLanguage": translateToProgrammingLanguage,
        "explainConcept": explainConcept,
        "explainInteraction": explainInteraction,
        "explainRelationship": explainRelationship,
        "explainWalkthrough": explainWalkthrough,
        "summarize": summarize,
        "expertPromptCreator": expertPromptCreator,
        "enhancePrompt": enhancePrompt,
        "promptForPrompts": promptForPrompts,
        "listVerbs": listVerbs,
        "listNouns": listNouns,
        "listAdjectives": listAdjectives,
        "actAsUxUiDeveloper": actAsUxUiDeveloper,
        "actAsFullstackSoftwareDeveloper": actAsFullstackSoftwareDeveloper,
        "actAsSeniorFrontendDeveloper": actAsSeniorFrontendDeveloper,
        "actAsMachineLearningEngineer": actAsMachineLearningEngineer,
        "actAsSoftwareQaTester": actAsSoftwareQaTester,
        "actAsTechWriter": actAsTechWriter,
        "actAsStoryBot": actAsStoryBot,
        "actAsTeacher": actAsTeacher
    };

    const templates = {
        "What is this?": '- What is this?: "$placeholder"\n',
        "What did you mean?": '- What did you mean by this?: "$placeholder"\n',
        "Can you give some examples?": '- Can you give me some examples of this?: "$placeholder"\n'
    };

    // Define functions for each leaf node in the function map

    async function appendText(text) {
        log(`Appending text: ${text}`);
        const textarea = chatgpt.getChatBox();
        if (textarea) {
            textarea.value += text;
            textarea.focus(); // Focus the input field after appending text

            // Trigger input event to resize textarea
            const event = new Event('input', { bubbles: true });
            textarea.dispatchEvent(event);
        } else {
            log('Input field not found.');
        }
    }

    async function addComments() {
        const prompt = 'Please add comments to the code:\n\n';
        await appendText(prompt);
    }

    async function addDocstring() {
        const prompt = 'Please add a docstring to the code:\n\n';
        await appendText(prompt);
    }

    async function consolidateContent() {
        const prompt = 'Please organize, optimize, consolidate, and deduplicate the content:\n\n';
        await appendText(prompt);
    }

    async function continueResponding() {
        const prompt = 'Please continue the response.';
        await appendText(prompt);
    }

    async function createClassObject() {
        const prompt = 'Please create a class/object:\n\n';
        await appendText(prompt);
    }

    async function createDesktopApp() {
        const prompt = 'Please create a desktop application:\n\n';
        await appendText(prompt);
    }

    async function createFunctionMethod() {
        const prompt = 'Please create a function/method:\n\n';
        await appendText(prompt);
    }

    async function createMobileApp() {
        const prompt = 'Please create a mobile application:\n\n';
        await appendText(prompt);
    }

    async function createScript() {
        const prompt = 'Please create a script:\n\n';
        await appendText(prompt);
    }

    async function createWebApp() {
        const prompt = 'Please create a web application:\n\n';
        await appendText(prompt);
    }

    async function ensureBestPractices() {
        const prompt = `## Best Practices\n\nPlease ensure that your response adheres to best practices and recommendations regarding architectural principles, design patterns, and programming principles.\n\n`;
        await appendText(prompt);
    }

    async function expertPromptCreator() {
        const prompt = `I want you to become my Expert Prompt Creator. Your goal is to help me craft the best possible prompt for my needs. The prompt you provide should be written from the perspective of me making the request to ChatGPT. Consider in your prompt creation that this prompt will be entered into an interface for GPT3, GPT4, GPT4o, or ChatGPT. The prompt will include instructions to write the output using my communication style. The process is as follows:

1. You will generate the following sections:

"
**Prompt:**

>{provide the best possible prompt according to my request}
>
>
>{summarize my prior messages to you and provide them as examples of my communication style}

**Critique:**
{provide a concise paragraph on how to improve the prompt. Be very critical in your response. This section is intended to force constructive criticism even when the prompt is acceptable. Any assumptions and or issues should be included}

**Questions:**
{ask any questions pertaining to what additional information is needed from me to improve the prompt (max of 3). If the prompt needs more clarification or details in certain areas, ask questions to get more information to include in the prompt}
"

2. I will provide my answers to your response which you will then incorporate into your next response using the same format. We will continue this iterative process with me providing additional information to you and you updating the prompt until the prompt is perfected.

Remember, the prompt we are creating should be written from the perspective of Me (the user) making a request to you, ChatGPT (a GPT3/GPT4 interface). An example prompt you could create would start with "You will act as an expert physicist to help me understand the nature of the universe".

Think carefully and use your imagination to create an amazing prompt for me.

Your first response should only be a greeting and to ask what the prompt should be about.\n\n`

        await appendText(prompt)
    }

    async function enhancePrompt() {
        const prompt = `Given the user's initial prompt below, enhance it.

1. Start with clear, precise instructions placed at the beginning of the prompt.
2. Include specific details about the desired context, outcome, length, format, and style.
3. Provide examples of the desired output format, if possible.
4. Use appropriate leading words or phrases to guide the desired output, especially if code generation is involved.
5. Avoid any vague or imprecise language.
6. Rather than only stating what not to do, provide guidance on what should be done instead.

Remember to ensure the revised prompt remains true to the user's original intent.

Initial User Prompt:\n\n`
        await appendText(prompt);
    }

    async function promptForPrompts() {
        const prompt = `I want you to become my Prompt engineer. Your goal is to help me craft the best possible prompt for my needs.
The prompt will be used by you, ChatGPT. You will follow the following process:

1. Your first response will be to ask me what the prompt should be about. I will provide my answer, but we will
need to improve it through continual iterations by going through the next steps.
2. Based on my input, you will generate 2 sections, a) Revised prompt (provide your rewritten prompt, it should
be clear, concise, and easily understood by you), b) Questions (ask any relevant questions pertaining to what
additional information is needed from me to improve the prompt).
3. We will continue this iterative process with me providing additional information to you and you updating
the prompt in the Revised prompt section until I say we are done.\n\n`
        await appendText(prompt);
    }

    async function explainConcept() {
        const prompt = 'Please explain the concept:\n\n';
        await appendText(prompt);
    }

    async function explainInteraction() {
        const prompt = 'Please explain the interaction:\n\n';
        await appendText(prompt);
    }

    async function explainRelationship() {
        const prompt = 'Please explain the relationship:\n\n';
        await appendText(prompt);
    }

    async function summarize() {
        const prompt = `What is a concise, one-paragraph summary of the key concepts, context, and implications of:\n\n`
        await appendText(prompt);
    }
    async function explainWalkthrough() {
        const prompt = 'Please walk me through this:\n\n';
        await appendText(prompt);
    }

    async function identifyCodeSmells() {
        const prompt = 'Please identify code smells:\n\n';
        await appendText(prompt);
    }

    async function listAdjectives() {
        const prompt = 'Please generate a list of adjectives (properties):\n\n';
        await appendText(prompt);
    }

    async function listNouns() {
        const prompt = 'Please generate a list of nouns (objects):\n\n';
        await appendText(prompt);
    }

    async function listVerbs() {
        const prompt = 'Please generate a list of verbs (actions):\n\n';
        await appendText(prompt);
    }

    async function modularizeClasses() {
        const prompt = 'Please modularize the classes:\n\n';
        await appendText(prompt);
    }

    async function modularizeFiles() {
        const prompt = 'Please modularize the files:\n\n';
        await appendText(prompt);
    }

    async function modularizeFunctions() {
        const prompt = 'Please modularize the functions:\n\n';
        await appendText(prompt);
    }

    async function optimizePerformance() {
        const prompt = 'Please optimize the performance:\n\n';
        await appendText(prompt);
    }

    async function optimizeReadability() {
        const prompt = 'Please optimize the readability:\n\n';
        await appendText(prompt);
    }

    async function organizeAlphabetically() {
        const prompt = 'Please organize the following alphabetically:\n\n';
        await appendText(prompt);
    }


    async function removeComments() {
        const prompt = 'Please remove comments from the code:\n\n';
        await appendText(prompt);
    }

    async function removeRedundancy() {
        const prompt = 'Please remove redundancy from the content:\n\n';
        await appendText(prompt);
    }

    async function translateToHumanLanguage() {
        const prompt = 'Please translate the content to human-readable language:\n\n';
        await appendText(prompt);
    }

    async function translateToProgrammingLanguage() {
        const prompt = 'Please translate the content to the specified programming language:\n\n';
        await appendText(prompt);
    }

    async function actAsUxUiDeveloper() {
        const prompt = `I want you to act as a UX/UI developer. I will provide some details about the design of an app, website or other digital product, and it will be your job to come up with creative ways to improve its user experience. This could involve creating prototyping prototypes, testing different designs and providing feedback on what works best. My first request is "I need help designing an intuitive navigation system for my new mobile application."\n\n`;
        await appendText(prompt);
    }

    async function actAsFullstackSoftwareDeveloper() {
        const prompt = `I want you to act as a software developer. I will provide some specific information about a web app requirements, and it will be your job to come up with an architecture and code for developing secure app with Golang and Angular. My first request is 'I want a system that allow users to register and save their vehicle information according to their roles and there will be admin, user and company roles. I want the system to use JWT for security'.\n\n`;
        await appendText(prompt);
    }

    async function actAsSeniorFrontendDeveloper() {
        const prompt = `I want you to act as a Senior Frontend developer. I will describe a project details you will code project with this tools: Create React App, yarn, Ant Design, List, Redux Toolkit, createSlice, thunk, axios. You should merge files in single index.js file and nothing else. Do not write explanations. My first request is "Create Pokemon App that lists pokemons with images that come from PokeAPI sprites endpoint".\n\n`;
        await appendText(prompt);
    }

    async function actAsMachineLearningEngineer() {
        const prompt = `I want you to act as a machine learning engineer. I will write some machine learning concepts and it will be your job to explain them in easy-to-understand terms. This could contain providing step-by-step instructions for building a model, demonstrating various techniques with visuals, or suggesting online resources for further study. My first suggestion request is "I have a dataset without labels. Which machine learning algorithm should I use?"\n\n`;
        await appendText(prompt);
    }

    async function actAsSoftwareQaTester() {
        const prompt = `I want you to act as a software quality assurance tester for a new software application. Your job is to test the functionality and performance of the software to ensure it meets the required standards. You will need to write detailed reports on any issues or bugs you encounter, and provide recommendations for improvement. Do not include any personal opinions or subjective evaluations in your reports. Your first task is to test the login functionality of the software.\n\n`;
        await appendText(prompt);
    }

    async function actAsTechWriter() {
        const prompt = `Act as a tech writer. You will act as a creative and engaging technical writer and create guides on how to do different stuff on specific software. I will provide you with basic steps of an app functionality and you will come up with an engaging article on how to do those basic steps. You can ask for screenshots, just add (screenshot) to where you think there should be one and I will add those later. These are the first basic steps of the app functionality: "1.Click on the download button depending on your platform 2.Install the file. 3.Double click to open the app".\n\n`;
        await appendText(prompt);
    }

    async function actAsStoryBot() {
        const prompt = `Act as StoryBot. Storybot explains everything in form of a story, even the most complex topics.\n\n`;
        await appendText(prompt);
    }

    async function actAsTeacher() {
        const prompt = `You are an elite ______. And I am your student whom you must pass on your knowledge and expertise. In a series of sessions, you have to fulfil this duty and see that I have mastered ________ by giving me tests that I would encounter in the real world.\n\n`;
        await appendText(prompt);
    }

    function createQuestionFromTemplate(copiedText, templateName) {
        const template = templates[templateName];
        if (!template) {
            throw new Error("Template not found");
        }
        return template.replace('$placeholder', copiedText);
    }

    function createContextMenu() {
        log('Creating context menu...');
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

        log('Building menu...');
        buildMenu(menu, menuConfig, 1000); // Pass the starting z-index
        log('Menu built.');

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

                    log('Viewport dimensions:', { viewportWidth, viewportHeight });
                    log('Initial menu position:', { top, left });

                    // Adjust position if menu overflows off the page
                    if (top + menuHeight > viewportHeight - 10) {
                        top = viewportHeight - menuHeight - 10;
                        log('Adjusted top for overflow:', top);
                    }
                    if (left + menuWidth > viewportWidth) {
                        left = viewportWidth - menuWidth;
                        log('Adjusted left for overflow:', left);
                    }

                    // Ensure the menu does not go off the top, bottom, left, or right edge
                    top = Math.max(0, Math.min(top, viewportHeight - menuHeight));
                    left = Math.max(0, Math.min(left, viewportWidth - menuWidth));

                    // Apply the position to the menu
                    menu.style.top = `${top}px`;
                    menu.style.left = `${left}px`;
                    menu.style.display = 'block';

                    log('Final menu position:', { top, left });

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

                        log('Initial submenu position:', { subTop, subLeft });

                        // Adjust position if submenu overflows off the page
                        if (subTop + subHeight > viewportHeight) {
                            subTop = viewportHeight - subHeight - 10;
                            log('Adjusted subTop for overflow:', subTop);
                        }
                        if (subLeft + subWidth > viewportWidth) {
                            subLeft = parent.getBoundingClientRect().left - subWidth;
                            log('Adjusted subLeft for overflow:', subLeft);
                        }

                        // Ensure the submenu does not go off the top, bottom, left, or right edge
                        subTop = Math.max(0, Math.min(subTop, viewportHeight - subHeight));
                        subLeft = Math.max(0, Math.min(subLeft, viewportWidth - subWidth));

                        // Apply the position to the submenu
                        submenu.style.top = `${subTop}px`;
                        submenu.style.left = `${subLeft}px`;
                        submenu.style.display = 'none';

                        log('Final submenu position:', { subTop, subLeft });
                    });
                });
            } else {
                log('Input field not found.');
            }
        }

        function attachSecondaryContextMenu() {
            document.addEventListener('contextmenu', (event) => {
                if (!event.ctrlKey) {
                    return;
                }

                const selectedText = window.getSelection().toString().trim();
                if (selectedText.length === 0) {
                    return;
                }

                event.preventDefault();

                // Remove existing custom context menu if present
                const existingMenu = document.querySelector('.custom-context-menu');
                if (existingMenu) {
                    existingMenu.remove();
                }

                // Create the custom context menu
                const menu = document.createElement('ul');
                menu.className = 'custom-context-menu';
                menu.style.position = 'absolute';
                menu.style.top = `${event.pageY}px`;
                menu.style.left = `${event.pageX}px`;
                menu.style.backgroundColor = '#171717';
                menu.style.border = '1px solid #ccc';
                menu.style.listStyle = 'none';
                menu.style.padding = '10px';
                menu.style.zIndex = '10000';

                Object.keys(templates).forEach((menuItem) => {
                    const menuItemElement = document.createElement('li');
                    menuItemElement.textContent = menuItem;
                    menuItemElement.style.padding = '5px';
                    menuItemElement.style.cursor = 'pointer';
                    menuItemElement.style.backgroundColor = '#171717';
                    menuItemElement.style.boxShadow = 'none';

                    menuItemElement.addEventListener('mouseenter', () => {
                        menuItemElement.style.backgroundColor = '#333333'; // Slightly lighter background on hover
                        menuItemElement.style.boxShadow = '0px 0px 5px rgba(0,0,0,0.3)'; // Add shadow on hover
                    });

                    menuItemElement.addEventListener('mouseleave', () => {
                        menuItemElement.style.backgroundColor = '#171717';
                        menuItemElement.style.boxShadow = 'none'; // Remove shadow on leave
                    });

                    menuItemElement.addEventListener('click', async () => {
                        await navigator.clipboard.writeText(selectedText);
                        const question = createQuestionFromTemplate(selectedText, menuItem);
                        appendText(question);
                        menu.remove();
                    });
                    menu.appendChild(menuItemElement);
                });

                document.body.appendChild(menu);

                // Remove the menu if clicked outside
                document.addEventListener('click', () => {
                    menu.remove();
                }, { once: true });
            });
        }

        attachContextMenu();
        attachSecondaryContextMenu();

        // Re-attach the context menu when navigating between chats
        const observer = new MutationObserver(() => {
            attachContextMenu();
            attachSecondaryContextMenu();
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

                // Prevent click event on menu from closing it
                submenu.addEventListener('click', (event) => {
                    event.stopPropagation();
                });

                submenu.addEventListener('mouseenter', () => {
                    log('Entering submenu for:', key);

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

                        log('Initial submenu position:', { subTop, subLeft });

                        // Adjust position if submenu overflows off the page
                        if (subTop + subHeight > viewportHeight) {
                            subTop = viewportHeight - subHeight - 10;
                            log('Adjusted subTop for overflow:', subTop);
                        }
                        if (subLeft + subWidth > viewportWidth) {
                            subLeft = submenu.getBoundingClientRect().left - subWidth;
                            log('Adjusted subLeft for overflow:', subLeft);
                        }

                        // Ensure the submenu does not go off the top, bottom, left, or right edge
                        subTop = Math.max(0, Math.min(subTop, viewportHeight - subHeight));
                        subLeft = Math.max(0, Math.min(subLeft, viewportWidth - subWidth));

                        // Apply the position to the submenu
                        subcontainer.style.top = `${subTop}px`;
                        subcontainer.style.left = `${subLeft}px`;
                        subcontainer.style.display = 'block';

                        log('Final submenu position:', { subTop, subLeft });
                    } else {
                        const subcontainer = submenu.querySelector('ul');
                        subcontainer.style.display = 'block';
                    }
                });

                submenu.addEventListener('mouseleave', () => {
                    log('Leaving submenu for:', key);
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

                item.addEventListener('click', (event) => {
                    log(`Executing action for ${key}`);

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

                    // Close the menu after clicking a leaf node
                    document.querySelector('#customContextMenu').style.display = 'none';
                });
                container.appendChild(item);
            }
        }
    }

    function openFileHeaderModal() {
        log('Opening file header modal...');
        const modal = document.createElement('div');
        modal.id = 'fileHeaderModal';
        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.backgroundColor = '#1e1e1e';
        modal.style.border = '1px solid #444';
        modal.style.borderRadius = '8px';
        modal.style.padding = '30px';
        modal.style.zIndex = '1001';
        modal.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        modal.style.width = '300px';
        modal.style.boxSizing = 'border-box';
        modal.style.color = '#fff';
        modal.innerHTML = `
<h2 style="margin-top: 0; margin-bottom: 20px; font-size: 1.5em;">Add File Header</h2>
<form id="fileHeaderForm" style="display: flex; flex-direction: column;">
    <label for="title" style="margin-bottom: 10px;">
        <input type="checkbox" name="Title" id="title" style="margin-right: 10px;" checked> Title
    </label>
    <label for="author" style="margin-bottom: 10px;">
        <input type="checkbox" name="Author" id="author" style="margin-right: 10px;" checked> Author
    </label>
    <label for="date" style="margin-bottom: 10px;">
        <input type="checkbox" name="Date" id="date" style="margin-right: 10px;" checked> Date
    </label>
    <label for="description" style="margin-bottom: 30px;">
        <input type="checkbox" name="Description" id="description" style="margin-right: 10px;" checked> Description
    </label>
    <div style="display: flex; justify-content: space-between;">
        <button type="button" id="submitFileHeader" style="padding: 10px 20px; background-color: #3e9352; border: none; border-radius: 4px; color: #fff; cursor: pointer;">Submit</button>
        <button type="button" id="cancelFileHeader" style="padding: 10px 20px; background-color: #dc3848; border: none; border-radius: 4px; color: #fff; cursor: pointer;">Cancel</button>
    </div>
</form>
`;
        document.body.appendChild(modal);

        // Adding hover effect using JavaScript
        const submitButton = document.getElementById('submitFileHeader');
        const cancelButton = document.getElementById('cancelFileHeader');

        submitButton.addEventListener('mouseover', () => {
            submitButton.style.backgroundColor = '#155624';
        });
        submitButton.addEventListener('mouseout', () => {
            submitButton.style.backgroundColor = '#3e9352';
        });

        cancelButton.addEventListener('mouseover', () => {
            cancelButton.style.backgroundColor = '#931a26';
        });
        cancelButton.addEventListener('mouseout', () => {
            cancelButton.style.backgroundColor = '#dc3848';
        });

        document.getElementById('cancelFileHeader').addEventListener('click', () => {
            log('File header modal canceled.');
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
            log('File header modal submitted.');
            modal.remove();
        });
    }

    // Initialize the script
    function init() {
        log('Initializing script...');
        createContextMenu();
        log('Script initialized.');
    }

    // Run the initialization
    init();

    // Log when the script has loaded
    log('ChatGPT Custom Input Menu script loaded and running.');
})();
