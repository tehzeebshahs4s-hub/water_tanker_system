const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  deliveryId: {
    type: String,
    required: true,
    unique: true
  },
  tankerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tanker',
    required: true
  },
  areaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Area',
    required: true
  },
  waterSourceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WaterSource'
  },
  scheduledTime: {
    type: Date,
    required: true
  },
  timeWindow: {
    start: { type: Date, required: true },
    end: { type: Date, required: true }
  },
  status: {
    type: String,
    enum: ['scheduled', 'loading', 'en-route', 'delivering', 'completed', 'delayed', 'cancelled'],
    default: 'scheduled'
  },
  loadAmount: {
    type: Number,
    required: true
  },
  actualDeliveryTime: Date,
  delayMinutes: {
    type: Number,
    default: 0
  },
  delayCost: {
    type: Number,
    default: 0
  },
  route: {
    path: [String],
    totalDistance: Number,
    estimatedTime: Number
  },
  priority: {
    type: String,
    enum: ['critical', 'high', 'medium', 'low'],
    default: 'medium'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Delivery', deliverySchema);
