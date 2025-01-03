document.addEventListener('DOMContentLoaded', () => {
    const hyperchillSyncModule = document.getElementById('hyperchill-sync-module') as HTMLElement;
    const allTimeModule = document.getElementById('all-time-module') as HTMLElement;
    const customTimeModule = document.getElementById('custom-time-module') as HTMLElement;
    
    const homeContents = document.getElementById('home-contents') as HTMLElement;
    const hyperchillSyncContents = document.getElementById('hyperchill-sync-contents') as HTMLElement;
    const allTimeContents = document.getElementById('all-time-contents') as HTMLElement;
    const customTimeContents = document.getElementById('custom-time-contents') as HTMLElement;
    
    const backBtns = document.querySelectorAll('.back-btn') as NodeListOf<HTMLElement>;

    // Hyperchill.io Sync
    const hyperchillSyncWebsitesModule = document.getElementById('hyperchill-sync-websites-module') as HTMLElement;
    const hyperchillSyncCategoriesModule = document.getElementById('hyperchill-sync-categories-module') as HTMLElement;

    // All Time Contents
    const allTimeWebsitesModule = document.getElementById('all-time-websites-module') as HTMLElement;
    const allTimeCategoriesModule = document.getElementById('all-time-categories-module') as HTMLElement;

    // Custom Time Contents
    const customTimeWebsitesModule = document.getElementById('custom-time-websites-module') as HTMLElement;
    const customTimeCategoriesModule = document.getElementById('custom-time-categories-module') as HTMLElement;

    // Blocked page
    const blockedPageType = document.getElementById('blocked-page-type') as HTMLElement;
    const websiteCategory = document.getElementById('website-category') as HTMLElement;
    const websiteInputContainer = document.getElementById('website-input-container') as HTMLElement;
    const categoryInputContainer = document.getElementById('category-input-container') as HTMLElement;

    type BlockedPageElements = {
        blockedPageType: HTMLElement;
        websiteCategory: HTMLElement;
        websiteInputContainer: HTMLElement;
        categoryInputContainer: HTMLElement;
    };
    
    const blockedPageElements: BlockedPageElements = {
        blockedPageType,
        websiteCategory,
        websiteInputContainer,
        categoryInputContainer
    };

    type ModulePair = [HTMLElement, HTMLElement];
    const modules: ModulePair[] = [
        [hyperchillSyncWebsitesModule, hyperchillSyncContents],
        [hyperchillSyncCategoriesModule, hyperchillSyncContents],
        [allTimeWebsitesModule, allTimeContents],
        [allTimeCategoriesModule, allTimeContents],
        [customTimeWebsitesModule, customTimeContents],
        [customTimeCategoriesModule, customTimeContents]
    ];

    // Blocked Page
    const blockedPage = document.getElementById('blocked-page') as HTMLElement;

    const contents = [
        homeContents,
        hyperchillSyncContents,
        allTimeContents,
        customTimeContents
    ];

    // Holds the id of the most recently selected contents page
    type TempStorage = { 
        contentsId: string | null; 
        blockedModuleId: string | null; 
    };

    const tempStorage: TempStorage = {
        contentsId: null,
        blockedModuleId: null
    };

    hyperchillSyncModule.addEventListener('click', () => {
        displayContents(hyperchillSyncContents, contents, tempStorage);
    });
    
    allTimeModule.addEventListener('click', () => {
        // Open New Page
        displayContents(allTimeContents, contents, tempStorage);
    })
    
    customTimeModule.addEventListener('click', () => {
        // Open New Page
        displayContents(customTimeContents, contents, tempStorage);
    })

    modules.forEach(([module, contents]) => {
        module.addEventListener('click', () => {
            tempStorage.blockedModuleId = module.id; // 1st
            hideDisplayPage(contents, blockedPage); // 2nd

            // Dynamic adjustments
            populateBlockedPage(modules, blockedPageElements);
        });
    });

    backBtns.forEach((backBtn) => {
        backBtn.addEventListener('click', () => {
            if (backBtn.id == 'blocked-page-back-btn') {
                // Return to the previously selected option (HC Sync, All Time, or Custom Time)
                if (tempStorage.contentsId) {
                    let prevContentsPage = document.getElementById(tempStorage.contentsId);
                    if (prevContentsPage) {
                        hideDisplayPage(blockedPage, prevContentsPage);
                    }
                }
            } else {
                displayContents(homeContents, contents, tempStorage)
            }
        })
    })

    // // // // // // //
    // Helper Functions
    // // // // // // //
    
    function populateBlockedPage(modules: [HTMLElement, HTMLElement][], blockedPageElements: BlockedPageElements): void {
        // Hyperchill.io Sync Websites
        if (tempStorage.blockedModuleId === modules[0][0].id) {
            console.log('Hyperchill.io Sync Websites');
            populateHyperchillSyncWebsites(blockedPageElements);
        } else if (tempStorage.blockedModuleId === modules[1][0].id) {
            console.log('Hyperchill.io Sync Categories');
            populateHyperchillSyncCategories(blockedPageElements);
        } else if (tempStorage.blockedModuleId === modules[2][0].id) {
            console.log('All Time Websites');
            populateAllTimeWebsites(blockedPageElements);
        } else if (tempStorage.blockedModuleId === modules[3][0].id) {
            console.log('All Time Categories');
            populateAllTimeCategories(blockedPageElements);
        } else if (tempStorage.blockedModuleId === modules[4][0].id) {
            console.log('Custom Time Websites');
            populateCustomTimeWebsites(blockedPageElements);
        } else if (tempStorage.blockedModuleId === modules[5][0].id) {
            console.log('Custom Time Categories');
            populateCustomTimeCategories(blockedPageElements);
        }
    }

    function populateHyperchillSyncWebsites(blockedPageElements: BlockedPageElements): void {
        blockedPageElements.blockedPageType.innerText = "Blocked Websites | Hyperchill.io Sync";
        blockedPageElements.websiteCategory.innerText = "Website";
        showWebsiteInput(blockedPageElements);
    }

    function populateHyperchillSyncCategories(blockedPageElements: BlockedPageElements): void {
        blockedPageElements.blockedPageType.innerText = "Blocked Categories | Hyperchill.io Sync";
        blockedPageElements.websiteCategory.innerText = "Category";
        showCategoryInput(blockedPageElements);
    }

    function populateAllTimeWebsites(blockedPageElements: BlockedPageElements): void {
        blockedPageElements.blockedPageType.innerText = "Blocked Websites | All Time";
        blockedPageElements.websiteCategory.innerText = "Website";
        showWebsiteInput(blockedPageElements);
    }

    function populateAllTimeCategories(blockedPageElements: BlockedPageElements): void {
        blockedPageElements.blockedPageType.innerText = "Blocked Categories | All Time";
        blockedPageElements.websiteCategory.innerText = "Category";
        showCategoryInput(blockedPageElements);
    }

    function populateCustomTimeWebsites(blockedPageElements: BlockedPageElements): void {
        blockedPageElements.blockedPageType.innerText = "Blocked Websites | Custom Time";
        blockedPageElements.websiteCategory.innerText = "Website";
        showWebsiteInput(blockedPageElements);
    }

    function populateCustomTimeCategories(blockedPageElements: BlockedPageElements): void {
        blockedPageElements.blockedPageType.innerText = "Blocked Categories | Custom Time";
        blockedPageElements.websiteCategory.innerText = "Category";
        showCategoryInput(blockedPageElements);
    }

    function showCategoryInput(blockedPageElements: BlockedPageElements): void {
        blockedPageElements.websiteInputContainer.classList.replace('flex', 'hidden');
        blockedPageElements.categoryInputContainer.classList.replace('hidden', 'flex');
    }

    function showWebsiteInput(blockedPageElements: BlockedPageElements): void {
        blockedPageElements.categoryInputContainer.classList.replace('flex', 'hidden');
        blockedPageElements.websiteInputContainer.classList.replace('hidden', 'flex');
    }
    
    // Deals with opening/ closing Hyperchill.io Sync, All Time, and Custom Time pages and the final Blocked Page
    function hideDisplayPage(hidePage: HTMLElement, displayPage: HTMLElement): void {
        hidePage.classList.replace('flex', 'hidden');
        displayPage.classList.replace('hidden', 'flex');
    }
    
    // Deals with showing/ hiding pages when initial modules are selected (e.g. Hyperchill.io Sync, All Time, and Custom Time)
    function displayContents(element: HTMLElement, contents: HTMLElement[], tempStorage: TempStorage): void {
        contents.forEach(content => {
            if (content === element) {
                content.classList.replace('hidden', 'flex');
            } else {
                content.classList.replace('flex', 'hidden');
            }
        });
    
        tempStorage.contentsId = element.id;
    }
});
