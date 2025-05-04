const canvas = document.getElementById("game");
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
const speed = 2;

let moveUp = false,
  moveDown = false,
  moveLeft = false,
  moveRight = false;

let lastDirection = "right"; // Track last movement direction

// Draw tile-based background
function drawBackground() {
  const tileSize = 100;
  const colors = ["#3ac6a5", "#33b899"];

  const startX = Math.floor(cameraX / tileSize) * tileSize;
  const startY = Math.floor(cameraY / tileSize) * tileSize;
  const endX = cameraX + canvas.width;
  const endY = cameraY + canvas.height;

  for (let y = startY; y < endY; y += tileSize) {
    for (let x = startX; x < endX; x += tileSize) {
      const col = Math.floor(x / tileSize);
      const row = Math.floor(y / tileSize);
      const colorIndex = (col + row) % 2;
      ctx.fillStyle = colors[colorIndex];
      ctx.fillRect(x - cameraX, y - cameraY, tileSize, tileSize);
    }
  }
}

// Draw characters with hover effect
function drawCharacter(character) {
  // Glow layer
  ctx.beginPath();
  ctx.arc(
    character.x - cameraX,
    character.y - cameraY + character.hoverOffset,
    character.radius + 10,
    0,
    Math.PI * 2
  );
  ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
  ctx.fill();
  ctx.closePath();

  // Main character
  ctx.beginPath();
  ctx.arc(
    character.x - cameraX,
    character.y - cameraY + character.hoverOffset,
    character.radius,
    0,
    Math.PI * 2
  );
  ctx.fillStyle = character.color;
  ctx.shadowColor = character.color;
  ctx.shadowBlur = 10;
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.closePath();
}

// Character movement and companion AI
function updatePositions() {
  // Move ARC-7 and update lastDirection
  if (moveUp) {
    arc7.y -= speed;
    lastDirection = "up";
  }
  if (moveDown) {
    arc7.y += speed;
    lastDirection = "down";
  }
  if (moveLeft) {
    arc7.x -= speed;
    lastDirection = "left";
  }
  if (moveRight) {
    arc7.x += speed;
    lastDirection = "right";
  }

  const isMoving = moveUp || moveDown || moveLeft || moveRight;
  let targetX, targetY;

  if (isMoving) {
    let dirX = 0;
    let dirY = 0;

    if (moveLeft) dirX = -1;
    if (moveRight) dirX = 1;
    if (moveUp) dirY = -1;
    if (moveDown) dirY = 1;

    // Normalize direction for diagonals
    if (dirX !== 0 && dirY !== 0) {
      dirX *= 0.707;
      dirY *= 0.707;
    }

    // Offset to the side of movement, not center
    const trailingOffset = 60;
    const sideOffsetX = -dirY * trailingOffset; // perpendicular offset
    const sideOffsetY = dirX * trailingOffset;

    targetX = arc7.x + sideOffsetX;
    targetY = arc7.y + sideOffsetY;
  } else {
    // Stand beside ARC-7 based on last movement
    let sideOffsetX = 0;
    let sideOffsetY = 0;

    switch (lastDirection) {
      case "left":
        sideOffsetX = 60;
        break;
      case "right":
        sideOffsetX = -60;
        break;
      case "up":
        sideOffsetY = 60;
        break;
      case "down":
        sideOffsetY = -60;
        break;
    }

    targetX = arc7.x + sideOffsetX;
    targetY = arc7.y + sideOffsetY;
  }

  // Move companion at fixed speed (no slingshot)
  const dx = targetX - companion.x;
  const dy = targetY - companion.y;
  const distance = Math.hypot(dx, dy);
  const moveStep = 2.2;

  if (distance > 1) {
    const angle = Math.atan2(dy, dx);
    companion.x += Math.cos(angle) * Math.min(moveStep, distance);
    companion.y += Math.sin(angle) * Math.min(moveStep, distance);
  }

  // Hover animation
  [arc7, companion].forEach((character) => {
    if (character.hoverOffset > 5) character.hoverDirection = -1;
    if (character.hoverOffset < -5) character.hoverDirection = 1;
    character.hoverOffset += character.hoverDirection * 0.2;
  });

  // Camera follows ARC-7
  cameraX = arc7.x - canvas.width / 2;
  cameraY = arc7.y - canvas.height / 2;
}

// Drawing loop
function draw() {
  updatePositions();
  drawBackground();
  drawCharacter(companion);
  drawCharacter(arc7);
}

setInterval(draw, 16);

// Touch + Mouse controls for D-pad
function addDirectionalEvents(id, startCallback, endCallback) {
  const el = document.getElementById(id);
  el.addEventListener("touchstart", startCallback);
  el.addEventListener("mousedown", startCallback);
  el.addEventListener("touchend", endCallback);
  el.addEventListener("mouseup", endCallback);
  el.addEventListener("mouseleave", endCallback);
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

// Auto-focus canvas to capture keyboard input
window.addEventListener("load", () => {
  canvas.focus();
});
