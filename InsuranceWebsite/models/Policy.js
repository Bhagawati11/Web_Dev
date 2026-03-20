const mongoose = require('mongoose')

const policySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  policyNumber: { type: String, unique: true },
  type: {
    type: String,
    enum: ['health', 'auto', 'life', 'home'],
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'expired', 'cancelled'],
    default: 'active',
  },
  coverageAmount: { type: Number, required: true },
  premium: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  details: {
    // Health specific
    deductible: Number,
    // Auto specific
    vehicleMake: String,
    vehicleModel: String,
    vehicleYear: Number,
    vehicleVIN: String,
    // Life specific
    beneficiary: String,
    // Home specific
    propertyAddress: String,
    propertyValue: Number,
  },
  createdAt: { type: Date, default: Date.now },
})

// Auto-generate policy number
policySchema.pre('save', async function (next) {
  if (!this.policyNumber) {
    const typeCode = this.type.toUpperCase().slice(0, 3)
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0')
    this.policyNumber = `${typeCode}-${timestamp}-${random}`
  }
  next()
})

module.exports = mongoose.model('Policy', policySchema)
