const mongoose = require('mongoose')

const claimSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  policy: { type: mongoose.Schema.Types.ObjectId, ref: 'Policy', required: true },
  claimNumber: { type: String, unique: true },
  status: {
    type: String,
    enum: ['submitted', 'under-review', 'approved', 'rejected', 'paid'],
    default: 'submitted',
  },
  claimAmount: { type: Number, required: true },
  approvedAmount: { type: Number },
  description: { type: String, required: true },
  incidentDate: { type: Date, required: true },
  documents: [{ name: String, url: String }],
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

claimSchema.pre('save', async function (next) {
  if (!this.claimNumber) {
    const timestamp = Date.now().toString().slice(-7)
    const random = Math.floor(Math.random() * 100)
      .toString()
      .padStart(2, '0')
    this.claimNumber = `CLM-${timestamp}-${random}`
  }
  this.updatedAt = Date.now()
  next()
})

module.exports = mongoose.model('Claim', claimSchema)
