const mongoose = require('mongoose');

const tankerSchema = new mongoose.Schema({
  tankerId: {
    type: String,
    required: true,
    unique: true
  },
  capacity: {
    type: Number,
    required: true,
    min: 500,
    max: 15000
  },
  currentLoad: {
    type: Number,
    default: 0
  },
  currentLocation: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  status: {
    type: String,
    enum: ['available', 'en-route', 'loading', 'unloading', 'maintenance'],
    default: 'available'
  },
  assignedArea: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Area',
    default: null
  },
  driverName: String,
  driverPhone: String,
  type: {
    type: String,
    enum: ['small', 'medium', 'large'],
    default: 'medium'
  },
  fuelLevel: {
    type: Number,
    default: 100,
    min: 0,
    max: 100
  },
  lastMaintenance: Date,
  totalDeliveries: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Tanker', tankerSchema);
