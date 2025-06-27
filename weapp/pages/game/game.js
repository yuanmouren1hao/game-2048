const GRID_SIZE = 4;
const CELL_SIZE = 100;
const CELL_GAP = 10;

Page({
    data: {
        grid: Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(0)),
        tiles: [],
        score: 0,
        bestScore: 0,
        gameOver: false
    },

    onLoad() {
        this.initGame();
        this.loadBestScore();
    },

    initGame() {
        const grid = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(0));
        this.setData({
            grid: grid,
            tiles: [],
            score: 0,
            gameOver: false
        });
        this.addRandomTile();
        this.addRandomTile();
    },

    loadBestScore() {
        wx.getStorage({
            key: 'bestScore',
            success: (res) => {
                this.setData({ bestScore: res.data });
            }
        });
    },

    saveBestScore() {
        wx.setStorage({
            key: 'bestScore',
            data: this.data.bestScore
        });
    },

    newGame() {
        this.initGame();
    },

    addRandomTile() {
        if (this.data.gameOver) return;

        const emptyCells = [];
        this.data.grid.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell === 0) {
                    emptyCells.push({ x, y });
                }
            });
        });

        if (emptyCells.length > 0) {
            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            const value = Math.random() < 0.9 ? 2 : 4;

            const newGrid = [...this.data.grid];
            newGrid[randomCell.y][randomCell.x] = value;

            const newTile = {
                x: randomCell.x,
                y: randomCell.y,
                value: value,
                merged: false,
                new: true
            };

            this.setData({
                grid: newGrid,
                tiles: [...this.data.tiles, newTile]
            }, () => {
                // 添加后取消new标记
                setTimeout(() => {
                    const updatedTiles = this.data.tiles.map(tile => {
                        if (tile.x === randomCell.x && tile.y === randomCell.y) {
                            return { ...tile, new: false };
                        }
                        return tile;
                    });
                    this.setData({ tiles: updatedTiles });
                }, 200);
            });
        }
    },

    handleTouchStart(e) {
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;
    },

    handleTouchEnd(e) {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const dx = touchEndX - this.touchStartX;
        const dy = touchEndY - this.touchStartY;

        if (Math.abs(dx) > Math.abs(dy)) {
            // 水平滑动
            if (dx > 0) {
                this.moveRight();
            } else {
                this.moveLeft();
            }
        } else {
            // 垂直滑动
            if (dy > 0) {
                this.moveDown();
            } else {
                this.moveUp();
            }
        }
    },

    moveLeft() {
        if (this.data.gameOver) return;

        let moved = false;
        let scoreIncrease = 0;
        const newGrid = JSON.parse(JSON.stringify(this.data.grid));
        const newTiles = [];

        // 处理每一行
        for (let y = 0; y < GRID_SIZE; y++) {
            // 先移除所有空白格
            const row = newGrid[y].filter(cell => cell !== 0);
            // 合并相同数字
            for (let x = 0; x < row.length; x++) {
                if (x < row.length - 1 && row[x] === row[x + 1]) {
                    row[x] *= 2;
                    scoreIncrease += row[x];
                    row.splice(x + 1, 1);
                    moved = true;
                }
            }
            // 补齐空白格
            while (row.length < GRID_SIZE) {
                row.push(0);
            }
            newGrid[y] = row;
        }

        // 更新分数
        if (moved || scoreIncrease > 0) {
            const newScore = this.data.score + scoreIncrease;
            const newBestScore = Math.max(newScore, this.data.bestScore);

            this.setData({
                grid: newGrid,
                score: newScore,
                bestScore: newBestScore
            }, () => {
                this.updateTiles();
                this.addRandomTile();
                this.checkGameOver();
            });

            if (scoreIncrease > 0) {
                this.saveBestScore();
            }
        }
    },

    moveRight() {
        if (this.data.gameOver) return;

        let moved = false;
        let scoreIncrease = 0;
        const newGrid = JSON.parse(JSON.stringify(this.data.grid));
        const newTiles = [];

        // 处理每一行
        for (let y = 0; y < GRID_SIZE; y++) {
            // 先移除所有空白格
            const row = newGrid[y].filter(cell => cell !== 0);
            // 从右向左合并相同数字
            for (let x = row.length - 1; x > 0; x--) {
                if (row[x] === row[x - 1]) {
                    row[x] *= 2;
                    scoreIncrease += row[x];
                    row.splice(x - 1, 1);
                    moved = true;
                    x--; // 跳过下一个元素，防止连续合并
                }
            }
            // 补齐空白格到左侧
            while (row.length < GRID_SIZE) {
                row.unshift(0);
            }
            newGrid[y] = row;
        }

        // 更新分数
        if (moved || scoreIncrease > 0) {
            const newScore = this.data.score + scoreIncrease;
            const newBestScore = Math.max(newScore, this.data.bestScore);

            this.setData({
                grid: newGrid,
                score: newScore,
                bestScore: newBestScore
            }, () => {
                this.updateTiles();
                this.addRandomTile();
                this.checkGameOver();
            });

            if (scoreIncrease > 0) {
                this.saveBestScore();
            }
        }
    },

    moveUp() {
        if (this.data.gameOver) return;

        let moved = false;
        let scoreIncrease = 0;
        const newGrid = JSON.parse(JSON.stringify(this.data.grid));
        const newTiles = [];

        // 处理每一列
        for (let x = 0; x < GRID_SIZE; x++) {
            // 获取当前列并移除空白格
            const column = [];
            for (let y = 0; y < GRID_SIZE; y++) {
                if (newGrid[y][x] !== 0) {
                    column.push(newGrid[y][x]);
                }
            }
            // 合并相同数字
            for (let y = 0; y < column.length; y++) {
                if (y < column.length - 1 && column[y] === column[y + 1]) {
                    column[y] *= 2;
                    scoreIncrease += column[y];
                    column.splice(y + 1, 1);
                    moved = true;
                }
            }
            // 补齐空白格到下方
            while (column.length < GRID_SIZE) {
                column.push(0);
            }
            // 更新列数据
            for (let y = 0; y < GRID_SIZE; y++) {
                newGrid[y][x] = column[y];
            }
        }

        // 更新分数
        if (moved || scoreIncrease > 0) {
            const newScore = this.data.score + scoreIncrease;
            const newBestScore = Math.max(newScore, this.data.bestScore);

            this.setData({
                grid: newGrid,
                score: newScore,
                bestScore: newBestScore
            }, () => {
                this.updateTiles();
                this.addRandomTile();
                this.checkGameOver();
            });

            if (scoreIncrease > 0) {
                this.saveBestScore();
            }
        }
    },

    moveDown() {
        if (this.data.gameOver) return;

        let moved = false;
        let scoreIncrease = 0;
        const newGrid = JSON.parse(JSON.stringify(this.data.grid));
        const newTiles = [];

        // 处理每一列
        for (let x = 0; x < GRID_SIZE; x++) {
            // 获取当前列并移除空白格
            const column = [];
            for (let y = 0; y < GRID_SIZE; y++) {
                if (newGrid[y][x] !== 0) {
                    column.push(newGrid[y][x]);
                }
            }
            // 从下向上合并相同数字
            for (let y = column.length - 1; y > 0; y--) {
                if (column[y] === column[y - 1]) {
                    column[y] *= 2;
                    scoreIncrease += column[y];
                    column.splice(y - 1, 1);
                    moved = true;
                    y--; // 跳过下一个元素，防止连续合并
                }
            }
            // 补齐空白格到上方
            while (column.length < GRID_SIZE) {
                column.unshift(0);
            }
            // 更新列数据
            for (let y = 0; y < GRID_SIZE; y++) {
                newGrid[y][x] = column[y];
            }
        }

        // 更新分数
        if (moved || scoreIncrease > 0) {
            const newScore = this.data.score + scoreIncrease;
            const newBestScore = Math.max(newScore, this.data.bestScore);

            this.setData({
                grid: newGrid,
                score: newScore,
                bestScore: newBestScore
            }, () => {
                this.updateTiles();
                this.addRandomTile();
                this.checkGameOver();
            });

            if (scoreIncrease > 0) {
                this.saveBestScore();
            }
        }
    },

    updateTiles() {
        const tiles = [];
        this.data.grid.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    tiles.push({
                        x,
                        y,
                        value,
                        merged: false,
                        new: false
                    });
                }
            });
        });
        this.setData({ tiles });
    },

    checkGameOver() {
        // 检查是否还有空格
        for (let y = 0; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                if (this.data.grid[y][x] === 0) {
                    return false; // 还有空格，游戏继续
                }
            }
        }

        // 检查是否还有可合并的相邻方块
        for (let y = 0; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                const value = this.data.grid[y][x];
                // 检查右侧
                if (x < GRID_SIZE - 1 && this.data.grid[y][x + 1] === value) {
                    return false;
                }
                // 检查下方
                if (y < GRID_SIZE - 1 && this.data.grid[y + 1][x] === value) {
                    return false;
                }
            }
        }

        // 游戏结束
        this.setData({ gameOver: true });
        return true;
    }
});