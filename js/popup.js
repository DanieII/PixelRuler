const image = document.querySelector("img");

function sendToggleRulerMessage(state) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, { command: state });
  });
}

function setRulerImage(state) {
  image.src = state ? "../images/ruler.png" : "../images/ruler-inactive.png";
}

document.addEventListener("DOMContentLoaded", function () {
  const isActiveSaved = localStorage.getItem("isActive");

  if (isActiveSaved != "null") {
    setRulerImage(isActiveSaved === "true");
  }
});

image.addEventListener("click", function (e) {
  const isActive = e.target.src.includes("inactive") ? false : true;
  const newState = !isActive;

  localStorage.setItem("isActive", newState);
  sendToggleRulerMessage(newState);
  setRulerImage(newState);
});
