// Define types for Blocked and Settings
// Interface defined a blueprint for objects
interface Item {
  value: string,
  date: number
}

interface Blocked {
  websites: Item[];
  categories: Item[];
}

interface Settings {
  deepWorkToggle?: boolean; // Made optional since not every entry uses it
  timeSpans?: number[][]; // Represents time spans as an array of numbers
}

// TypeScript declaration defines a const blocked, ensuring it adheres to a specific type structure
// Record<K, T>
// K: keys of the object
// T: Type of the values corresponding to each key
// Record structure works here since each key in blocked object is of type Blocked
// If keys had various object types, type or interface would need to be used for specific key-type mappings
const blocked: Record<'hyperchill-sync' | 'all-time' | 'custom-time', Blocked> = {
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

const settings: Record<'hyperchill-sync' | 'custom-time', Settings> = {
  'hyperchill-sync': {
    deepWorkToggle: false
  },
  'custom-time': {
    timeSpans: []
  }
};

type State = {
  jwt: string | null;
  userEmail: string | null;
};

// Run on extension install or update
chrome.runtime.onInstalled.addListener(() => {

  chrome.storage.local.get("blocked", (result) => {
    if (!result.blocked) {
      // Settings object does not exist, initialize with defaults
      chrome.storage.local.set({ blocked: blocked }, () => {
        console.log("Blocked data initialized:", blocked);
      });
    } else {
      console.log("Blocked object exists:", result.blocked);
    }
  });

  chrome.storage.local.get("settings", (result) => {
    if (!result.settings) {
      // Settings object does not exist, initialize with defaults
      chrome.storage.local.set({ settings: settings }, () => {
        console.log("Settings initialized:", settings);
      });
    } else {
      console.log("Settings object exists:", result.settings);
    }
  });

  chrome.storage.local.get("state", (result) => {
    if (!result.state) {
        const state = { jwt: null, userEmail: null };
        chrome.storage.local.set({ state }, () => {
            console.log("State initialized:", state);
        });
    } else {
        console.log("State object exists:", result.state);
    }
  });

});