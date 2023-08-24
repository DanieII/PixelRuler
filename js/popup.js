const image = document.querySelector("img");

function sendToggleRulerMessage(state) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, { command: state });
  });
}

image.addEventListener("click", function (e) {
  const isActive = e.target.src.includes("inactive") ? false : true;

  e.target.src = isActive
    ? "../images/ruler-inactive.png"
    : "../images/ruler.png";
  sendToggleRulerMessage(!isActive);
});
