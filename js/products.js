// Products Page JavaScript

let currentProducts = [];
let filteredProducts = [];
let currentPage = 1;
const productsPerPage = 8;

// Initialize products page
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    setupFilterListeners();
    setupSortListener();
    updateCartCount();
});

// Load products
function loadProducts() {
    // Check if we have search results
    const searchResults = localStorage.getItem('searchResults');
    const searchQuery = localStorage.getItem('searchQuery');
    
    if (searchResults) {
        currentProducts = JSON.parse(searchResults);
        filteredProducts = [...currentProducts];
        
        // Clear search results from storage
        localStorage.removeItem('searchResults');
        localStorage.removeItem('searchQuery');
        
        // Update search input if it exists
        const searchInput = document.querySelector('.search-box input');
        if (searchInput && searchQuery) {
            searchInput.value = searchQuery;
        }
        
        showToast(`Found ${currentProducts.length} products for "${searchQuery}"`, 'success');
    } else {
        // Load all products from main.js
        currentProducts = window.shoppingWebsite ? window.shoppingWebsite.products : [];
        filteredProducts = [...currentProducts];
    }
    
    displayProducts();
    updateResultsCount();
}

// Display products with pagination
function displayProducts() {
    const container = document.getElementById('products-container');
    if (!container) return;
    
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToShow = filteredProducts.slice(startIndex, endIndex);
    
    container.innerHTML = '';
    
    if (productsToShow.length === 0) {
        container.innerHTML = `
            <div class="no-products">
                <i class="fas fa-search"></i>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search terms</p>
                <button class="btn btn-primary" onclick="clearFilters()">Clear All Filters</button>
            </div>
        `;
        return;
    }
    
    productsToShow.forEach(product => {
        const productCard = createProductCard(product);
        container.appendChild(productCard);
    });
    
    updatePagination();
}

// Create product card (reuse from main.js)
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

// Setup filter listeners
function setupFilterListeners() {
    const categoryFilter = document.getElementById('category-filter');
    const priceMin = document.getElementById('price-min');
    const priceMax = document.getElementById('price-max');
    const ratingFilter = document.getElementById('rating-filter');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', applyFilters);
    }
    
    if (priceMin) {
        priceMin.addEventListener('input', applyFilters);
    }
    
    if (priceMax) {
        priceMax.addEventListener('input', applyFilters);
    }
    
    if (ratingFilter) {
        ratingFilter.addEventListener('change', applyFilters);
    }
}

// Setup sort listener
function setupSortListener() {
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', applySorting);
    }
}

// Apply filters
function applyFilters() {
    const categoryFilter = document.getElementById('category-filter');
    const priceMin = document.getElementById('price-min');
    const priceMax = document.getElementById('price-max');
    const ratingFilter = document.getElementById('rating-filter');
    
    filteredProducts = currentProducts.filter(product => {
        // Category filter
        if (categoryFilter.value && product.category !== categoryFilter.value) {
            return false;
        }
        
        // Price filter
        if (priceMin.value && product.price < parseFloat(priceMin.value)) {
            return false;
        }
        
        if (priceMax.value && product.price > parseFloat(priceMax.value)) {
            return false;
        }
        
        // Rating filter
        if (ratingFilter.value && product.rating < parseFloat(ratingFilter.value)) {
            return false;
        }
        
        return true;
    });
    
    currentPage = 1; // Reset to first page
    displayProducts();
    updateResultsCount();
}

// Apply sorting
function applySorting() {
    const sortSelect = document.getElementById('sort-select');
    const sortValue = sortSelect.value;
    
    filteredProducts.sort((a, b) => {
        switch (sortValue) {
            case 'name':
                return a.name.localeCompare(b.name);
            case 'name-desc':
                return b.name.localeCompare(a.name);
            case 'price':
                return a.price - b.price;
            case 'price-desc':
                return b.price - a.price;
            case 'rating':
                return b.rating - a.rating;
            default:
                return 0;
        }
    });
    
    currentPage = 1; // Reset to first page
    displayProducts();
}

// Clear all filters
function clearFilters() {
    const categoryFilter = document.getElementById('category-filter');
    const priceMin = document.getElementById('price-min');
    const priceMax = document.getElementById('price-max');
    const ratingFilter = document.getElementById('rating-filter');
    
    if (categoryFilter) categoryFilter.value = '';
    if (priceMin) priceMin.value = '';
    if (priceMax) priceMax.value = '';
    if (ratingFilter) ratingFilter.value = '';
    
    filteredProducts = [...currentProducts];
    currentPage = 1;
    displayProducts();
    updateResultsCount();
}

// Update results count
function updateResultsCount() {
    const resultsCount = document.getElementById('results-count');
    if (resultsCount) {
        resultsCount.textContent = filteredProducts.length;
    }
}

// Update pagination
function updatePagination() {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;
    
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `
        <button onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
            <i class="fas fa-chevron-left"></i> Previous
        </button>
    `;
    
    // Page numbers
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <button onclick="changePage(${i})" class="${i === currentPage ? 'active' : ''}">
                ${i}
            </button>
        `;
    }
    
    // Next button
    paginationHTML += `
        <button onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
            Next <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    pagination.innerHTML = paginationHTML;
}

// Change page
function changePage(page) {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        displayProducts();
        
        // Scroll to top of products section
        const productsSection = document.querySelector('.products-page');
        if (productsSection) {
            productsSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

// Add to cart function (reuse from main.js)
function addToCart(productId) {
    if (window.shoppingWebsite) {
        window.shoppingWebsite.addToCart(productId);
    } else {
        // Fallback if main.js is not loaded
        const product = currentProducts.find(p => p.id === productId);
        if (!product) return;
        
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
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
}

// Update cart count
function updateCartCount() {
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
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

// Search functionality
function performSearch() {
    const searchInput = document.querySelector('.search-box input');
    const query = searchInput.value.trim().toLowerCase();
    
    if (!query) {
        filteredProducts = [...currentProducts];
    } else {
        filteredProducts = currentProducts.filter(product => 
            product.name.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query)
        );
    }
    
    currentPage = 1;
    displayProducts();
    updateResultsCount();
}

// Setup search functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.querySelector('.search-box button');
    const searchInput = document.querySelector('.search-box input');
    
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
});

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

// Initialize mobile menu
setupMobileMenu();