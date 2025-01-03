// Define types for Blocked and Settings
interface Blocked {
  websites: string[];
  categories: string[];
}

interface Settings {
  'deep-work-toggle'?: boolean; // Made optional since not every entry uses it
  'time-spans'?: string[]; // Represents time spans as an array of strings
}

// Define records with explicit keys
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
    'deep-work-toggle': false
  },
  'custom-time': {
    'time-spans': []
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
});