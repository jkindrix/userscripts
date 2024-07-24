// ==UserScript==
// @name         🛠️ ChatGPT Input Menu
// @namespace    https://github.com/jkindrix/userscripts
// @version      2.0.43
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
    Behavior: {
      Continue: 'continueResponding',
      'Use Best Practices': 'ensureBestPractices',
      'Toggle Formal': 'toggleFormal',
      'Toggle Concise': 'toggleConcise',
    },
    Code: {
      Add: {
        'File Header': 'openFileHeaderModal',
        Comments: 'addComments',
        Docstring: 'addDocstring',
        'Test Cases': 'addTestCases',
      },
      Analyze: {
        'Identify Code Smells': 'identifyCodeSmells',
        'Security Vulnerabilities': 'analyzeSecurityVulnerabilities',
      },
      Behavior: {
        'Be Succinct': 'beSuccinct'
      },
      Create: {
        Application: {
          Desktop: 'createDesktopApp',
          Mobile: 'createMobileApp',
          Web: 'createWebApp',
        },
        'Class/Object': 'createClassObject',
        'Function/Method': 'createFunctionMethod',
        Script: 'createScript',
        'Unit Test': 'createUnitTest',
        'Integration Test': 'createIntegrationTest',
      },
      Refactor: {
        Modularize: {
          Classes: 'modularizeClasses',
          Functions: 'modularizeFunctions',
          Files: 'modularizeFiles',
        },
        Organize: {
          Alphabetically: 'organizeAlphabetically',
          Consolidate: 'consolidateContent',
        },
        Remove: {
          Comments: 'removeComments',
          Redundancy: 'removeRedundancy',
        },
        Optimize: {
          Performance: 'optimizePerformance',
          Readability: 'optimizeReadability',
        },
        Translate: {
          Language: {
            Human: 'translateToHumanLanguage',
            Programming: 'translateToProgrammingLanguage',
          },
        },
      },
      Update: {
        'Copy Example': 'copyExample',
        'Version Control': {
          Commit: 'versionControlCommit',
          Branch: 'versionControlBranch',
          Merge: 'versionControlMerge',
        },
      },
      Debug: {
        'Find Bugs': 'findBugs',
        'Fix Bugs': 'fixBugs',
        'Log Output': 'logOutput',
      },
    },
    Explain: {
      Concept: 'explainConcept',
      Interaction: 'explainInteraction',
      Relationship: 'explainRelationship',
      Summarize: 'summarize',
      Walkthrough: 'explainWalkthrough',
      'Beginner Level': 'explainBeginnerLevel',
      'Intermediate Level': 'explainIntermediateLevel',
      'Advanced Level': 'explainAdvancedLevel',
    },
    List: {
      'Verbs (Actions)': 'listVerbs',
      'Nouns (Objects)': 'listNouns',
      'Adjectives (Properties)': 'listAdjectives',
      'Libraries/Frameworks': 'listLibrariesFrameworks',
      'Design Patterns': 'listDesignPatterns',
    },
    'Prompt Engineering': {
      'Expert Prompt Creator': 'expertPromptCreator',
      'Enhance Prompt': 'enhancePrompt',
      'Prompt for Prompts': 'promptForPrompts',
      'Generate Variations': 'generatePromptVariations',
      'Evaluate Effectiveness': 'evaluatePromptEffectiveness',
    },
    Roles: {
      'UX/UI Developer': 'actAsUxUiDeveloper',
      'Fullstack Software Developer': 'actAsFullstackSoftwareDeveloper',
      'Senior Frontend Developer': 'actAsSeniorFrontendDeveloper',
      'Machine Learning Engineer': 'actAsMachineLearningEngineer',
      'Software QA Tester': 'actAsSoftwareQaTester',
      'Tech Writer': 'actAsTechWriter',
      StoryBot: 'actAsStoryBot',
      Teacher: 'actAsTeacher',
      'Data Scientist': 'actAsDataScientist',
      'DevOps Engineer': 'actAsDevOpsEngineer',
      'Product Manager': 'actAsProductManager',
      'Android Developer': 'actAsAndroidDeveloper'
    },
    Environment: {
      Android: 'androidDevelopmentEnvironment'
    }
  };

  const functionMap = {
    continueResponding,
    ensureBestPractices,
    toggleFormal,
    toggleConcise,
    beSuccinct,
    openFileHeaderModal,
    addComments,
    addDocstring,
    addTestCases,
    identifyCodeSmells,
    analyzeSecurityVulnerabilities,
    createDesktopApp,
    createMobileApp,
    createWebApp,
    createClassObject,
    createFunctionMethod,
    createScript,
    createUnitTest,
    createIntegrationTest,
    modularizeClasses,
    modularizeFunctions,
    modularizeFiles,
    organizeAlphabetically,
    consolidateContent,
    removeComments,
    removeRedundancy,
    optimizePerformance,
    optimizeReadability,
    translateToHumanLanguage,
    translateToProgrammingLanguage,
    copyExample,
    versionControlCommit,
    versionControlBranch,
    versionControlMerge,
    findBugs,
    fixBugs,
    logOutput,
    explainConcept,
    explainInteraction,
    explainRelationship,
    summarize,
    explainWalkthrough,
    explainBeginnerLevel,
    explainIntermediateLevel,
    explainAdvancedLevel,
    listVerbs,
    listNouns,
    listAdjectives,
    listLibrariesFrameworks,
    listDesignPatterns,
    expertPromptCreator,
    enhancePrompt,
    promptForPrompts,
    generatePromptVariations,
    evaluatePromptEffectiveness,
    actAsUxUiDeveloper,
    actAsFullstackSoftwareDeveloper,
    actAsSeniorFrontendDeveloper,
    actAsMachineLearningEngineer,
    actAsSoftwareQaTester,
    actAsTechWriter,
    actAsStoryBot,
    actAsTeacher,
    actAsDataScientist,
    actAsDevOpsEngineer,
    actAsProductManager,
    actAsAndroidDeveloper,
    androidDevelopmentEnvironment
  };

  const templates = {
    'What is this?': '- What is this?: "$placeholder"\n',
    'What did you mean?': '- What did you mean by this?: "$placeholder"\n',
    'Can you give some examples?':
      '- Can you give me some examples of this?: "$placeholder"\n',
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

  async function beSuccinct() {
    const prompt = 'Be succinct for this response. I only need to see the new code or code that needs to change. Do not send all of the code.\n\n'
    await appendText(prompt);
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
    const prompt =
      'Please organize, optimize, consolidate, and deduplicate the content:\n\n';
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
    const prompt =
      '## Best Practices\n\nPlease ensure that your response adheres to best practices and recommendations regarding architectural principles, design patterns, and programming principles.\n\n';
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

Your first response should only be a greeting and to ask what the prompt should be about.\n\n`;

    await appendText(prompt);
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

Initial User Prompt:\n\n`;
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
the prompt in the Revised prompt section until I say we are done.\n\n`;
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
    const prompt =
      'What is a concise, one-paragraph summary of the key concepts, context, and implications of:\n\n';
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
    const prompt =
      'Please translate the content to human-readable language:\n\n';
    await appendText(prompt);
  }

  async function translateToProgrammingLanguage() {
    const prompt =
      'Please translate the content to the specified programming language:\n\n';
    await appendText(prompt);
  }

  async function actAsUxUiDeveloper() {
    const prompt =
      'I want you to act as a UX/UI developer. I will provide some details about the design of an app, website or other digital product, and it will be your job to come up with creative ways to improve its user experience. This could involve creating prototyping prototypes, testing different designs and providing feedback on what works best. My first request is "I need help designing an intuitive navigation system for my new mobile application."\n\n';
    await appendText(prompt);
  }

  async function actAsFullstackSoftwareDeveloper() {
    const prompt =
      'I want you to act as a software developer. I will provide some specific information about a web app requirements, and it will be your job to come up with an architecture and code for developing secure app with Golang and Angular. My first request is \'I want a system that allow users to register and save their vehicle information according to their roles and there will be admin, user and company roles. I want the system to use JWT for security\'.\n\n';
    await appendText(prompt);
  }

  async function actAsSeniorFrontendDeveloper() {
    const prompt =
      'I want you to act as a Senior Frontend developer. I will describe a project details you will code project with this tools: Create React App, yarn, Ant Design, List, Redux Toolkit, createSlice, thunk, axios. You should merge files in single index.js file and nothing else. Do not write explanations. My first request is "Create Pokemon App that lists pokemons with images that come from PokeAPI sprites endpoint".\n\n';
    await appendText(prompt);
  }

  async function actAsMachineLearningEngineer() {
    const prompt =
      'I want you to act as a machine learning engineer. I will write some machine learning concepts and it will be your job to explain them in easy-to-understand terms. This could contain providing step-by-step instructions for building a model, demonstrating various techniques with visuals, or suggesting online resources for further study. My first suggestion request is "I have a dataset without labels. Which machine learning algorithm should I use?"\n\n';
    await appendText(prompt);
  }

  async function actAsSoftwareQaTester() {
    const prompt =
      'I want you to act as a software quality assurance tester for a new software application. Your job is to test the functionality and performance of the software to ensure it meets the required standards. You will need to write detailed reports on any issues or bugs you encounter, and provide recommendations for improvement. Do not include any personal opinions or subjective evaluations in your reports. Your first task is to test the login functionality of the software.\n\n';
    await appendText(prompt);
  }

  async function actAsTechWriter() {
    const prompt =
      'Act as a tech writer. You will act as a creative and engaging technical writer and create guides on how to do different stuff on specific software. I will provide you with basic steps of an app functionality and you will come up with an engaging article on how to do those basic steps. You can ask for screenshots, just add (screenshot) to where you think there should be one and I will add those later. These are the first basic steps of the app functionality: "1.Click on the download button depending on your platform 2.Install the file. 3.Double click to open the app".\n\n';
    await appendText(prompt);
  }

  async function actAsStoryBot() {
    const prompt =
      'Act as StoryBot. Storybot explains everything in form of a story, even the most complex topics.\n\n';
    await appendText(prompt);
  }

  async function actAsTeacher() {
    const prompt =
      'You are an elite ______. And I am your student whom you must pass on your knowledge and expertise. In a series of sessions, you have to fulfil this duty and see that I have mastered ________ by giving me tests that I would encounter in the real world.\n\n';
    await appendText(prompt);
  }

  async function copyExample() {
    const prompt =
      '## Copy Example\n\nPlease provide an example of how to use the following code or concept. Ensure that the example is clear, well-commented, and easy to understand.\n\n';
    await appendText(prompt);
  }

  async function toggleFormal() {
    const prompt =
      '## Toggle Formal\n\nPlease adjust your response style to be more formal or informal based on the context and request.\n\n';
    await appendText(prompt);
  }

  async function toggleConcise() {
    const prompt =
      '## Toggle Concise\n\nPlease adjust your response to be more concise or detailed based on the context and request.\n\n';
    await appendText(prompt);
  }

  async function addTestCases() {
    const prompt =
      '## Add Test Cases\n\nPlease add relevant test cases for the provided code to ensure its functionality and correctness.\n\n';
    await appendText(prompt);
  }

  async function analyzeSecurityVulnerabilities() {
    const prompt =
      '## Analyze Security Vulnerabilities\n\nPlease analyze the provided code for any potential security vulnerabilities and suggest improvements to mitigate them.\n\n';
    await appendText(prompt);
  }

  async function createUnitTest() {
    const prompt =
      '## Create Unit Test\n\nPlease create unit tests for the specified functions or methods to verify their correctness.\n\n';
    await appendText(prompt);
  }

  async function createIntegrationTest() {
    const prompt =
      '## Create Integration Test\n\nPlease create integration tests to verify that different parts of the application work together correctly.\n\n';
    await appendText(prompt);
  }

  async function versionControlCommit() {
    const prompt =
      '## Version Control Commit\n\nPlease prepare a commit message for the following changes:\n\n';
    await appendText(prompt);
  }

  async function versionControlBranch() {
    const prompt =
      '## Version Control Branch\n\nPlease create a new branch in version control for the following feature or issue:\n\n';
    await appendText(prompt);
  }

  async function versionControlMerge() {
    const prompt =
      '## Version Control Merge\n\nPlease merge the specified branch into the main branch and resolve any conflicts that arise.\n\n';
    await appendText(prompt);
  }

  async function findBugs() {
    const prompt =
      '## Find Bugs\n\nPlease analyze the provided code for any bugs and report them with possible solutions.\n\n';
    await appendText(prompt);
  }

  async function fixBugs() {
    const prompt =
      '## Fix Bugs\n\nPlease fix the identified bugs in the provided code and ensure it works as expected.\n\n';
    await appendText(prompt);
  }

  async function logOutput() {
    const prompt =
      '## Log Output\n\nPlease add appropriate logging to the provided code to help with debugging and monitoring.\n\n';
    await appendText(prompt);
  }

  async function explainBeginnerLevel() {
    const prompt =
      '## Explain (Beginner Level)\n\nPlease explain the following concept in a way that a beginner can understand:\n\n';
    await appendText(prompt);
  }

  async function explainIntermediateLevel() {
    const prompt =
      '## Explain (Intermediate Level)\n\nPlease explain the following concept in a way that someone with intermediate knowledge can understand:\n\n';
    await appendText(prompt);
  }

  async function explainAdvancedLevel() {
    const prompt =
      '## Explain (Advanced Level)\n\nPlease explain the following concept in a way that an expert can understand:\n\n';
    await appendText(prompt);
  }

  async function listLibrariesFrameworks() {
    const prompt =
      '## List Libraries/Frameworks\n\nPlease list the relevant libraries and frameworks for the following technology or use case:\n\n';
    await appendText(prompt);
  }

  async function listDesignPatterns() {
    const prompt =
      '## List Design Patterns\n\nPlease list the appropriate design patterns for the following programming scenario:\n\n';
    await appendText(prompt);
  }

  async function generatePromptVariations() {
    const prompt =
      '## Generate Prompt Variations\n\nPlease generate several variations of the following prompt to explore different ways to ask the question or request:\n\n';
    await appendText(prompt);
  }

  async function evaluatePromptEffectiveness() {
    const prompt =
      '## Evaluate Prompt Effectiveness\n\nPlease evaluate the effectiveness of the following prompt and suggest improvements:\n\n';
    await appendText(prompt);
  }

  async function actAsDataScientist() {
    const prompt =
      '## Act as Data Scientist\n\nYou will act as a Data Scientist. Your goal is to provide insights, data analysis, and machine learning solutions. Start by asking what specific data or problem needs to be addressed.\n\n';
    await appendText(prompt);
  }

  async function actAsDevOpsEngineer() {
    const prompt =
      '## Act as DevOps Engineer\n\nYou will act as a DevOps Engineer. Your goal is to provide solutions for continuous integration, deployment, and infrastructure automation. Start by asking what specific system or deployment needs to be addressed.\n\n';
    await appendText(prompt);
  }

  async function actAsProductManager() {
    const prompt =
      '## Act as Product Manager\n\nYou will act as a Product Manager. Your goal is to provide strategic product planning, user stories, and feature prioritization. Start by asking what specific product or feature needs to be addressed.\n\n';
    await appendText(prompt);
  }

  async function androidDevelopmentEnvironment() {
    const prompt = `In an Android app that's already setup, configured, and verified fully working to use Kotlin, Jetpack Compose, Navigation Compose, Material3, KSP, DataStores, Hilt, Room, and Retrofit with an MVVM architecture, what is the best practice way to handle the following:\n\n`;
    await appendText(prompt);
  }

  async function actAsAndroidDeveloper() {
    const prompt = `You will act as an expert Android developer to help me create a robust and efficient application using MVVM architecture with Kotlin and Jetpack Compose. The application should follow best practices and utilize the following technologies and principles: Hilt for Dependency Injection, Room for database management, Retrofit for network calls, Material3 for UI design, and Lifecycle Awareness and Management. Additionally, guide me on effective state management strategies within this context.

Key features to consider for high-quality source code include:

Readability: Clear naming conventions, consistent formatting, comments and documentation, logical code structure, and literate programming where applicable.
Maintainability: Modular design, DRY principle, separation of concerns, dependency management, and configuration management.
Efficiency: Performance optimization, resource management, and regular profiling and benchmarking.
Scalability: Extendable architecture, decoupling, asynchronous processing, and load balancing.
Robustness: Comprehensive error handling, testing, defensive programming, and recovery mechanisms.
Security: Input validation, secure coding practices, encryption, and access controls.
Version Control: Use of VCS, meaningful commit messages, branching strategy, and CI/CD pipelines.
Compliance and Standards: Adherence to standards, regular code reviews, and knowledge sharing.
Portability: Cross-platform compatibility and environment independence.
Usability: User-friendly interfaces and well-documented APIs.
Unless specified, I want all responses to include the filename, expected filepath, and only the code that needs to be added or updated. I don't ever want to see a response that includes an entire code file or any lines that have not been changed.

After each response, please provide the next step you would like to work on.

My communication style is clear, concise, and focused on practical and actionable advice. I appreciate detailed explanations, step-by-step guides, and real-world examples that can be directly applied to my project.

Examples of my communication style:

"Can you show me how to set up Hilt for dependency injection in my project? Please include the necessary Gradle dependencies and a simple example of a Hilt module."
"What is the best way to manage state in Jetpack Compose? I need a clear explanation with code snippets demonstrating different state management techniques."
"How can I implement efficient network calls using Retrofit in my application? Provide a step-by-step guide including setup, making requests, and handling responses."

Your first response should only be a greeting and to ask what the user would like to work on.\n\n`;
    await appendText(prompt);
  }

  function createQuestionFromTemplate(copiedText, templateName) {
    const template = templates[templateName];
    if (!template) {
      throw new Error('Template not found');
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
          submenus.forEach((submenu) => {
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
        document.addEventListener(
          'click',
          () => {
            menu.remove();
          },
          { once: true },
        );
      });
    }

    attachContextMenu();
    attachSecondaryContextMenu();

    // Re-attach the context menu when navigating between chats
    const observer = new MutationObserver(() => {
      attachContextMenu();
      attachSecondaryContextMenu();
    });
    observer.observe(document.querySelector('main'), {
      childList: true,
      subtree: true,
    });
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

        item.addEventListener('click', () => {
          log(`Executing action for ${key}`);

          try {
            const func = functionMap[config[key]];
            if (typeof func === 'function') {
              func();
            } else {
              console.error(
                `Function ${config[key]} not found in function map.`,
              );
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

    document
      .getElementById('cancelFileHeader')
      .addEventListener('click', () => {
        log('File header modal canceled.');
        modal.remove();
      });

    document
      .getElementById('submitFileHeader')
      .addEventListener('click', async () => {
        const form = document.getElementById('fileHeaderForm');
        let headerText =
          'Generate a header for this code file which includes the following properties:\n\n';
        const checkboxes = form.querySelectorAll(
          'input[type="checkbox"]:checked',
        );
        checkboxes.forEach((checkbox) => {
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
