/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/login.ts":
/*!**********************!*\
  !*** ./src/login.ts ***!
  \**********************/
/***/ (function() {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
document.addEventListener("DOMContentLoaded", () => {
    // Get button and input elements
    const loginSubmitBtn = document.getElementById("loginSubmitBtn");
    const emailInput = document.getElementById("emailInputSignin");
    const passwordInput = document.getElementById("passwordInput");
    // Add event listener to the login button
    loginSubmitBtn.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
        const email = emailInput.value;
        const password = passwordInput.value;
        if (isValidEmail(email)) {
            yield addUser(email, password);
        }
        else {
            alert("Invalid email address. Please try again.");
        }
    }));
    // Add event listener for Enter key
    document.addEventListener("keydown", (event) => handleLoginEnter(event, loginSubmitBtn));
});
// Handle the Enter key for login
function handleLoginEnter(event, loginSubmitBtn) {
    var _a;
    if (event.key === "Enter" && ((_a = document.activeElement) === null || _a === void 0 ? void 0 : _a.id) === "passwordInput") {
        event.preventDefault();
        loginSubmitBtn.click();
    }
}
// Function to validate email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
// Function to add a user
function addUser(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = { email, password };
        try {
            const response = yield fetch("http://localhost:3000/extension/auth/validateUser", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user })
            });
            if (!response.ok) {
                if (response.status === 429) {
                    const data = yield response.json();
                    alert(data.message);
                    throw new Error(`HTTP error! Status: ${response.status} - ${data.message}`);
                }
                else {
                    alert("Your email or password is incorrect. Please try again.");
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
            }
            const data = yield response.json();
            if (data.loginSuccess === true) {
                alert("Login was successful!"); // remove this eventually
                // Store the JWT and userEmail in Chrome's local storage
                chrome.storage.local.get("state", (result) => {
                    const state = result.state || { jwt: null, userEmail: null }; // Use the existing state or initialize a new one
                    state.jwt = data.token; // Update jwt
                    state.userEmail = data.email; // Update userEmail
                    chrome.storage.local.set({ state }, () => {
                        console.log("State updated:", state);
                    });
                });
                // take down the popup and send user's email to main execution environment
                chrome.runtime.sendMessage({ type: 'INITIATE_LOGIN_PROCESS', email: data.email }, (response) => {
                    if (response) {
                        console.log("Removed Login Popup");
                    }
                });
            }
            else {
                alert("An error occurred on the server. We apologize for the inconvenience. Please try again later.");
            }
        }
        catch (error) {
            console.error("Error during login:", error);
        }
    });
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/login.ts"]();
/******/ 	
/******/ })()
;
//# sourceMappingURL=login.js.map