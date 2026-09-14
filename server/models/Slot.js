const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  slotId: {
    type: String,
    required: true,
    unique: true
  },
  sourceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WaterSource',
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  assignedTanker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tanker',
    default: null
  },
  status: {
    type: String,
    enum: ['available', 'reserved', 'occupied', 'maintenance'],
    default: 'available'
  },
  priority: {
    type: Number,
    default: 0
  },
  conflictWith: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Slot'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Slot', slotSchema);
