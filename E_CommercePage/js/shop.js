import { products } from './products.js'

const grid = document.getElementById('productGrid')

function renderProducts(list) {
  grid.innerHTML = ''

  list.forEach((p) => {
    grid.innerHTML += `
      <div class="card">
        <img src="${p.image}">
        <h4>${p.name}</h4>
        <p>₹${p.price}</p>
        <button data-id="${p.id}" class="add-btn">Add to Cart</button>
      </div>
    `
  })

  document.querySelectorAll('.add-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id)
      const product = products.find((p) => p.id === id)
      addToCart(product)
    })
  })
}

function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem('cart')) || []

  let existing = cart.find((p) => p.id === product.id)

  if (existing) existing.qty += 1
  else cart.push({ ...product, qty: 1 })

  localStorage.setItem('cart', JSON.stringify(cart))
  window.updateCartCount()
  window.showToast('Added to cart 🛒')
}

renderProducts(products)

const categoryBtn = document.getElementById('categoryBtn')
const dropdownMenu = document.getElementById('dropdownMenu')

if (categoryBtn && dropdownMenu) {
  categoryBtn.addEventListener('click', () => {
    dropdownMenu.classList.toggle('show')
  })

  // Close if clicked outside
  window.addEventListener('click', (e) => {
    if (!e.target.matches('#categoryBtn')) {
      dropdownMenu.classList.remove('show')
    }
  })
}

if (dropdownMenu) {
  dropdownMenu.addEventListener('click', (e) => {
    e.preventDefault();

    const link = e.target.closest('a[data-category]');
    if (!link) return;

    const category = link.dataset.category;

    if (category === 'all') {
      renderProducts(products);
    } else {
      const filtered = products.filter(p => p.category === category);
      renderProducts(filtered);
    }

    dropdownMenu.classList.remove('show');
  });
}
