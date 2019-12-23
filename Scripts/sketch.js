const canvasSize = 800;
const menuSize = 50;
const defaultGridSize = 50;
const defaultDelay = 0;

var grid, gridSize, cellSize;
var isSolving, clickedCellState;
var start, goal, delay, paused;
var gridSizeSlider, gridSizeInput, delaySlider, delayInput;
var allowDiagonal = true;
var showTraceLines = false;

function setup() {
    createCanvas(canvasSize, canvasSize + menuSize);
    initMenu();
}

function draw() {
    noStroke();
    background(0);
    updateVars();
    drawGrid();
    drawCells();
}

function updateVars() {
    if (gridSizeSlider.value() !== gridSize) {
        gridSize = gridSizeSlider.value();
        gridSizeInput.value(gridSizeSlider.value());
        resetGrid();
    }
    if (delaySlider.value() !== delay) {
        delay = delaySlider.value();
        delayInput.value(delaySlider.value());
    }
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

    for (let location in costs) {
        const value = 50 + 200 * (costs[location] / maxExpectedCost);
        fill(value, 0, 0);
        rect((location % gridSize) * cellSize, Math.floor(location / gridSize) * cellSize, cellSize, cellSize)
    }

    for (let i = 0; i < openList.length; i++) {
        const location = openList[i];
        const value = 100 + 155 * (i / openList.length);
        fill(value, value, 0);
        rect((location % gridSize) * cellSize, Math.floor(location / gridSize) * cellSize, cellSize, cellSize)
    }

    fill(200, 0, 200);
    for (let location of path) {
        rect((location % gridSize) * cellSize, Math.floor(location / gridSize) * cellSize, cellSize, cellSize)
    }

    fill(0, 255, 0);
    rect((start % gridSize) * cellSize, Math.floor(start / gridSize) * cellSize, cellSize, cellSize)

    fill(0, 0, 255);
    rect((goal % gridSize) * cellSize, Math.floor(goal / gridSize) * cellSize, cellSize, cellSize)

    fill(255);
    for (let i = 0; i < grid.length; i++) {
        if (!grid[i]) {
            rect((i % gridSize) * cellSize, Math.floor(i / gridSize) * cellSize, cellSize, cellSize)
        }
    }

    if (showTraceLines) {
        stroke(0);
        for (const to in cameFrom) {
            const from = cameFrom[to];
            line((from % gridSize) * cellSize + cellSize / 2,
                Math.floor(from / gridSize) * cellSize + cellSize / 2,
                (to % gridSize) * cellSize + cellSize / 2,
                Math.floor(to / gridSize) * cellSize + cellSize / 2);
        }
        noStroke();
    }

    ellipseMode(CENTER);
    fill(0, 255, 0);
    circle((current % gridSize) * cellSize + cellSize / 2, Math.floor(current / gridSize) * cellSize + cellSize / 2, cellSize * 0.5, cellSize * 0.5)
}

function initMenu() {
    const itemWidth = canvasSize / 5;

    startButton = createButton('Start');
    startButton.position(itemWidth * 0, canvasSize);
    startButton.class('menu-item');
    startButton.style('height', menuSize / 2 + 'px');
    startButton.style('width', itemWidth + 'px');
    startButton.mousePressed(function () {
        paused = false;
    });

    pauseButton = createButton('Pause');
    pauseButton.position(itemWidth * 0, canvasSize + menuSize / 2);
    pauseButton.class('menu-item');
    pauseButton.style('height', menuSize / 2 + 'px');
    pauseButton.style('width', itemWidth + 'px');
    pauseButton.mousePressed(function () {
        paused = true;
    });

    clearButton = createButton('Clear');
    clearButton.position(itemWidth * 1, canvasSize);
    clearButton.class('menu-item');
    clearButton.style('height', menuSize / 2 + 'px');
    clearButton.style('width', itemWidth + 'px');
    clearButton.mousePressed(function () {
        paused = true;
        initAStar(start, goal);
    });

    clearButton = createButton('Reset');
    clearButton.position(itemWidth * 1, canvasSize + menuSize / 2);
    clearButton.class('menu-item');
    clearButton.style('height', menuSize / 2 + 'px');
    clearButton.style('width', itemWidth + 'px');
    clearButton.mousePressed(function () {
        resetGrid();
    });

    traceLinesButton = createButton('Show trace lines');
    traceLinesButton.position(itemWidth * 2, canvasSize);
    traceLinesButton.class('menu-item');
    traceLinesButton.style('height', menuSize / 2 + 'px');
    traceLinesButton.style('width', itemWidth + 'px');
    traceLinesButton.mousePressed(function () {
        showTraceLines = !showTraceLines;
        this.toggleClass('menu-item-checked')
    });

    diagonalButton = createButton('Allow diagonal');
    diagonalButton.position(itemWidth * 2, canvasSize + menuSize / 2);
    diagonalButton.class('menu-item menu-item-checked');
    diagonalButton.style('height', menuSize / 2 + 'px');
    diagonalButton.style('width', itemWidth + 'px');
    diagonalButton.mousePressed(function () {
        allowDiagonal = !allowDiagonal;
        this.toggleClass('menu-item-checked')
    });

    gridSizeLabel = createButton('Grid size');
    gridSizeLabel.position(itemWidth * 3, canvasSize);
    gridSizeLabel.class('menu-item');
    gridSizeLabel.addClass('menu-item-no-hover');
    gridSizeLabel.style('height', menuSize / 2 + 'px');
    gridSizeLabel.style('width', itemWidth + 'px');

    gridSizeSlider = createSlider(5, 50, defaultGridSize);
    gridSizeSlider.position(itemWidth * 3, canvasSize + menuSize / 2);
    gridSizeSlider.class('menu-item');
    gridSizeSlider.style('height', menuSize / 2 + 'px');
    gridSizeSlider.style('width', itemWidth * 0.7 + 'px');

    gridSizeInput = createInput('' + gridSizeSlider.value());
    gridSizeInput.position(itemWidth * 3.7, canvasSize + menuSize / 2);
    gridSizeInput.input(function () {
        gridSizeSlider.value(Math.max(Math.min(this.value(), 50), 5));
    });
    gridSizeInput.class('menu-item');
    gridSizeInput.style('height', menuSize / 2 + 'px');
    gridSizeInput.style('width', itemWidth * 0.3 + 'px');

    delayLabel = createButton('Delay (ms)');
    delayLabel.position(itemWidth * 4, canvasSize);
    delayLabel.class('menu-item');
    delayLabel.addClass('menu-item-no-hover');
    delayLabel.style('height', menuSize / 2 + 'px');
    delayLabel.style('width', itemWidth + 'px');

    delaySlider = createSlider(0, 999, defaultDelay);
    delaySlider.position(itemWidth * 4, canvasSize + menuSize / 2);
    delaySlider.class('menu-item');
    delaySlider.style('height', menuSize / 2 + 'px');
    delaySlider.style('width', itemWidth * 0.7 + 'px');

    delayInput = createInput('' + delaySlider.value());
    delayInput.position(itemWidth * 4.7, canvasSize + menuSize / 2);
    delayInput.input(function () {
        if (this.value() >= 0 && this.value() <= 999) delaySlider.value(this.value());
    });
    delayInput.class('menu-item');
    delayInput.style('height', menuSize / 2 + 'px');
    delayInput.style('width', itemWidth * 0.3 + 'px');
}

function resetGrid() {
    const gridSize = gridSizeSlider.value();
    grid = new Array(gridSize * gridSize).fill(true);
    cellSize = canvasSize / gridSize;
    isSolving = false;
    clickedCellState = 0;
    start = 0;
    goal = gridSize * gridSize - 1;
    paused = true;
    initAStar(start, goal);
}

function mousePressed() {
    const location = getMouseCell();
    if (location !== undefined) {
        if (location == start) {
            clickedCellState = 'start';
        } else if (location == goal) {
            clickedCellState = 'goal';
        } else {
            clickedCellState = !grid[location];
            grid[location] = clickedCellState;
        }
    }
}

function mouseDragged() {
    const location = getMouseCell();
    if (location !== undefined) {
        if (clickedCellState === 'start' && grid[location]) {
            start = location;
            initAStar(start, goal);
        } else if (clickedCellState === 'goal' && grid[location]) {
            goal = location;
            initAStar(start, goal);
        } else if ((clickedCellState === true || clickedCellState === false) &&
            location != start && location != goal) {
            grid[location] = clickedCellState;
        }
    }
}

function getMouseCell() {
    if (!isSolving && mouseX >= 0 && mouseX < canvasSize && mouseY >= 0 && mouseY < canvasSize) {
        return Math.floor(mouseY / cellSize) * gridSize + Math.floor(mouseX / cellSize);
    }
    return undefined;
}