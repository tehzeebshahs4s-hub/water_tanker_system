function greedyAssignment(tankers, areas, options = {}) {
  const startTime = performance.now();
  const {
    prioritizeDistance = true,
    maxAssignments = Infinity
  } = options;

  const steps = [];
  const assignments = [];
  const unassignedAreas = [...areas];
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

  const priorityWeight = { critical: 4, high: 3, medium: 2, low: 1 };

  const sortedAreas = unassignedAreas.sort((a, b) => {
    const priorityDiff = priorityWeight[b.priority] - priorityWeight[a.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return b.demand - a.demand;
  });

  for (const area of sortedAreas) {
    if (assignments.length >= maxAssignments) break;
    if (availableTankers.length === 0) break;

    let bestTanker = null;
    let bestScore = -Infinity;

    for (const tanker of availableTankers) {
      if (tanker.status !== 'available') continue;
      if (tanker.capacity < area.demand * 0.3) continue;

      const distance = calculateDistance(tanker.currentLocation, area.coordinates);
      const capacityFit = tanker.capacity / area.demand;
      const priorityScore = priorityWeight[area.priority];

      let score;
      if (prioritizeDistance) {
        score = (priorityScore * 100) + (capacityFit * 50) - (distance * 5);
      } else {
        score = (priorityScore * 100) + (capacityFit * 50);
      }

      if (score > bestScore) {
        bestScore = score;
        bestTanker = tanker;
      }
    }

    if (bestTanker) {
      const distance = calculateDistance(bestTanker.currentLocation, area.coordinates);
      const assignment = {
        tanker: bestTanker,
        area: area,
        distance: distance,
        estimatedTime: Math.round(distance * 3),
        score: bestScore,
        efficiency: (bestTanker.capacity / area.demand * 100).toFixed(1)
      };
      assignments.push(assignment);

      const tankerIdx = availableTankers.findIndex(t => t.tankerId === bestTanker.tankerId);
      if (tankerIdx > -1) availableTankers.splice(tankerIdx, 1);

      steps.push({
        step: steps.length + 1,
        area: area.name,
        tanker: bestTanker.tankerId,
        distance: distance.toFixed(2),
        score: bestScore.toFixed(2)
      });
    }
  }

  const unassigned = sortedAreas.filter(area =>
    !assignments.some(a => a.area.areaId === area.areaId)
  );

  const totalDistance = assignments.reduce((sum, a) => sum + a.distance, 0);
  const avgEfficiency = assignments.length > 0
    ? assignments.reduce((sum, a) => sum + parseFloat(a.efficiency), 0) / assignments.length
    : 0;

  return {
    success: assignments.length > 0,
    assignments,
    unassignedAreas: unassigned,
    statistics: {
      totalAssigned: assignments.length,
      totalUnassigned: unassigned.length,
      totalDistance: totalDistance.toFixed(2),
      averageEfficiency: avgEfficiency.toFixed(1),
      averageDistance: assignments.length > 0 ? (totalDistance / assignments.length).toFixed(2) : 0
    },
    steps,
    complexity: {
      time: 'O(n * m * log(n)) where n=areas, m=tankers',
      space: 'O(n + m)'
    },
    executionTime: performance.now() - startTime
  };
}

function greedyBatchAssignment(tankers, areas, batchSize = 5) {
  const results = [];
  const remainingTankers = [...tankers];
  const remainingAreas = [...areas];

  while (remainingAreas.length > 0 && remainingTankers.length > 0) {
    const batchAreas = remainingAreas.splice(0, batchSize);
    const result = greedyAssignment(remainingTankers, batchAreas);
    results.push(result);

    result.assignments.forEach(a => {
      const idx = remainingTankers.findIndex(t => t.tankerId === a.tanker.tankerId);
      if (idx > -1) remainingTankers.splice(idx, 1);
    });
  }

  return {
    batches: results,
    totalAssigned: results.reduce((sum, r) => sum + r.statistics.totalAssigned, 0),
    totalUnassigned: remainingAreas.length
  };
}

module.exports = { greedyAssignment, greedyBatchAssignment };
