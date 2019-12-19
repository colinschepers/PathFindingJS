var openSet = new Set();
var cameFrom = {};
var costs = {};
var expectedCosts = {};
var path = [];

function getShortestPath(start, goal, delay) {
    openSet = new Set();
    cameFrom = {};
    costs = {};
    expectedCosts = {};
    path = [];

    openSet.add(start);
    cameFrom[start] = start;
    costs[start] = 0;
    expectedCosts[start] = getHeuristicCost(start, goal);

    setTimeout(getNextLocation, delay);

    while (openSet.Count > 0 && current !== goal) {
        setTimeout(addNewLocations, delay);
        setTimeout(getNextLocation, delay);
    }

    while (goal in cameFrom && goal !== start) {
        setTimeout(backtrack, delay);
    }

    return path;
}

function getNextLocation() {
    let current = null;
    let minExpectedCost = double.MaxValue;

    for (const item of openSet) {
        const expectedCost = expectedCosts[item];
        if (expectedCost < minExpectedCost) {
            current = item;
            minExpectedCost = expectedCost;
        }
    }

    openSet.remove(current);
}

function addNewLocations() {
    for (const neighbor of getNeighbors(current)) {
        var newCost = costs[current] + getCost(current, neighbor);
        if (!(neighbor in costs) || newCost < costs[neighbor]) {
            cameFrom[neighbor] = current;
            costs[neighbor] = newCost;
            expectedCosts[neighbor] = newCost + getHeuristicCost(neighbor, goal);
            openSet.add(neighbor);
        }
    }
}

function backtrack() {
    path.unshift(0, goal);
    goal = cameFrom[goal];
}

function getNeighbors(loc) {
    const neighbors = [];
    if (loc.x > 0 && grid[loc.x - 1][loc.y]) {
        neighbors.push({
            x: loc.x - 1,
            y: loc.y
        });
    }
    if (loc.x < gridSize - 1 && grid[loc.x + 1][loc.y]) {
        neighbors.push({
            x: loc.x + 1,
            y: loc.y
        });
    }
    if (loc.y > 0 && grid[loc.x][loc.y - 1]) {
        neighbors.push({
            x: loc.x,
            y: loc.y - 1
        });
    }
    if (loc.y < gridSize - 1 && grid[loc.x][loc.y + 1]) {
        neighbors.push({
            x: loc.x,
            y: loc.y + 1
        });
    }
    return neighbors;
}

function getHeuristicCost(from, to) {
    return Math.abs(from.x - to.x) + Math.abs(from.y - to.y);
}

function getCost(from, to) {
    return Math.abs(from.x - to.x) + Math.abs(from.y - to.y);
}