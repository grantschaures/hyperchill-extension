/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/*!***************************!*\
  !*** ./src/background.ts ***!
  \***************************/

// TypeScript declaration defines a const blocked, ensuring it adheres to a specific type structure
// Record<K, T>
// K: keys of the object
// T: Type of the values corresponding to each key
// Record structure works here since each key in blocked object is of type Blocked
// If keys had various object types, type or interface would need to be used for specific key-type mappings
const blocked = {
    'hyperchill-sync': {
        websites: [],
        categories: []
    },
    'all-time': {
        websites: [],
        categories: []
    },
    'custom-time': {
        websites: [],
        categories: []
    }
};
const settings = {
    'hyperchill-sync': {
        deepWorkToggle: false
    },
    'custom-time': {
        timeSpans: []
    }
};
// Run on extension install or update
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.get("blocked", (result) => {
        if (!result.blocked) {
            // Settings object does not exist, initialize with defaults
            chrome.storage.local.set({ blocked: blocked }, () => {
                console.log("Blocked data initialized:", blocked);
            });
        }
        else {
            console.log("Blocked object exists:", result.blocked);
        }
    });
    chrome.storage.local.get("settings", (result) => {
        if (!result.settings) {
            // Settings object does not exist, initialize with defaults
            chrome.storage.local.set({ settings: settings }, () => {
                console.log("Settings initialized:", settings);
            });
        }
        else {
            console.log("Settings object exists:", result.settings);
        }
    });
});

/******/ })()
;
//# sourceMappingURL=background.js.map