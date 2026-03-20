const isAuthenticated = (req, res, next) => {
  if (req.session.user) return next()
  req.flash('error', 'Please log in to access this page.')
  res.redirect('/auth/login')
}

const isGuest = (req, res, next) => {
  if (!req.session.user) return next()
  res.redirect('/policies')
}

module.exports = { isAuthenticated, isGuest }
