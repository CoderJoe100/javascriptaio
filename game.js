// game.js
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const worldWidth = 2000;
const worldHeight = 2000;

let ballX = 1000;
let ballY = 1000;
const radius = 20;
const speed = 2;

let hoverOffset = 0;
let hoverDirection = 1;

let cameraX = 0;
let cameraY = 0;

let moveUp = false,
  moveDown = false,
  moveLeft = false,
  moveRight = false;

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update hover
  if (hoverOffset > 5) hoverDirection = -1;
  if (hoverOffset < -5) hoverDirection = 1;
  hoverOffset += hoverDirection * 0.2;

  // Move ARC-7
  if (moveUp) ballY -= speed;
  if (moveDown) ballY += speed;
  if (moveLeft) ballX -= speed;
  if (moveRight) ballX += speed;

  // Camera follow
  cameraX = ballX - canvas.width / 2;
  cameraY = ballY - canvas.height / 2;

  // Background grid
  ctx.strokeStyle = "#ddd";
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

  // Glow
  ctx.beginPath();
  ctx.arc(
    ballX - cameraX,
    ballY - cameraY + hoverOffset,
    radius + 12,
    0,
    Math.PI * 2
  );
  ctx.fillStyle = "rgba(0, 180, 255, 0.2)";
  ctx.fill();
  ctx.closePath();

  // ARC-7
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
  ctx.font = "14px sans-serif";
  ctx.fillText(
    "ARC-7",
    ballX - cameraX - 20,
    ballY - cameraY + hoverOffset - 25
  );
}

setInterval(draw, 16);

// Touch controls
document
  .getElementById("up")
  .addEventListener("touchstart", () => (moveUp = true));
document
  .getElementById("up")
  .addEventListener("touchend", () => (moveUp = false));

document
  .getElementById("down")
  .addEventListener("touchstart", () => (moveDown = true));
document
  .getElementById("down")
  .addEventListener("touchend", () => (moveDown = false));

document
  .getElementById("left")
  .addEventListener("touchstart", () => (moveLeft = true));
document
  .getElementById("left")
  .addEventListener("touchend", () => (moveLeft = false));

document
  .getElementById("right")
  .addEventListener("touchstart", () => (moveRight = true));
document
  .getElementById("right")
  .addEventListener("touchend", () => (moveRight = false));
