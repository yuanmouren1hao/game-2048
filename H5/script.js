// 游戏常量
const GRID_SIZE = 4;
const START_TILES = 2;

// 游戏状态
let grid = [];
let score = 0;
let bestScore = localStorage.getItem('bestScore') || 0;
let gameOver = false;

// 初始化游戏
function initGame() {
    // 创建空网格
    grid = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(0));

    // 清空游戏界面
    document.querySelector('.grid').innerHTML = '';
    document.querySelector('.tile-container').innerHTML = '';

    // 重置分数和状态
    score = 0;
    gameOver = false;
    updateScore();

    // 创建网格背景
    createGrid();

    // 添加初始方块
    addRandomTile();
    addRandomTile();

    // 更新界面
    updateView();
}

// 创建网格背景
function createGrid() {
    const gridContainer = document.querySelector('.grid-container');
    const gridElement = document.querySelector('.grid');
    const tileContainer = document.querySelector('.tile-container');
    const cellSize = 100 / GRID_SIZE;

    // 确保tile-container存在
    if (!tileContainer) {
        const newTileContainer = document.createElement('div');
        newTileContainer.className = 'tile-container';
        gridContainer.appendChild(newTileContainer);
    }

    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.style.width = `${cellSize}%`;
            cell.style.height = `${cellSize}%`;
            cell.style.left = `${j * cellSize}%`;
            cell.style.top = `${i * cellSize}%`;
            gridElement.appendChild(cell);
        }
    }
}

// 添加随机方块
function addRandomTile() {
    if (!hasEmptyCell()) return;

    let row, col;
    do {
        row = Math.floor(Math.random() * GRID_SIZE);
        col = Math.floor(Math.random() * GRID_SIZE);
    } while (grid[row][col] !== 0);

    grid[row][col] = Math.random() < 0.9 ? 2 : 4;
}

// 检查是否有空格子
function hasEmptyCell() {
    return grid.some(row => row.some(cell => cell === 0));
}

// 更新游戏视图
function updateView() {
    const tileContainer = document.querySelector('.tile-container');
    tileContainer.innerHTML = '';

    const cellSize = 100 / GRID_SIZE;

    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            if (grid[i][j] !== 0) {
                const tile = document.createElement('div');
                tile.className = `tile tile-${grid[i][j]}`;
                tile.textContent = grid[i][j];
                tile.style.width = `${cellSize}%`;
                tile.style.height = `${cellSize}%`;
                tile.style.left = `${j * cellSize}%`;
                tile.style.top = `${i * cellSize}%`;
                tileContainer.appendChild(tile);
            }
        }
    }
}

// 更新分数显示
function updateScore() {
    document.getElementById('score').textContent = score;
    document.getElementById('best-score').textContent = bestScore;
}

// 检查游戏是否结束
function checkGameOver() {
    // 如果有空格子，游戏未结束
    if (hasEmptyCell()) return false;

    // 检查是否有相邻相同数字的方块
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            const current = grid[i][j];

            // 检查右侧方块
            if (j < GRID_SIZE - 1 && current === grid[i][j + 1]) {
                return false;
            }

            // 检查下方方块
            if (i < GRID_SIZE - 1 && current === grid[i + 1][j]) {
                return false;
            }
        }
    }

    return true;
}

// 移动方块
function moveTiles(direction) {
    if (gameOver) return;

    // 创建网格副本用于比较
    const oldGrid = JSON.parse(JSON.stringify(grid));

    // 根据方向处理移动
    switch (direction) {
        case 'up':
            for (let j = 0; j < GRID_SIZE; j++) {
                grid = moveColumn(grid, j, 'up');
            }
            break;
        case 'down':
            for (let j = 0; j < GRID_SIZE; j++) {
                grid = moveColumn(grid, j, 'down');
            }
            break;
        case 'left':
            for (let i = 0; i < GRID_SIZE; i++) {
                grid[i] = moveRow(grid[i], 'left');
            }
            break;
        case 'right':
            for (let i = 0; i < GRID_SIZE; i++) {
                grid[i] = moveRow(grid[i], 'right');
            }
            break;
    }

    // 检查是否有移动发生
    if (JSON.stringify(oldGrid) !== JSON.stringify(grid)) {
        addRandomTile();
        updateView();

        // 检查游戏是否结束
        if (checkGameOver()) {
            gameOver = true;
            setTimeout(() => alert('游戏结束！'), 100);
        }
    }
}

// 移动行
function moveRow(row, direction) {
    // 移除所有0
    let newRow = row.filter(cell => cell !== 0);

    // 合并相同数字
    if (direction === 'left') {
        for (let i = 0; i < newRow.length - 1; i++) {
            if (newRow[i] === newRow[i + 1]) {
                newRow[i] *= 2;
                newRow[i + 1] = 0;
                score += newRow[i];
                if (score > bestScore) {
                    bestScore = score;
                    localStorage.setItem('bestScore', bestScore);
                }
            }
        }
    } else {
        for (let i = newRow.length - 1; i > 0; i--) {
            if (newRow[i] === newRow[i - 1]) {
                newRow[i] *= 2;
                newRow[i - 1] = 0;
                score += newRow[i];
                if (score > bestScore) {
                    bestScore = score;
                    localStorage.setItem('bestScore', bestScore);
                }
            }
        }
    }

    // 再次移除0
    newRow = newRow.filter(cell => cell !== 0);

    // 根据方向填充0
    if (direction === 'left') {
        while (newRow.length < GRID_SIZE) {
            newRow.push(0);
        }
    } else {
        while (newRow.length < GRID_SIZE) {
            newRow.unshift(0);
        }
    }

    return newRow;
}

// 移动列
function moveColumn(grid, col, direction) {
    // 提取列
    let column = [];
    for (let i = 0; i < GRID_SIZE; i++) {
        column.push(grid[i][col]);
    }

    // 移动列
    if (direction === 'up') {
        column = moveRow(column, 'left');
    } else {
        column = moveRow(column, 'right');
    }

    // 将列放回网格
    for (let i = 0; i < GRID_SIZE; i++) {
        grid[i][col] = column[i];
    }

    return grid;
}

// 键盘事件处理
document.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowUp') {
        moveTiles('up');
    } else if (event.key === 'ArrowDown') {
        moveTiles('down');
    } else if (event.key === 'ArrowLeft') {
        moveTiles('left');
    } else if (event.key === 'ArrowRight') {
        moveTiles('right');
    }

    updateScore();
});

// 新游戏按钮
document.getElementById('new-game').addEventListener('click', function () {
    initGame();
});

// 初始化游戏
initGame();