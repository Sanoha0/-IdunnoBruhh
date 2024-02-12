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
    ScoreText.textContent = "Score: " + score;
    placeApples();
    drawApples();
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

function placeApples() {
    placeRedApple();
    placeGreenApple();
    placeYellowApple();
    placeOrangeApple();
    placePaleGreenApple();
    apples.forEach(apple => {
        apple.newlyAdded = true;
    });
}

function drawApples() {
    apples.forEach(apple => {
        if (apple.moved || apple.newlyAdded) {
            ctx.fillStyle = apple.color;
            ctx.fillRect(apple.x, apple.y, UnitSize, UnitSize);
            apple.moved = false;
            apple.newlyAdded = false;
        }
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
            ScoreText.textContent = "Score: " + score; // Update the score display
            apples.splice(index, 1);
            appleEaten = true;
        } else {
            apple.moved = true;
        }
    });

    if (appleEaten) {
        placeApples();
    }

    snake.unshift(head);
    snake.pop();

    // Update snake velocity to move straight
    if (xVelocity !== 0) {
        yVelocity = 0;
    } else if (yVelocity !== 0) {
        xVelocity = 0;
    }
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
