const signupForm = document.getElementById('signupForm')
const loginForm = document.getElementById('loginForm')

// SIGNUP
if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const user = {
      name: signupForm[0].value,
      email: signupForm[1].value,
      password: signupForm[2].value,
    }

    let users = JSON.parse(localStorage.getItem('users')) || []
    users.push(user)

    localStorage.setItem('users', JSON.stringify(users))
    localStorage.setItem('currentUser', JSON.stringify(user))

    window.location.href = 'checkout.html'
  })
}

// LOGIN
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const email = loginForm[0].value
    const pass = loginForm[1].value

    let users = JSON.parse(localStorage.getItem('users')) || []
    let found = users.find((u) => u.email === email && u.password === pass)

    if (found) {
      localStorage.setItem('currentUser', JSON.stringify(found))
      window.location.href = 'checkout.html'
    } else {
      window.showToast('Invalid credentials')
    }
  })
}
