const GameBoard = document.querySelector("#GameBoard");
const ctx = GameBoard.getContext("2d");
const ScoreText = document.querySelector("#Score");
const ResetBtn = document.querySelector("#ResetBtn");
const GameWidth = GameBoard.width;
const GameHeight = GameBoard.height;
const BoardBg = "black";
const SnakeColor = "lightblue";
const SnakeBorder = "black";
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

gameStart();

function gameStart() {
    running = true;
    ScoreText.textContent = score;
    placeApples();
    drawApples();
    nextTick();
}

function nextTick() {
    if (running) {
        setTimeout(() => {
            clearBoard();
            drawApples();
            moveSnake();
            drawSnake();
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

function placeRedApple() {
    const color = "red";
    const position = getRandomPosition();
    apples.push({ x: position.x, y: position.y, color: color });
}

function placeGreenApple() {
    const color = "green";
    const position = getRandomPosition();
    apples.push({ x: position.x, y: position.y, color: color });
}

function placeYellowApple() {
    const color = "yellow";
    const position = getRandomPosition();
    apples.push({ x: position.x, y: position.y, color: color });
}

function placeOrangeApple() {
    const color = "orange";
    const position = getRandomPosition();
    apples.push({ x: position.x, y: position.y, color: color });
}

function placePaleGreenApple() {
    const color = "palegreen";
    const position = getRandomPosition();
    apples.push({ x: position.x, y: position.y, color: color });
}

function getRandomPosition() {
    const posX = Math.floor(Math.random() * GameWidth);
    const posY = Math.floor(Math.random() * GameHeight);
    return { x: posX, y: posY };
}

function placeApples() {
    placeRedApple();
    placeGreenApple();
    placeYellowApple();
    placeOrangeApple();
    placePaleGreenApple();
}

function drawApples() {
    apples.forEach(apple => {
        ctx.fillStyle = apple.color;
        ctx.fillRect(apple.x, apple.y, UnitSize, UnitSize);
    });
}

function moveSnake() {
    const head = { x: snake[0].x + xVelocity, y: snake[0].y + yVelocity };
    snake.unshift(head);

    apples.forEach((apple, index) => {
        if (apple.x === snake[0].x && apple.y === snake[0].y) {
            score += 10;
            ScoreText.textContent = "Score: " + score;
            apples.splice(index, 1);
            placeApples();
        }
    });

    snake.pop();
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
