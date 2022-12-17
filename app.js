/* Global variables */
var gameOver = false;
var score = 0;

var snakeCtrlls = {
  snakeLeght: (bodySnake = []),
  moveDir: "w",
};

var nInterval,
  intervalMs = 120;

/* The fkin problem */
var moveX = 0,
  moveY = -50;

nInterval = setInterval(moveSnake, intervalMs);

document.getElementById("LeftCtrll").addEventListener("click", () => {
  if (snakeCtrlls.moveDir == "a") {
    snakeCtrlls.moveDir = "s";
    changeDirection();
    return;
  }
  if (snakeCtrlls.moveDir == "s") {
    snakeCtrlls.moveDir = "d";
    changeDirection();
    return;
  }
  if (snakeCtrlls.moveDir == "d") {
    snakeCtrlls.moveDir = "w";
    changeDirection();
    return;
  }
  if (snakeCtrlls.moveDir == "w") {
    snakeCtrlls.moveDir = "a";
    changeDirection();
    return;
  }
});
document.getElementById("RightCtrll").addEventListener("click", () => {
  if (snakeCtrlls.moveDir == "a") {
    snakeCtrlls.moveDir = "w";
    changeDirection();
    return;
  }
  if (snakeCtrlls.moveDir == "s") {
    snakeCtrlls.moveDir = "a";
    changeDirection();
    return;
  }
  if (snakeCtrlls.moveDir == "d") {
    snakeCtrlls.moveDir = "s";
    changeDirection();
    return;
  }
  if (snakeCtrlls.moveDir == "w") {
    snakeCtrlls.moveDir = "d";
    changeDirection();
    return;
  }
});

function changeDirection() {
  switch (snakeCtrlls.moveDir) {
    case "a":
      moveX = -50;
      moveY = 0;
      break;

    case "d":
      moveX = 50;
      moveY = 0;
      break;

    case "w":
      moveX = 0;
      moveY = -50;
      break;

    case "s":
      moveX = 0;
      moveY = 50;
      break;
  }

  /* pls don't broke yourself */
  snakeCtrlls.moveDir = value;
  clearInterval(nInterval);
  nInterval = setInterval(moveSnake, intervalMs);
}

/* initial snake */
for (let i = 0; i < 2; i++) {
  var bodyPos = { x: 0, y: i * 50 };

  createBody(bodyPos.x, bodyPos.y);

  snakeCtrlls.snakeLeght.push(bodyPos);
}

/* Create new Body */
function createBody(X, Y) {
  var body = document.createElement("div");
  body.classList.add("snakeBody");

  body.style.top = `${Y}px`;
  body.style.left = `${X}px`;

  document.getElementById("Snake").appendChild(body);
}

/* WASD config */
document.addEventListener("keypress", (e) => {
  if (gameOver) return;

  switch (e.key) {
    case "a":
      if (snakeCtrlls.moveDir == "a" || snakeCtrlls.moveDir == "d") return;
      moveX = -50;
      moveY = 0;
      break;

    case "d":
      if (snakeCtrlls.moveDir == "a" || snakeCtrlls.moveDir == "d") return;
      moveX = 50;
      moveY = 0;
      break;

    case "w":
      if (snakeCtrlls.moveDir == "w" || snakeCtrlls.moveDir == "s") return;
      moveX = 0;
      moveY = -50;
      break;

    case "s":
      if (snakeCtrlls.moveDir == "w" || snakeCtrlls.moveDir == "s") return;
      moveX = 0;
      moveY = 50;
      break;
  }

  /* pls don't broke yourself */
  snakeCtrlls.moveDir = e.key;
  clearInterval(nInterval);
  nInterval = setInterval(moveSnake, intervalMs);
});

/* All the move of the snake */
function moveSnake() {
  snake = document.getElementById("Snake").children;

  for (let i = snakeCtrlls.snakeLeght.length - 1; i > 0; i--) {
    snakeCtrlls.snakeLeght[i].x = snakeCtrlls.snakeLeght[i - 1].x;
    snakeCtrlls.snakeLeght[i].y = snakeCtrlls.snakeLeght[i - 1].y;
  }

  const Table = document.getElementById("Table");

  snakeCtrlls.snakeLeght[0].x += moveX;
  snakeCtrlls.snakeLeght[0].y += moveY;

  /* If get out of square */
  if (snakeCtrlls.snakeLeght[0].x > Table.offsetWidth - 25) {
    snakeCtrlls.snakeLeght[0].x = -Table.offsetWidth + 25;
  }
  if (snakeCtrlls.snakeLeght[0].x < -Table.offsetWidth + 25) {
    snakeCtrlls.snakeLeght[0].x = Table.offsetWidth - 25;
  }

  if (snakeCtrlls.snakeLeght[0].y > Table.offsetHeight - 25) {
    snakeCtrlls.snakeLeght[0].y = -Table.offsetHeight + 25;
  }
  if (snakeCtrlls.snakeLeght[0].y < -Table.offsetHeight + 25) {
    snakeCtrlls.snakeLeght[0].y = Table.offsetHeight - 25;
  }

  /* Follow the leader */
  for (let i = 0; i < snake.length; i++) {
    snake[i].style.top = `${snakeCtrlls.snakeLeght[i].y}px`;
    snake[i].style.left = `${snakeCtrlls.snakeLeght[i].x}px`;
  }

  Eating();
  checkCollision();
}

/* The food */
var Food = {
  posX: 0,
  posY: 0,
};

function SpawnFood() {
  var food = document.createElement("div");
  food.setAttribute("id", "Food");
  food.classList.add("Food");

  const Table = document.getElementById("Table");

  const spawnCellX = (Table.offsetWidth - 25) / 50;
  const spawnCellY = (Table.offsetHeight - 25) / 50;

  Food.posX = Math.floor(Math.random() * spawnCellX) * 50;
  Food.posY = Math.floor(Math.random() * spawnCellY) * 50;

  if (Math.floor(Math.random() * 2) > 0) {
    Food.posX *= -1;
    Food.posY *= -1;
  }

  food.style.left = Food.posX + "px";
  food.style.top = Food.posY + "px";

  document.getElementById("Table").appendChild(food);
}

SpawnFood();

function Eating() {
  if (
    snakeCtrlls.snakeLeght[0].x == Food.posX &&
    snakeCtrlls.snakeLeght[0].y == Food.posY
  ) {
    Growing(snakeCtrlls.moveDir);
    const food = document.getElementById("Food");
    document.getElementById("Table").removeChild(food);
    SpawnFood();
    score++;
    document.getElementById("scoreCount").innerHTML = `Score: ${score}`;

    if (score > 10) {
      intervalMs = 60;
    }

    if (score > 25) {
      intervalMs = 30;
    }
  }
}

function Growing(direction) {
  var x, y;
  switch (direction) {
    case "w":
      x = 0;
      y = 50;
      break;
    case "a":
      x = 50;
      y = 0;
      break;
    case "s":
      x = 0;
      y = -50;
      break;
    case "d":
      x = -50;
      y = 0;
      break;
  }
  /* Fuck */
  var bodyPos = {
    x: snakeCtrlls.snakeLeght[snakeCtrlls.snakeLeght.length - 1].x + x,
    y: snakeCtrlls.snakeLeght[snakeCtrlls.snakeLeght.length - 1].y + y,
  };
  createBody(bodyPos.x, bodyPos.y);

  snakeCtrlls.snakeLeght.push(bodyPos);
}

function checkCollision() {
  for (let i = 1; i < snakeCtrlls.snakeLeght.length; i++) {
    if (
      snakeCtrlls.snakeLeght[0].x == snakeCtrlls.snakeLeght[i].x &&
      snakeCtrlls.snakeLeght[0].y == snakeCtrlls.snakeLeght[i].y
    ) {
      clearInterval(nInterval);
      alert("You lose, fool");
      gameOver = true;

      let Reset = document.createElement("button");
      Reset.classList.add("ResetButton");
      Reset.innerHTML = "Reset The Game";
      Reset.addEventListener("click", () => window.location.reload());
      document.body.appendChild(Reset);
    }
  }
}
