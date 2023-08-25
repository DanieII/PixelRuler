const cursorDot = document.createElement("div");
cursorDot.classList.add("cursor-dot");

const ruler = document.createElement("div");
ruler.classList.add("pixel-ruler");

const overlay = document.createElement("canvas");
overlay.classList.add("overlay");
overlay.width = window.innerWidth;
overlay.height = window.innerHeight;

const canvas = overlay.getContext("2d");
canvas.strokeStyle = "blue";
canvas.lineWidth = 1;
let draw = false;
let lineStart = { x: 0, y: 0 };

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const isActive = message.command;
  togglePixelRulerElements(isActive);
});

function calculatePixels(position) {
  const dx = position.x - position.x;
  const dy = position.y - position.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function addPixelCounter() {
  const pixelCounter = document.createElement("div");
  pixelCounter.classList.add("pixel-counter");

  const distance = calculatePixels(getCurrentPosition());
  pixelCounter.textContent = `${distance.toFixed(2)} pixels`;

  const centerX = (lineStart.x + lineEnd.x) / 2;
  const centerY = (lineStart.y + lineEnd.y) / 2;
  pixelCounter.style.left = centerX + "px";
  pixelCounter.style.top = centerY + "px";
  document.body.appendChild(pixelCounter);
}

function getCurrentPosition(e) {
  return { x: e.clientX, y: e.clientY };
}

function updateCursorDotPosition(e) {
  const { x, y } = getCurrentPosition(e);
  cursorDot.style.left = x + "px";
  cursorDot.style.top = y + "px";
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

  drawLine(getCurrentPosition(e));
  addPixelCounter();
}

function drawLine(position) {
  canvas.clearRect(0, 0, overlay.width, overlay.height);
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
  document.body[bodyAction](ruler);
  document.body[bodyAction](cursorDot);
  document.body[bodyAction](overlay);
}
