const express = require('express')
const router = express.Router()
const Claim = require('../models/Claim')
const Policy = require('../models/Policy')
const { isAuthenticated } = require('../middleware/auth')

router.get('/', isAuthenticated, async (req, res) => {
  try {
    const claims = await Claim.find({ user: req.session.user.id })
      .populate('policy', 'policyNumber type')
      .sort({ createdAt: -1 })
    res.render('claims/index', { title: 'My Claims', claims })
  } catch (err) {
    req.flash('error', 'Could not load claims.')
    res.redirect('/')
  }
})

router.get('/new', isAuthenticated, async (req, res) => {
  try {
    const policies = await Policy.find({ user: req.session.user.id, status: 'active' })
    res.render('claims/new', { title: 'File a Claim', policies })
  } catch (err) {
    req.flash('error', 'Could not load policies.')
    res.redirect('/claims')
  }
})

router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { policy, claimAmount, description, incidentDate } = req.body
    const policyDoc = await Policy.findOne({ _id: policy, user: req.session.user.id })
    if (!policyDoc) {
      req.flash('error', 'Invalid policy.')
      return res.redirect('/claims/new')
    }
    const claim = new Claim({
      user: req.session.user.id,
      policy,
      claimAmount,
      description,
      incidentDate,
    })
    await claim.save()
    req.flash('success', `Claim ${claim.claimNumber} submitted!`)
    res.redirect('/claims')
  } catch (err) {
    console.error(err)
    req.flash('error', 'Failed to submit claim.')
    res.redirect('/claims/new')
  }
})

router.get('/:id', isAuthenticated, async (req, res) => {
  try {
    const claim = await Claim.findOne({ _id: req.params.id, user: req.session.user.id }).populate(
      'policy'
    )
    if (!claim) {
      req.flash('error', 'Claim not found.')
      return res.redirect('/claims')
    }
    res.render('claims/show', { title: `Claim ${claim.claimNumber}`, claim })
  } catch (err) {
    req.flash('error', 'Could not load claim.')
    res.redirect('/claims')
  }
})

module.exports = router
