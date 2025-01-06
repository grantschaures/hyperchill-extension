/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/*!**********************!*\
  !*** ./src/popup.ts ***!
  \**********************/

document.addEventListener('DOMContentLoaded', () => {
    const optionsBtn = document.getElementById('optionsBtn');
    if (optionsBtn) {
        optionsBtn.addEventListener('click', () => {
            chrome.runtime.openOptionsPage(() => {
                if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError);
                }
            });
        });
    }
    else {
        console.error('Element with ID "optionsBtn" not found.');
    }
});

/******/ })()
;
//# sourceMappingURL=popup.js.map