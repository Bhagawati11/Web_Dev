const express = require('express')
const router = express.Router()
const Policy = require('../models/Policy')
const { isAuthenticated } = require('../middleware/auth')

router.get('/', isAuthenticated, async (req, res) => {
  try {
    const policies = await Policy.find({ user: req.session.user.id }).sort({ createdAt: -1 })
    res.render('policies/index', { title: 'My Policies', policies })
  } catch (err) {
    req.flash('error', 'Could not load policies.')
    res.redirect('/')
  }
})

router.get('/new', isAuthenticated, (req, res) =>
  res.render('policies/new', { title: 'Add New Policy' })
)

router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { type, coverageAmount, premium, startDate, endDate, ...rest } = req.body
    const details = {}
    if (type === 'auto') {
      details.vehicleMake = rest.vehicleMake
      details.vehicleModel = rest.vehicleModel
      details.vehicleYear = rest.vehicleYear
      details.vehicleVIN = rest.vehicleVIN
    } else if (type === 'health') {
      details.deductible = rest.deductible
    } else if (type === 'life') {
      details.beneficiary = rest.beneficiary
    } else if (type === 'home') {
      details.propertyAddress = rest.propertyAddress
      details.propertyValue = rest.propertyValue
    }
    const policy = new Policy({
      user: req.session.user.id,
      type,
      coverageAmount,
      premium,
      startDate,
      endDate,
      details,
    })
    await policy.save()
    req.flash('success', `Policy ${policy.policyNumber} created!`)
    res.redirect('/policies')
  } catch (err) {
    console.error(err)
    req.flash('error', 'Failed to create policy.')
    res.redirect('/policies/new')
  }
})

router.get('/:id', isAuthenticated, async (req, res) => {
  try {
    const policy = await Policy.findOne({ _id: req.params.id, user: req.session.user.id })
    if (!policy) {
      req.flash('error', 'Policy not found.')
      return res.redirect('/policies')
    }
    res.render('policies/show', { title: `Policy ${policy.policyNumber}`, policy })
  } catch (err) {
    req.flash('error', 'Could not load policy.')
    res.redirect('/policies')
  }
})

router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    await Policy.findOneAndDelete({ _id: req.params.id, user: req.session.user.id })
    req.flash('success', 'Policy cancelled.')
    res.redirect('/policies')
  } catch (err) {
    req.flash('error', 'Could not cancel policy.')
    res.redirect('/policies')
  }
})

module.exports = router
