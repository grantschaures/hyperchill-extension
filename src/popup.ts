document.addEventListener('DOMContentLoaded', () => {
  const optionsBtn = document.getElementById('optionsBtn') as HTMLButtonElement | null;

  if (optionsBtn) {
    optionsBtn.addEventListener('click', () => {
      chrome.runtime.openOptionsPage(() => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
        }
      });
    });
  } else {
    console.error('Element with ID "optionsBtn" not found.');
  }
});