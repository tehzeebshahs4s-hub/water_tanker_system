class MinHeap {
  constructor() {
    this.heap = [];
  }

  push(node) {
    this.heap.push(node);
    this.bubbleUp(this.heap.length - 1);
  }

  pop() {
    if (this.heap.length === 0) return null;
    const min = this.heap[0];
    const end = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = end;
      this.sinkDown(0);
    }
    return min;
  }

  bubbleUp(idx) {
    const element = this.heap[idx];
    while (idx > 0) {
      const parentIdx = Math.floor((idx - 1) / 2);
      const parent = this.heap[parentIdx];
      if (element.distance >= parent.distance) break;
      this.heap[parentIdx] = element;
      this.heap[idx] = parent;
      idx = parentIdx;
    }
  }

  sinkDown(idx) {
    const length = this.heap.length;
    const element = this.heap[idx];
    while (true) {
      const leftChildIdx = 2 * idx + 1;
      const rightChildIdx = 2 * idx + 2;
      let leftChild, rightChild;
      let swap = null;

      if (leftChildIdx < length) {
        leftChild = this.heap[leftChildIdx];
        if (leftChild.distance < element.distance) {
          swap = leftChildIdx;
        }
      }
      if (rightChildIdx < length) {
        rightChild = this.heap[rightChildIdx];
        if ((swap === null && rightChild.distance < element.distance) ||
            (swap !== null && rightChild.distance < leftChild.distance)) {
          swap = rightChildIdx;
        }
      }
      if (swap === null) break;
      this.heap[idx] = this.heap[swap];
      this.heap[swap] = element;
      idx = swap;
    }
  }

  isEmpty() {
    return this.heap.length === 0;
  }
}

function dijkstra(graph, source, destination, weightType = 'weight') {
  const startTime = performance.now();

  const distances = {};
  const previous = {};
  const visited = new Set();
  const steps = [];

  const nodes = new Set();
  graph.edges.forEach(edge => {
    nodes.add(edge.from);
    nodes.add(edge.to);
  });

  const adjacencyList = {};
  nodes.forEach(node => {
    adjacencyList[node] = [];
  });
  graph.edges.forEach(edge => {
    adjacencyList[edge.from].push({ node: edge.to, weight: edge[weightType] });
    adjacencyList[edge.to].push({ node: edge.from, weight: edge[weightType] });
  });

  nodes.forEach(node => {
    distances[node] = Infinity;
    previous[node] = null;
  });
  distances[source] = 0;

  const pq = new MinHeap();
  pq.push({ node: source, distance: 0 });

  while (!pq.isEmpty()) {
    const current = pq.pop();
    const currentNode = current.node;

    if (visited.has(currentNode)) continue;
    visited.add(currentNode);

    steps.push({
      step: steps.length + 1,
      currentNode,
      distances: { ...distances },
      visited: [...visited]
    });

    if (currentNode === destination) break;

    adjacencyList[currentNode].forEach(neighbor => {
      if (!visited.has(neighbor.node)) {
        const newDist = distances[currentNode] + neighbor.weight;
        if (newDist < distances[neighbor.node]) {
          distances[neighbor.node] = newDist;
          previous[neighbor.node] = currentNode;
          pq.push({ node: neighbor.node, distance: newDist });
        }
      }
    });
  }

  const path = [];
  let current = destination;
  while (current) {
    path.unshift(current);
    current = previous[current];
  }

  if (path[0] !== source) {
    return {
      success: false,
      message: 'No path found',
      steps,
      executionTime: performance.now() - startTime
    };
  }

  const totalDistance = distances[destination];
  const pathEdges = [];
  for (let i = 0; i < path.length - 1; i++) {
    const edge = graph.edges.find(e =>
      (e.from === path[i] && e.to === path[i + 1]) ||
      (e.to === path[i] && e.from === path[i + 1])
    );
    if (edge) {
      pathEdges.push({
        from: path[i],
        to: path[i + 1],
        weight: edge[weightType],
        distance: edge.distance,
        time: edge.time
      });
    }
  }

  return {
    success: true,
    path,
    pathEdges,
    totalDistance,
    totalTime: pathEdges.reduce((sum, e) => sum + e.time, 0),
    totalKm: pathEdges.reduce((sum, e) => sum + e.distance, 0),
    steps,
    complexity: {
      time: 'O((V + E) log V)',
      space: 'O(V + E)',
      vertices: nodes.size,
      edges: graph.edges.length
    },
    executionTime: performance.now() - startTime
  };
}

function dijkstraFromAllSources(graph, sources, destination, weightType = 'weight') {
  return sources.map(source => ({
    source,
    result: dijkstra(graph, source, destination, weightType)
  })).filter(r => r.result.success)
    .sort((a, b) => a.result.totalDistance - b.result.totalDistance);
}

function findAllPaths(graph, source, destination, maxPaths = 5) {
  const adjacencyList = {};
  graph.edges.forEach(edge => {
    if (!adjacencyList[edge.from]) adjacencyList[edge.from] = [];
    if (!adjacencyList[edge.to]) adjacencyList[edge.to] = [];
    adjacencyList[edge.from].push({ node: edge.to, weight: edge.weight });
    adjacencyList[edge.to].push({ node: edge.from, weight: edge.weight });
  });

  const allPaths = [];
  const visited = new Set();

  function dfs(current, path, totalWeight) {
    if (current === destination) {
      allPaths.push({ path: [...path], totalWeight });
      return;
    }
    if (allPaths.length >= maxPaths) return;

    visited.add(current);
    (adjacencyList[current] || []).forEach(neighbor => {
      if (!visited.has(neighbor.node)) {
        path.push(neighbor.node);
        dfs(neighbor.node, path, totalWeight + neighbor.weight);
        path.pop();
      }
    });
    visited.delete(current);
  }

  dfs(source, [source], 0);
  return allPaths.sort((a, b) => a.totalWeight - b.totalWeight);
}

module.exports = { dijkstra, dijkstraFromAllSources, findAllPaths };
