const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const worldWidth = 2000;
const worldHeight = 2000;

let humanX = 1200;
let humanY = 1000;

let ballX = 1000;
let ballY = 1000;

let towerX = 1400;
let towerY = 1000;

const towerRadius = 30;
let showMessage = false;

const radius = 20;
const speed = 5;

let hoverOffset = 0;
let hoverDirection = 1;

let cameraX = 0;
let cameraY = 0;

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Hover animation
  if (hoverOffset > 5) hoverDirection = -1;
  if (hoverOffset < -5) hoverDirection = 1;
  hoverOffset += hoverDirection * 0.2;

  // Ball follows human
  const followSpeed = 0.05;
  ballX += (humanX - ballX) * followSpeed;
  ballY += (humanY - ballY) * followSpeed;

  // Camera follows ball (edges only)
  const edgeMargin = 100;
  if (ballX - cameraX < edgeMargin) cameraX = ballX - edgeMargin;
  if (ballX - cameraX > canvas.width - edgeMargin)
    cameraX = ballX - (canvas.width - edgeMargin);
  if (ballY - cameraY < edgeMargin) cameraY = ballY - edgeMargin;
  if (ballY - cameraY > canvas.height - edgeMargin)
    cameraY = ballY - (canvas.height - edgeMargin);

  // Draw human (blue)
  ctx.beginPath();
  ctx.arc(humanX - cameraX, humanY - cameraY, 25, 0, Math.PI * 2);
  ctx.fillStyle = "blue";
  ctx.fill();
  ctx.closePath();

  // Check distance to tower
  const dx = ballX - towerX;
  const dy = ballY - towerY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  showMessage = distance < 80;

  // Draw glow aura around AI
  ctx.beginPath();
  ctx.arc(
    ballX - cameraX,
    ballY - cameraY + hoverOffset,
    radius + 10,
    0,
    Math.PI * 2
  );
  ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
  ctx.fill();
  ctx.closePath();

  // Draw AI ball (red)
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

  // Draw AI name above ball
  ctx.fillStyle = "black";
  ctx.font = "14px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(
    "ARC-7",
    ballX - cameraX,
    ballY - cameraY + hoverOffset - radius - 10
  );

  // Grid lines (optional visual)
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
}

document
  .getElementById("right")
  .addEventListener("click", () => (humanX += 10));

setInterval(draw, 16); // 60 FPS
