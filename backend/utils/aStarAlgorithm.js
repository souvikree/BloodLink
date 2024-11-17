// aStarAlgorithm.js

const aStar = (start, goal, graph) => {
    const openSet = new Set();
    const cameFrom = new Map();
    const gScore = new Map();
    const fScore = new Map();

    openSet.add(start);
    gScore.set(start, 0);
    fScore.set(start, heuristic(start, goal));

    while (openSet.size > 0) {
        const current = getLowestFScore(openSet, fScore);
        
        if (current === goal) {
            return reconstructPath(cameFrom, current);
        }

        openSet.delete(current);

        const neighbors = graph[current] || [];
        for (const neighbor of neighbors) {
            const tentativeGScore = (gScore.get(current) || Infinity) + distance(current, neighbor);

            if (tentativeGScore < (gScore.get(neighbor) || Infinity)) {
                cameFrom.set(neighbor, current);
                gScore.set(neighbor, tentativeGScore);
                fScore.set(neighbor, tentativeGScore + heuristic(neighbor, goal));

                if (!openSet.has(neighbor)) {
                    openSet.add(neighbor);
                }
            }
        }
    }

    return []; // Return an empty array if there's no path
};

// Heuristic function (Euclidean distance)
const heuristic = (a, b) => {
    // Replace this with your own heuristic calculation based on the graph's coordinates
    return Math.sqrt(Math.pow(b.latitude - a.latitude, 2) + Math.pow(b.longitude - a.longitude, 2));
};

// Function to get the lowest fScore from the openSet
const getLowestFScore = (openSet, fScore) => {
    let lowest = null;
    let lowestScore = Infinity;

    for (const node of openSet) {
        const score = fScore.get(node) || Infinity;
        if (score < lowestScore) {
            lowestScore = score;
            lowest = node;
        }
    }

    return lowest;
};

// Function to reconstruct the path from start to goal
const reconstructPath = (cameFrom, current) => {
    const totalPath = [current];
    while (cameFrom.has(current)) {
        current = cameFrom.get(current);
        totalPath.push(current);
    }
    return totalPath.reverse(); // Return the path in the correct order
};

// Function to calculate the distance between two nodes (could be based on actual road distance)
const distance = (a, b) => {
    // Replace with your own distance calculation
    return Math.sqrt(Math.pow(b.latitude - a.latitude, 2) + Math.pow(b.longitude - a.longitude, 2));
};

module.exports = aStar;
