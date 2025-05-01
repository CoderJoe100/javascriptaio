const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const worldWidth = 2000;
const worldHeight = 2000;

let ballX = 1000;
let ballY = 1000;
let cameraX = 0;
let cameraY = 0;

const radius = 20;
const speed = 3;

let hoverOffset = 0;
let hoverDirection = 1;
let glowPulse = 0;
let glowDirection = 1;

let moveUp = false;
let moveDown = false;
let moveLeft = false;
let moveRight = false;

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update hover
  if (hoverOffset > 5) hoverDirection = -1;
  if (hoverOffset < -5) hoverDirection = 1;
  hoverOffset += hoverDirection * 0.2;

  // Update glow pulse
  if (glowPulse > 10) glowDirection = -1;
  if (glowPulse < 0) glowDirection = 1;
  glowPulse += glowDirection * 0.1;

  // Move ARC-7
  if (moveUp) ballY -= speed;
  if (moveDown) ballY += speed;
  if (moveLeft) ballX -= speed;
  if (moveRight) ballX += speed;

  // Camera follows ball
  const edgeMargin = 100;
  if (ballX - cameraX < edgeMargin) cameraX = ballX - edgeMargin;
  if (ballX - cameraX > canvas.width - edgeMargin)
    cameraX = ballX - (canvas.width - edgeMargin);
  if (ballY - cameraY < edgeMargin) cameraY = ballY - edgeMargin;
  if (ballY - cameraY > canvas.height - edgeMargin)
    cameraY = ballY - (canvas.height - edgeMargin);

  // Draw grid
  ctx.strokeStyle = "#eee";
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

  // Draw glow
  ctx.beginPath();
  ctx.arc(
    ballX - cameraX,
    ballY - cameraY + hoverOffset,
    radius + 10 + glowPulse,
    0,
    Math.PI * 2
  );
  ctx.fillStyle = "rgba(255, 0, 0, 0.15)";
  ctx.fill();
  ctx.closePath();

  // Draw ball
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

  // Label
  ctx.fillStyle = "black";
  ctx.font = "12px Arial";
  ctx.textAlign = "center";
  ctx.fillText("ARC-7", ballX - cameraX, ballY - cameraY + hoverOffset - 25);
}

setInterval(draw, 16);

// Touch D-pad controls
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
