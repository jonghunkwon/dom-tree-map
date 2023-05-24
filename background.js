const previousScripts = {};
async function getTabData(storageKey, callback) {
    return chrome.storage.sync.get([storageKey]).then((result) => {
        const data = result[storageKey] || {};
        callback(data);
    });
}

chrome.action.onClicked.addListener(async (tab) => {
    const tabId = tab.id;
    const storageKey = `tabStorage-${tabId}`;
    const currentScripts = ['content_script/contentscript.js'];
    let optionData = {};

    await getTabData(storageKey, (data) => {
        optionData = data;
    })

    if (!previousScripts[tabId]) {
        chrome.scripting.executeScript({ target: { tabId }, files: currentScripts }, function() {
            previousScripts[tabId] = true;
        });
    }

    chrome.storage.sync.set({
        [storageKey]: {
            ...optionData,
            isShowController: !optionData.isShowController,
        }
    }, () => {
        chrome.tabs.sendMessage(tabId, { action: "semanticHandlerClick", storageKey });
    })
});

chrome.tabs.onRemoved.addListener(async function(tabId, removeInfo) {
    const storageKey = `tabStorage-${tabId}`;
    chrome.storage.sync.set({
        [storageKey]: {
            ...optionData,
            isShowController: false,
        }
    }, () => {
        chrome.tabs.sendMessage(tabId, { action: "semanticHandlerClick", storageKey });
        delete previousScripts[tabId];
    })
    
});
  
chrome.tabs.onUpdated.addListener(async function(tabId, changeInfo, tab) {
    const storageKey = `tabStorage-${tabId}`;
    let optionData = {};

    await getTabData(storageKey, (data) => {
        optionData = data;
    })

    if (changeInfo.status === "complete") {
        chrome.storage.sync.set({
            [storageKey]: {
                ...optionData,
                isShowController: false,
            }
        }, () => {
            delete previousScripts[tabId];
        })

    }
});