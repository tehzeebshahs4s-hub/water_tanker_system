function dpSchedule(deliveries, tankerCount, timeSlots, options = {}) {
  const startTime = performance.now();
  const {
    slotDuration = 60,
    maxDelayCost = 100,
    priorityWeight = { critical: 10, high: 5, medium: 3, low: 1 }
  } = options;

  const steps = [];

  const totalSlots = timeSlots;
  const dp = Array(tankerCount + 1).fill(null).map(() =>
    Array(totalSlots + 1).fill(null).map(() => ({
      cost: Infinity,
      assignments: []
    }))
  );

  for (let t = 0; t <= tankerCount; t++) {
    dp[t][0].cost = 0;
  }

  const sortedDeliveries = [...deliveries].sort((a, b) => {
    const pw = { critical: 4, high: 3, medium: 2, low: 1 };
    return pw[b.priority] - pw[a.priority];
  });

  for (let i = 1; i <= sortedDeliveries.length; i++) {
    const delivery = sortedDeliveries[i - 1];
    const deliveryTimeSlot = Math.floor((delivery.scheduledHour || 6) - 6);

    for (let t = 1; t <= tankerCount; t++) {
      const skipCost = dp[t - 1][i - 1].cost + (priorityWeight[delivery.priority] || 1) * maxDelayCost;

      let bestSlotCost = Infinity;
      let bestSlot = -1;

      for (let s = deliveryTimeSlot; s < totalSlots; s++) {
        const delaySlots = s - deliveryTimeSlot;
        const delayCost = delaySlots * (priorityWeight[delivery.priority] || 1) * 10;

        const slotAvailable = !dp[t][i - 1].assignments.some(a => a.slot === s);

        if (slotAvailable) {
          const totalSlotCost = dp[t][i - 1].cost + delayCost + (delivery.loadAmount || 5000) * 0.01;
          if (totalSlotCost < bestSlotCost) {
            bestSlotCost = totalSlotCost;
            bestSlot = s;
          }
        }
      }

      if (skipCost < bestSlotCost || bestSlot === -1) {
        dp[t][i] = {
          cost: skipCost,
          assignments: [...dp[t - 1][i - 1].assignments]
        };
      } else {
        dp[t][i] = {
          cost: bestSlotCost,
          assignments: [
            ...dp[t][i - 1].assignments,
            {
              delivery: delivery.deliveryId,
              tanker: t,
              slot: bestSlot,
              delay: bestSlot - deliveryTimeSlot,
              delayCost: (bestSlot - deliveryTimeSlot) * (priorityWeight[delivery.priority] || 1) * 10
            }
          ]
        };
      }
    }

    steps.push({
      step: i,
      delivery: delivery.deliveryId,
      priority: delivery.priority,
      bestCost: dp[tankerCount][i].cost.toFixed(2),
      assignmentsCount: dp[tankerCount][i].assignments.length
    });
  }

  const result = dp[tankerCount][sortedDeliveries.length];

  const schedule = result.assignments.map(a => ({
    ...a,
    startTime: 6 + a.slot,
    endTime: 6 + a.slot + 1,
    timeLabel: `${6 + a.slot}:00 - ${7 + a.slot}:00`
  }));

  const totalDelay = schedule.reduce((sum, s) => sum + s.delay, 0);
  const totalDelayCost = schedule.reduce((sum, s) => sum + s.delayCost, 0);
  const scheduledCount = schedule.length;
  const unscheduledCount = sortedDeliveries.length - scheduledCount;

  return {
    success: scheduledCount > 0,
    schedule,
    statistics: {
      totalScheduled: scheduledCount,
      unscheduled: unscheduledCount,
      totalDelaySlots: totalDelay,
      totalDelayCost: totalDelayCost.toFixed(2),
      averageDelay: scheduledCount > 0 ? (totalDelay / scheduledCount).toFixed(2) : 0,
      totalCost: result.cost.toFixed(2),
      utilizationRate: ((scheduledCount / totalSlots) * 100).toFixed(1)
    },
    steps,
    complexity: {
      time: 'O(n * T * k) where n=deliveries, T=timeSlots, k=tankers',
      space: 'O(k * T * n)'
    },
    executionTime: performance.now() - startTime
  };
}

function dpScheduleWithTimeWindows(deliveries, tankerCount, timeWindows) {
  const enhancedDeliveries = deliveries.map(d => ({
    ...d,
    earliestStart: timeWindows[d.deliveryId]?.start || 6,
    latestEnd: timeWindows[d.deliveryId]?.end || 20,
    maxDelay: (timeWindows[d.deliveryId]?.end || 20) - (d.scheduledHour || 6)
  }));

  return dpSchedule(enhancedDeliveries, tankerCount, 14);
}

module.exports = { dpSchedule, dpScheduleWithTimeWindows };
