const products = [
  {
    id: 'bag-signature',
    name: 'Signature leather bag',
    description: 'Premium leather, elegant stitching, and fast shipping for any style.',
    price: 129,
    status: 'In stock',
  },
  {
    id: 'smart-watch',
    name: 'Smart watch pro',
    description: 'Modern health dashboard, smooth UX, and adaptive notifications.',
    price: 189,
    status: 'In stock',
  },
  {
    id: 'wireless-earbuds',
    name: 'Wireless earbuds',
    description: 'Noise isolation, comfortable fit, and premium sound balance.',
    price: 89,
    status: 'Limited stock',
  },
  {
    id: 'travel-kit',
    name: 'Travel essentials kit',
    description: 'Curated set of travel gear built for craftsmanship and convenience.',
    price: 74,
    status: 'In stock',
  },
]

const productsList = document.getElementById('products-list')
const cartItems = document.getElementById('cart-items')
const cartCount = document.getElementById('cart-count')
const cartSubtotalEl = document.getElementById('cart-subtotal')
const cartTotalEl = document.getElementById('cart-total')
const checkoutBtn = document.getElementById('checkout-btn')
const backDashboardBtn = document.getElementById('back-dashboard')
const refreshShopBtn = document.getElementById('refresh-shop')

let cart = []
const deliveryFee = 9

function formatCurrency(value) {
  return `$${value.toFixed(2)}`
}

function updateCartStats() {
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  const total = subtotal + deliveryFee
  if (cartCount) {
    cartCount.textContent = `${cart.length} item${cart.length === 1 ? '' : 's'}`
  }
  if (cartSubtotalEl) {
    cartSubtotalEl.textContent = formatCurrency(subtotal)
  }
  if (cartTotalEl) {
    cartTotalEl.textContent = formatCurrency(total)
  }
}

function renderCart() {
  if (!cartItems) return

  if (cart.length === 0) {
    cartItems.innerHTML = '<div class="cart-empty">No items in cart yet.</div>'
    return
  }

  cartItems.innerHTML = cart
    .map(
      (item) => `
      <div class="cart-item">
        <div>
          <p>${item.name}</p>
          <small>${item.quantity} × ${formatCurrency(item.price)}</small>
        </div>
        <div class="product-actions">
          <button type="button" data-action="decrease" data-id="${item.id}">-</button>
          <button type="button" data-action="increase" data-id="${item.id}">+</button>
          <button type="button" data-action="remove" data-id="${item.id}">Remove</button>
        </div>
      </div>
    `,
    )
    .join('')
}

function addToCart(productId) {
  const product = products.find((item) => item.id === productId)
  if (!product) return

  const existingItem = cart.find((item) => item.id === productId)
  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({ ...product, quantity: 1 })
  }

  updateCartStats()
  renderCart()
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId)
  updateCartStats()
  renderCart()
}

function changeQuantity(productId, delta) {
  const item = cart.find((entry) => entry.id === productId)
  if (!item) return
  item.quantity = Math.max(1, item.quantity + delta)
  updateCartStats()
  renderCart()
}

function renderProducts() {
  if (!productsList) return
  productsList.innerHTML = products
    .map(
      (product) => `
      <article class="product-card">
        <div class="product-line">
          <div>
            <h4>${product.name}</h4>
            <p>${product.description}</p>
          </div>
          <div class="product-price">${formatCurrency(product.price)}</div>
        </div>
        <div class="product-line">
          <span>${product.status}</span>
          <div class="product-actions">
            <button type="button" data-action="add" data-id="${product.id}">Add to cart</button>
          </div>
        </div>
      </article>
    `,
    )
    .join('')
}

function initializeEvents() {
  if (!productsList) return
  productsList.addEventListener('click', (event) => {
    const target = event.target
    if (!(target instanceof HTMLElement)) return
    const productId = target.dataset.id
    const action = target.dataset.action
    if (!productId || action !== 'add') return
    addToCart(productId)
  })

  if (!cartItems) return
  cartItems.addEventListener('click', (event) => {
    const target = event.target
    if (!(target instanceof HTMLElement)) return
    const productId = target.dataset.id
    const action = target.dataset.action
    if (!productId || !action) return

    if (action === 'remove') {
      removeFromCart(productId)
    } else if (action === 'decrease') {
      changeQuantity(productId, -1)
    } else if (action === 'increase') {
      changeQuantity(productId, 1)
    }
  })

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        alert('Your cart is empty. Add a product before checkout.')
        return
      }
      alert('Checkout completed successfully!')
      cart = []
      updateCartStats()
      renderCart()
    })
  }

  if (backDashboardBtn) {
    backDashboardBtn.addEventListener('click', () => {
      window.location.href = 'index.html'
    })
  }

  if (refreshShopBtn) {
    refreshShopBtn.addEventListener('click', () => {
      window.location.reload()
    })
  }
}

renderProducts()
updateCartStats()
renderCart()
initializeEvents()
