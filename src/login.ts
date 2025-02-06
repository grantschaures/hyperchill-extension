document.addEventListener("DOMContentLoaded", () => {
    // Get button and input elements
    const loginSubmitBtn = document.getElementById("loginSubmitBtn") as HTMLButtonElement;
    const emailInput = document.getElementById("emailInputSignin") as HTMLInputElement;
    const passwordInput = document.getElementById("passwordInput") as HTMLInputElement;

    // Add event listener to the login button
    loginSubmitBtn.addEventListener("click", async () => {
        const email = emailInput.value;
        const password = passwordInput.value;

        if (isValidEmail(email)) {
            await addUser(email, password);
        } else {
            alert("Invalid email address. Please try again.");
        }
    });

    // Add event listener for Enter key
    document.addEventListener("keydown", (event) => handleLoginEnter(event, loginSubmitBtn));
});

// Handle the Enter key for login
function handleLoginEnter(event: KeyboardEvent, loginSubmitBtn: HTMLButtonElement): void {
    if (event.key === "Enter" && document.activeElement?.id === "passwordInput") {
        event.preventDefault();
        loginSubmitBtn.click();
    }
}

// Function to validate email
function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Function to add a user
async function addUser(email: string, password: string): Promise<void> {
    const user = { email, password };

    try {
        const response = await fetch("http://localhost:3000/extension/auth/validateUser", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({user})
        });

        if (!response.ok) {
            if (response.status === 429) {
                const data = await response.json();
                alert(data.message);
                throw new Error(`HTTP error! Status: ${response.status} - ${data.message}`);
            } else {
                alert("Your email or password is incorrect. Please try again.");
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        }

        const data = await response.json();
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

        } else {
            alert("An error occurred on the server. We apologize for the inconvenience. Please try again later.");
        }

    } catch (error) {
        console.error("Error during login:", error);
    }
}