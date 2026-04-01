const mongoose = require('mongoose');

const centerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  lat: Number,
  lng: Number,
  contact: { type: String, default: 'N/A' },
  certified: { type: Boolean, default: true },
});

module.exports = mongoose.model('Center', centerSchema);
