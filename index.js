const GameBoard = document.querySelector("#GameBoard");
const ctx = GameBoard.getContext("2d");
const ScoreText = document.querySelector("#Score");
const ResetBtn = document.querySelector("#ResetBtn");
const GameWidth = GameBoard.width;
const GameHeight = GameBoard.height;
const BoardBg = "black";
const SnakeColor = "lightblue";
const SnakeBorder = "black";
const AppleColors = ["red", "yellow", "lightgreen", "pastelgreen", "orange"]; // New array for apple colors
const MaxApples = 5; // Maximum number of apples allowed
const UnitSize = 25;
let running = false;
let xVelocity = UnitSize;
let yVelocity = 0;
let foodX;
let foodY;
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
    createFood();
    createApples(); // Create apples when the game starts
    drawFood();
    drawApples(); // Draw apples when the game starts
    nextTick();
}

function nextTick() {
    if (running) {
        setTimeout(() => {
            clearBoard();
            drawFood();
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
    gameStart();
}

function clearBoard() {
    ctx.fillStyle = BoardBg;
    ctx.fillRect(0, 0, GameWidth, GameHeight);
}

function createFood() {
    foodX = Math.floor(Math.random() * (GameWidth / UnitSize)) * UnitSize;
    foodY = Math.floor(Math.random() * (GameHeight / UnitSize)) * UnitSize;
}

function drawFood() {
    ctx.fillStyle = "red"; // Always draw food as red
    ctx.fillRect(foodX, foodY, UnitSize, UnitSize);
}

function createApples() {
    apples = []; // Clear previous apples
    for (let i = 0; i < MaxApples; i++) {
        let apple = {
            x: Math.floor(Math.random() * (GameWidth / UnitSize)) * UnitSize,
            y: Math.floor(Math.random() * (GameHeight / UnitSize)) * UnitSize,
            color: AppleColors[Math.floor(Math.random() * AppleColors.length)]
        };
        apples.push(apple);
    }
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

    const ateFood = snake[0].x === foodX && snake[0].y === foodY;
    if (ateFood) {
        score += 10;
        ScoreText.textContent = "Score: " + score;
        createFood();
    } else {
        snake.pop();
    }
    // Check if snake ate an apple
    apples.forEach((apple, index) => {
        if (snake[0].x === apple.x && snake[0].y === apple.y) {
            score += 20; // Increase score for eating an apple
            ScoreText.textContent = "Score: " + score;
            apples.splice(index, 1); // Remove the eaten apple
            createApples(); // Create a new apple
        }
    });
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
