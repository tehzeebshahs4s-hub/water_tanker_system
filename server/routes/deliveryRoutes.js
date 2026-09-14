const express = require('express');
const router = express.Router();
const Delivery = require('../models/Delivery');

router.get('/', async (req, res) => {
  try {
    const deliveries = await Delivery.find()
      .populate('tankerId')
      .populate('areaId')
      .populate('waterSourceId');
    res.json(deliveries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id)
      .populate('tankerId')
      .populate('areaId')
      .populate('waterSourceId');
    if (!delivery) return res.status(404).json({ error: 'Delivery not found' });
    res.json(delivery);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const delivery = new Delivery(req.body);
    await delivery.save();
    res.status(201).json(delivery);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const delivery = await Delivery.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!delivery) return res.status(404).json({ error: 'Delivery not found' });
    res.json(delivery);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const delivery = await Delivery.findByIdAndDelete(req.params.id);
    if (!delivery) return res.status(404).json({ error: 'Delivery not found' });
    res.json({ message: 'Delivery deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/status/:status', async (req, res) => {
  try {
    const deliveries = await Delivery.find({ status: req.params.status })
      .populate('tankerId')
      .populate('areaId');
    res.json(deliveries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/area/:areaId', async (req, res) => {
  try {
    const deliveries = await Delivery.find({ areaId: req.params.areaId })
      .populate('tankerId')
      .populate('waterSourceId');
    res.json(deliveries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
