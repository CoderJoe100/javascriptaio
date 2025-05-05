const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Allow keyboard focus
canvas.setAttribute("tabindex", "0");
canvas.focus();

const worldWidth = 2000;
const worldHeight = 2000;
const speed = 2;

let cameraX = 0;
let cameraY = 0;

let moveUp = false,
  moveDown = false,
  moveLeft = false,
  moveRight = false;

let arc7 = { x: 1000, y: 1000, radius: 20, hoverOffset: 0, hoverDirection: 1 };
let companion = {
  x: 960,
  y: 1000,
  radius: 12,
  hoverOffset: 0,
  hoverDirection: 1,
};

// Background placeholder
function drawBackground() {
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Hovering motion
function updateHover(character) {
  if (character.hoverOffset > 5) character.hoverDirection = -1;
  if (character.hoverOffset < -5) character.hoverDirection = 1;
  character.hoverOffset += character.hoverDirection * 0.3;
}

function updatePositions() {
  if (moveUp) arc7.y -= speed;
  if (moveDown) arc7.y += speed;
  if (moveLeft) arc7.x -= speed;
  if (moveRight) arc7.x += speed;

  cameraX = arc7.x - canvas.width / 2;
  cameraY = arc7.y - canvas.height / 2;

  // Companion moves to ARC-7's side
  let targetX = arc7.x - 40;
  let targetY = arc7.y - 40;
  companion.x += (targetX - companion.x) * 0.05;
  companion.y += (targetY - companion.y) * 0.05;

  updateHover(arc7);
  updateHover(companion);
}

function drawCharacter(character, color) {
  const x = character.x - cameraX;
  const y = character.y - cameraY + character.hoverOffset;

  ctx.beginPath();
  ctx.arc(x, y, character.radius + 8, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.05)";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(x, y, character.radius, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

function draw() {
  updatePositions();
  drawBackground();
  drawCharacter(companion, "cyan");
  drawCharacter(arc7, "crimson");
}

setInterval(draw, 16);

// Touch + mouse D-pad handling
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

// Keyboard support
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" || e.key === "w") moveUp = true;
  if (e.key === "ArrowDown" || e.key === "s") moveDown = true;
  if (e.key === "ArrowLeft" || e.key === "a") moveLeft = true;
  if (e.key === "ArrowRight" || e.key === "d") moveRight = true;
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowUp" || e.key === "w") moveUp = false;
  if (e.key === "ArrowDown" || e.key === "s") moveDown = false;
  if (e.key === "ArrowLeft" || e.key === "a") moveLeft = false;
  if (e.key === "ArrowRight" || e.key === "d") moveRight = false;
});
