const GameBoard = document.querySelector("#GameBoard");
const ctx = GameBoard.getContext("2d");
const ScoreText = document.querySelector("#Score");
const ResetBtn = document.querySelector("#ResetBtn");
const UpButton = document.querySelector("#UpButton");
const DownButton = document.querySelector("#DownButton");
const LeftButton = document.querySelector("#LeftButton");
const RightButton = document.querySelector("#RightButton");
const GameWidth = GameBoard.width;
const GameHeight = GameBoard.height;
const BoardBg = "black";
const UnitSize = 25;
const MaxApples = 5; // Maximum number of apples allowed
let running = false;
let xVelocity = UnitSize;
let yVelocity = 0;
let score = 0;
let snake = [{ x: 0, y: 0 }];
let apples = [];

// Background Animation
let gradientOffset = 0;

// Event listeners
window.addEventListener("keydown", changeDirection);
ResetBtn.addEventListener("click", resetGame);
UpButton.addEventListener("click", () => changeDirection({ key: "ArrowUp" }));
DownButton.addEventListener("click", () => changeDirection({ key: "ArrowDown" }));
LeftButton.addEventListener("click", () => changeDirection({ key: "ArrowLeft" }));
RightButton.addEventListener("click", () => changeDirection({ key: "ArrowRight" }));

gameStart();

function gameStart() {
    running = true;
    ScoreText.textContent = score;
    createApples(MaxApples); // Create apples up to the maximum allowed
    drawApples();
    nextTick();
    animateBackground();
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
    snake = [{ x: 0, y: 0 }];
    gameStart();
}

function clearBoard() {
    ctx.fillStyle = BoardBg;
    ctx.fillRect(0, 0, GameWidth, GameHeight);
}

function createApples(count) {
    const availableSpots = (GameWidth / UnitSize) * (GameHeight / UnitSize);
    const maxApplesToCreate = Math.min(count, availableSpots);
    for (let i = 0; i < maxApplesToCreate; i++) {
        const appleX = Math.floor(Math.random() * (GameWidth / UnitSize)) * UnitSize;
        const appleY = Math.floor(Math.random() * (GameHeight / UnitSize)) * UnitSize;
        apples.push({ x: appleX, y: appleY });
    }
}

function drawApples() {
    apples.forEach(apple => {
        ctx.fillStyle = "red"; // Apple color
        ctx.fillRect(apple.x, apple.y, UnitSize, UnitSize);
    });
}

function moveSnake() {
    const head = { x: snake[0].x + xVelocity, y: snake[0].y + yVelocity };
    snake.unshift(head);

    const ateFoodIndex = apples.findIndex(apple => apple.x === snake[0].x && apple.y === snake[0].y);
    if (ateFoodIndex !== -1) {
        const eatenApple = apples[ateFoodIndex];
        score += 10;
        ScoreText.textContent = "Score: " + score;
        apples.splice(ateFoodIndex, 1);
        createApples(1); // Create a new apple
        snake.push({}); // Add a new segment to the snake's body
    } else {
        snake.pop();
    }
}

function drawSnake() {
    snake.forEach((segment, index) => {
        let hue = (index / snake.length) * 360; // Hues from 0 to 360
        ctx.fillStyle = `hsl(${hue}, 100%, 50%)`; // Rainbow-colored snake
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

function animateBackground() {
    setInterval(() => {
        gradientOffset += 0.01;
        const gradient = ctx.createLinearGradient(0, 0, GameWidth, GameHeight);
        gradient.addColorStop(0, "rgba(0,0,0,0.8)");
        gradient.addColorStop(0.5, "rgba(0,0,50,0.6)");
        gradient.addColorStop(1, "rgba(0,0,100,0.8)");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, GameWidth, GameHeight);
        drawStars();
    }, 100);
}

function drawStars() {
    for (let i = 0; i < 100; i++) {
        const x = Math.random() * GameWidth;
        const y = Math.random() * GameHeight;
        const radius = Math.random() * 2;
        const brightness = Math.random();
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
        ctx.fill();
    }
}

// Your existing code goes here

// Define a variable to store the current color of the snake
let snakeColor = "lightblue";

// Function to generate a random color among red, blue, and yellow
function generateRandomColor() {
    const colors = ["red", "blue", "yellow"];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
}

// Function to update the snake color every second
function updateSnakeColor() {
    setInterval(() => {
        snakeColor = generateRandomColor();
    }, 1000);
}

// Function to update the snake size and color when it eats an apple
function updateSnakeSizeAndColor() {
    // Increase snake length by 1 block
    snake.push({});
    // Change snake color
    snakeColor = generateRandomColor();
}

// Modify the moveSnake function to update snake size and color when it eats an apple
function moveSnake() {
    const head = { x: snake[0].x + xVelocity, y: snake[0].y + yVelocity };
    snake.unshift(head);

    const ateFoodIndex = apples.findIndex(apple => apple.x === snake[0].x && apple.y === snake[0].y);
    if (ateFoodIndex !== -1) {
        const eatenApple = apples[ateFoodIndex];
        score += 10;
        ScoreText.textContent = "Score: " + score;
        apples.splice(ateFoodIndex, 1);
        createApples(1); // Create a new apple
        updateSnakeSizeAndColor(); // Update snake size and color
    } else {
        snake.pop();
    }
}

// Call the updateSnakeColor function to start the color change
updateSnakeColor();
