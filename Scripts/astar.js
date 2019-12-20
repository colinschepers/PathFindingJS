var openSet = new Set();
var cameFrom = {};
var costs = {};
var expectedCosts = {};
var path = [];
var current = null;
var maxExpectedCost = null;
var globalSimulationNr = 0;

function initAStar(start, goal) {
    openSet = new Set();
    cameFrom = {};
    costs = {};
    expectedCosts = {};
    path = [];
    current = start;
    maxExpectedCost = getHeuristicCost(start, goal);
    globalSimulationNr++;

    openSet.add(start);
    cameFrom[start] = start;
    costs[start] = 0;
    expectedCosts[start] = maxExpectedCost;

    getNextLocation(globalSimulationNr);
}

function getNextLocation(simulationNr) {
    if(simulationNr != globalSimulationNr) {
        return;
    }
    if(paused) {
        setTimeout(function() { getNextLocation(simulationNr); }, delay);
        return;
    }

    let minExpectedCost = Infinity;
    for (const item of openSet) {
        const expectedCost = expectedCosts[item];
        if (expectedCost < minExpectedCost) {
            current = item;
            minExpectedCost = expectedCost;
        }
    }

    openSet.delete(current);

    if(current !== goal) {
        setTimeout(function() { addNewLocations(simulationNr); }, delay);
    } else {
        setTimeout(function() { backtrack(simulationNr); }, delay);
    }
}

function addNewLocations(simulationNr) {
    if(simulationNr != globalSimulationNr) {
        return;
    }
    if(paused) {
        setTimeout(function() { addNewLocations(simulationNr); }, delay);
        return;
    }

    for (const neighbor of getNeighbors(current)) {
        var newCost = costs[current] + getCost(current, neighbor);

        if (!(neighbor in costs) || newCost < costs[neighbor]) {
            cameFrom[neighbor] = current;
            costs[neighbor] = newCost;
            expectedCosts[neighbor] = newCost + getHeuristicCost(neighbor, goal);
            openSet.add(neighbor);
        }
    }

    if(openSet.size > 0) {
        setTimeout(function() { getNextLocation(simulationNr); }, delay);
    }
}

function backtrack(simulationNr) {
    if(simulationNr != globalSimulationNr) {
        return;
    }
    if(paused) {
        setTimeout(function() { backtrack(simulationNr); }, delay);
        return;
    }

    path.unshift(current);
    current = cameFrom[current];

    if(current in cameFrom && current !== start) {
        setTimeout(function() { backtrack(simulationNr); }, delay);
    }
}

function getNeighbors(loc) {
    const neighbors = [];

    const canUp = loc - gridSize >= 0;
    const canDown = loc + gridSize < gridSize * gridSize;
    const canLeft = loc % gridSize > 0;
    const canRight = loc % gridSize < gridSize - 1;

    if (canUp && grid[loc - gridSize]) {
        neighbors.push(loc - gridSize);
    }
    if (canDown && grid[loc + gridSize]) {
        neighbors.push(loc + gridSize);
    }
    if (canLeft && grid[loc - 1]) {
        neighbors.push(loc - 1);
    }
    if (canRight && grid[loc + 1]) {
        neighbors.push(loc + 1);
    }

    if(canGoDiagonal) {
        if (canUp && canLeft && grid[loc - gridSize - 1] && (grid[loc - gridSize] || grid[loc - 1])) {
            neighbors.push(loc - gridSize - 1);
        }
        if (canUp && canRight && grid[loc - gridSize + 1] && (grid[loc - gridSize] || grid[loc + 1])) {
            neighbors.push(loc - gridSize + 1);
        }
        if (canDown && canLeft && grid[loc + gridSize - 1] && (grid[loc + gridSize] || grid[loc - 1])) {
            neighbors.push(loc + gridSize - 1);
        }
        if (canDown && canRight && grid[loc + gridSize + 1] && (grid[loc + gridSize] || grid[loc + 1])) {
            neighbors.push(loc + gridSize + 1);
        }
    }

    return neighbors;
}

function getHeuristicCost(from, to) {
    return euclideanDistance(from % gridSize, Math.floor(from / gridSize), to % gridSize, Math.floor(to / gridSize));
}

function getCost(from, to) {
    return euclideanDistance(from % gridSize, Math.floor(from / gridSize), to % gridSize, Math.floor(to / gridSize));
}

function manhattanDistance(x1, y1, x2, y2) {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function euclideanDistance(x1, y1, x2, y2) {
    const dx = x1 - x2;
    const dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy);
}