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

export function dijkstraClient(graph, source, destination, weightType = 'weight') {
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

  return {
    success: path[0] === source,
    path,
    totalDistance: distances[destination],
    steps
  };
}

export function greedyAssignmentClient(tankers, areas) {
  const assignments = [];
  const availableTankers = [...tankers];

  const calculateDistance = (loc1, loc2) => {
    const R = 6371;
    const dLat = (loc2.lat - loc1.lat) * Math.PI / 180;
    const dLon = (loc2.lng - loc1.lng) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(loc1.lat * Math.PI / 180) * Math.cos(loc2.lat * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const sortedAreas = [...areas].sort((a, b) => {
    const pw = { critical: 4, high: 3, medium: 2, low: 1 };
    return pw[b.priority] - pw[a.priority];
  });

  for (const area of sortedAreas) {
    let bestTanker = null;
    let bestScore = -Infinity;

    for (const tanker of availableTankers) {
      if (tanker.status !== 'available') continue;
      if (tanker.capacity < area.demand * 0.3) continue;

      const distance = calculateDistance(tanker.currentLocation, area.coordinates);
      const capacityFit = tanker.capacity / area.demand;
      const priorityScore = { critical: 4, high: 3, medium: 2, low: 1 }[area.priority];
      const score = (priorityScore * 100) + (capacityFit * 50) - (distance * 5);

      if (score > bestScore) {
        bestScore = score;
        bestTanker = tanker;
      }
    }

    if (bestTanker) {
      assignments.push({
        tanker: bestTanker,
        area: area,
        score: bestScore
      });
      const idx = availableTankers.findIndex(t => t.tankerId === bestTanker.tankerId);
      if (idx > -1) availableTankers.splice(idx, 1);
    }
  }

  return { assignments };
}

export function formatTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

export function formatDistance(km) {
  return `${km.toFixed(1)} km`;
}

export function getPriorityColor(priority) {
  const colors = {
    critical: 'bg-red-100 text-red-800',
    high: 'bg-orange-100 text-orange-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800'
  };
  return colors[priority] || 'bg-gray-100 text-gray-800';
}

export function getStatusColor(status) {
  const colors = {
    available: 'bg-green-100 text-green-800',
    'en-route': 'bg-blue-100 text-blue-800',
    loading: 'bg-yellow-100 text-yellow-800',
    maintenance: 'bg-red-100 text-red-800',
    scheduled: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    delayed: 'bg-orange-100 text-orange-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}
