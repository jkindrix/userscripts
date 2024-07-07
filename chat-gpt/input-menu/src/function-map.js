import { appendText, openFileHeaderModal } from './utility-functions.js';

export const functionMap = {
    "openFileHeaderModal": openFileHeaderModal,
    "addComments": () => appendText('Add comments'),
    "addDocstring": () => appendText('Add docstring'),
    "createDesktopApp": () => appendText('Create desktop application'),
    "createMobileApp": () => appendText('Create mobile application'),
    "createWebApp": () => appendText('Create web application'),
    "createClassObject": () => appendText('Create class/object'),
    "createFunctionMethod": () => appendText('Create function/method'),
    "createScript": () => appendText('Create script'),
    "modularizeClasses": () => appendText('Modularize classes'),
    "modularizeFunctions": () => appendText('Modularize functions'),
    "modularizeFiles": () => appendText('Modularize files'),
    "removeComments": () => appendText('Remove comments'),
    "removeRedundancy": () => appendText('Remove redundancy'),
    "optimizePerformance": () => appendText('Optimize performance'),
    "optimizeReadability": () => appendText('Optimize readability'),
    "translateToHumanLanguage": () => appendText('Translate to human language'),
    "translateToProgrammingLanguage": () => appendText('Translate to programming language'),
    "explainConcept": () => appendText('Explain concept'),
    "explainInteraction": () => appendText('Explain interaction'),
    "explainRelationship": () => appendText('Explain relationship'),
    "listVerbs": () => appendText('Generate a list of verbs (actions)'),
    "listNouns": () => appendText('Generate a list of nouns (objects)'),
    "listAdjectives": () => appendText('Generate a list of adjectives (properties)')
};
