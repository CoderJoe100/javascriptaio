document.addEventListener("DOMContentLoaded", function () {
  const ball = document.getElementById("ball");
  let x = 100;
  let y = 100;
  const step = 10;

  function refresh() {
    ball.style.left = x + "px";
    ball.style.top = y + "px";
  }

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
