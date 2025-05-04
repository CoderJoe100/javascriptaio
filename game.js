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

const backgroundImage = new Image();
backgroundImage.src = "zombie.jpg"; // Ensure this image is in your project directory

function updatePositions() {
  // Move ARC-7 based on input
  if (moveUp) arc7.y -= speed;
  if (moveDown) arc7.y += speed;
  if (moveLeft) arc7.x -= speed;
  if (moveRight) arc7.x += speed;

  // Define isMoving BEFORE using it!
  const isMoving = moveUp || moveDown || moveLeft || moveRight;

  let targetX, targetY;

  if (isMoving) {
    // While moving, companion follows
    const dx = arc7.x - companion.x;
    const dy = arc7.y - companion.y;
    targetX = companion.x + dx * 0.05;
    targetY = companion.y + dy * 0.05;
  } else {
    // While stopped, companion moves beside ARC-7
    const sideOffsetX = -60;
    const sideOffsetY = 0;
    targetX = arc7.x + sideOffsetX;
    targetY = arc7.y + sideOffsetY;
  }

  const followSpeed = isMoving ? 0.15 : 0.07;
  const maxDistance = 100; // Maximum distance companion can fall behind

  let dxFollow = targetX - companion.x;
  let dyFollow = targetY - companion.y;
  const distance = Math.hypot(dxFollow, dyFollow);

  if (distance > maxDistance) {
    // Snap closer if too far
    const angle = Math.atan2(dyFollow, dxFollow);
    companion.x = targetX - Math.cos(angle) * maxDistance;
    companion.y = targetY - Math.sin(angle) * maxDistance;
  }

  companion.x += dxFollow * followSpeed;
  companion.y += dyFollow * followSpeed;

  // Hover effect
  [arc7, companion].forEach((character) => {
    if (character.hoverOffset > 5) character.hoverDirection = -1;
    if (character.hoverOffset < -5) character.hoverDirection = 1;
    character.hoverOffset += character.hoverDirection * 0.2;
  });

  // Camera follows ARC-7
  cameraX = arc7.x - canvas.width / 2;
  cameraY = arc7.y - canvas.height / 2;
}

function drawCharacter(character) {
  // Glow effect
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

  // Character
  ctx.beginPath();
  ctx.arc(
    character.x - cameraX,
    character.y - cameraY + character.hoverOffset,
    character.radius,
    0,
    Math.PI * 2
  );
  ctx.fillStyle = character.color;
  ctx.fill();
  ctx.closePath();
}

function drawBackground() {
  const tileSize = 100;
  const colors = ["#3ac6a5", "#33b899"]; // Alternating tile colors

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

function draw() {
  updatePositions();

  // Draw background
  //ctx.drawImage(backgroundImage, -cameraX, -cameraY, worldWidth, worldHeight);
  drawBackground(); // Now uses custom tile grid

  // Draw characters
  drawCharacter(companion);
  drawCharacter(arc7);
}

setInterval(draw, 16);

// Touch + Mouse Controls for D-pad
function addDirectionalEvents(id, startCallback, endCallback) {
  const el = document.getElementById(id);
  el.addEventListener("touchstart", startCallback);
  el.addEventListener("mousedown", startCallback);
  el.addEventListener("touchend", endCallback);
  el.addEventListener("mouseup", endCallback);
  el.addEventListener("mouseleave", endCallback);
}

addDirectionalEvents("up", () => moveUp = true, () => moveUp = false);
addDirectionalEvents("down", () => moveDown = true, () => moveDown = false);
addDirectionalEvents("left", () => moveLeft = true, () => moveLeft = false);
addDirectionalEvents("right", () => moveRight = true, () => moveRight = false);