function fordFulkerson(graph, source, sink) {
  const startTime = performance.now();

  const nodes = new Set();
  graph.edges.forEach(edge => {
    nodes.add(edge.from);
    nodes.add(edge.to);
  });

  const capacity = {};
  const flow = {};
  const adjacency = {};

  nodes.forEach(node => {
    adjacency[node] = new Set();
    capacity[node] = {};
    flow[node] = {};
  });

  graph.edges.forEach(edge => {
    capacity[edge.from][edge.to] = (capacity[edge.from][edge.to] || 0) + edge.capacity;
    capacity[edge.to][edge.from] = (capacity[edge.to][edge.from] || 0) + 0;
    flow[edge.from][edge.to] = 0;
    flow[edge.to][edge.from] = 0;
    adjacency[edge.from].add(edge.to);
    adjacency[edge.to].add(edge.from);
  });

  const steps = [];
  let totalFlow = 0;
  let iteration = 0;

  function bfs() {
    const visited = new Set();
    const queue = [[source, []]];
    visited.add(source);

    while (queue.length > 0) {
      const [current, path] = queue.shift();

      if (current === sink) {
        return path;
      }

      for (const neighbor of adjacency[current]) {
        if (!visited.has(neighbor)) {
          const residual = capacity[current][neighbor] - flow[current][neighbor];
          if (residual > 0) {
            visited.add(neighbor);
            queue.push([neighbor, [...path, { from: current, to: neighbor, capacity: capacity[current][neighbor], flow: flow[current][neighbor] }]]);
          }
        }
      }
    }
    return null;
  }

  let augmentingPath;
  while ((augmentingPath = bfs()) && iteration < 100) {
    iteration++;

    let bottleneck = Infinity;
    augmentingPath.forEach(edge => {
      const residual = capacity[edge.from][edge.to] - flow[edge.from][edge.to];
      bottleneck = Math.min(bottleneck, residual);
    });

    augmentingPath.forEach(edge => {
      flow[edge.from][edge.to] += bottleneck;
      flow[edge.to][edge.from] -= bottleneck;
    });

    totalFlow += bottleneck;

    steps.push({
      iteration,
      path: augmentingPath.map(e => `${e.from} -> ${e.to}`),
      bottleneck,
      totalFlow,
      pathFlow: augmentingPath.map(e => ({
        edge: `${e.from}-${e.to}`,
        flow: flow[e.from][e.to],
        capacity: capacity[e.from][e.to]
      }))
    });
  }

  const flowDistribution = [];
  graph.edges.forEach(edge => {
    if (flow[edge.from][edge.to] > 0) {
      flowDistribution.push({
        from: edge.from,
        to: edge.to,
        flow: flow[edge.from][edge.to],
        capacity: capacity[edge.from][edge.to],
        utilization: ((flow[edge.from][edge.to] / capacity[edge.from][edge.to]) * 100).toFixed(1)
      });
    }
  });

  const bottlenecks = [];
  nodes.forEach(node => {
    if (node !== source && node !== sink) {
      let inFlow = 0;
      let outFlow = 0;
      adjacency[node].forEach(neighbor => {
        inFlow += flow[neighbor][node] || 0;
        outFlow += flow[node][neighbor] || 0;
      });
      if (Math.abs(inFlow - outFlow) < 0.01) {
        const totalNodeFlow = Math.max(inFlow, outFlow);
        const totalCapacity = Array.from(adjacency[neighbor] || []).reduce((sum, n) =>
          sum + (capacity[node][n] || 0), 0);
        if (totalCapacity > 0 && totalNodeFlow / totalCapacity > 0.8) {
          bottlenecks.push({ node, utilization: (totalNodeFlow / totalCapacity * 100).toFixed(1) });
        }
      }
    }
  });

  return {
    success: totalFlow > 0,
    maxFlow: totalFlow,
    flowDistribution,
    bottlenecks,
    steps,
    statistics: {
      totalFlow,
      iterations,
      nodesCount: nodes.size,
      edgesWithFlow: flowDistribution.length,
      avgUtilization: flowDistribution.length > 0
        ? (flowDistribution.reduce((sum, f) => sum + parseFloat(f.utilization), 0) / flowDistribution.length).toFixed(1)
        : 0
    },
    complexity: {
      time: 'O(E * max_flow)',
      space: 'O(V + E)'
    },
    executionTime: performance.now() - startTime
  };
}

function fordFulkersonMultiSource(graph, sources, sinks) {
  const modifiedGraph = {
    edges: [...graph.edges]
  };

  const superSource = 'SUPER_SOURCE';
  const superSink = 'SUPER_SINK';

  sources.forEach(source => {
    modifiedGraph.edges.push({
      from: superSource,
      to: source,
      capacity: Infinity,
      weight: 0
    });
  });

  sinks.forEach(sink => {
    modifiedGraph.edges.push({
      from: sink,
      to: superSink,
      capacity: Infinity,
      weight: 0
    });
  });

  return fordFulkerson(modifiedGraph, superSource, superSink);
}

function minCut(graph, source, sink) {
  const result = fordFulkerson(graph, source, sink);

  const reachable = new Set();
  const queue = [source];
  reachable.add(source);

  while (queue.length > 0) {
    const current = queue.shift();
    graph.edges.forEach(edge => {
      if (edge.from === current && !reachable.has(edge.to)) {
        const residual = edge.capacity - (result.flowDistribution.find(f => f.from === current && f.to === edge.to)?.flow || 0);
        if (residual > 0) {
          reachable.add(edge.to);
          queue.push(edge.to);
        }
      }
    });
  }

  const minCutEdges = graph.edges.filter(edge =>
    reachable.has(edge.from) && !reachable.has(edge.to)
  );

  return {
    ...result,
    minCut: minCutEdges,
    reachableNodes: Array.from(reachable),
    cutCapacity: minCutEdges.reduce((sum, e) => sum + e.capacity, 0)
  };
}

module.exports = { fordFulkerson, fordFulkersonMultiSource, minCut };
