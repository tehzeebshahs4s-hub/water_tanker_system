const mongoose = require('mongoose');

const waterSourceSchema = new mongoose.Schema({
  sourceId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['treatment-plant', 'dam', 'well', 'hydrant', 'reservoir'],
    required: true
  },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  capacity: {
    type: Number,
    required: true
  },
  currentOutput: {
    type: Number,
    default: 0
  },
  operational: {
    type: Boolean,
    default: true
  },
  connectedAreas: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Area'
  }],
  waterQuality: {
    type: String,
    enum: ['excellent', 'good', 'fair', 'poor'],
    default: 'good'
  },
  maxTankerCapacity: {
    type: Number,
    default: 10000
  },
  queueLength: {
    type: Number,
    default: 0
  },
  averageWaitTime: {
    type: Number,
    default: 15
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('WaterSource', waterSourceSchema);
