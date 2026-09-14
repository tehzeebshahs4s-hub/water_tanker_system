function backtrackSlotAllocation(sources, tankers, timeSlots, options = {}) {
  const startTime = performance.now();
  const {
    maxIterations = 10000,
    priorityWeight = { critical: 4, high: 3, medium: 2, low: 1 }
  } = options;

  const steps = [];
  let iterations = 0;
  let solutionsFound = 0;

  const slotMap = {};
  sources.forEach(source => {
    slotMap[source.sourceId] = {};
    for (let hour = 6; hour < 20; hour++) {
      slotMap[source.sourceId][hour] = {
        available: true,
        assigned: null,
        priority: 0
      };
    }
  });

  const requests = tankers.map(tanker => ({
    tankerId: tanker.tankerId,
    sourceId: tanker.preferredSource || sources[0].sourceId,
    requestedHour: tanker.requestedHour || 8,
    priority: tanker.priority || 'medium',
    duration: tanker.loadingDuration || 1
  }));

  requests.sort((a, b) => {
    const pw = { critical: 4, high: 3, medium: 2, low: 1 };
    return pw[b.priority] - pw[a.priority];
  });

  function canAssign(request, hour) {
    if (hour < 6 || hour >= 20) return false;
    if (!slotMap[request.sourceId][hour].available) return false;

    for (let h = hour; h < hour + request.duration; h++) {
      if (h >= 20 || !slotMap[request.sourceId][h].available) return false;
    }
    return true;
  }

  function assignSlot(request, hour) {
    const assignment = [];
    for (let h = hour; h < hour + request.duration; h++) {
      slotMap[request.sourceId][h].available = false;
      slotMap[request.sourceId][h].assigned = request.tankerId;
      slotMap[request.sourceId][h].priority = priorityWeight[request.priority];
      assignment.push(h);
    }
    return assignment;
  }

  function unassignSlot(request, hour) {
    for (let h = hour; h < hour + request.duration; h++) {
      slotMap[request.sourceId][h].available = true;
      slotMap[request.sourceId][h].assigned = null;
      slotMap[request.sourceId][h].priority = 0;
    }
  }

  const assignments = [];
  const conflicts = [];

  function solve(requestIndex) {
    if (iterations >= maxIterations) return false;
    iterations++;

    if (requestIndex >= requests.length) {
      solutionsFound++;
      return true;
    }

    const request = requests[requestIndex];
    const preferredHour = request.requestedHour;

    steps.push({
      step: steps.length + 1,
      tanker: request.tankerId,
      source: request.sourceId,
      tryingHour: preferredHour,
      action: 'attempting'
    });

    if (canAssign(request, preferredHour)) {
      const assignedHours = assignSlot(request, preferredHour);
      assignments.push({
        tankerId: request.tankerId,
        sourceId: request.sourceId,
        hour: preferredHour,
        duration: request.duration,
        priority: request.priority,
        assignedHours,
        delay: 0
      });

      steps.push({
        step: steps.length + 1,
        tanker: request.tankerId,
        hour: preferredHour,
        action: 'assigned',
        delay: 0
      });

      if (solve(requestIndex + 1)) return true;

      unassignSlot(request, preferredHour);
      assignments.pop();
    }

    for (let offset = 1; offset <= 12; offset++) {
      if (iterations >= maxIterations) return false;

      const altHour = preferredHour + offset;
      if (canAssign(request, altHour)) {
        const assignedHours = assignSlot(request, altHour);
        assignments.push({
          tankerId: request.tankerId,
          sourceId: request.sourceId,
          hour: altHour,
          duration: request.duration,
          priority: request.priority,
          assignedHours,
          delay: offset
        });

        steps.push({
          step: steps.length + 1,
          tanker: request.tankerId,
          hour: altHour,
          action: 'assigned (alternate)',
          delay: offset
        });

        if (solve(requestIndex + 1)) return true;

        unassignSlot(request, altHour);
        assignments.pop();
      }

      const altHourBack = preferredHour - offset;
      if (altHourBack >= 6 && canAssign(request, altHourBack)) {
        const assignedHours = assignSlot(request, altHourBack);
        assignments.push({
          tankerId: request.tankerId,
          sourceId: request.sourceId,
          hour: altHourBack,
          duration: request.duration,
          priority: request.priority,
          assignedHours,
          delay: -offset
        });

        steps.push({
          step: steps.length + 1,
          tanker: request.tankerId,
          hour: altHourBack,
          action: 'assigned (earlier)',
          delay: -offset
        });

        if (solve(requestIndex + 1)) return true;

        unassignSlot(request, altHourBack);
        assignments.pop();
      }
    }

    conflicts.push({
      tankerId: request.tankerId,
      sourceId: request.sourceId,
      reason: 'No available slot found'
    });

    steps.push({
      step: steps.length + 1,
      tanker: request.tankerId,
      action: 'conflict - no slot available'
    });

    return false;
  }

  solve(0);

  const scheduled = assignments.filter(a => a.delay === 0);
  const delayed = assignments.filter(a => a.delay > 0);
  const totalDelay = assignments.reduce((sum, a) => sum + Math.abs(a.delay), 0);

  return {
    success: assignments.length > 0,
    assignments,
    conflicts,
    scheduled,
    delayed,
    statistics: {
      totalAssigned: assignments.length,
      totalConflicts: conflicts.length,
      scheduledOnTime: scheduled.length,
      scheduledWithDelay: delayed.length,
      totalDelayHours: totalDelay,
      averageDelay: assignments.length > 0 ? (totalDelay / assignments.length).toFixed(2) : 0,
      iterations,
      solutionsFound
    },
    slotMap,
    steps,
    complexity: {
      time: 'O(m^n) worst case, pruned with heuristics',
      space: 'O(n + m * T) where n=tankers, m=hours, T=timeSlots'
    },
    executionTime: performance.now() - startTime
  };
}

function backtrackSimple(requests, availableSlots) {
  const startTime = performance.now();
  const assignments = [];
  const steps = [];

  const sortedRequests = [...requests].sort((a, b) => {
    const pw = { critical: 4, high: 3, medium: 2, low: 1 };
    return pw[b.priority] - pw[a.priority];
  });

  const usedSlots = new Set();

  function solve(idx) {
    if (idx >= sortedRequests.length) return true;

    const request = sortedRequests[idx];
    for (const slot of availableSlots) {
      if (!usedSlots.has(slot.id)) {
        usedSlots.add(slot.id);
        assignments.push({ ...request, assignedSlot: slot });
        steps.push({ request: request.id, slot: slot.id, action: 'assigned' });

        if (solve(idx + 1)) return true;

        usedSlots.delete(slot.id);
        assignments.pop();
        steps.push({ request: request.id, slot: slot.id, action: 'backtrack' });
      }
    }
    return false;
  }

  solve(0);

  return {
    success: assignments.length > 0,
    assignments,
    steps,
    executionTime: performance.now() - startTime
  };
}

module.exports = { backtrackSlotAllocation, backtrackSimple };
