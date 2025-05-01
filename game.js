const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// World size
const worldWidth = 2000;
const worldHeight = 2000;

// Game objects and movement
let ballX = 1000;
let ballY = 1000;
const radius = 20;
const speed = 5;
let hoverOffset = 0;
let hoverDirection = 1;

// Camera
let cameraX = 0;
let cameraY = 0;

// Touch-based movement flags
let movingUp = false;
let movingDown = false;
let movingLeft = false;
let movingRight = false;

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Hover effect
  if (hoverOffset > 5) hoverDirection = -1;
  if (hoverOffset < -5) hoverDirection = 1;
  hoverOffset += hoverDirection * 0.2;

  // Movement
  if (movingUp) ballY -= speed;
  if (movingDown) ballY += speed;
  if (movingLeft) ballX -= speed;
  if (movingRight) ballX += speed;

  // Camera tracking
  const edgeMargin = 100;
  if (ballX - cameraX < edgeMargin) cameraX = ballX - edgeMargin;
  if (ballX - cameraX > canvas.width - edgeMargin)
    cameraX = ballX - (canvas.width - edgeMargin);
  if (ballY - cameraY < edgeMargin) cameraY = ballY - edgeMargin;
  if (ballY - cameraY > canvas.height - edgeMargin)
    cameraY = ballY - (canvas.height - edgeMargin);

  // Grid
  ctx.strokeStyle = "#ccc";
  for (let x = 0; x < worldWidth; x += 100) {
    ctx.beginPath();
    ctx.moveTo(x - cameraX, 0 - cameraY);
    ctx.lineTo(x - cameraX, worldHeight - cameraY);
    ctx.stroke();
  }
  for (let y = 0; y < worldHeight; y += 100) {
    ctx.beginPath();
    ctx.moveTo(0 - cameraX, y - cameraY);
    ctx.lineTo(worldWidth - cameraX, y - cameraY);
    ctx.stroke();
  }

  // Draw ARC-7
  ctx.beginPath();
  ctx.arc(
    ballX - cameraX,
    ballY - cameraY + hoverOffset,
    radius,
    0,
    Math.PI * 2
  );
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.closePath();

  ctx.fillStyle = "black";
  ctx.font = "12px Arial";
  ctx.fillText(
    "ARC-7",
    ballX - cameraX - 18,
    ballY - cameraY + hoverOffset - 30
  );
}

setInterval(draw, 16);

// Touch listeners
document
  .getElementById("up")
  .addEventListener("touchstart", () => (movingUp = true));
document
  .getElementById("up")
  .addEventListener("touchend", () => (movingUp = false));

document
  .getElementById("down")
  .addEventListener("touchstart", () => (movingDown = true));
document
  .getElementById("down")
  .addEventListener("touchend", () => (movingDown = false));

document
  .getElementById("left")
  .addEventListener("touchstart", () => (movingLeft = true));
document
  .getElementById("left")
  .addEventListener("touchend", () => (movingLeft = false));

document
  .getElementById("right")
  .addEventListener("touchstart", () => (movingRight = true));
document
  .getElementById("right")
  .addEventListener("touchend", () => (movingRight = false));
