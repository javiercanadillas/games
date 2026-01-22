const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const levelDisplay = document.getElementById('level');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const pauseResumeButton = document.getElementById('pauseResumeButton');
const difficultySelect = document.getElementById('difficultySelect');
const motivationalMessage = document.getElementById('motivationalMessage');

const ROW_COUNT = 20;
const COL_COUNT = 10;
const BLOCK_SIZE = canvas.width / COL_COUNT;

let board = [];
let currentTetromino = null;
let currentX = 0;
let currentY = 0;
let score = 0;
let level = 1;
let gameOver = false;
let gamePaused = false;
let gameInterval;
let gameSpeed = 500; // Milliseconds

// Tetromino shapes
const TETROMINOES = [
    // I
    [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
    // J
    [[1, 0, 0], [1, 1, 1], [0, 0, 0]],
    // L
    [[0, 0, 1], [1, 1, 1], [0, 0, 0]],
    // O
    [[1, 1], [1, 1]],
    // S
    [[0, 1, 1], [1, 1, 0], [0, 0, 0]],
    // T
    [[0, 1, 0], [1, 1, 1], [0, 0, 0]],
    // Z
    [[1, 1, 0], [0, 1, 1], [0, 0, 0]]
];

const COLORS = [
    'cyan', 'blue', 'orange', 'yellow', 'lime', 'purple', 'red'
];

function init() {
    for (let r = 0; r < ROW_COUNT; r++) {
        board[r] = [];
        for (let c = 0; c < COL_COUNT; c++) {
            board[r][c] = 0;
        }
    }
    score = 0;
    level = 1;
    gameOver = false;
    gamePaused = false;
    scoreDisplay.textContent = score;
    levelDisplay.textContent = level;
    motivationalMessage.classList.add('hidden');
    drawBoard();
    generateTetromino();
    startGameLoop();
}

function generateTetromino() {
    const rand = Math.floor(Math.random() * TETROMINOES.length);
    currentTetromino = {
        shape: TETROMINOES[rand],
        color: COLORS[rand],
        rotation: 0
    };
    currentX = Math.floor(COL_COUNT / 2) - Math.floor(currentTetromino.shape[0].length / 2);
    currentY = 0;

    if (!isValidMove(currentTetromino.shape, currentX, currentY)) {
        endGame();
    }
}

function drawBlock(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    ctx.strokeStyle = 'black';
    ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}

function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let r = 0; r < ROW_COUNT; r++) {
        for (let c = 0; c < COL_COUNT; c++) {
            if (board[r][c] !== 0) {
                drawBlock(c, r, board[r][c]);
            }
        }
    }
    drawTetromino();
}

function drawTetromino() {
    const shape = currentTetromino.shape;
    for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
            if (shape[r][c] === 1) {
                drawBlock(currentX + c, currentY + r, currentTetromino.color);
            }
        }
    }
}

function isValidMove(shape, x, y) {
    for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
            if (shape[r][c] === 1) {
                const newX = x + c;
                const newY = y + r;
                if (newX < 0 || newX >= COL_COUNT || newY >= ROW_COUNT || (newY >= 0 && board[newY][newX] !== 0)) {
                    return false;
                }
            }
        }
    }
    return true;
}

function mergeTetromino() {
    const shape = currentTetromino.shape;
    for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
            if (shape[r][c] === 1) {
                board[currentY + r][currentX + c] = currentTetromino.color;
            }
        }
    }
}

function clearLines() {
    let linesCleared = 0;
    for (let r = ROW_COUNT - 1; r >= 0; r--) {
        if (board[r].every(cell => cell !== 0)) {
            linesCleared++;
            for (let rowToMove = r; rowToMove > 0; rowToMove--) {
                board[rowToMove] = board[rowToMove - 1];
            }
            board[0] = Array(COL_COUNT).fill(0);
            r++; // Check the same row again as new one moved down
        }
    }
    if (linesCleared > 0) {
        if (linesCleared === 1) {
            score += 100 * level;
        } else if (linesCleared === 2) {
            score += 300 * level;
        } else if (linesCleared === 3) {
            score += 500 * level;
        } else if (linesCleared >= 4) {
            score += 800 * level;
        }
        scoreDisplay.textContent = score;
        if (score >= level * 1000) { // Level up
            level++;
            levelDisplay.textContent = level;
            gameSpeed = Math.max(50, gameSpeed - 50); // Increase speed
            clearInterval(gameInterval);
            startGameLoop();
        }
    }
}

function moveDown() {
    if (!gamePaused && !gameOver) {
        if (isValidMove(currentTetromino.shape, currentX, currentY + 1)) {
            currentY++;
        } else {
            mergeTetromino();
            clearLines();
            generateTetromino();
        }
        drawBoard();
    }
}

function rotateTetromino() {
    if (gamePaused || gameOver) return;

    const originalShape = currentTetromino.shape;
    const rotatedShape = [];
    for (let c = 0; c < originalShape[0].length; c++) {
        rotatedShape[c] = [];
        for (let r = 0; r < originalShape.length; r++) {
            rotatedShape[c][r] = originalShape[originalShape.length - 1 - r][c];
        }
    }

    if (isValidMove(rotatedShape, currentX, currentY)) {
        currentTetromino.shape = rotatedShape;
    } else if (isValidMove(rotatedShape, currentX - 1, currentY)) {
        currentTetromino.shape = rotatedShape;
        currentX--;
    } else if (isValidMove(rotatedShape, currentX + 1, currentY)) {
        currentTetromino.shape = rotatedShape;
        currentX++;
    }
    drawBoard();
}

function moveLeft() {
    if (gamePaused || gameOver) return;
    if (isValidMove(currentTetromino.shape, currentX - 1, currentY)) {
        currentX--;
        drawBoard();
    }
}

function moveRight() {
    if (gamePaused || gameOver) return;
    if (isValidMove(currentTetromino.shape, currentX + 1, currentY)) {
        currentX++;
        drawBoard();
    }
}

function startGameLoop() {
    clearInterval(gameInterval); // Clear any existing interval
    gameInterval = setInterval(moveDown, gameSpeed);
}

function endGame() {
    gameOver = true;
    clearInterval(gameInterval);
    motivationalMessage.textContent = `Game Over! Your score was ${score}. Keep trying, you'll get better!`;
    motivationalMessage.classList.remove('hidden');
    startButton.textContent = 'Play Again';
}

function togglePauseResume() {
    gamePaused = !gamePaused;
    if (gamePaused) {
        clearInterval(gameInterval);
        pauseResumeButton.textContent = 'Resume';
    } else {
        startGameLoop();
        pauseResumeButton.textContent = 'Pause';
    }
}

function setDifficulty(difficulty) {
    switch (difficulty) {
        case 'easy':
            gameSpeed = 700;
            break;
        case 'medium':
            gameSpeed = 500;
            break;
        case 'hard':
            gameSpeed = 300;
            break;
    }
    if (!gamePaused && !gameOver) {
        startGameLoop();
    }
}

// Event Listeners
startButton.addEventListener('click', () => {
    if (gameOver) {
        init();
    } else if (gamePaused) {
        togglePauseResume();
    } else {
        init();
    }
});

stopButton.addEventListener('click', endGame);
pauseResumeButton.addEventListener('click', togglePauseResume);
difficultySelect.addEventListener('change', (e) => setDifficulty(e.target.value));

document.addEventListener('keydown', (e) => {
    if (gameOver || gamePaused) return;
    switch (e.key) {
        case 'ArrowLeft':
            moveLeft();
            break;
        case 'ArrowRight':
            moveRight();
            break;
        case 'ArrowDown':
            moveDown();
            break;
        case 'ArrowUp':
            rotateTetromino();
            break;
    }
});

// Initial setup
init();