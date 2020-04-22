'use strict';

function checkBrowserSupport() {
  if (!canvas.getContext) alert('Incompatible browser');
}

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

var currentState = getInitialState();
var gameOverElement = document.getElementById('gameOver');

addNewApple();
drawApple();
drawSnake();

function getInitialState() {
  function getInitialSnake() {
    let snake = [
      { x: 30, y: 10 },
      { x: 20, y: 10 },
      { x: 10, y: 10 },
    ];

    return snake;
  }

  let state = {
    direction: directions.RIGHT,
    snake: getInitialSnake(),
    apples: [],
    score: 0,
  }

  return state;
}

function setHighScore(value) {
  localStorage.setItem('highScore', value);
}

function getHighScore() {
  if (!localStorage.getItem('highScore')) setHighScore(currentState.score)

  return localStorage.getItem('highScore');
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

  currentState = getInitialState();
  allowKeyPress = true;

  addNewApple();
  drawApple();
  drawSnake();

  moveSnakeInterval = setInterval(moveSnake, 100);
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
    currentState.snake.unshift(newSnakeHead);
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
  gameOverElement.children.currentScore.innerHTML = 'Your score: ' + currentState.score;
  gameOverElement.children.highScore.innerHTML = 'Highscore: ' + getHighScore();
}

function reachedApple(newSnakeHead) {
  let {apples} = currentState;

  return apples[0] !== undefined && newSnakeHead.x === apples[0].x && newSnakeHead.y === apples[0].y;
}

function boundaryExceeded() {
  var snakeHeadToBeDrawn = currentState.snake[0];

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
  let {snake} = currentState;

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

  currentState.apples.forEach(apple => {
    ctx.fillRect(apple.x, apple.y, w, h);
  });
}

function addNewApple() {
  let x = getRandomInt(canvas.width / w) * w;
  let y = getRandomInt(canvas.height / h) * h;

  currentState.apples.push({ x: x, y: y });
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function drawSnake() {
  ctx.fillStyle = 'rgb(200, 0, 0)';
  ctx.strokeStyle = 'black';

  currentState.snake.forEach(element => {
    ctx.fillRect(element.x, element.y, w, h);
    ctx.strokeRect(element.x, element.y, w, h);
  });
}

function updateSnakePosition(newSnakeHead) {
  currentState.snake.unshift(newSnakeHead);
  currentState.snake.pop();
}

function getNewSnakeHead() {
  var currentHead = currentState.snake[0];
  let {direction} = currentState;

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
  const apple = currentState.apples.pop();

  ctx.clearRect(apple.x, apple.y, w, h);
}

function updateScore() {
  currentState.score += 10;

  if (currentState.score > getHighScore()) setHighScore(score);

}

function movementInSameAxis(keyCode) {
  return whichAxis(keyCode) === whichAxis(currentState.direction);
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

    currentState.direction = keyCode;
  }
}
