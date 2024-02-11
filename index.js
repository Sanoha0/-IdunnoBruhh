const GameBoard = document.querySelector("#GameBoard");
const ctx = GameBoard.getContext("2d");
const ScoreText = document.querySelector("#Score");
const GameWidth = GameBoard.width;
const GameHeight = GameBoard.height;
const BoardBg = "black";
const UnitSize = 25;
const maxApples = 5; // New constant for maximum apples
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
let apples = []; // New array to hold apples

window.addEventListener("keydown", changeDirection);

gameStart();

function gameStart() {
    running = true;
    ScoreText.textContent = score;
    createFood();
    drawFood();
    nextTick();
}

function nextTick() {
    if (running) {
        setTimeout(() => {
            clearBoard();
            drawFood();
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

function clearBoard() {
    ctx.fillStyle = BoardBg;
    ctx.fillRect(0, 0, GameWidth, GameHeight);
}

function createFood() {
    while (apples.length < maxApples) {
        const appleX = Math.floor(Math.random() * (GameWidth / UnitSize)) * UnitSize;
        const appleY = Math.floor(Math.random() * (GameHeight / UnitSize)) * UnitSize;
        const appleColor = getRandomColor();
        apples.push({ x: appleX, y: appleY, color: appleColor });
    }
}

function drawFood() {
    apples.forEach(apple => {
        ctx.fillStyle = apple.color;
        ctx.fillRect(apple.x, apple.y, UnitSize, UnitSize);
    });
}

function moveSnake() {
    const head = { x: snake[0].x + xVelocity, y: snake[0].y + yVelocity };
    snake.unshift(head);

    const ateFood = apples.some(apple => apple.x === head.x && apple.y === head.y);
    if (ateFood) {
        score += 10;
        ScoreText.textContent = "Score: " + score;
        apples = apples.filter(apple => apple.x !== head.x || apple.y !== head.y);
        createFood();
    } else {
        snake.pop();
    }
}

function drawSnake() {
    snake.forEach(segment => {
        ctx.fillStyle = getRandomColor();
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

function getRandomColor() {
    const colors = ["red", "yellow", "green", "blue", "purple", "orange"];
    return colors[Math.floor(Math.random() * colors.length)];
}
