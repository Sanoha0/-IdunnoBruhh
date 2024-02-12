document.addEventListener("DOMContentLoaded", function() {
    const GameBoard = document.querySelector("#GameBoard");
    const ctx = GameBoard.getContext("2d");
    const ScoreText = document.querySelector("#ScoreText");
    const ResetBtn = document.querySelector("#ResetBtn");
    const GameWidth = GameBoard.width;
    const GameHeight = GameBoard.height;
    const BoardBg = "black";
    const SnakeColor = "lightblue";
    const SnakeBorder = "black";
    const FoodColor = "red";
    const UnitSize = 25;
    const maxApples = 5; // Maximum number of apples
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
                snakeMoves(); // Call snakeMoves instead of moveSnake
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
        for (let i = 0; i < maxApples; i++) {
            let appleX = Math.floor(Math.random() * (GameWidth / UnitSize)) * UnitSize;
            let appleY = Math.floor(Math.random() * (GameHeight / UnitSize)) * UnitSize;
            apples.push({ x: appleX, y: appleY });
        }
    }

    function drawFood() {
        ctx.fillStyle = FoodColor;
        apples.forEach(apple => {
            ctx.fillRect(apple.x, apple.y, UnitSize, UnitSize);
        });
    }

    function snakeMoves() {
        // Calculate the new head position
        const newHead = { x: snake[0].x + xVelocity, y: snake[0].y + yVelocity };

        // Check if the new head collides with any apple
        const ateFood = checkAppleCollision(newHead);

        // If the snake ate an apple, increment the score and remove the eaten apple
        if (ateFood) {
            score += 10;
            ScoreText.textContent = "Score: " + score;
            removeEatenApple(newHead);
        } else {
            // If no apple was eaten, remove the tail of the snake to simulate movement
            snake.pop();
        }

        // Add the new head to the snake
        snake.unshift(newHead);
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
        ctx.fillStyle = "white";
        ctx.font = "40px Arial";
        ctx.fillText("Game Over!", 200, 300);
    }

    function checkAppleCollision(newHead) {
        // Iterate through each apple to check for collision with the new head
        for (let i = 0; i < apples.length; i++) {
            if (newHead.x === apples[i].x && newHead.y === apples[i].y) {
                return true; // Collision detected
            }
        }
        return false; // No collision detected
    }

    function removeEatenApple(newHead) {
        // Iterate through each apple to find the one eaten by the snake
        for (let i = 0; i < apples.length; i++) {
            if (newHead.x === apples[i].x && newHead.y === apples[i].y) {
                // Remove the eaten apple from the apples array
                apples.splice(i, 1);
                // Break the loop as we found the eaten apple
                break;
            }
        }
    }
});
