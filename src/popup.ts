document.addEventListener('DOMContentLoaded', () => {
  const blockButton = document.getElementById('blockButton') as HTMLButtonElement;

  blockButton.addEventListener('click', () => {
    blockSite();
  });

  function blockSite(): void {
      const siteUrl = prompt('Enter the URL of the site to block:');
      if (siteUrl) {
          // Logic to block the site
          console.log(`Blocking site: ${siteUrl}`);
          alert(`Site ${siteUrl} has been blocked.`);
      } else {
          alert('No URL entered. Please try again.');
      }
  }
});