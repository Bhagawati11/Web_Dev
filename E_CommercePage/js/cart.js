let cart = JSON.parse(localStorage.getItem('cart')) || []
const cartDiv = document.getElementById('cartItems')
const totalEl = document.getElementById('cartTotal')

const checkoutBtn = document.getElementById('checkoutBtn')

if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    let user = localStorage.getItem('currentUser')

    if (!user) {
      window.showToast('Please login to continue')
      setTimeout(() => (window.location.href = 'login.html'), 1500)
    } else {
      window.location.href = 'checkout.html'
    }
  })
}


function renderCart() {
  cartDiv.innerHTML = ''
  let total = 0

  if (cart.length === 0) {
    cartDiv.innerHTML = '<p>Your cart is empty 🛒</p>'
    totalEl.textContent = 0
    return
  }

  cart.forEach((p, i) => {
    total += p.price * p.qty

    cartDiv.innerHTML += `
      <div class="card">
        <h4>${p.name}</h4>
        <p>₹${p.price}</p>
        <button onclick="changeQty(${i}, -1)">−</button>
        <span>${p.qty}</span>
        <button onclick="changeQty(${i}, 1)">+</button>
      </div>
    `
  })

  totalEl.textContent = total
}

window.changeQty = function (i, delta) {
  cart[i].qty += delta
  if (cart[i].qty <= 0) cart.splice(i, 1)

  localStorage.setItem('cart', JSON.stringify(cart))
  renderCart()
  window.updateCartCount()
}

renderCart()
