const canvasSize = 800;
const menuSize = 50;
const canGoDiagonal = true;

var grid, gridSize, cellSize;
var isSolving, clickedCellState;
var start, goal, delay, paused;
var gridSizeSlider, gridSizeInput, delaySlider, delayInput;

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
    if(gridSizeSlider.value() !== gridSize) {
        gridSize = gridSizeSlider.value();
        gridSizeInput.value(gridSizeSlider.value());
        resetGrid();
    } 
    if(delaySlider.value() !== delay) {
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

    fill(255);
    for (let i = 0; i < grid.length; i++) {
        if (!grid[i]) {
            rect((i % gridSize) * cellSize, Math.floor(i / gridSize) * cellSize, cellSize, cellSize)
        }
    }

    fill(255, 255, 0);
    for (let location of openSet) {
        rect((location % gridSize) * cellSize, Math.floor(location / gridSize) * cellSize, cellSize, cellSize)
    }

    for (let location in costs) {
        fill(0, 0, 55 + 200 * (costs[location] / maxExpectedCost));
        rect((location % gridSize) * cellSize, Math.floor(location / gridSize) * cellSize, cellSize, cellSize)
    }

    fill(255, 0, 255);
    for (let location of path) {
        rect((location % gridSize) * cellSize, Math.floor(location / gridSize) * cellSize, cellSize, cellSize)
    }

    fill(0, 255, 0);
    rect((start % gridSize) * cellSize, Math.floor(start / gridSize) * cellSize, cellSize, cellSize)

    fill(255, 0, 0);
    rect((goal % gridSize) * cellSize, Math.floor(goal / gridSize) * cellSize, cellSize, cellSize)

    ellipseMode(CENTER);
    fill(0);
    circle((current % gridSize) * cellSize + cellSize / 2,  Math.floor(current / gridSize) * cellSize + cellSize / 2, cellSize * 0.5, cellSize * 0.5)
}

function initMenu() {
    const itemWidth = canvasSize / 5;

    startButton = createButton('Start');
    startButton.position(itemWidth * 0, canvasSize);
    startButton.class('menu-item');
    startButton.style('height', menuSize + 'px');
    startButton.style('width', itemWidth + 'px');
    startButton.mousePressed(function() { paused = false; });

    pauseButton = createButton('Pause');
    pauseButton.position(itemWidth * 1, canvasSize);
    pauseButton.class('menu-item');
    pauseButton.style('height', menuSize + 'px');
    pauseButton.style('width', itemWidth + 'px');
    pauseButton.mousePressed(function() { paused = true; });

    gridSizeLabel = createButton('Grid size');
    gridSizeLabel.position(itemWidth * 2, canvasSize);
    gridSizeLabel.class('menu-item');
    gridSizeLabel.addClass('menu-item-no-hover');
    gridSizeLabel.style('height', menuSize / 2 + 'px');
    gridSizeLabel.style('width', itemWidth + 'px');

    gridSizeSlider = createSlider(5, 100, 100);
    gridSizeSlider.position(itemWidth * 2, canvasSize + menuSize / 2);
    gridSizeSlider.class('menu-item');
    gridSizeSlider.style('height', menuSize / 2 + 'px');
    gridSizeSlider.style('width', itemWidth * 0.7 + 'px');

    gridSizeInput = createInput('' + gridSizeSlider.value());
    gridSizeInput.position(itemWidth * 2.7, canvasSize + menuSize / 2);
    gridSizeInput.input(function() { gridSizeSlider.value(Math.max(Math.min(this.value(), 50), 5)); });
    gridSizeInput.class('menu-item');
    gridSizeInput.style('height', menuSize / 2 + 'px');
    gridSizeInput.style('width', itemWidth * 0.3 + 'px');

    delayLabel = createButton('Delay (ms)');
    delayLabel.position(itemWidth * 3, canvasSize);
    delayLabel.class('menu-item');
    delayLabel.addClass('menu-item-no-hover');
    delayLabel.style('height', menuSize / 2 + 'px');
    delayLabel.style('width', itemWidth + 'px');

    delaySlider = createSlider(0, 999, 0);
    delaySlider.position(itemWidth * 3, canvasSize + menuSize / 2);
    delaySlider.class('menu-item');
    delaySlider.style('height', menuSize / 2 + 'px');
    delaySlider.style('width', itemWidth * 0.7 + 'px');

    delayInput = createInput('' + delaySlider.value());
    delayInput.position(itemWidth * 3.7, canvasSize + menuSize / 2);
    delayInput.input(function() { if(this.value() >= 0 && this.value() <= 999) delaySlider.value(this.value()); });
    delayInput.class('menu-item');
    delayInput.style('height', menuSize / 2 + 'px');
    delayInput.style('width', itemWidth * 0.3 + 'px');

    resetButton = createButton('Clear');
    resetButton.position(itemWidth * 4, canvasSize);
    resetButton.class('menu-item');
    resetButton.style('height', menuSize + 'px');
    resetButton.style('width', itemWidth + 'px');
    resetButton.mousePressed(function() { resetGrid() });
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
    if (location) {
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
    if (location) {
        if (clickedCellState === 'start' && grid[location]) {
            start = location;
        } else if (clickedCellState === 'goal' && grid[location]) {
            goal = location;
        } else if ((clickedCellState === true || clickedCellState === false) && location != start &&  location != goal) {
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