const express = require('express');
const router = express.Router();
const Tanker = require('../models/Tanker');
const Area = require('../models/Area');
const Delivery = require('../models/Delivery');
const WaterSource = require('../models/WaterSource');

router.get('/dashboard', async (req, res) => {
  try {
    const [tankers, areas, deliveries, sources] = await Promise.all([
      Tanker.find(),
      Area.find(),
      Delivery.find(),
      WaterSource.find()
    ]);

    const totalTankers = tankers.length;
    const availableTankers = tankers.filter(t => t.status === 'available').length;
    const enRouteTankers = tankers.filter(t => t.status === 'en-route').length;
    const maintenanceTankers = tankers.filter(t => t.status === 'maintenance').length;

    const totalCapacity = tankers.reduce((sum, t) => sum + t.capacity, 0);
    const totalDemand = areas.reduce((sum, a) => sum + a.demand, 0);

    const pendingDeliveries = deliveries.filter(d => d.status === 'scheduled').length;
    const completedDeliveries = deliveries.filter(d => d.status === 'completed').length;
    const delayedDeliveries = deliveries.filter(d => d.status === 'delayed').length;

    const totalDelayCost = deliveries.reduce((sum, d) => sum + (d.delayCost || 0), 0);

    const priorityStats = {
      critical: areas.filter(a => a.priority === 'critical').length,
      high: areas.filter(a => a.priority === 'high').length,
      medium: areas.filter(a => a.priority === 'medium').length,
      low: areas.filter(a => a.priority === 'low').length
    };

    const sourcesStats = {
      total: sources.length,
      operational: sources.filter(s => s.operational).length,
      totalCapacity: sources.reduce((sum, s) => sum + s.capacity, 0),
      currentOutput: sources.reduce((sum, s) => sum + s.currentOutput, 0)
    };

    res.json({
      tankers: {
        total: totalTankers,
        available: availableTankers,
        enRoute: enRouteTankers,
        maintenance: maintenanceTankers,
        utilization: ((enRouteTankers / totalTankers) * 100).toFixed(1)
      },
      areas: {
        total: areas.length,
        priority: priorityStats,
        totalDemand,
        totalSupply: tankers.reduce((sum, t) => sum + t.currentLoad, 0)
      },
      deliveries: {
        total: deliveries.length,
        pending: pendingDeliveries,
        completed: completedDeliveries,
        delayed: delayedDeliveries,
        totalDelayCost
      },
      sources: sourcesStats,
      capacity: {
        totalTankerCapacity: totalCapacity,
        totalAreaDemand: totalDemand,
        supplyDemandRatio: (totalCapacity / totalDemand).toFixed(2)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/performance', async (req, res) => {
  try {
    const deliveries = await Delivery.find();

    const byStatus = {};
    deliveries.forEach(d => {
      byStatus[d.status] = (byStatus[d.status] || 0) + 1;
    });

    const byPriority = {};
    deliveries.forEach(d => {
      byPriority[d.priority] = (byPriority[d.priority] || 0) + 1;
    });

    const delays = deliveries.filter(d => d.delayMinutes > 0);
    const avgDelay = delays.length > 0
      ? delays.reduce((sum, d) => sum + d.delayMinutes, 0) / delays.length
      : 0;

    const hourlyDistribution = Array(14).fill(0);
    deliveries.forEach(d => {
      const hour = new Date(d.scheduledTime).getHours();
      if (hour >= 6 && hour < 20) {
        hourlyDistribution[hour - 6]++;
      }
    });

    res.json({
      totalDeliveries: deliveries.length,
      byStatus,
      byPriority,
      delays: {
        count: delays.length,
        averageMinutes: avgDelay.toFixed(1),
        totalCost: deliveries.reduce((sum, d) => sum + (d.delayCost || 0), 0)
      },
      hourlyDistribution
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/algorithm-comparison', (req, res) => {
  const comparison = {
    algorithms: [
      {
        name: "Dijkstra's Algorithm",
        type: "Route Optimization",
        timeComplexity: "O((V + E) log V)",
        spaceComplexity: "O(V + E)",
        bestFor: "Single-source shortest path",
        pros: ["Optimal solution", "Efficient with priority queue"],
        cons: ["Doesn't handle negative weights", "Single source only"]
      },
      {
        name: "Greedy Algorithm",
        type: "Resource Assignment",
        timeComplexity: "O(n * m * log n)",
        spaceComplexity: "O(n + m)",
        bestFor: "Quick resource allocation",
        pros: ["Fast execution", "Good for real-time decisions"],
        cons: ["Not always optimal", "Myopic decisions"]
      },
      {
        name: "Dynamic Programming",
        type: "Scheduling Optimization",
        timeComplexity: "O(n * T * k)",
        spaceComplexity: "O(k * T * n)",
        bestFor: "Constrained scheduling",
        pros: ["Optimal solution", "Handles complex constraints"],
        cons: ["High memory usage", "Slower for large inputs"]
      },
      {
        name: "Backtracking",
        type: "Slot Allocation",
        timeComplexity: "O(m^n) worst case",
        spaceComplexity: "O(n + m * T)",
        bestFor: "Constraint satisfaction",
        pros: ["Guaranteed solution if exists", "Flexible constraints"],
        cons: ["Exponential worst case", "Slow for large problems"]
      },
      {
        name: "Ford-Fulkerson",
        type: "Flow Optimization",
        timeComplexity: "O(E * max_flow)",
        spaceComplexity: "O(V + E)",
        bestFor: "Network flow maximization",
        pros: ["Finds max flow", "Identifies bottlenecks"],
        cons: ["Slow with large capacities", "Not polynomial"]
      }
    ]
  };

  res.json(comparison);
});

module.exports = router;
