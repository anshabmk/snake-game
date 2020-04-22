'use strict';

var canvas = document.getElementById('gameCanvas');
var ctx = this.canvas.getContext('2d');
var allowKeyPress = false;
var moveSnakeInterval;
var w = 10;
var h = 10;

var directions = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
};

var direction = this.directions.RIGHT;

var snake = [
  { x: 30, y: 10 },
  { x: 20, y: 10 },
  { x: 10, y: 10 },
];

var apples = [];
var score = 0;
var gameOverElement = document.getElementById('gameOver');

setHighScore();
initGame();

function checkBrowserSupport() {
  if (!canvas.getContext) alert('Incompatible browser');
}

function setHighScore() {
  if (localStorage.getItem('highScore')) {
    return;
  } else {
    localStorage.setItem('highScore', '0');
  }
}

function startGame() {
  let gameMenu = document.getElementById('gameMenu');
  gameMenu.style.display = 'none';
  allowKeyPress = true;
  moveSnakeInterval = setInterval(moveSnake, 100);
}

function restartGame() {
  gameOverElement.style.display = 'none';

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  direction = directions.RIGHT;

  snake = [
    { x: 30, y: 10 },
    { x: 20, y: 10 },
    { x: 10, y: 10 },
  ];

  apples = [];
  score = 0;
  allowKeyPress = true;

  initGame();

  moveSnakeInterval = setInterval(moveSnake, 100);
}

function initGame() {
  addNewApple();
  drawApple();
  drawSnake();
}


function moveSnake() {
  if (boundaryExceeded()) {
    gameOver();
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawApple();

  const newSnakeHead = getNewSnakeHead();

  if (reachedApple(newSnakeHead)) {
    eatApple();
    updateScore();
    snake.unshift(newSnakeHead);
    setTimeout(addNewApple, 500);
  }

  drawSnake();

  if (selfCollided()) {
    gameOver();
    return;
  }

  updateSnakePosition(newSnakeHead);
}

function gameOver() {
  clearInterval(moveSnakeInterval);
  allowKeyPress = false;
  showGameOverScreen();
}

function showGameOverScreen() {
  gameOverElement.style.display = 'block';
}

function reachedApple(newSnakeHead) {
  return apples[0] !== undefined && newSnakeHead.x === apples[0].x && newSnakeHead.y === apples[0].y;
}

function boundaryExceeded() {
  var snakeHeadToBeDrawn = snake[0];

  if (snakeHeadToBeDrawn.x < 0 || snakeHeadToBeDrawn.x >= canvas.width) {
    return true;
  }

  if (snakeHeadToBeDrawn.y < 0 || snakeHeadToBeDrawn.y >= canvas.height) {
    return true;
  }

  return false;
}

function selfCollided() {
  const newSnakeHead = getNewSnakeHead();

  for (let i = 0; i < snake.length; i++) {
    const snakePart = snake[i];

    if (newSnakeHead.x === snakePart.x && newSnakeHead.y === snakePart.y) {
      return true;
    }
  }

  return false;
}

function drawApple() {
  ctx.fillStyle = 'black';

  apples.forEach(apple => {
    ctx.fillRect(apple.x, apple.y, w, h);
  });
}

function addNewApple() {
  let x = getRandomInt(canvas.width / w) * w;
  let y = getRandomInt(canvas.height / h) * h;

  apples.push({ x: x, y: y });
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function drawSnake() {
  ctx.fillStyle = 'rgb(200, 0, 0)';
  ctx.strokeStyle = 'black';

  snake.forEach(element => {
    ctx.fillRect(element.x, element.y, w, h);
    ctx.strokeRect(element.x, element.y, w, h);
  });
}

function updateSnakePosition(newSnakeHead) {
  snake.unshift(newSnakeHead);
  snake.pop();
}

function getNewSnakeHead() {
  var currentHead = snake[0];

  if (direction === directions.RIGHT) {
    var newSnakeX = currentHead.x + w;

    return { x: newSnakeX, y: currentHead.y };
  } else if (direction === directions.LEFT) {
    var newSnakeX = currentHead.x - w;

    return { x: newSnakeX, y: currentHead.y };
  } else if (direction === directions.UP) {
    var newSnakeY = currentHead.y - h;

    return { x: currentHead.x, y: newSnakeY };
  } else if (direction === directions.DOWN) {
    var newSnakeY = currentHead.y + h;

    return { x: currentHead.x, y: newSnakeY };
  }
}

function eatApple() {
  const apple = apples.pop();

  ctx.clearRect(apple.x, apple.y, w, h);
}

function updateScore() {
  score += 10;

  if (score > localStorage.getItem('highScore')) {
    localStorage.setItem('highScore', score);
  }
}

function movementInSameAxis(keyCode) {
  return whichAxis(keyCode) === whichAxis(direction);
}

function whichAxis(directionKeyCode) {
  var axes = { X: 'X', Y: 'Y' };

  if ([directions.LEFT, directions.RIGHT].includes(directionKeyCode)) {
    return axes.X;
  } else {
    return axes.Y;
  }
}

document.getElementById('startGameButton').addEventListener('click', function () {
  startGame();
});

document.getElementById('restartGameButton').addEventListener('click', function () {
  restartGame();
})

document.onkeydown = function (event) {
  if (!allowKeyPress) return;

  var keyCode = event.keyCode;

  var directionKeyCodes = [
    directions.LEFT,
    directions.RIGHT,
    directions.UP,
    directions.DOWN,
  ];

  if (directionKeyCodes.includes(keyCode)) {
    if (movementInSameAxis(keyCode)) {
      return;
    }

    direction = keyCode;
  }
}
