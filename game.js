document.addEventListener("DOMContentLoaded", function () {
  const ball = document.getElementById("ball");
  let x = 100;
  let y = 100;
  const step = 10;

  const ballWidth = ball.offsetWidth;
  const ballHeight = ball.offsetHeight;

  function refresh() {
    ball.style.left = x + "px";
    ball.style.top = y + "px";
  }

  refresh(); // Set initial ball position

  document.addEventListener("keydown", function (event) {
    const maxX = window.innerWidth - ballWidth;
    const maxY = window.innerHeight - ballHeight;

    if (event.key === "ArrowUp" && y - step >= 0) {
      y -= step;
      refresh();
      ball.classList.add("spin"); // Spin after moving up
    }

    if (event.key === "ArrowDown" && y + step <= maxY) {
      y += step;
      refresh();
      ball.classList.add("spin"); // Spin after moving down
    }

    if (event.key === "ArrowLeft" && x - step >= 0) {
      x -= step;
      refresh();
      ball.classList.add("spin"); // Spin after moving left
    }

    if (event.key === "ArrowRight" && x + step <= maxX) {
      x += step;
      refresh();
      ball.classList.add("spin"); // Spin after moving right
    }
  });
});
