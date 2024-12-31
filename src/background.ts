chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    // Logic to check if the URL should be blocked
    return { cancel: true };
  },
  { urls: ["*://*/*"] }, // Correct URL pattern to match all URLs
  ["blocking"]
);

// Function to communicate with hyperchill.io backend
async function fetchFromBackend(endpoint: string) {
  const response = await fetch(`https://hyperchill.io/api/${endpoint}`);
  return response.json();
}

// I'll figure this out tomorrow a