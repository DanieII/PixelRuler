chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const isActive = message.command;
  if (isActive) {
    showRuler();
  } else {
    hideRuler();
  }
});

function showRuler() {
  const ruler = document.createElement("div");
  ruler.classList.add("pixel-ruler");

  const cursorDot = document.createElement("div");
  cursorDot.classList.add("cursor-dot");

  document.addEventListener("mousemove", (e) => {
    cursorDot.style.left = e.clientX + "px";
    cursorDot.style.top = e.clientY + "px";
  });

  document.body.appendChild(ruler);
  document.body.appendChild(cursorDot);
}

function hideRuler() {
  document.body.removeChild(document.querySelector(".pixel-ruler"));
}
