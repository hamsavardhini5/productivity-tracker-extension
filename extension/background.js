// Background script for tracking tab activity and sending data to backend

let activeTabId = null;
let activeStartTime = null;
let siteTimes = {};


// Helper to get domain from URL, ignore chrome:// and about:blank
function getDomain(url) {
  try {
    if (!url || url.startsWith('chrome://') || url.startsWith('chrome-extension://') || url.startsWith('about:')) {
      return null;
    }
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

// Listen for tab activation

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  if (activeTabId !== null && activeStartTime !== null) {
    const endTime = Date.now();
    try {
      const tab = await chrome.tabs.get(activeTabId);
      const domain = getDomain(tab.url);
      if (domain) {
        siteTimes[domain] = (siteTimes[domain] || 0) + (endTime - activeStartTime);
      }
    } catch {}
  }
  activeTabId = activeInfo.tabId;
  try {
    const tab = await chrome.tabs.get(activeTabId);
    const domain = getDomain(tab.url);
    if (domain) {
      activeStartTime = Date.now();
    } else {
      activeStartTime = null;
    }
  } catch {
    activeStartTime = null;
  }
});

// Listen for tab updates (URL changes)

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tabId === activeTabId && changeInfo.url) {
    const endTime = Date.now();
    const domain = getDomain(changeInfo.url);
    if (domain && activeStartTime) {
      siteTimes[domain] = (siteTimes[domain] || 0) + (endTime - activeStartTime);
      activeStartTime = Date.now();
    } else {
      activeStartTime = null;
    }
  }
});

// Listen for window focus changes

chrome.windows.onFocusChanged.addListener((windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    // User left Chrome
    if (activeTabId !== null && activeStartTime !== null) {
      chrome.tabs.get(activeTabId, (tab) => {
        const domain = getDomain(tab.url);
        if (domain) {
          siteTimes[domain] = (siteTimes[domain] || 0) + (Date.now() - activeStartTime);
        }
      });
    }
    activeTabId = null;
    activeStartTime = null;
  } else {
    // User returned to Chrome
    if (activeTabId !== null) {
      chrome.tabs.get(activeTabId, (tab) => {
        const domain = getDomain(tab.url);
        if (domain) {
          activeStartTime = Date.now();
        } else {
          activeStartTime = null;
        }
      });
    }
  }
});


// Periodically update time for the active tab
setInterval(async () => {
  if (activeTabId !== null && activeStartTime !== null) {
    try {
      const tab = await chrome.tabs.get(activeTabId);
      const domain = getDomain(tab.url);
      if (domain) {
        const now = Date.now();
        siteTimes[domain] = (siteTimes[domain] || 0) + (now - activeStartTime);
        activeStartTime = now;
      }
    } catch {}
  }
}, 1000); // every second

// Expose a message API to get tracked times and send to backend
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GET_SITE_TIMES') {
    sendResponse({ siteTimes });
  } else if (request.type === 'SEND_TO_BACKEND') {
    fetch('http://localhost:3000/api/times', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ siteTimes })
    }).then(() => {
      siteTimes = {};
      sendResponse({ status: 'ok' });
    }).catch(() => {
      sendResponse({ status: 'error' });
    });
    return true; // async
  }
});
