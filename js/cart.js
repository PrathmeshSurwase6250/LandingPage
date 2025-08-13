// Cart Page JavaScript

let cart = [];
let appliedCoupon = null;

// Initialize cart page
document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    updateCartCount();
    setupEventListeners();
});

// Load cart from localStorage
function loadCart() {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    displayCart();
}

// Display cart content
function displayCart() {
    const container = document.getElementById('cart-container');
    if (!container) return;
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h3>Your cart is empty</h3>
                <p>Looks like you haven't added any items to your cart yet.</p>
                <a href="products.html" class="continue-shopping">Continue Shopping</a>
            </div>
        `;
        return;
    }
    
    const cartItemsHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <img src="${item.image}" alt="${item.name}" class="item-image">
            <div class="item-details">
                <h3>${item.name}</h3>
                <p class="item-price">$${item.price.toFixed(2)}</p>
            </div>
            <div class="quantity-controls">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <input type="number" class="quantity-input" value="${item.quantity}" 
                       min="1" onchange="setQuantity(${item.id}, this.value)">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
            </div>
            <button class="remove-btn" onclick="removeItem(${item.id})">
                <i class="fas fa-trash"></i> Remove
            </button>
        </div>
    `).join('');
    
    const subtotal = getSubtotal();
    const shipping = subtotal > 50 ? 0 : 5.99;
    const discount = appliedCoupon ? subtotal * 0.1 : 0; // 10% discount
    const total = subtotal + shipping - discount;
    
    container.innerHTML = `
        <div class="cart-items">
            <h2>Shopping Cart (${cart.length} items)</h2>
            ${cartItemsHTML}
        </div>
        <div class="cart-summary">
            <h3>Order Summary</h3>
            <div class="summary-item">
                <span>Subtotal</span>
                <span>$${subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-item">
                <span>Shipping</span>
                <span>${shipping === 0 ? 'Free' : '$' + shipping.toFixed(2)}</span>
            </div>
            ${appliedCoupon ? `
                <div class="summary-item">
                    <span>Discount (${appliedCoupon})</span>
                    <span>-$${discount.toFixed(2)}</span>
                </div>
            ` : ''}
            <div class="summary-item">
                <span>Total</span>
                <span>$${total.toFixed(2)}</span>
            </div>
            
            <div class="coupon-section">
                <h4>Have a coupon?</h4>
                <div class="coupon-input">
                    <input type="text" id="coupon-code" placeholder="Enter coupon code">
                    <button class="apply-coupon" onclick="applyCoupon()">Apply</button>
                </div>
                ${appliedCoupon ? `
                    <p style="color: #27ae60; font-size: 0.9rem;">
                        <i class="fas fa-check"></i> Coupon "${appliedCoupon}" applied!
                    </p>
                ` : ''}
            </div>
            
            <button class="checkout-btn" onclick="proceedToCheckout()">
                <i class="fas fa-credit-card"></i> Proceed to Checkout
            </button>
            
            <div style="text-align: center; margin-top: 1rem;">
                <a href="products.html" class="continue-shopping">
                    <i class="fas fa-arrow-left"></i> Continue Shopping
                </a>
            </div>
        </div>
    `;
}

// Update quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    const newQuantity = item.quantity + change;
    if (newQuantity < 1) {
        removeItem(productId);
        return;
    }
    
    item.quantity = newQuantity;
    saveCart();
    displayCart();
    updateCartCount();
}

// Set quantity directly
function setQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    const newQuantity = parseInt(quantity);
    if (newQuantity < 1) {
        removeItem(productId);
        return;
    }
    
    item.quantity = newQuantity;
    saveCart();
    displayCart();
    updateCartCount();
}

// Remove item from cart
function removeItem(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    displayCart();
    updateCartCount();
    showToast('Item removed from cart', 'success');
}

// Apply coupon
function applyCoupon() {
    const couponInput = document.getElementById('coupon-code');
    const couponCode = couponInput.value.trim().toUpperCase();
    
    if (!couponCode) {
        showToast('Please enter a coupon code', 'warning');
        return;
    }
    
    // Sample coupon codes
    const validCoupons = ['SAVE10', 'WELCOME', 'DISCOUNT'];
    
    if (validCoupons.includes(couponCode)) {
        appliedCoupon = couponCode;
        showToast('Coupon applied successfully!', 'success');
        displayCart();
    } else {
        showToast('Invalid coupon code', 'error');
    }
}

// Get subtotal
function getSubtotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Update cart count in header
function updateCartCount() {
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountElement.textContent = totalItems;
    }
}

// Proceed to checkout
function proceedToCheckout() {
    if (cart.length === 0) {
        showToast('Your cart is empty', 'warning');
        return;
    }
    
    // Store checkout data
    const checkoutData = {
        items: cart,
        subtotal: getSubtotal(),
        shipping: getSubtotal() > 50 ? 0 : 5.99,
        discount: appliedCoupon ? getSubtotal() * 0.1 : 0,
        total: getSubtotal() + (getSubtotal() > 50 ? 0 : 5.99) - (appliedCoupon ? getSubtotal() * 0.1 : 0),
        coupon: appliedCoupon
    };
    
    localStorage.setItem('checkoutData', JSON.stringify(checkoutData));
    
    // Redirect to checkout page (you can create this page)
    showToast('Redirecting to checkout...', 'success');
    setTimeout(() => {
        // For demo purposes, we'll show a modal instead of redirecting
        showCheckoutModal();
    }, 1000);
}

// Show checkout modal (demo)
function showCheckoutModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    
    const checkoutData = JSON.parse(localStorage.getItem('checkoutData'));
    
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="closeModal()">&times;</span>
            <h2>Checkout</h2>
            <div style="margin: 2rem 0;">
                <h3>Order Summary</h3>
                <p><strong>Items:</strong> ${checkoutData.items.length}</p>
                <p><strong>Subtotal:</strong> $${checkoutData.subtotal.toFixed(2)}</p>
                <p><strong>Shipping:</strong> ${checkoutData.shipping === 0 ? 'Free' : '$' + checkoutData.shipping.toFixed(2)}</p>
                ${checkoutData.coupon ? `<p><strong>Discount:</strong> -$${checkoutData.discount.toFixed(2)}</p>` : ''}
                <p><strong>Total:</strong> $${checkoutData.total.toFixed(2)}</p>
            </div>
            
            <form id="checkout-form">
                <div style="margin-bottom: 1rem;">
                    <label>Full Name:</label>
                    <input type="text" required style="width: 100%; padding: 0.5rem; margin-top: 0.5rem;">
                </div>
                <div style="margin-bottom: 1rem;">
                    <label>Email:</label>
                    <input type="email" required style="width: 100%; padding: 0.5rem; margin-top: 0.5rem;">
                </div>
                <div style="margin-bottom: 1rem;">
                    <label>Address:</label>
                    <textarea required style="width: 100%; padding: 0.5rem; margin-top: 0.5rem; height: 80px;"></textarea>
                </div>
                <div style="margin-bottom: 1rem;">
                    <label>Card Number:</label>
                    <input type="text" placeholder="1234 5678 9012 3456" required style="width: 100%; padding: 0.5rem; margin-top: 0.5rem;">
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                    <div>
                        <label>Expiry Date:</label>
                        <input type="text" placeholder="MM/YY" required style="width: 100%; padding: 0.5rem; margin-top: 0.5rem;">
                    </div>
                    <div>
                        <label>CVV:</label>
                        <input type="text" placeholder="123" required style="width: 100%; padding: 0.5rem; margin-top: 0.5rem;">
                    </div>
                </div>
                <button type="submit" class="checkout-btn" style="width: 100%;">
                    <i class="fas fa-lock"></i> Place Order
                </button>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Handle form submission
    document.getElementById('checkout-form').addEventListener('submit', function(e) {
        e.preventDefault();
        placeOrder();
    });
}

// Close modal
function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}

// Place order
function placeOrder() {
    showToast('Processing your order...', 'success');
    
    setTimeout(() => {
        // Clear cart
        cart = [];
        appliedCoupon = null;
        saveCart();
        localStorage.removeItem('checkoutData');
        
        // Close modal
        closeModal();
        
        // Show success message
        showToast('Order placed successfully! Thank you for your purchase.', 'success');
        
        // Redirect to home page
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }, 2000);
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Setup event listeners
function setupEventListeners() {
    // Close modal when clicking outside
    document.addEventListener('click', function(e) {
        const modal = document.querySelector('.modal');
        if (modal && e.target === modal) {
            closeModal();
        }
    });
    
    // Mobile menu functionality
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    }
}