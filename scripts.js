class Direction {
  static get Left() {
    return 0;
  }
  static get Right() {
    return 1;
  }
  static get Up() {
    return 2;
  }
  static get Down() {
    return 3;
  }
}

class KeyCode {
  static get Left() {
    return "ArrowLeft";
  }
  static get Right() {
    return "ArrowRight";
  }
  static get Up() {
    return "ArrowUp";
  }
  static get Down() {
    return "ArrowDown";
  }
}

function ryx() {
  let x = Math.floor(Math.random() * 16);
  let y = Math.floor(Math.random() * 16);
  return {
    x,
    y,
  };
}

// ###########################################################
//      CONFIGS/UTILS                             END
// ###########################################################

let direction = Direction.Right,
  gameOver = false,
  gameLoop;
const canvas = document.querySelector("#snake"),
  context = canvas.getContext("2d"),
  box = 32,
  //   cellSize = box/16,
  snake = [
    {
      x: 8,
      y: 8,
      direction: Direction.Right,
      size: 1,
    },
  ],
  food = { ...ryx(), eaten: false };

function createBG() {
  context.fillStyle = "#000";

  context.fillRect(0, 0, 16 * box, 16 * box);
}
const clear = createBG;
function createSnake() {
  context.fillStyle = "#00ff00";

  for (let body of snake)
    context.fillRect(body.x * box, body.y * box, box, box);

  context.fillStyle = "#f0f";
  context.fillRect(500, 500, 520, 520);
}
function eraseSnake() {
  let listRemove = [];
  for (let body of snake) {
    body.size--;
    if (body.size <= 0) listRemove.push(body);
  }
  for (let body of listRemove) snake.splice(snake.indexOf(body), 1);
}
const renderSnake = createSnake;
function createFood() {
  context.fillStyle = "#ffff00";

  context.fillRect(food.x * box, food.y * box, box, box);
}
const renderFood = createFood;
function update(event) {
  let keyPressed = event.code;

  if (
    (direction == Direction.Up && keyPressed == KeyCode.Down) ||
    (direction == Direction.Down && keyPressed == KeyCode.Up) ||
    (direction == Direction.Left && keyPressed == KeyCode.Right) ||
    (direction == Direction.Right && keyPressed == KeyCode.Left)
  )
    return;

  switch (keyPressed) {
    case KeyCode.Up:
      direction = Direction.Up;
      break;
    case KeyCode.Down:
      direction = Direction.Down;
      break;
    case KeyCode.Left:
      direction = Direction.Left;
      break;
    case KeyCode.Right:
      direction = Direction.Right;
      break;
    default:
      return;
  }
}
const onInput = update;

function detectCollisions() {
  // colisions that cause death;
  let hasCollision = false;
  hasCollision = detectSelfCollision();
  if (hasCollision) gameOver = true;

  // others collisions
  detectEatCollision();
}

function detectSelfCollision() {
  let hasCollision = false;

  for (let body of snake)
    for (let _body of snake)
      if (body != _body)
        if (body.x == _body.x && body.y == _body.y) hasCollision = true;

  return hasCollision;
}
function detectEatCollision() {
  let head = snake[0];
  if (head.x == food.x && head.y == food.y) food.eaten = true;

  if (food.eaten) {
    eatSound.play();
    head.size++;
    let okPos = true;

    let np;
    do {
      np = ryx();
      okPos = snake
        .map((body) => np.x == body.x && np.y == body.y)
        .find((collision) => collision == true);
      if (okPos == undefined) okPos = true;
    } while (!okPos);

    food.x = np.x;
    food.y = np.y;
    food.eaten = false;
  }
}

function _gameOver() {
  gameOver = true;
  context.fillStyle = "#f00";
  context.font = "48px serif";
  context.fillText("Game Over", 5 * box, 8 * box, 8 * box);

  backgroundSound.pause();
  failSound.play();

  clearInterval(gameLoop);
}

function repaint() {
  clear();
  renderSnake();
  renderFood();
}

function onUpdate() {
  if (gameOver) {
    _gameOver();
    return;
  }

  let head = snake[0];
  let nextMovimentBody = JSON.parse(JSON.stringify(head));
  nextMovimentBody.direction = direction;
  nextMovimentBody.size++;

  switch (nextMovimentBody.direction) {
    case Direction.Up:
      nextMovimentBody.y--;
      break;
    case Direction.Down:
      nextMovimentBody.y++;
      break;
    case Direction.Left:
      nextMovimentBody.x--;
      break;
    case Direction.Right:
      nextMovimentBody.x++;
      break;
  }

  if (nextMovimentBody.x <= -1) nextMovimentBody.x = 15;
  if (nextMovimentBody.x >= 16) nextMovimentBody.x = 0;
  if (nextMovimentBody.y <= -1) nextMovimentBody.y = 15;
  if (nextMovimentBody.y >= 16) nextMovimentBody.y = 0;

  snake.unshift(nextMovimentBody);
  eraseSnake();

  detectCollisions();
  repaint();
}

// ###########################################################
//      ENGINE                              END
// ###########################################################

window.addEventListener("keydown", onInput);

window.onload = () => {
  // onUpdate();
  gameLoop = setInterval(onUpdate, 100);

  var backgroundSound = document.querySelector("#backgroundSound");
  backgroundSound.loop = true;

  var eatSound = document.querySelector("#eatSound");
  eatSound.loop = false;

  var failSound = document.querySelector("#failSound");
  failSound.loop = false;

  backgroundSound.play();
};

// ###########################################################
//      START                              END
// ###########################################################
