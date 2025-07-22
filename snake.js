const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const box = 20;
const canvasSize = 400;
let snake = [{x: 9 * box, y: 10 * box}];
let direction = null;
let food = randomFood();
let score = 0;
let game;

function randomFood() {
    return {
        x: Math.floor(Math.random() * (canvasSize / box)) * box,
        y: Math.floor(Math.random() * (canvasSize / box)) * box
    };
}

function draw() {
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? '#5dc5ff' : '#2d6cdf';
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = '#222';
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = '#ff5d5d';
    ctx.fillRect(food.x, food.y, box, box);

    document.getElementById('score').innerText = `점수: ${score}`;
}

function moveSnake() {
    let head = {x: snake[0].x, y: snake[0].y};

    if (direction === 'LEFT') head.x -= box;
    if (direction === 'UP') head.y -= box;
    if (direction === 'RIGHT') head.x += box;
    if (direction === 'DOWN') head.y += box;

    // 벽 충돌
    if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize) {
        gameOver();
        return;
    }
    // 자기 몸 충돌
    for (let i = 0; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
            return;
        }
    }
    // 먹이 먹기
    if (head.x === food.x && head.y === food.y) {
        score++;
        food = randomFood();
    } else {
        snake.pop();
    }
    snake.unshift(head);
}

function gameLoop() {
    moveSnake();
    draw();
}

function gameOver() {
    clearInterval(game);
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0, 0, canvasSize, canvasSize);
    ctx.fillStyle = '#fff';
    ctx.font = '2em Segoe UI, Arial';
    ctx.textAlign = 'center';
    ctx.fillText('게임 오버!', canvasSize/2, canvasSize/2);
    ctx.font = '1.1em Segoe UI, Arial';
    ctx.fillText(`최종 점수: ${score}`, canvasSize/2, canvasSize/2 + 40);
}

function restartGame() {
    snake = [{x: 9 * box, y: 10 * box}];
    direction = null;
    food = randomFood();
    score = 0;
    clearInterval(game);
    game = setInterval(gameLoop, 110);
}

document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
    else if (e.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
    else if (e.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
    else if (e.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
    if (!game) game = setInterval(gameLoop, 110);
});

// 모바일 터치 컨트롤
let touchStartX, touchStartY;
canvas.addEventListener('touchstart', e => {
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
});
canvas.addEventListener('touchend', e => {
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartX;
    const dy = touch.clientY - touchStartY;
    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0 && direction !== 'LEFT') direction = 'RIGHT';
        else if (dx < 0 && direction !== 'RIGHT') direction = 'LEFT';
    } else {
        if (dy > 0 && direction !== 'UP') direction = 'DOWN';
        else if (dy < 0 && direction !== 'DOWN') direction = 'UP';
    }
    if (!game) game = setInterval(gameLoop, 110);
});

draw();
