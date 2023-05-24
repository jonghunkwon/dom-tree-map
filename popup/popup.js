const handleShowSemanticTree = document.getElementById('enableSemanticTree').addEventListener('click', (event) => {
    const checked = event.currentTarget.checked;
    // browser.runtime.sendMessage({
    //     tabId: chrome.tabId,
    //     message: 'test',
    //     options: {
    //         state: event.currentTarget.checked
    //     }
    // })

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.storage.local.set({
            semantic: checked,
        }, function(){
            //콜백
            chrome.tabs.sendMessage(tabs[0].id, {action: "semanticHandlerClick" });
        });
        
      });
    // chrome.runtime.sendMessage({action: "semanticHandlerClick", state: event.currentTarget.checked }, /* callback */);
});

chrome.runtime.onConnect.addListener((tabs) => {
    console.log('tabs', tabs);
    chrome.storage.local.get(['semantic'], function(){
        //콜백
        document.getElementById('enableSemanticTree').checked = true;
    });
})

