loginForm.addEventListener('submit', (e) => {
  e.preventDefault()

  let users = JSON.parse(localStorage.getItem('users')) || []
  let found = users.find((u) => u.email === email && u.password === pass)

  if (found) {
    localStorage.setItem('currentUser', JSON.stringify(found))
    window.location.href = 'checkout.html'
  }
})
