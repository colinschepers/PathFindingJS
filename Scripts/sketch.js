const canvasSize = 800;
const menuSize = 100;
const delay = 300;

var gridSize, grid, cellSize, isSolving, clickedCellState;
var startX, startY, goalX, goalY;

function setup() {
    createCanvas(canvasSize, canvasSize + menuSize);
    initGrid(10);
}

function draw() {
    noStroke();
    background(0);
    drawGrid();
    drawCells();
}

function drawGrid() {
    stroke(255);
    for (let i = 0; i <= canvasSize; i += cellSize) {
        line(i, 0, i, canvasSize);
        line(0, i, canvasSize, i);
    }
}

function drawCells() {
    noStroke();
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            if (x === start.x && y === start.y) {
                fill(0, 255, 0);
            } else if (x === goal.x && y === goal.y) {
                fill(255, 0, 0);
            } else if (!grid[x][y]) {
                fill(255);
            } else {
                continue;
            }
            rect(x * cellSize, y * cellSize, cellSize, cellSize)
        }
    }
}

function initGrid(size) {
    gridSize = size;
    grid = new Array(gridSize).fill(true).map(() => new Array(gridSize).fill(true));
    cellSize = canvasSize / gridSize;
    isSolving = false;
    clickedCellState = 0;
    start = {
        x: 0,
        y: 0
    };
    goal = {
        x: gridSize - 1,
        y: gridSize - 1
    };
}

function mousePressed() {
    const location = getMouseCell();
    if (location) {
        if (location.x == start.x && location.y == start.y) {
            clickedCellState = 'start';
        } else if (location.x == goal.x && location.y == goal.y) {
            clickedCellState = 'goal';
        } else {
            clickedCellState = !grid[location.x][location.y];
            grid[location.x][location.y] = clickedCellState;
        }
    }
}

function mouseDragged() {
    const location = getMouseCell();
    if (location) {
        if (clickedCellState === 'start' && grid[location.x][location.y]) {
            start.x = location.x;
            start.y = location.y;
        } else if (clickedCellState === 'goal' && grid[location.x][location.y]) {
            goal.x = location.x;
            goal.y = location.y;
        } else if ((clickedCellState === true || clickedCellState === false) &&
            (location.x != start.x || location.y != start.y) &&
            (location.x != goal.x || location.y != goal.y)) {
            grid[location.x][location.y] = clickedCellState;
        }
    }
}

function getMouseCell() {
    if (!isSolving && mouseX >= 0 && mouseX < canvasSize && mouseY >= 0 && mouseY < canvasSize) {
        return {
            x: Math.floor(mouseX / cellSize),
            y: Math.floor(mouseY / cellSize)
        };
    }
    return undefined;
}