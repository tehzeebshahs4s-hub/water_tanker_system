const express = require('express');
const router = express.Router();
const WaterSource = require('../models/WaterSource');

router.get('/', async (req, res) => {
  try {
    const sources = await WaterSource.find();
    res.json(sources);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const source = await WaterSource.findById(req.params.id);
    if (!source) return res.status(404).json({ error: 'Water source not found' });
    res.json(source);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const source = new WaterSource(req.body);
    await source.save();
    res.status(201).json(source);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const source = await WaterSource.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!source) return res.status(404).json({ error: 'Water source not found' });
    res.json(source);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const source = await WaterSource.findByIdAndDelete(req.params.id);
    if (!source) return res.status(404).json({ error: 'Water source not found' });
    res.json({ message: 'Water source deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/type/:type', async (req, res) => {
  try {
    const sources = await WaterSource.find({ type: req.params.type });
    res.json(sources);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
