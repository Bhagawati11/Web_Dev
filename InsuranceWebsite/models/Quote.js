const mongoose = require('mongoose')

const quoteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  insuranceType: {
    type: String,
    enum: ['health', 'auto', 'life', 'home'],
    required: true,
  },
  estimatedPremium: { type: Number },
  coverageAmount: { type: Number },
  status: { type: String, enum: ['pending', 'reviewed', 'converted'], default: 'pending' },
  details: { type: mongoose.Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Quote', quoteSchema)
