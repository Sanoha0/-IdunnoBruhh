const GameBoard = document.querySelector("#GameBoard");
const ctx = GameBoard.getContext("2d");
const ScoreText = document.querySelector("#Score");
const ResetBtn = document.querySelector("#ResetBtn");
const UpBtn = document.querySelector("#UpBtn");
const DownBtn = document.querySelector("#DownBtn");
const LeftBtn = document.querySelector("#LeftBtn");
const RightBtn = document.querySelector("#RightBtn");
const GameWidth = GameBoard.width;
const GameHeight = GameBoard.height;
const BoardBg = "black";
const SnakeColor = "lightblue";
const SnakeBorder = "black";
const AppleColors = ["red", "green", "yellow", "orange", "palegreen"];
const UnitSize = 25;
let running = false;
let xVelocity = UnitSize;
let yVelocity = 0;
let score = 0;
let snake = [
    { x: UnitSize * 4, y: 0 },
    { x: UnitSize * 3, y: 0 },
    { x: UnitSize * 2, y: 0 },
    { x: UnitSize, y: 0 },
    { x: 0, y: 0 }
];
let apples = [];

window.addEventListener("keydown", changeDirection);
ResetBtn.addEventListener("click", resetGame);

// Add event listeners to directional buttons
UpBtn.addEventListener("click", () => changeDirection("ArrowUp"));
DownBtn.addEventListener("click", () => changeDirection("ArrowDown"));
LeftBtn.addEventListener("click", () => changeDirection("ArrowLeft"));
RightBtn.addEventListener("click", () => changeDirection("ArrowRight"));

gameStart();

function gameStart() {
    running = true;
    ScoreText.textContent = "Score: " + score;
    placeApples();
    drawApples();
    drawSnake();
    nextTick();
}

function nextTick() {
    if (running) {
        setTimeout(() => {
            clearBoard();
            moveSnake();
            drawSnake();
            drawApples();
            if (!checkGameOver()) {
                nextTick();
            } else {
                displayGameOver();
            }
        }, 75);
    }
}

function resetGame() {
    running = false;
    score = 0;
    xVelocity = UnitSize;
    yVelocity = 0;
    snake = [
        { x: UnitSize * 4, y: 0 },
        { x: UnitSize * 3, y: 0 },
        { x: UnitSize * 2, y: 0 },
        { x: UnitSize, y: 0 },
        { x: 0, y: 0 }
    ];
    apples = [];
    gameStart();
}

function clearBoard() {
    ctx.fillStyle = BoardBg;
    ctx.fillRect(0, 0, GameWidth, GameHeight);
}

function getRandomPosition() {
    const posX = Math.floor(Math.random() * (GameWidth / UnitSize)) * UnitSize;
    const posY = Math.floor(Math.random() * (GameHeight / UnitSize)) * UnitSize;
    return { x: posX, y: posY };
}

function placeApple() {
    const color = AppleColors[Math.floor(Math.random() * AppleColors.length)];
    const position = getRandomPosition();
    apples.push({ x: position.x, y: position.y, color: color });
}

function placeApples() {
    for (let i = 0; i < 5; i++) {
        placeApple();
    }
}

function drawApples() {
    apples.forEach(apple => {
        ctx.fillStyle = apple.color;
        ctx.fillRect(apple.x, apple.y, UnitSize, UnitSize);
    });
}

function moveSnake() {
    const headX = snake[0].x + xVelocity; 
    const headY = snake[0].y + yVelocity;
    const head = { x: headX, y: headY };

    let appleEaten = false;

    apples.forEach((apple, index) => {
        if (apple.x === headX && apple.y === headY) {
            score += 10;
            ScoreText.textContent = "Score: " + score;
            apples.splice(index, 1);
            appleEaten = true;
        }
    });

    if (appleEaten) {
        placeApple();
    }

    snake.unshift(head);
    snake.pop();

    if (xVelocity !== 0) {
        yVelocity = 0;
    } else if (yVelocity !== 0) {
        xVelocity = 0;
    }
}

function drawSnake() {
    snake.forEach(segment => {
        ctx.fillStyle = SnakeColor;
        ctx.fillRect(segment.x, segment.y, UnitSize, UnitSize);
    });
}

function changeDirection(event) {
    const keyPressed = event.key;
    const LEFT = "ArrowLeft";
    const UP = "ArrowUp";
    const RIGHT = "ArrowRight";
    const DOWN = "ArrowDown";

    const goingUp = yVelocity === -UnitSize;
    const goingDown = yVelocity === UnitSize;
    const goingLeft = xVelocity === -UnitSize;
    const goingRight = xVelocity === UnitSize;

    if (keyPressed === LEFT && !goingRight) {
        xVelocity = -UnitSize;
        yVelocity = 0;
    }
    if (keyPressed === UP && !goingDown) {
        xVelocity = 0;
        yVelocity = -UnitSize;
    }
    if (keyPressed === RIGHT && !goingLeft) {
        xVelocity = UnitSize;
        yVelocity = 0;
    }
    if (keyPressed === DOWN && !goingUp) {
        xVelocity = 0;
        yVelocity = UnitSize;
    }
}

function checkGameOver() {
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > GameWidth - UnitSize;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > GameHeight - UnitSize;

    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}

function displayGameOver() {
    console.log("Game Over!");
}
