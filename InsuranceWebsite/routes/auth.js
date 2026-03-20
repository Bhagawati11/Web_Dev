const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { isGuest, isAuthenticated } = require('../middleware/auth')

router.get('/register', isGuest, (req, res) =>
  res.render('auth/register', { title: 'Create Account' })
)

router.post('/register', isGuest, async (req, res) => {
  try {
    const { name, email, password, phone, address, dateOfBirth } = req.body
    const existing = await User.findOne({ email })
    if (existing) {
      req.flash('error', 'Email already registered.')
      return res.redirect('/auth/register')
    }
    const user = new User({ name, email, password, phone, address, dateOfBirth })
    await user.save()
    req.session.user = { id: user._id, name: user.name, email: user.email }
    req.flash('success', `Welcome, ${user.name}!`)
    res.redirect('/policies')
  } catch (err) {
    console.error(err)
    req.flash('error', 'Registration failed.')
    res.redirect('/auth/register')
  }
})

router.get('/login', isGuest, (req, res) => res.render('auth/login', { title: 'Login' }))

router.post('/login', isGuest, async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user || !(await user.comparePassword(password))) {
      req.flash('error', 'Invalid email or password.')
      return res.redirect('/auth/login')
    }
    req.session.user = { id: user._id, name: user.name, email: user.email }
    req.flash('success', `Welcome back, ${user.name}!`)
    res.redirect('/policies')
  } catch (err) {
    req.flash('error', 'Login failed.')
    res.redirect('/auth/login')
  }
})

router.get('/logout', isAuthenticated, (req, res) => {
  req.session.destroy()
  res.redirect('/')
})

router.get('/profile', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id)
    res.render('auth/profile', { title: 'My Profile', profileUser: user })
  } catch (err) {
    req.flash('error', 'Could not load profile.')
    res.redirect('/policies')
  }
})

module.exports = router
