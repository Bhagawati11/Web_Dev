signupForm.addEventListener('submit', (e) => {
  e.preventDefault()

  let users = JSON.parse(localStorage.getItem('users')) || []
  let user = { name, email, password }

  users.push(user)
  localStorage.setItem('users', JSON.stringify(users))

  localStorage.setItem('currentUser', JSON.stringify(user)) // auto login
  window.location.href = 'checkout.html'
})
