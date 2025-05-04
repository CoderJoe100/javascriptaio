const canvas = document.getElementById("game");
canvas.focus(); // ensures keyboard input
const ctx = canvas.getContext("2d");

const worldWidth = 2000;
const worldHeight = 2000;

let arc7 = {
  x: 1000,
  y: 1000,
  radius: 20,
  color: "red",
  hoverOffset: 0,
  hoverDirection: 1,
};
let companion = {
  x: 950,
  y: 1000,
  radius: 15,
  color: "blue",
  hoverOffset: 0,
  hoverDirection: 1,
};

let cameraX = 0;
let cameraY = 0;
let speed = 2;
let moveUp = false,
  moveDown = false,
  moveLeft = false,
  moveRight = false;

// Background image (if you're using one)
// const backgroundImage = new Image();
// backgroundImage.src = "ancient_ruins.jpg";

// Floating particle dust
let particles = [];
for (let i = 0; i < 50; i++) {
  particles.push({
    x: Math.random() * worldWidth,
    y: Math.random() * worldHeight,
    radius: Math.random() * 2 + 1,
    alpha: Math.random() * 0.5 + 0.2,
    speedY: Math.random() * 0.3 + 0.1,
  });
}

function updatePositions() {
  const isMoving = moveUp || moveDown || moveLeft || moveRight;

  if (moveUp) arc7.y -= speed;
  if (moveDown) arc7.y += speed;
  if (moveLeft) arc7.x -= speed;
  if (moveRight) arc7.x += speed;

  let targetX = companion.x;
  let targetY = companion.y;

  if (isMoving) {
    let dirX = 0,
      dirY = 0;
    if (moveLeft) dirX = -1;
    if (moveRight) dirX = 1;
    if (moveUp) dirY = -1;
    if (moveDown) dirY = 1;

    if (dirX !== 0 && dirY !== 0) {
      dirX *= 0.707;
      dirY *= 0.707;
    }

    const trailingOffset = 60;
    const sideOffsetX = -dirY * trailingOffset;
    const sideOffsetY = dirX * trailingOffset;

    targetX = arc7.x + sideOffsetX;
    targetY = arc7.y + sideOffsetY;
  }

  // Companion easing
  companion.x += (targetX - companion.x) * 0.07;
  companion.y += (targetY - companion.y) * 0.07;

  // Hover animation
  [arc7, companion].forEach((c) => {
    if (c.hoverOffset > 5) c.hoverDirection = -1;
    if (c.hoverOffset < -5) c.hoverDirection = 1;
    c.hoverOffset += c.hoverDirection * 0.2;
  });

  cameraX = arc7.x - canvas.width / 2;
  cameraY = arc7.y - canvas.height / 2;
}

function drawParticles() {
  particles.forEach((p) => {
    p.y += p.speedY;
    if (p.y > worldHeight) p.y = 0;
    ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
    ctx.beginPath();
    ctx.arc(p.x - cameraX, p.y - cameraY, p.radius, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawCharacter(c) {
  ctx.beginPath();
  ctx.arc(
    c.x - cameraX,
    c.y - cameraY + c.hoverOffset,
    c.radius + 10,
    0,
    Math.PI * 2
  );
  ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
  ctx.fill();
  ctx.closePath();

  ctx.beginPath();
  ctx.arc(
    c.x - cameraX,
    c.y - cameraY + c.hoverOffset,
    c.radius,
    0,
    Math.PI * 2
  );
  ctx.fillStyle = c.color;
  ctx.fill();
  ctx.closePath();
}

function draw() {
  updatePositions();

  // Clear screen
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Optional background image
  // ctx.drawImage(backgroundImage, -cameraX, -cameraY, worldWidth, worldHeight);

  drawParticles();
  drawCharacter(companion);
  drawCharacter(arc7);
}

setInterval(draw, 16);

// Touch + Mouse D-pad controls
function addDirectionalEvents(id, start, end) {
  const el = document.getElementById(id);
  el.addEventListener("touchstart", start);
  el.addEventListener("mousedown", start);
  el.addEventListener("touchend", end);
  el.addEventListener("mouseup", end);
  el.addEventListener("mouseleave", end);
}

addDirectionalEvents(
  "up",
  () => (moveUp = true),
  () => (moveUp = false)
);
addDirectionalEvents(
  "down",
  () => (moveDown = true),
  () => (moveDown = false)
);
addDirectionalEvents(
  "left",
  () => (moveLeft = true),
  () => (moveLeft = false)
);
addDirectionalEvents(
  "right",
  () => (moveRight = true),
  () => (moveRight = false)
);

// Keyboard controls
document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
    case "w":
    case "W":
      moveUp = true;
      break;
    case "ArrowDown":
    case "s":
    case "S":
      moveDown = true;
      break;
    case "ArrowLeft":
    case "a":
    case "A":
      moveLeft = true;
      break;
    case "ArrowRight":
    case "d":
    case "D":
      moveRight = true;
      break;
  }
});

document.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "ArrowUp":
    case "w":
    case "W":
      moveUp = false;
      break;
    case "ArrowDown":
    case "s":
    case "S":
      moveDown = false;
      break;
    case "ArrowLeft":
    case "a":
    case "A":
      moveLeft = false;
      break;
    case "ArrowRight":
    case "d":
    case "D":
      moveRight = false;
      break;
  }
});
