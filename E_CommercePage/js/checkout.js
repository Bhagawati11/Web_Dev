const form = document.getElementById('checkoutForm')

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault()

    const currentUser = JSON.parse(localStorage.getItem('currentUser'))
    let cart = JSON.parse(localStorage.getItem('cart')) || []

    const order = {
      user: currentUser.email,
      name: form[0].value,
      address: form[1].value,
      phone: form[2].value,
      cart,
      date: new Date(),
    }

    let orders = JSON.parse(localStorage.getItem('orders')) || []
    orders.push(order)

    localStorage.setItem('orders', JSON.stringify(orders))
    localStorage.removeItem('cart')

    window.location.href = 'index.html'
  })
}
