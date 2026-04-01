// ===== PROFILE & NAVBAR LOGIC =====
const profileArea = document.getElementById('profileArea')
const currentUser = JSON.parse(localStorage.getItem('currentUser'))

if (profileArea) {
  if (currentUser) {
    profileArea.innerHTML = `
      <div class="profile-dropdown">
        <span class="profile-name">${currentUser.name} ▾</span>
        <div class="dropdown-content profile-menu">
          <a href="#" id="logoutBtn">Logout</a>
        </div>
      </div>
    `

    // Toggle dropdown
    const profileName = profileArea.querySelector('.profile-name')
    const menu = profileArea.querySelector('.profile-menu')

    profileName.addEventListener('click', () => {
      menu.classList.toggle('show')
    })

    // Close when clicking outside
    window.addEventListener('click', (e) => {
      if (!e.target.closest('.profile-dropdown')) {
        menu.classList.remove('show')
      }
    })

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
      // Remove login session
      localStorage.removeItem('currentUser')

      // Clear cart for clean session
      localStorage.removeItem('cart')

      // Optional: clear checkout form cache if you add later
      // localStorage.removeItem('checkoutData');

      window.showToast('Logged out successfully')

      setTimeout(() => location.reload(), 800)
    })

  } else {
    profileArea.innerHTML = `
      <a href="login.html">Login</a>
      <a href="signup.html">Sign Up</a>
    `
  }
}

// ===== CART COUNT IN NAVBAR =====
function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem('cart')) || []

  let count = cart.reduce((sum, p) => sum + (p.qty ? p.qty : 1), 0)

  const cartEl = document.getElementById('cartCount')
  if (cartEl) cartEl.innerText = count
}

updateCartCount()

// ===== FRIENDLY TOAST MESSAGE =====
function showToast(text) {
  let msg = document.createElement('div')
  msg.className = 'toast'
  msg.innerText = text
  document.body.appendChild(msg)

  setTimeout(() => msg.remove(), 2000)
}

// Make functions global
window.updateCartCount = updateCartCount
window.showToast = showToast
