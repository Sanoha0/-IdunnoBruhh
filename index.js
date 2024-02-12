const GameBoard = document.querySelector("#GameBoard");
const ctx = GameBoard.getContext("2d");
const Score = document.querySelector("#Score");
const ResetBtn = document.querySelector("#ResetBtn");
const GameWidth = GameBoard.width;
const GameHeight = GameBoard.height;
const BoardBg = "black";
const SnakeColor = "lightblue";
const SnakeBorder = "black";
const UnitSize = 25;
const MaxApples = 5; // Maximum number of apples
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
let apples = []; // Array to store apples

window.addEventListener("keydown", changeDirection);
ResetBtn.addEventListener("click", resetGame);

gameStart();

function gameStart() {
    running = true;
    ScoreText.textContent = score;
    createFood(MaxApples);
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

function createFood(maxApples) {
    while (apples.length < maxApples) {
        let appleX = Math.floor(Math.random() * (GameWidth / UnitSize)) * UnitSize;
        let appleY = Math.floor(Math.random() * (GameHeight / UnitSize)) * UnitSize;
        let appleColor = getRandomColor();
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

    const ateFood = apples.findIndex(apple => apple.x === head.x && apple.y === head.y);
    if (ateFood !== -1) {
        score += 10;
        ScoreText.textContent = "Score: " + score;
        apples.splice(ateFood, 1); // Remove eaten apple
        createFood(1); // Add one more apple
    } else {
        snake.pop();
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

function getRandomColor() {
    const colors = ["red", "yellow", "green", "blue", "purple", "orange"]; // Add more colors if needed
    return colors[Math.floor(Math.random() * colors.length)];
}
