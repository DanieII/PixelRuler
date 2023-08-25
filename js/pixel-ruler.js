const cursorDot = document.createElement("div");
cursorDot.classList.add("cursor-dot");

const overlay = document.createElement("canvas");
overlay.classList.add("overlay");
overlay.width = window.innerWidth;
overlay.height = window.innerHeight;

const canvas = overlay.getContext("2d");
canvas.strokeStyle = "silver";
canvas.lineWidth = 2;
let draw = false;
let lineStart = { x: 0, y: 0 };

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const isActive = message.command;
  togglePixelRulerElements(isActive);
});

function getCurrentPosition(e) {
  return { x: e.clientX, y: e.clientY };
}

function calculatePixels(position) {
  const dx = lineStart.x - position.x;
  const dy = lineStart.y - position.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function addPixelCounter(position) {
  const pixelCounter = document.createElement("div");
  pixelCounter.classList.add("pixel-counter");
  document.body.appendChild(pixelCounter);

  const distance = calculatePixels(position);
  pixelCounter.textContent = `${distance.toFixed(2)} pixels`;

  const centerX = (lineStart.x + position.x) / 2;
  const centerY = (lineStart.y + position.y) / 2;
  pixelCounter.style.left = centerX + "px";
  pixelCounter.style.top = centerY + "px";
}

function removePixelCounter() {
  const pixelCounter = document.querySelector(".pixel-counter");
  if (pixelCounter) {
    pixelCounter.remove();
  }
}

function updateCursorDotPosition(e) {
  const { x, y } = getCurrentPosition(e);
  cursorDot.style.left = x + "px";
  cursorDot.style.top = y + "px";
}

function clearCanvas() {
  canvas.clearRect(0, 0, overlay.width, overlay.height);
}

function handleMouseDown(e) {
  draw = true;
  lineStart = getCurrentPosition(e);
}

function handleMouseMove(e) {
  updateCursorDotPosition(e);
  if (!draw) {
    return;
  }

  const position = getCurrentPosition(e);
  drawLine(position);
  removePixelCounter();
  addPixelCounter(position);
}

function drawLine(position) {
  clearCanvas();
  canvas.beginPath();
  canvas.moveTo(lineStart.x, lineStart.y);
  canvas.lineTo(position.x, position.y);
  canvas.stroke();
}

function handleMouseUp() {
  draw = false;
}

function togglePixelRulerElements(show) {
  const eventAction = show ? "addEventListener" : "removeEventListener";
  const bodyAction = show ? "appendChild" : "removeChild";

  document[eventAction]("mousemove", handleMouseMove);
  overlay[eventAction]("mousedown", handleMouseDown);
  overlay[eventAction]("mousemove", handleMouseMove);
  overlay[eventAction]("mouseup", handleMouseUp);
  document.body[bodyAction](cursorDot);
  document.body[bodyAction](overlay);
  removePixelCounter();
  clearCanvas();
}
