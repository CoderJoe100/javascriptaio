document.addEventListener("DOMContentLoaded", function () {
  const ball = document.getElementById("ball");
  let x = 100;
  let y = 100;
  const step = 10;

  function refresh() {
    ball.style.left = x + "px"; // Move it horizontally (left)
    ball.style.top = y + "px"; // Move it vertically (top)
  }
  // Call refresh right away to place the ball at (100px, 100px) before any keys are pressed
  refresh();

  function spinBall() {
    ball.classList.add("spin");
    setTimeout(() => {
      ball.classList.remove("spin");
    }, 600);
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowUp") {
      y -= step;
      refresh();
      spinBall();
    }
    if (event.key === "ArrowDown") {
      y += step;
      refresh();
      spinBall();
    }
    if (event.key === "ArrowLeft") {
      x -= step;
      refresh();
      spinBall();
    }
    if (event.key === "ArrowRight") {
      x += step;
      refresh();
      spinBall();
    }
  });
});
