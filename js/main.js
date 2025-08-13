// Shopping Website JavaScript

// Sample product data
const products = [
    {
        id: 1,
        name: "Wireless Bluetooth Headphones",
        price: 89.99,
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
        rating: 4.5,
        reviews: 128,
        description: "High-quality wireless headphones with noise cancellation and long battery life."
    },
    {
        id: 2,
        name: "Smart Fitness Watch",
        price: 199.99,
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
        rating: 4.3,
        reviews: 89,
        description: "Advanced fitness tracking with heart rate monitor and GPS."
    },
    {
        id: 3,
        name: "Premium Cotton T-Shirt",
        price: 29.99,
        category: "Fashion",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
        rating: 4.7,
        reviews: 256,
        description: "Comfortable and stylish cotton t-shirt available in multiple colors."
    },
    {
        id: 4,
        name: "Designer Jeans",
        price: 79.99,
        category: "Fashion",
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400",
        rating: 4.4,
        reviews: 167,
        description: "Premium denim jeans with perfect fit and modern styling."
    },
    {
        id: 5,
        name: "Coffee Maker",
        price: 149.99,
        category: "Home",
        image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400",
        rating: 4.6,
        reviews: 203,
        description: "Automatic coffee maker with programmable settings and thermal carafe."
    },
    {
        id: 6,
        name: "Yoga Mat",
        price: 39.99,
        category: "Sports",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
        rating: 4.8,
        reviews: 342,
        description: "Non-slip yoga mat perfect for home workouts and studio sessions."
    },
    {
        id: 7,
        name: "Wireless Charger",
        price: 49.99,
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400",
        rating: 4.2,
        reviews: 95,
        description: "Fast wireless charging pad compatible with all Qi-enabled devices."
    },
    {
        id: 8,
        name: "Running Shoes",
        price: 129.99,
        category: "Sports",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
        rating: 4.9,
        reviews: 189,
        description: "Lightweight running shoes with superior cushioning and support."
    }
];

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM elements
const featuredProductsContainer = document.getElementById('featured-products');
const cartCountElement = document.querySelector('.cart-count');
const searchInput = document.querySelector('.search-box input');
const searchButton = document.querySelector('.search-box button');

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    loadFeaturedProducts();
    updateCartCount();
    setupEventListeners();
    setupMobileMenu();
});

// Load featured products
function loadFeaturedProducts() {
    if (!featuredProductsContainer) return;
    
    const featuredProducts = products.slice(0, 4); // Show first 4 products
    featuredProductsContainer.innerHTML = '';
    
    featuredProducts.forEach(product => {
        const productCard = createProductCard(product);
        featuredProductsContainer.appendChild(productCard);
    });
}

// Create product card element
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card fade-in';
    
    const stars = '★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating));
    
    card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <div class="product-info">
            <h3 class="product-title">${product.name}</h3>
            <div class="product-price">$${product.price.toFixed(2)}</div>
            <div class="product-rating">
                <span class="stars">${stars}</span>
                <span class="rating-text">${product.rating} (${product.reviews})</span>
            </div>
            <button class="add-to-cart" onclick="addToCart(${product.id})">
                Add to Cart
            </button>
        </div>
    `;
    
    return card;
}

// Add to cart functionality
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showToast('Product added to cart!', 'success');
}

// Update cart count
function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
    }
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
    // Search functionality
    if (searchButton) {
        searchButton.addEventListener('click', performSearch);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            if (email) {
                showToast('Thank you for subscribing!', 'success');
                this.reset();
            }
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Perform search
function performSearch() {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) return;
    
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
    );
    
    if (filteredProducts.length > 0) {
        // Store search results and redirect to products page
        localStorage.setItem('searchResults', JSON.stringify(filteredProducts));
        localStorage.setItem('searchQuery', query);
        window.location.href = 'products.html';
    } else {
        showToast('No products found for your search.', 'warning');
    }
}

// Mobile menu functionality
function setupMobileMenu() {
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

// Animation on scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.fade-in, .slide-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationDelay = '0.1s';
                entry.target.style.animationFillMode = 'both';
            }
        });
    }, {
        threshold: 0.1
    });
    
    elements.forEach(element => {
        observer.observe(element);
    });
}

// Initialize animations
animateOnScroll();

// Utility functions
function formatPrice(price) {
    return `$${price.toFixed(2)}`;
}

function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function clearCart() {
    cart = [];
    localStorage.removeItem('cart');
    updateCartCount();
}

// Export functions for use in other pages
window.shoppingWebsite = {
    products,
    cart,
    addToCart,
    updateCartCount,
    showToast,
    formatPrice,
    getCartTotal,
    clearCart,
    createProductCard
};