const previousScripts = {};
async function getTabData(storageKey, callback) {
    return chrome.storage.sync.get([storageKey]).then((result) => {
        console.log('result', result);
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
        console.log('data', data);
        optionData = data;
    })

    if (!previousScripts[tabId]) {
        chrome.scripting.executeScript({ target: { tabId }, files: currentScripts }, function() {
            previousScripts[tabId] = true;
        });
    }

    console.log('optionData', optionData);

    chrome.storage.sync.set({
        [storageKey]: {
            ...optionData,
            isShowController: !optionData.isShowController,
        }
    }, () => {
        chrome.tabs.sendMessage(tabId, { action: "semanticHandlerClick", storageKey });
    })
});

  