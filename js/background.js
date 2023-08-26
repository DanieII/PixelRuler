function sendInactiveImageMessage() {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      chrome.tabs.sendMessage(tab.id, { command: false });
    });
  });
}

chrome.tabs.onActivated.addListener((activeInfo) => {
  sendInactiveImageMessage();
  localStorage.setItem("isActive", false);
});
