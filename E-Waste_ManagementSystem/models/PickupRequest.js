const mongoose = require('mongoose');

const pickupRequestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  scheduledDate: { type: Date, required: true },
  status: { type: String, default: 'Scheduled', enum: ['Scheduled', 'In-Transit', 'Completed', 'Cancelled'] },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('PickupRequest', pickupRequestSchema);
