const express = require('express');
const router = express.Router();
const Tanker = require('../models/Tanker');

router.get('/', async (req, res) => {
  try {
    const tankers = await Tanker.find();
    res.json(tankers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const tanker = await Tanker.findById(req.params.id);
    if (!tanker) return res.status(404).json({ error: 'Tanker not found' });
    res.json(tanker);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const tanker = new Tanker(req.body);
    await tanker.save();
    res.status(201).json(tanker);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const tanker = await Tanker.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!tanker) return res.status(404).json({ error: 'Tanker not found' });
    res.json(tanker);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const tanker = await Tanker.findByIdAndDelete(req.params.id);
    if (!tanker) return res.status(404).json({ error: 'Tanker not found' });
    res.json({ message: 'Tanker deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/status/:status', async (req, res) => {
  try {
    const tankers = await Tanker.find({ status: req.params.status });
    res.json(tankers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
