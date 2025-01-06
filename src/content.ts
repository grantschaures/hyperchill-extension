// The point of this script will be to dynamically load users' data from chrome.storage.local into the blocked page (#blocked-page)
// It will also deal with User Interaction (adding/ removing websites and categories)

// (1) Retrieve data from chrome.storage.local and initialize blocked and settings objects
// (2) define populateBlockedPage() with args tempStorage {contentsId and blockedModuleId}
//     This will populate blocked page
// (3) Define callback functions for blocking a website/ category and removing from list

import { TempStorage, tempStorage } from "./types"

// ✅ Declare storageDict in the global scope
let storageDict: Record<string, Item[] | undefined> = {};

// Variables
const blockedGrid = document.getElementById('blocked-grid') as HTMLElement;
const websiteInput = document.getElementById('website-input') as HTMLInputElement;
const blockWebsiteBtn = document.getElementById('block-website-btn') as HTMLElement;
const categoryInput = document.getElementById('category-input') as HTMLSelectElement;
const blockCategoryBtn = document.getElementById('block-category-btn') as HTMLElement;

// Input-related blocked page elements
const invalidWebsiteContainer = document.getElementById('invalid-website-container') as HTMLElement;
const invalidWebsiteMessage = document.getElementById('invalid-website-message') as HTMLElement;
const invalidCategoryContainer = document.getElementById('invalid-category-container') as HTMLElement;
const invalidCategoryMessage = document.getElementById('invalid-category-message') as HTMLElement;

// Custom time page
const addTimespanBtn = document.getElementById('add-timespan-btn') as HTMLElement;
const initialHour = document.getElementById('initial-hour') as HTMLInputElement;
const initialMinute = document.getElementById('initial-minute') as HTMLInputElement;
const initialAMPM = document.getElementById('initial-ampm') as HTMLInputElement;
const finalHour = document.getElementById('final-hour') as HTMLInputElement;
const finalMinute = document.getElementById('final-minute') as HTMLInputElement;
const finalAMPM = document.getElementById('final-ampm') as HTMLInputElement;

// Hyperchill.io Sync Page
const deepWorkToggle = document.getElementById('deepWorkToggle') as HTMLInputElement;

type BlockedCount = {
    hyperchillSyncWebsitesBlocked: HTMLElement;
    hyperchillSyncCategoriesBlocked: HTMLElement;
    allTimeWebsitesBlocked: HTMLElement;
    allTimeCategoriesBlocked: HTMLElement;
    customTimeWebsitesBlocked: HTMLElement;
    customTimeCategoriesBlocked: HTMLElement;
};

const blockedCountElements: BlockedCount = {
    hyperchillSyncWebsitesBlocked: document.getElementById('hyperchill-sync-websites-blocked') as HTMLElement,
    hyperchillSyncCategoriesBlocked: document.getElementById('hyperchill-sync-categories-blocked') as HTMLElement,
    allTimeWebsitesBlocked: document.getElementById('all-time-websites-blocked') as HTMLElement,
    allTimeCategoriesBlocked: document.getElementById('all-time-categories-blocked') as HTMLElement,
    customTimeWebsitesBlocked: document.getElementById('custom-time-websites-blocked') as HTMLElement,
    customTimeCategoriesBlocked: document.getElementById('custom-time-categories-blocked') as HTMLElement
};

let blockedModuleId: string | null = null;

type BlockedData = {
    blocked: Record<'hyperchill-sync' | 'all-time' | 'custom-time', Blocked>;
    settings: Record<'hyperchill-sync' | 'custom-time', Settings>;
};

const blockedData: BlockedData = {
    blocked: {
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
    },
    settings: {
        'hyperchill-sync': {
            deepWorkToggle: false
        },
        'custom-time': {
            timeSpans: []
        }
    }
};

type ModuleId =
    | 'hyperchill-sync-websites-module'
    | 'hyperchill-sync-categories-module'
    | 'all-time-websites-module'
    | 'all-time-categories-module'
    | 'custom-time-websites-module'
    | 'custom-time-categories-module';

const moduleIds: ModuleId[] = [
    'hyperchill-sync-websites-module',
    'hyperchill-sync-categories-module',
    'all-time-websites-module',
    'all-time-categories-module',
    'custom-time-websites-module',
    'custom-time-categories-module'
];

document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get(['blocked', 'settings'], (result) => {
        blockedData.blocked = result.blocked || {};
        blockedData.settings = result.settings || {};

        // values are references to blocked data
        storageDict = {
            'hyperchill-sync-websites-module': blockedData.blocked["hyperchill-sync"].websites,
            'hyperchill-sync-categories-module': blockedData.blocked["hyperchill-sync"].categories,
            'all-time-websites-module': blockedData.blocked["all-time"].websites,
            'all-time-categories-module': blockedData.blocked["all-time"].categories,
            'custom-time-websites-module': blockedData.blocked["custom-time"].websites,
            'custom-time-categories-module': blockedData.blocked["custom-time"].categories,
        };

        updateDeepWorkToggleState(blockedData);
        populateTimespansGrid(blockedData);
        updateModuleBlockCount(blockedData, blockedCountElements);
    });

    // Document Event Listeners
    document.addEventListener('click', (event) => {
        let target = event.target as HTMLElement;
        if (target.classList.contains('remove-btn')) {
            const blockedValueDiv = target.parentElement?.previousElementSibling?.previousElementSibling;
            const blockedValue = blockedValueDiv?.textContent;

            if (blockedValue && blockedModuleId) {
                const blockedArr = storageDict[blockedModuleId];
                const index = blockedArr?.findIndex(item => item.value === blockedValue);

                if (index !== undefined && index > -1) {
                    blockedArr?.splice(index, 1);
                    chrome.storage.local.set({ blocked: blockedData.blocked }, () => {
                        console.log("Blocked List Updated:", blockedData.blocked);
                        updateBlockedPage(tempStorage);
                        updateModuleBlockCount(blockedData, blockedCountElements);
                    });
                }
            }
        } else if (target.classList.contains('remove-timespan-btn')) {
            const initialTimeSpan = target.parentElement?.previousElementSibling?.previousElementSibling;
            const finalTimeSpan = target.parentElement?.previousElementSibling;
            const initialTime = initialTimeSpan?.textContent;
            const finalTime = finalTimeSpan?.textContent;

            if (initialTime && finalTime) {
                const timespansArr = blockedData.settings["custom-time"].timeSpans;
                const initialTimeInMs = convertTimeToMs(initialTime);
                const finalTimeInMs = convertTimeToMs(finalTime);

                const index = timespansArr?.findIndex(timespan => timespan[0] === initialTimeInMs && timespan[1] === finalTimeInMs);

                if (index !== undefined && index > -1) {
                    timespansArr?.splice(index, 1);
                    chrome.storage.local.set({ settings: blockedData.settings }, () => {
                        console.log("Settings Updated:", blockedData.settings);
                        populateTimespansGrid(blockedData);
                    });
                }
            }
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            if (document.activeElement === websiteInput) {
                blockWebsiteBtn.click();

            } else if (document.activeElement === categoryInput) {
                // functionality is a bit weird but at least there's the option
                blockCategoryBtn.click();
            }
        }
    });

    blockWebsiteBtn.addEventListener('click', (event) => {
        // depending on the current blockedModuleId, we will first check if input is correct format
        // then we'll add the inputted website into the data object and run updateBlockedPage
        let domain = websiteInput.value;
        let [validationResult, errorType] = validateWebsiteInput(domain, tempStorage);

        if (validationResult) {
            console.log('valid domain')

            // if invalid input message still showing on valid input, remove it asap
            if (invalidWebsiteContainer.style.opacity === '1') {
                invalidWebsiteContainer.style.opacity = '0';
            }

            // (1) add new entry to main blocked object
            updateBlockedObject(tempStorage, domain);

            // (1.1) set chrome.strage.local with this new data
            chrome.storage.local.set({ blocked: blockedData.blocked }, () => {
                console.log("Blocked List Updated:", blockedData.blocked);
            });

            // (2) clear input
            websiteInput.value = '';
            websiteInput.focus();

            // (3) show entry at bottom of grid UI (rapidly clears and repopulates grid)
            updateBlockedPage(tempStorage);

            // (4) update module block count
            updateModuleBlockCount(blockedData, blockedCountElements);

        } else {
            console.log('invalid input');

            let errorStr = "";
            if (errorType === 'invalid-input') {
                errorStr = "Invalid input. Please try again."
            } else if (errorType === 'duplicate-website') {
                errorStr = "Deplicate entry. Please try again."
            }
            invalidWebsiteMessage.innerText = errorStr;

            // show error message
            invalidWebsiteContainer.style.opacity = '1';
            setTimeout(() => {
                invalidWebsiteContainer.style.opacity = '0';
            }, 3000);

            websiteInput.focus();
        }
    })

    blockCategoryBtn.addEventListener('click', (event) => {
        let category = categoryInput.value;

        if (validateCategoryInput(category, tempStorage)) {
            console.log('valid input')
        
            // (1) add new entry to main blocked object
            updateBlockedObject(tempStorage, category);
    
            // (1.1) set chrome.strage.local with this new data
            chrome.storage.local.set({ blocked: blockedData.blocked }, () => {
                console.log("Blocked List Updated:", blockedData.blocked);
            });
    
            // (2) show entry at bottom of grid UI (rapidly clears and repopulates grid)
            updateBlockedPage(tempStorage);

            // (3) update module block count
            updateModuleBlockCount(blockedData, blockedCountElements);

        } else {
            console.log('invalid input')

            let errorStr = "Duplicate entry. Please try again";
            invalidCategoryMessage.innerText = errorStr;

            // show error message
            invalidCategoryContainer.style.opacity = '1';
            setTimeout(() => {
                invalidCategoryContainer.style.opacity = '0';
            }, 3000);
        }
    })

    // Custom Time page
    addTimespanBtn.addEventListener('click', () => {
        console.log('add time span btn clicked');

        const inputs = [initialHour, initialMinute, initialAMPM, finalHour, finalMinute, finalAMPM];

        const inputsValid = checkInputValues(inputs);
        if (inputsValid) {
            console.log('All inputs are valid');
            // Proceed with adding the time span

            // (2) Determine the time 0ms to (24hrs X ms/ day) for first and last three elements in inputs
            // Final output for this will be array containing ms for initial and final time
            let timespanArr = getTimespanArr(inputs);
            let timespans = blockedData.settings["custom-time"].timeSpans;

            if (timespans && !isDuplicateTimespan(timespanArr, timespans)) {
                blockedData.settings["custom-time"].timeSpans?.push(timespanArr);
    
                // (2.1) set chrome.strage.local with this new settings data
                chrome.storage.local.set({ settings: blockedData.settings }, () => {
                    console.log("Settings Updated:", blockedData.settings);
                });

                // after successful addition of time span, clear inputs except initialAMPM and finalAMPM
                inputs.forEach(input => {
                    if (input !== initialAMPM && input !== finalAMPM) {
                        input.value = '';
                    }
                });
                initialAMPM.value = 'AM';
                finalAMPM.value = 'PM';

            } else {
                // create error message for duplicate time span
                alert("Error: Timespan already exists. Try again 😛"); // idgaf, an alert will do
            }

            // if user input same time for initial and final, that effectively blocks the websites/ categories at all times

            // (3) Call function to populate time-spans grid (also called when Dom Content Loads)
            populateTimespansGrid(blockedData);
            
        } else {
            console.log('Some inputs are missing values');
        }
    });

    // Hyperchill.io Sync Page
    deepWorkToggle.addEventListener('click', () => {
        blockedData.settings['hyperchill-sync'].deepWorkToggle = deepWorkToggle.checked;
        chrome.storage.local.set({ settings: blockedData.settings }, () => {
            console.log("Settings Updated:", blockedData.settings);
        });
    });
});

// // // // // // //
// Helper Functions
// // // // // // //

function updateDeepWorkToggleState(blockedData: BlockedData): void {
    let deepWorkToggleState = blockedData.settings['hyperchill-sync'].deepWorkToggle;

    if (deepWorkToggleState) {
        deepWorkToggle.checked = true;
    } else {
        deepWorkToggle.checked = false;
    }
}

function isDuplicateTimespan(timespanArr: number[], timespans: number[][]): boolean {
    for (const timespan of timespans) {
        if (timespan[0] === timespanArr[0] && timespan[1] === timespanArr[1]) {
            return true;
        }
    }
    return false;
}

function populateTimespansGrid(blockedData: BlockedData): void {
    let timespansArr = blockedData.settings["custom-time"].timeSpans;
    if (timespansArr) {
        appendTimespans(timespansArr);
    }
}

function appendTimespans(timespans: number[][]): void {

    const timespansGrid = document.getElementById('timespans-grid') as HTMLElement;

    // Clear Previous Contents of timespans grid
    timespansGrid.innerHTML = '';

    timespans.forEach(timespan => {
        const initialTime = convertMsToTime(timespan[0]);
        const finalTime = convertMsToTime(timespan[1]);

        const initialTimeSpan = document.createElement('span');
        initialTimeSpan.className = 'inline-flex items-center justify-center px-4';
        initialTimeSpan.textContent = initialTime;

        const finalTimeSpan = document.createElement('span');
        finalTimeSpan.className = 'inline-flex items-center justify-center px-4';
        finalTimeSpan.textContent = finalTime;

        const buttonDiv = document.createElement('div');
        buttonDiv.className = 'flex justify-center';

        const removeButton = document.createElement('button');
        removeButton.className = 'remove-timespan-btn bg-red-500 text-white p-2 rounded-md w-10';
        removeButton.textContent = '-';

        buttonDiv.appendChild(removeButton);

        timespansGrid.appendChild(initialTimeSpan);
        timespansGrid.appendChild(finalTimeSpan);
        timespansGrid.appendChild(buttonDiv);
    });
}

function convertTimeToMs(time: string): number {
    const [timePart, ampm] = time.split(' ');
    const [hours, minutes] = timePart.split(':').map(Number);
    const hours24 = ampm === 'PM' && hours !== 12 ? hours + 12 : ampm === 'AM' && hours === 12 ? 0 : hours;
    return (hours24 * 60 * 60 * 1000) + (minutes * 60 * 1000);
}

function convertMsToTime(ms: number): string {
    const date = new Date(ms);
    let hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutesStr} ${ampm}`;
}

function getTimespanArr(inputs: HTMLInputElement[]): number[] {
    const [initialHour, initialMinute, initialAMPM, finalHour, finalMinute, finalAMPM] = inputs;

    const convertTo24HourFormat = (hour: number, ampm: string): number => {
        if (ampm.toLowerCase() === 'pm' && hour !== 12) {
            return hour + 12;
        } else if (ampm.toLowerCase() === 'am' && hour === 12) {
            return 0;
        }
        return hour;
    };

    const initialHour24 = convertTo24HourFormat(parseInt(initialHour.value), initialAMPM.value);
    const finalHour24 = convertTo24HourFormat(parseInt(finalHour.value), finalAMPM.value);

    const initialTimeInMs = (initialHour24 * 60 * 60 * 1000) + (parseInt(initialMinute.value) * 60 * 1000);
    const finalTimeInMs = (finalHour24 * 60 * 60 * 1000) + (parseInt(finalMinute.value) * 60 * 1000);

    return [initialTimeInMs, finalTimeInMs];
}

function checkInputValues(inputs: HTMLInputElement[]): boolean {
    let allInputsValid = true;

    inputs.forEach(input => {
        if (!input.value) {
            input.style.border = '2px solid red';
            allInputsValid = false;
        } else {
            input.style.border = ''; // Reset border if input has value
        }
    });

    return allInputsValid;
}

function updateModuleBlockCount(blockedData: BlockedData, blockedCountElements: BlockedCount): void {
    blockedCountElements.hyperchillSyncWebsitesBlocked.innerText = blockedData.blocked["hyperchill-sync"].websites.length + (blockedData.blocked["hyperchill-sync"].websites.length === 1 ? " Site Blocked" : " Sites Blocked");
    blockedCountElements.hyperchillSyncCategoriesBlocked.innerText = blockedData.blocked["hyperchill-sync"].categories.length + (blockedData.blocked["hyperchill-sync"].categories.length === 1 ? " Category Blocked" : " Categories Blocked");
    
    blockedCountElements.allTimeWebsitesBlocked.innerText = blockedData.blocked["all-time"].websites.length + (blockedData.blocked["all-time"].websites.length === 1 ? " Site Blocked" : " Sites Blocked");
    blockedCountElements.allTimeCategoriesBlocked.innerText = blockedData.blocked["all-time"].categories.length + (blockedData.blocked["all-time"].categories.length === 1 ? " Category Blocked" : " Categories Blocked");
    
    blockedCountElements.customTimeWebsitesBlocked.innerText = blockedData.blocked["custom-time"].websites.length + (blockedData.blocked["custom-time"].websites.length === 1 ? " Site Blocked" : " Sites Blocked");
    blockedCountElements.customTimeCategoriesBlocked.innerText = blockedData.blocked["custom-time"].categories.length + (blockedData.blocked["custom-time"].categories.length === 1 ? " Category Blocked" : " Categories Blocked");
}

// update blocked website or category
function updateBlockedObject(tempStorage: TempStorage, input: string): void {
    const { blockedModuleId } = tempStorage;

    if (blockedModuleId === moduleIds[0]) {
        blockedData.blocked['hyperchill-sync'].websites.push({ value: input, date: Date.now() });
    } else if (blockedModuleId === moduleIds[1]) {
        blockedData.blocked['hyperchill-sync'].categories.push({ value: input, date: Date.now() });
    } else if (blockedModuleId === moduleIds[2]) {
        blockedData.blocked['all-time'].websites.push({ value: input, date: Date.now() });
    } else if (blockedModuleId === moduleIds[3]) {
        blockedData.blocked['all-time'].categories.push({ value: input, date: Date.now() });
    } else if (blockedModuleId === moduleIds[4]) {
        blockedData.blocked['custom-time'].websites.push({ value: input, date: Date.now() });
    } else if (blockedModuleId === moduleIds[5]) {
        blockedData.blocked['custom-time'].categories.push({ value: input, date: Date.now() });
    } else {
        console.warn(`Unhandled module ID: ${blockedModuleId}`);
    }
}

function validateCategoryInput(category: string, tempStorage: TempStorage): boolean {

    const { blockedModuleId } = tempStorage;
    let blockedCategoryData;
    
    if (blockedModuleId === moduleIds[1]) {
        blockedCategoryData = blockedData.blocked['hyperchill-sync'].categories;
    }else if (blockedModuleId === moduleIds[3]) {
        blockedCategoryData = blockedData.blocked['all-time'].categories;
    } else if (blockedModuleId === moduleIds[5]) {
        blockedCategoryData = blockedData.blocked['custom-time'].categories;
    } else {
        console.warn(`Unhandled module ID: ${blockedModuleId}`);
    }
    
    if (blockedCategoryData) {
        for (const item of blockedCategoryData) {
            if (item.value === category) {
                return false;
            }
        }
    }

    return true;
}

function validateWebsiteInput(domain: string, tempStorage: TempStorage): [boolean, string | null] {
    const domainPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
    let patternTest = domainPattern.test(domain);

    const { blockedModuleId } = tempStorage;
    let blockedWebsiteData;
    let duplicateWebsiteTest = true;
    
    if (blockedModuleId === 'hyperchill-sync-websites-module') {
        blockedWebsiteData = blockedData.blocked['hyperchill-sync'].websites;
    }else if (blockedModuleId === 'all-time-websites-module') {
        blockedWebsiteData = blockedData.blocked['all-time'].websites;
    } else if (blockedModuleId === 'custom-time-websites-module') {
        blockedWebsiteData = blockedData.blocked['custom-time'].websites;
    } else {
        console.warn(`Unhandled module ID: ${blockedModuleId}`);
    }
    
    blockedWebsiteData?.forEach((item) => {
        if (item.value === domain) {
            duplicateWebsiteTest = false;
        }
    })
    
    let lengthTest = true;
    if (domain.length > 253) {
        lengthTest = false;
    }

    let errorType: string | null = null;
    if (!patternTest || !lengthTest) {
        errorType = 'invalid-input'
    } else if (!duplicateWebsiteTest) {
        errorType = 'duplicate-website'
    }


    return [patternTest && duplicateWebsiteTest && lengthTest, errorType];
}

export function updateBlockedPage(tempStorage: TempStorage): void {

    // Clear Previous Contents of blocked grid
    blockedGrid.innerHTML = '';
    blockedModuleId = tempStorage.blockedModuleId;

    if (blockedModuleId !== null) {
        // populate blockedGrid
        let blockedArr = storageDict[blockedModuleId];
        blockedArr?.forEach((item) => {
            const blockedValueDiv = document.createElement('div');
            blockedValueDiv.textContent = item.value;
            blockedValueDiv.className = 'break-words'; // that should be fine

            const timeSinceValueDiv = document.createElement('div');
            timeSinceValueDiv.textContent = getTimeStrFromDate(item.date); // Assuming a static value for demonstration

            const buttonDiv = document.createElement('div');
            const removeButton = document.createElement('button');
            removeButton.className = 'remove-btn bg-red-500 text-white p-1 rounded';
            removeButton.textContent = 'Remove';
            buttonDiv.appendChild(removeButton);

            blockedGrid.appendChild(blockedValueDiv);
            blockedGrid.appendChild(timeSinceValueDiv);
            blockedGrid.appendChild(buttonDiv);
        });
    } else {
        console.error('blockedModuleId is null');
    }
}

function getTimeStrFromDate(itemDate: number): string {
    let timeElapsed = Date.now() - itemDate;
    
    const seconds = Math.floor(timeElapsed / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const years = Math.floor(days / 365);
    
    if (years > 0) {
        return `${years} year${years > 1 ? 's' : ''}`;
    } else if (weeks > 0) {
        return `${weeks} week${weeks > 1 ? 's' : ''}`;
    } else if (days > 0) {
        return `${days} day${days > 1 ? 's' : ''}`;
    } else if (hours > 0) {
        return `${hours} hour${hours > 1 ? 's' : ''}`;
    } else if (minutes > 0) {
        return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else {
        return `${seconds} second${seconds > 1 ? 's' : ''}`;
    }
}