// Global variables
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let products = [];

// Sample product data
const sampleProducts = [
    {
        id: 1,
        name: "Wireless Bluetooth Headphones",
        price: 89.99,
        category: "electronics",
        description: "High-quality wireless headphones with noise cancellation",
        image: "https://via.placeholder.com/300x200?text=Headphones",
        featured: true
    },
    {
        id: 2,
        name: "Smart Fitness Watch",
        price: 199.99,
        category: "electronics",
        description: "Track your fitness goals with this advanced smartwatch",
        image: "https://via.placeholder.com/300x200?text=Smartwatch",
        featured: true
    },
    {
        id: 3,
        name: "Premium Cotton T-Shirt",
        price: 29.99,
        category: "clothing",
        description: "Comfortable and stylish cotton t-shirt",
        image: "https://via.placeholder.com/300x200?text=T-Shirt",
        featured: true
    },
    {
        id: 4,
        name: "Designer Jeans",
        price: 79.99,
        category: "clothing",
        description: "Classic designer jeans for everyday wear",
        image: "https://via.placeholder.com/300x200?text=Jeans",
        featured: true
    },
    {
        id: 5,
        name: "Modern Coffee Table",
        price: 299.99,
        category: "home",
        description: "Elegant coffee table for your living room",
        image: "https://via.placeholder.com/300x200?text=Coffee+Table",
        featured: true
    },
    {
        id: 6,
        name: "Garden Plant Pots Set",
        price: 49.99,
        category: "home",
        description: "Beautiful ceramic plant pots for your garden",
        image: "https://via.placeholder.com/300x200?text=Plant+Pots",
        featured: true
    },
    {
        id: 7,
        name: "Yoga Mat Premium",
        price: 39.99,
        category: "sports",
        description: "Non-slip yoga mat for your fitness routine",
        image: "https://via.placeholder.com/300x200?text=Yoga+Mat",
        featured: true
    },
    {
        id: 8,
        name: "Dumbbell Set 20kg",
        price: 89.99,
        category: "sports",
        description: "Professional dumbbell set for strength training",
        image: "https://via.placeholder.com/300x200?text=Dumbbells",
        featured: true
    },
    {
        id: 9,
        name: "Laptop Stand",
        price: 59.99,
        category: "electronics",
        description: "Adjustable laptop stand for better ergonomics",
        image: "https://via.placeholder.com/300x200?text=Laptop+Stand",
        featured: false
    },
    {
        id: 10,
        name: "Running Shoes",
        price: 129.99,
        category: "sports",
        description: "Comfortable running shoes for all terrains",
        image: "https://via.placeholder.com/300x200?text=Running+Shoes",
        featured: false
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    products = sampleProducts;
    updateCartCount();
    loadFeaturedProducts();
    updateUserInterface();
    
    // Add event listeners
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal') || e.target.classList.contains('close-btn')) {
            closeAllModals();
        }
    });
});

// Cart functionality
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    saveCart();
    updateCartCount();
    updateCartDisplay();
    showNotification('Product added to cart!');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    updateCartDisplay();
    showNotification('Product removed from cart!');
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            updateCartCount();
            updateCartDisplay();
        }
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">Your cart is empty</p>';
        cartTotal.textContent = '$0.00';
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <button class="close-btn" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `$${total.toFixed(2)}`;
}

// UI Toggle functions
function toggleSearch() {
    const searchBar = document.getElementById('searchBar');
    searchBar.classList.toggle('active');
    if (searchBar.classList.contains('active')) {
        document.getElementById('searchInput').focus();
    }
}

function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    cartSidebar.classList.toggle('active');
    if (cartSidebar.classList.contains('active')) {
        updateCartDisplay();
    }
}

function toggleUserMenu() {
    const userMenu = document.getElementById('userMenu');
    userMenu.classList.toggle('active');
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
    document.getElementById('userMenu').classList.remove('active');
}

// Search functionality
function searchProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
    
    // If we're on the products page, filter there
    if (window.location.pathname.includes('products.html')) {
        displayProducts(filteredProducts);
    } else {
        // Redirect to products page with search
        window.location.href = `products.html?search=${encodeURIComponent(searchTerm)}`;
    }
}

// Product display functions
function loadFeaturedProducts() {
    const featuredProducts = products.filter(product => product.featured);
    const container = document.getElementById('featuredProducts');
    
    if (!container) return;
    
    container.innerHTML = featuredProducts.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div class="product-details">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <p class="product-description">${product.description}</p>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

function displayProducts(productsToShow = products) {
    const container = document.getElementById('productGrid');
    if (!container) return;
    
    container.innerHTML = productsToShow.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div class="product-details">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <p class="product-description">${product.description}</p>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

function filterByCategory(category) {
    const filteredProducts = category === 'all' ? products : products.filter(product => product.category === category);
    
    if (window.location.pathname.includes('products.html')) {
        displayProducts(filteredProducts);
    } else {
        window.location.href = `products.html?category=${category}`;
    }
}

// User authentication functions
function showLogin() {
    closeAllModals();
    document.getElementById('loginModal').classList.add('active');
}

function showRegister() {
    closeAllModals();
    document.getElementById('registerModal').classList.add('active');
}

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Simple validation - in a real app, this would check against a backend
    if (email && password) {
        currentUser = {
            name: email.split('@')[0],
            email: email
        };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateUserInterface();
        closeAllModals();
        showNotification('Login successful!');
    } else {
        showNotification('Please fill in all fields', 'error');
    }
}

function handleRegister(event) {
    event.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    if (name && email && password) {
        currentUser = {
            name: name,
            email: email
        };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateUserInterface();
        closeAllModals();
        showNotification('Registration successful!');
    } else {
        showNotification('Please fill in all fields', 'error');
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateUserInterface();
    showNotification('Logged out successfully!');
}

function updateUserInterface() {
    const userName = document.getElementById('userName');
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const profileBtn = document.getElementById('profileBtn');
    const ordersBtn = document.getElementById('ordersBtn');
    
    if (currentUser) {
        userName.textContent = currentUser.name;
        loginBtn.style.display = 'none';
        registerBtn.style.display = 'none';
        logoutBtn.style.display = 'block';
        profileBtn.style.display = 'block';
        ordersBtn.style.display = 'block';
    } else {
        userName.textContent = 'Guest';
        loginBtn.style.display = 'block';
        registerBtn.style.display = 'block';
        logoutBtn.style.display = 'none';
        profileBtn.style.display = 'none';
        ordersBtn.style.display = 'none';
    }
}

// Checkout functionality
function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    
    if (!currentUser) {
        showNotification('Please login to checkout', 'error');
        showLogin();
        return;
    }
    
    // In a real app, this would redirect to a payment processor
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Simulate order processing
    const order = {
        id: Date.now(),
        user: currentUser,
        items: [...cart],
        total: total,
        date: new Date().toISOString(),
        status: 'pending'
    };
    
    // Save order to localStorage (in a real app, this would go to a database)
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Clear cart
    cart = [];
    saveCart();
    updateCartCount();
    updateCartDisplay();
    toggleCart();
    
    showNotification(`Order placed successfully! Total: $${total.toFixed(2)}`);
}

// Utility functions
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#e74c3c' : '#27ae60'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function showProfile() {
    if (!currentUser) return;
    showNotification(`Profile: ${currentUser.name} (${currentUser.email})`);
}

function showOrders() {
    if (!currentUser) return;
    
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const userOrders = orders.filter(order => order.user.email === currentUser.email);
    
    if (userOrders.length === 0) {
        showNotification('No orders found', 'error');
    } else {
        const orderList = userOrders.map(order => 
            `Order #${order.id}: $${order.total.toFixed(2)} (${new Date(order.date).toLocaleDateString()})`
        ).join('\n');
        alert(`Your Orders:\n${orderList}`);
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Handle URL parameters for search and category filtering
function handleURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const search = urlParams.get('search');
    const category = urlParams.get('category');
    
    if (search) {
        document.getElementById('searchInput').value = search;
        searchProducts();
    }
    
    if (category) {
        filterByCategory(category);
    }
}

// Initialize URL parameter handling
if (window.location.pathname.includes('products.html')) {
    document.addEventListener('DOMContentLoaded', handleURLParameters);
}