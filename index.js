// Existing code

document.addEventListener("DOMContentLoaded", function() {
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

    // New code
    const maxApples = 3; // Maximum number of apples
    let apples = []; // Array to hold multiple apples

    window.addEventListener("keydown", changeDirection);
    ResetBtn.addEventListener("click", resetGame);

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
                clearBoard(); // Clear the board first
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
        gameStart();
    }

    function clearBoard() {
        ctx.fillStyle = BoardBg;
        ctx.fillRect(0, 0, GameWidth, GameHeight);
    }

    function createFood() {
        apples = [];
        const types = ["red", "yellow", "white"]; // Define available types
        for (let i = 0; i < maxApples; i++) {
            let appleX = Math.floor(Math.random() * (GameWidth / UnitSize)) * UnitSize;
            let appleY = Math.floor(Math.random() * (GameHeight / UnitSize)) * UnitSize;
            let type = types[Math.floor(Math.random() * types.length)]; // Choose a random type
            apples.push({ x: appleX, y: appleY, type: type }); // Include type in apple object
        }
    }

    function drawFood() {
        apples.forEach(apple => {
            let color;
            switch (apple.type) {
                case "red":
                    color = "red";
                    break;
                case "yellow":
                    color = "yellow";
                    break;
                case "white":
                    color = "white";
                    break;
                default:
                    color = "red"; // Default color
            }
            ctx.fillStyle = color;
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
            createFood();
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
        running = false;
        ctx.fillStyle = "white";
        ctx.font = "40px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Game Over", GameWidth / 2, GameHeight / 2);
    }
});
