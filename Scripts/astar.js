var openList = [];
var opened = new Set();
var cameFrom = {};
var costs = {};
var expectedCosts = {};
var path = [];
var current = null;
var maxExpectedCost = null;
var globalSimulationNr = 0;

function initAStar(start, goal) {
    openList = [];
    opened = new Set();
    cameFrom = {};
    costs = {};
    expectedCosts = {};
    path = [];
    current = start;
    maxExpectedCost = getHeuristicCost(start, goal);
    globalSimulationNr++;

    openList.push(start);
    opened.add(start);
    cameFrom[start] = start;
    costs[start] = 0;
    expectedCosts[start] = maxExpectedCost;

    aStar(globalSimulationNr);
}

function aStar(simulationNr) {
    if (paused) {
        setTimeout(function () {
            aStar(simulationNr);
        }, delay);
    } else if (current === goal) {
        backtrack(simulationNr);
    } else if (simulationNr == globalSimulationNr) {
        openList.sort(function (a, b) {
            return expectedCosts[b] - expectedCosts[a];
        });

        current = openList.pop();

        for (const neighbor of getNeighbors(current)) {
            var newCost = costs[current] + getCost(current, neighbor);

            if (!opened.has(neighbor) || newCost < costs[neighbor]) {
                cameFrom[neighbor] = current;
                costs[neighbor] = newCost;
                expectedCosts[neighbor] = newCost + getHeuristicCost(neighbor, goal);

                if (!openList.includes(neighbor)) {
                    openList.push(neighbor);
                    opened.add(neighbor);
                }
            }
        }

        if (openList.length > 0) {
            setTimeout(function () {
                aStar(simulationNr);
            }, delay);
        }
    }
}

function backtrack(simulationNr) {
    if (paused) {
        setTimeout(function () {
            backtrack(simulationNr);
        }, delay);
    } else if (simulationNr == globalSimulationNr && current in cameFrom && current !== start) {
        path.unshift(current);
        current = cameFrom[current];

        setTimeout(function () {
            backtrack(simulationNr);
        }, delay);
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

    if (allowDiagonal) {
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
    return manhattanDistance(from % gridSize, Math.floor(from / gridSize), to % gridSize, Math.floor(to / gridSize));
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