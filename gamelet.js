document.addEventListener("DOMContentLoaded", function () {
  const ball = document.getElementById("ball");
  let x = 100;
  let y = 100;
  const step = 10;

  // Get ball dimensions
  const ballWidth = ball.offsetWidth;
  const ballHeight = ball.offsetHeight;

  function refresh() {
    ball.style.left = x + "px";
    ball.style.top = y + "px";
  }

  refresh(); // Show initial position

  function spinBall() {
    ball.classList.add("spin");
    setTimeout(() => {
      ball.classList.remove("spin");
    }, 600);
  }

  document.addEventListener("keydown", function (event) {
    const maxX = window.innerWidth - ballWidth;
    const maxY = window.innerHeight - ballHeight;

    if (event.key === "ArrowUp" && y - step >= 0) {
      y -= step;
      refresh();
      spinBall();
    }
    if (event.key === "ArrowDown" && y + step <= maxY) {
      y += step;
      refresh();
      spinBall();
    }
    if (event.key === "ArrowLeft" && x - step >= 0) {
      x -= step;
      refresh();
      spinBall();
    }
    if (event.key === "ArrowRight" && x + step <= maxX) {
      x += step;
      refresh();
      spinBall();
    }
  });
});
