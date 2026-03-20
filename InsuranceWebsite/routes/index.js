const express = require('express')
const router = express.Router()

router.get('/', (req, res) =>
  res.render('index', { title: 'InsureWell - Your Trusted Insurance Partner' })
)
router.get('/about', (req, res) => res.render('about', { title: 'About Us - InsureWell' }))
router.get('/contact', (req, res) => res.render('contact', { title: 'Contact Us - InsureWell' }))
router.get('/services', (req, res) =>
  res.render('services', { title: 'Our Services - InsureWell' })
)

module.exports = router
