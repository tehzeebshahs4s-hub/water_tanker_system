const mongoose = require('mongoose');

const areaSchema = new mongoose.Schema({
  areaId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  town: {
    type: String,
    required: true
  },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  demand: {
    type: Number,
    required: true,
    min: 0
  },
  currentSupply: {
    type: Number,
    default: 0
  },
  priority: {
    type: String,
    enum: ['critical', 'high', 'medium', 'low'],
    default: 'medium'
  },
  population: {
    type: Number,
    required: true
  },
  waterSources: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WaterSource'
  }],
  nearestHydrants: [String],
  roadConnections: [String],
  averageWaitTime: {
    type: Number,
    default: 0
  },
  congestionLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'severe'],
    default: 'medium'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Area', areaSchema);
