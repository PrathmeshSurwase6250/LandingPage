// Authentication JavaScript

// Sample user data (in a real app, this would be stored in a database)
const users = [
    {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
    },
    {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123'
    }
];

// Initialize authentication
document.addEventListener('DOMContentLoaded', function() {
    setupFormListeners();
    updateCartCount();
    setupMobileMenu();
    checkAuthStatus();
});

// Setup form listeners
function setupFormListeners() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
}

// Handle login
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const rememberMe = document.getElementById('remember-me').checked;
    
    // Validate inputs
    if (!email || !password) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    // Check if user exists
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Store user session
        const sessionData = {
            id: user.id,
            name: user.name,
            email: user.email,
            isLoggedIn: true,
            loginTime: new Date().toISOString()
        };
        
        if (rememberMe) {
            localStorage.setItem('userSession', JSON.stringify(sessionData));
        } else {
            sessionStorage.setItem('userSession', JSON.stringify(sessionData));
        }
        
        showToast('Login successful!', 'success');
        
        // Redirect to home page after a short delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    } else {
        showToast('Invalid email or password', 'error');
    }
}

// Handle registration
function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    const agreeTerms = document.getElementById('agree-terms').checked;
    
    // Validate inputs
    if (!name || !email || !password || !confirmPassword) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }
    
    if (password.length < 6) {
        showToast('Password must be at least 6 characters long', 'error');
        return;
    }
    
    if (!agreeTerms) {
        showToast('Please agree to the terms and conditions', 'error');
        return;
    }
    
    // Check if email already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        showToast('Email already registered', 'error');
        return;
    }
    
    // Create new user
    const newUser = {
        id: users.length + 1,
        name: name,
        email: email,
        password: password
    };
    
    // In a real app, you would save this to a database
    users.push(newUser);
    
    showToast('Registration successful! Please log in.', 'success');
    
    // Switch to login form
    setTimeout(() => {
        toggleForm();
        // Clear register form
        document.getElementById('register-form').reset();
    }, 1000);
}

// Toggle between login and register forms
function toggleForm() {
    const formToggle = document.getElementById('form-toggle');
    const toggleText = document.getElementById('toggle-text');
    
    if (formToggle.checked) {
        formToggle.checked = false;
        toggleText.textContent = 'Register';
    } else {
        formToggle.checked = true;
        toggleText.textContent = 'Login';
    }
}

// Check authentication status
function checkAuthStatus() {
    const userSession = JSON.parse(localStorage.getItem('userSession') || sessionStorage.getItem('userSession') || 'null');
    
    if (userSession && userSession.isLoggedIn) {
        // User is logged in, update UI
        updateUserUI(userSession);
    }
}

// Update user UI
function updateUserUI(user) {
    const userBtn = document.querySelector('.user-btn');
    if (userBtn) {
        userBtn.innerHTML = `<i class="fas fa-user"></i> ${user.name.split(' ')[0]}`;
        userBtn.href = 'profile.html';
    }
}

// Logout function
function logout() {
    localStorage.removeItem('userSession');
    sessionStorage.removeItem('userSession');
    
    showToast('Logged out successfully', 'success');
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
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

// Update cart count
function updateCartCount() {
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountElement.textContent = totalItems;
    }
}

// Setup mobile menu
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

// Password strength checker
function checkPasswordStrength(password) {
    let strength = 0;
    let feedback = [];
    
    if (password.length >= 8) {
        strength += 1;
    } else {
        feedback.push('At least 8 characters');
    }
    
    if (/[a-z]/.test(password)) {
        strength += 1;
    } else {
        feedback.push('Include lowercase letters');
    }
    
    if (/[A-Z]/.test(password)) {
        strength += 1;
    } else {
        feedback.push('Include uppercase letters');
    }
    
    if (/[0-9]/.test(password)) {
        strength += 1;
    } else {
        feedback.push('Include numbers');
    }
    
    if (/[^A-Za-z0-9]/.test(password)) {
        strength += 1;
    } else {
        feedback.push('Include special characters');
    }
    
    return {
        strength: strength,
        feedback: feedback
    };
}

// Real-time password validation
document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('register-password');
    const confirmPasswordInput = document.getElementById('register-confirm-password');
    
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            const strength = checkPasswordStrength(this.value);
            updatePasswordStrengthIndicator(strength);
        });
    }
    
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', function() {
            const password = document.getElementById('register-password').value;
            if (this.value && this.value !== password) {
                this.style.borderColor = '#e74c3c';
            } else {
                this.style.borderColor = '#27ae60';
            }
        });
    }
});

// Update password strength indicator
function updatePasswordStrengthIndicator(strength) {
    // You can add a visual strength indicator here
    console.log('Password strength:', strength.strength, '/ 5');
    if (strength.feedback.length > 0) {
        console.log('Suggestions:', strength.feedback.join(', '));
    }
}

// Social login handlers (demo)
function handleGoogleLogin() {
    showToast('Google login functionality would be implemented here', 'info');
}

function handleFacebookLogin() {
    showToast('Facebook login functionality would be implemented here', 'info');
}

// Forgot password handler
function handleForgotPassword() {
    const email = document.getElementById('login-email').value;
    
    if (!email) {
        showToast('Please enter your email address', 'warning');
        return;
    }
    
    showToast('Password reset link sent to your email', 'success');
}

// Export functions for use in other pages
window.auth = {
    checkAuthStatus,
    logout,
    showToast,
    handleGoogleLogin,
    handleFacebookLogin,
    handleForgotPassword
};