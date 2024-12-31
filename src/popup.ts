document.getElementById('blockButton')?.addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    if (activeTab?.url) {
      // Logic to block the current site
      console.log(`Blocking site: ${activeTab.url}`);
    }
  });
});