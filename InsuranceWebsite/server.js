require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const path = require('path')

const app = express()

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => console.error('❌ MongoDB connection error:', err))

// View Engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// Middleware
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(methodOverride('_method'))

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
  })
)

app.use(flash())

// Global locals for views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null
  res.locals.success = req.flash('success')
  res.locals.error = req.flash('error')
  next()
})

// Routes
const indexRoutes = require('./routes/index')
const authRoutes = require('./routes/auth')
const policyRoutes = require('./routes/policies')
const claimRoutes = require('./routes/claims')
const quoteRoutes = require('./routes/quotes')

app.use('/', indexRoutes)
app.use('/auth', authRoutes)
app.use('/policies', policyRoutes)
app.use('/claims', claimRoutes)
app.use('/quotes', quoteRoutes)

// 404 Handler
app.use((req, res) => {
  res.status(404).render('404', { title: '404 - Page Not Found' })
})

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).render('error', { title: 'Server Error', error: err.message })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`🚀 InsureWell server running on http://localhost:${PORT}`)
})
