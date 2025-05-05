const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const worldWidth = 2000;
const worldHeight = 2000;

const arc7 = { x: 1000, y: 1000, radius: 20, color: "crimson" };
const companion = { x: 970, y: 980, radius: 10, glow: 0 };

let cameraX = 0;
let cameraY = 0;
const speed = 3;

let moveUp = false,
  moveDown = false,
  moveLeft = false,
  moveRight = false;

const backgroundImage = new Image();
backgroundImage.src = "ancient_ruins.jpg"; // Make sure this image is in your folder

const particles = Array.from({ length: 50 }, () => ({
  x: Math.random() * worldWidth,
  y: Math.random() * worldHeight,
  size: Math.random() * 2 + 1,
  speed: Math.random() * 0.3 + 0.1,
}));

function updatePositions() {
  if (moveUp) arc7.y -= speed;
  if (moveDown) arc7.y += speed;
  if (moveLeft) arc7.x -= speed;
  if (moveRight) arc7.x += speed;

  // Companion tracks to ARC-7's left side
  companion.x += (arc7.x - 50 - companion.x) * 0.05;
  companion.y += (arc7.y - companion.y) * 0.05;
}

function drawCharacter(character, color) {
  ctx.beginPath();
  ctx.arc(
    character.x - cameraX,
    character.y - cameraY,
    character.radius,
    0,
    Math.PI * 2
  );
  ctx.fillStyle = color;
  ctx.shadowColor = "white";
  ctx.shadowBlur = character === companion ? 20 : 0;
  ctx.fill();
  ctx.shadowBlur = 0;
}

function drawParticles() {
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  particles.forEach((p) => {
    p.y -= p.speed;
    if (p.y < 0) p.y = worldHeight;
    ctx.beginPath();
    ctx.arc(p.x - cameraX, p.y - cameraY, p.size, 0, Math.PI * 2);
    ctx.fill();
  });
}

function draw() {
  updatePositions();
  cameraX = arc7.x - canvas.width / 2;
  cameraY = arc7.y - canvas.height / 2;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(backgroundImage, -cameraX, -cameraY, worldWidth, worldHeight);
  drawParticles();
  drawCharacter(companion, "aqua");
  drawCharacter(arc7, "crimson");
}

setInterval(draw, 16);

// Touch + Mouse input for D-pad
function setupDpad(id, pressFn, releaseFn) {
  const el = document.getElementById(id);
  el.addEventListener("touchstart", (e) => {
    e.preventDefault();
    pressFn();
  });
  el.addEventListener("touchend", (e) => {
    e.preventDefault();
    releaseFn();
  });
  el.addEventListener("mousedown", (e) => {
    e.preventDefault();
    pressFn();
  });
  el.addEventListener("mouseup", (e) => {
    e.preventDefault();
    releaseFn();
  });
  el.addEventListener("mouseleave", (e) => {
    e.preventDefault();
    releaseFn();
  });
}

setupDpad(
  "up",
  () => (moveUp = true),
  () => (moveUp = false)
);
setupDpad(
  "down",
  () => (moveDown = true),
  () => (moveDown = false)
);
setupDpad(
  "left",
  () => (moveLeft = true),
  () => (moveLeft = false)
);
setupDpad(
  "right",
  () => (moveRight = true),
  () => (moveRight = false)
);

// Keyboard input
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") moveUp = true;
  if (e.key === "ArrowDown") moveDown = true;
  if (e.key === "ArrowLeft") moveLeft = true;
  if (e.key === "ArrowRight") moveRight = true;
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowUp") moveUp = false;
  if (e.key === "ArrowDown") moveDown = false;
  if (e.key === "ArrowLeft") moveLeft = false;
  if (e.key === "ArrowRight") moveRight = false;
});
