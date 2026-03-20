const express = require('express')
const router = express.Router()
const Quote = require('../models/Quote')

const calculatePremium = (type, details) => {
  let base = 0
  if (type === 'health') {
    const age = details.age || 30
    base = age < 30 ? 3000 : age < 45 ? 5000 : 8000
    if (details.smoker === 'yes') base *= 1.5
  } else if (type === 'auto') {
    const year = new Date().getFullYear() - (details.vehicleYear || 2020)
    base = Math.max(3000, 8000 - year * 300)
    if (details.drivingRecord === 'poor') base *= 1.4
  } else if (type === 'life') {
    const age = details.age || 30
    const coverage = details.coverageAmount || 1000000
    base = (coverage / 1000) * (age < 35 ? 1.2 : age < 50 ? 2.5 : 5)
  } else if (type === 'home') {
    const value = details.propertyValue || 5000000
    base = value * 0.005
  }
  return Math.round(base)
}

router.get('/', (req, res) => res.render('quotes/new', { title: 'Get a Free Quote', quote: null }))

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, insuranceType, ...details } = req.body
    const premium = calculatePremium(insuranceType, details)
    const coverageMap = {
      health: 500000,
      auto: 1000000,
      life: details.coverageAmount || 1000000,
      home: details.propertyValue || 5000000,
    }
    const quote = new Quote({
      name,
      email,
      phone,
      insuranceType,
      estimatedPremium: premium,
      coverageAmount: coverageMap[insuranceType],
      details,
      user: req.session?.user?.id,
    })
    await quote.save()
    res.render('quotes/result', { title: 'Your Quote', quote, premium, insuranceType, name })
  } catch (err) {
    console.error(err)
    req.flash('error', 'Could not calculate quote.')
    res.redirect('/quotes')
  }
})

module.exports = router
