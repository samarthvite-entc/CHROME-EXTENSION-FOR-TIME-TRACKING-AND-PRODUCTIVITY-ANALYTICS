let activeTabId = null;
let startTime = null;


chrome.tabs.onActivated.addListener(activeInfo => {
    updateTimeSpent();
    activeTabId = activeInfo.tabId;
    startTime = Date.now();
});


chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab.active && changeInfo.status === "complete") {
        updateTimeSpent();
        activeTabId = tabId;
        startTime = Date.now();
    }
});


chrome.windows.onFocusChanged.addListener(() => {
    updateTimeSpent();
    startTime = Date.now();
});

function updateTimeSpent() {
    if (!activeTabId || !startTime) return;

    chrome.tabs.get(activeTabId, tab => {
        if (!tab.url || tab.url.startsWith("chrome://")) return;

        const url = new URL(tab.url);
        const domain = url.hostname;
        const timeSpent = Math.floor((Date.now() - startTime) / 1000);

        chrome.storage.local.get([domain], result => {
            let total = result[domain] || 0;
            total += timeSpent;

            chrome.storage.local.set({ [domain]: total });

            sendToBackend(domain, timeSpent);
        });
    });
}

function sendToBackend(domain, timeSpent) {
    fetch("http://localhost:5000/api/time", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            userId: "user1",
            domain,
            timeSpent,
            date: new Date().toISOString().split("T")[0]
        })
    }).catch(err => console.log("Server not reachable"));
}
