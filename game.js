const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const worldWidth = 2000;
const worldHeight = 2000;

let ballX = 1000;
let ballY = 1000;
const radius = 20;
const speed = 5;

let hoverOffset = 0;
let hoverDirection = 1;

let auraRadius = radius + 10;
let auraAlpha = 0.3;
let auraGrowing = true;

let cameraX = 0;
let cameraY = 0;

let moving = {
  up: false,
  down: false,
  left: false,
  right: false,
};

function updatePosition() {
  if (moving.up) ballY -= speed;
  if (moving.down) ballY += speed;
  if (moving.left) ballX -= speed;
  if (moving.right) ballX += speed;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  updatePosition();

  // Hover animation
  if (hoverOffset > 5) hoverDirection = -1;
  if (hoverOffset < -5) hoverDirection = 1;
  hoverOffset += hoverDirection * 0.2;

  // Radiating aura animation
  if (auraGrowing) {
    auraRadius += 0.5;
    auraAlpha -= 0.01;
    if (auraAlpha <= 0.05) auraGrowing = false;
  } else {
    auraRadius = radius + 10;
    auraAlpha = 0.3;
    auraGrowing = true;
  }

  // Camera follow logic
  const edgeMargin = 100;
  if (ballX - cameraX < edgeMargin) cameraX = ballX - edgeMargin;
  if (ballX - cameraX > canvas.width - edgeMargin)
    cameraX = ballX - (canvas.width - edgeMargin);
  if (ballY - cameraY < edgeMargin) cameraY = ballY - edgeMargin;
  if (ballY - cameraY > canvas.height - edgeMargin)
    cameraY = ballY - (canvas.height - edgeMargin);

  // Grid background
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

  // Radiating aura
  ctx.beginPath();
  ctx.arc(
    ballX - cameraX,
    ballY - cameraY + hoverOffset,
    auraRadius,
    0,
    Math.PI * 2
  );
  ctx.fillStyle = `rgba(0, 200, 255, ${auraAlpha})`;
  ctx.fill();
  ctx.closePath();

  // Base glow aura
  ctx.beginPath();
  ctx.arc(
    ballX - cameraX,
    ballY - cameraY + hoverOffset,
    radius + 10,
    0,
    Math.PI * 2
  );
  ctx.fillStyle = "rgba(0, 200, 255, 0.2)";
  ctx.fill();
  ctx.closePath();

  // Main body of ARC-7
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

  // ARC-7 label
  ctx.font = "14px Arial";
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.fillText(
    "ARC-7",
    ballX - cameraX,
    ballY - cameraY + hoverOffset - radius - 10
  );
}

setInterval(draw, 16);

// Touch + Mouse control for D-pad
function handleDirectionStart(dir) {
  moving[dir] = true;
}

function handleDirectionStop(dir) {
  moving[dir] = false;
}

["up", "down", "left", "right"].forEach((dir) => {
  const btn = document.getElementById(dir);
  btn.addEventListener("touchstart", () => handleDirectionStart(dir));
  btn.addEventListener("touchend", () => handleDirectionStop(dir));
  btn.addEventListener("mousedown", () => handleDirectionStart(dir));
  btn.addEventListener("mouseup", () => handleDirectionStop(dir));
  btn.addEventListener("mouseleave", () => handleDirectionStop(dir));
});
