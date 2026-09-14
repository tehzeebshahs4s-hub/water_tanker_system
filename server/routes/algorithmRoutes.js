const express = require('express');
const router = express.Router();
const { dijkstra, dijkstraFromAllSources, findAllPaths } = require('../algorithms/dijkstra');
const { greedyAssignment, greedyBatchAssignment } = require('../algorithms/greedy');
const { dpSchedule, dpScheduleWithTimeWindows } = require('../algorithms/dynamicProgramming');
const { backtrackSlotAllocation, backtrackSimple } = require('../algorithms/backtracking');
const { fordFulkerson, fordFulkersonMultiSource, minCut } = require('../algorithms/fordFulkerson');
const roadNetwork = require('../../data/roadNetwork.js');

router.post('/dijkstra', (req, res) => {
  try {
    const { source, destination, weightType = 'weight' } = req.body;
    if (!source || !destination) {
      return res.status(400).json({ error: 'Source and destination are required' });
    }
    const result = dijkstra(roadNetwork, source, destination, weightType);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/dijkstra/all-sources', (req, res) => {
  try {
    const { sources, destination, weightType = 'weight' } = req.body;
    if (!sources || !destination) {
      return res.status(400).json({ error: 'Sources and destination are required' });
    }
    const result = dijkstraFromAllSources(roadNetwork, sources, destination, weightType);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/dijkstra/all-paths', (req, res) => {
  try {
    const { source, destination, maxPaths = 5 } = req.body;
    if (!source || !destination) {
      return res.status(400).json({ error: 'Source and destination are required' });
    }
    const result = findAllPaths(roadNetwork, source, destination, maxPaths);
    res.json({ paths: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/greedy', (req, res) => {
  try {
    const { tankers, areas, options = {} } = req.body;
    if (!tankers || !areas) {
      return res.status(400).json({ error: 'Tankers and areas are required' });
    }
    const result = greedyAssignment(tankers, areas, options);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/greedy/batch', (req, res) => {
  try {
    const { tankers, areas, batchSize = 5 } = req.body;
    if (!tankers || !areas) {
      return res.status(400).json({ error: 'Tankers and areas are required' });
    }
    const result = greedyBatchAssignment(tankers, areas, batchSize);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/dp-schedule', (req, res) => {
  try {
    const { deliveries, tankerCount, timeSlots = 14, options = {} } = req.body;
    if (!deliveries || !tankerCount) {
      return res.status(400).json({ error: 'Deliveries and tanker count are required' });
    }
    const result = dpSchedule(deliveries, tankerCount, timeSlots, options);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/dp-schedule/time-windows', (req, res) => {
  try {
    const { deliveries, tankerCount, timeWindows } = req.body;
    if (!deliveries || !tankerCount || !timeWindows) {
      return res.status(400).json({ error: 'Deliveries, tanker count, and time windows are required' });
    }
    const result = dpScheduleWithTimeWindows(deliveries, tankerCount, timeWindows);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/backtrack', (req, res) => {
  try {
    const { sources, tankers, timeSlots = 14, options = {} } = req.body;
    if (!sources || !tankers) {
      return res.status(400).json({ error: 'Sources and tankers are required' });
    }
    const result = backtrackSlotAllocation(sources, tankers, timeSlots, options);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/backtrack/simple', (req, res) => {
  try {
    const { requests, availableSlots } = req.body;
    if (!requests || !availableSlots) {
      return res.status(400).json({ error: 'Requests and available slots are required' });
    }
    const result = backtrackSimple(requests, availableSlots);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/maxflow', (req, res) => {
  try {
    const { graph, source, sink } = req.body;
    if (!graph || !source || !sink) {
      return res.status(400).json({ error: 'Graph, source, and sink are required' });
    }
    const result = fordFulkerson(graph, source, sink);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/maxflow/multi-source', (req, res) => {
  try {
    const { graph, sources, sinks } = req.body;
    if (!graph || !sources || !sinks) {
      return res.status(400).json({ error: 'Graph, sources, and sinks are required' });
    }
    const result = fordFulkersonMultiSource(graph, sources, sinks);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/maxflow/min-cut', (req, res) => {
  try {
    const { graph, source, sink } = req.body;
    if (!graph || !source || !sink) {
      return res.status(400).json({ error: 'Graph, source, and sink are required' });
    }
    const result = minCut(graph, source, sink);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/road-network', (req, res) => {
  res.json(roadNetwork);
});

module.exports = router;
