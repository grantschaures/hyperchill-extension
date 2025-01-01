document.addEventListener('DOMContentLoaded', () => {
    const testBtn = document.getElementById('testBtn') as HTMLButtonElement;
    const status = document.getElementById('status') as HTMLElement;
    const inputField = document.getElementById('input') as HTMLInputElement;

    // Load saved options
    chrome.storage.sync.get(['option'], (result) => {
        if (result.option) {
            inputField.value = result.option;
        }
    });

    // Save options
    testBtn.addEventListener('click', () => {
        console.log('asdfasdfasdf')
        // const optionValue = inputField.value;
        // chrome.storage.sync.set({ option: optionValue }, () => {
        //     status.textContent = 'Options saved.';
        //     setTimeout(() => {
        //         status.textContent = '';
        //     }, 2000);
        // });
    });
});