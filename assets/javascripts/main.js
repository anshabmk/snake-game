var canvas = document.getElementById('gameCanvas');

if (canvas.getContext) {
  var ctx = canvas.getContext('2d');

  var w = 10;
  var h = 10;

  var directions = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
  };

  var direction = directions.RIGHT;

  var snake = [
    { x: 30, y: 10 },
    { x: 20, y: 10 },
    { x: 10, y: 10 },
  ];

  var apples = [];

  addNewApple();

  setInterval(moveSnake, 100);
}

function moveSnake() {
  if(boundaryWillExceed()) {
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawApple();

  var newSnakeHead = getNewSnakeHead();

  if (apples[0] !== undefined && newSnakeHead.x === apples[0].x && newSnakeHead.y === apples[0].y) {
    eatApple();
    snake.unshift(newSnakeHead);
    setTimeout(addNewApple, 500);
  }

  drawSnake();
  updateSnakePosition();
}

function boundaryWillExceed() {
  var snakeHead = snake[0];

  if (snakeHead.x < 0 || snakeHead.x >= canvas.width) {
    return true;
  }

  if (snakeHead.y < 0 || snakeHead.y >= canvas.height) {
    return true;
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
  x = getRandomInt(canvas.width / w) * w;
  y = getRandomInt(canvas.height / h) * h;

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

function updateSnakePosition() {
  var newSnakeHead = getNewSnakeHead();

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
  apple = apples.pop();

  ctx.clearRect(apple.x, apple.y, w, h);
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

document.onkeydown = function (event) {
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
