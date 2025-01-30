const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const cellSize = 20;
const gridSize = 20;
const speed = 150;
const colors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'];
let snake = [{x: 10, y: 10}];
let dx = 0;
let dy = 0;
let apple = {x: 15, y: 15};
let apples = 5;

function draw() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  snake.forEach(segment => {
    ctx.fillStyle = colors[snake.indexOf(segment) % colors.length];
    ctx.fillRect(segment.x * cellSize, segment.y * cellSize, cellSize, cellSize);
  });

  // Draw apple
  ctx.fillStyle = 'red';
  ctx.fillRect(apple.x * cellSize, apple.y * cellSize, cellSize, cellSize);
}

function move() {
  const head = {x: snake[0].x + dx, y: snake[0].y + dy};
  snake.unshift(head);

  // Check if the snake eats an apple
  if (head.x === apple.x && head.y === apple.y) {
    apples--;
    if (apples === 0) {
      apples = 5;
      // Respawn apple
      apple.x = Math.floor(Math.random() * gridSize);
      apple.y = Math.floor(Math.random() * gridSize);
    }
  } else {
    // Remove tail
    snake.pop();
  }
}

function gameOver() {
  clearInterval(interval);
  alert('Game Over!');
  window.location.reload();
}

function collision() {
  // Check if the snake collides with itself
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      return true;
    }
  }
  // Check if the snake goes out of bounds
  return (
    snake[0].x < 0 || snake[0].x >= gridSize ||
    snake[0].y < 0 || snake[0].y >= gridSize
  );
}

function update() {
  if (collision()) {
    gameOver();
  }
  move();
  draw();
}

function keyDown(event) {
  switch (event.key) {
    case 'ArrowUp':
      if (dy === 0) {
        dx = 0;
        dy = -1;
      }
      break;
    case 'ArrowDown':
      if (dy === 0) {
        dx = 0;
        dy = 1;
      }
      break;
    case 'ArrowLeft':
      if (dx === 0) {
        dx = -1;
        dy = 0;
      }
      break;
    case 'ArrowRight':
      if (dx === 0) {
        dx = 1;
        dy = 0;
      }
      break;
  }
}

document.addEventListener('keydown', keyDown);

// Main game loop
const interval = setInterval(update, speed);

