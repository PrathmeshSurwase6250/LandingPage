# ShopHub - Full Working Shopping Website

A modern, responsive e-commerce website built with HTML, CSS, and JavaScript. ShopHub provides a complete shopping experience with product browsing, cart management, user authentication, and checkout functionality.

## 🌟 Features

### 🛍️ Shopping Features
- **Product Catalog**: Browse products with categories and search functionality
- **Product Filtering**: Filter by category, price range, and ratings
- **Product Sorting**: Sort by name, price, and ratings
- **Shopping Cart**: Add, remove, and update product quantities
- **Cart Persistence**: Cart data saved in localStorage
- **Coupon System**: Apply discount codes (SAVE10, WELCOME, DISCOUNT)
- **Checkout Process**: Complete order placement with payment form

### 👤 User Features
- **User Authentication**: Login and registration system
- **Session Management**: Remember user login state
- **Profile Management**: User account information
- **Social Login**: Google and Facebook integration (demo)

### 🎨 Design Features
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Clean, professional design with animations
- **Dark/Light Theme**: Consistent color scheme
- **Interactive Elements**: Hover effects and smooth transitions
- **Loading States**: Visual feedback for user actions

### 🔧 Technical Features
- **Local Storage**: Persistent data storage
- **Search Functionality**: Real-time product search
- **Pagination**: Navigate through product pages
- **Toast Notifications**: User feedback messages
- **Form Validation**: Input validation and error handling
- **Mobile Menu**: Hamburger menu for mobile devices

## 📁 File Structure

```
shopping-website/
├── index.html              # Homepage
├── products.html           # Products page
├── cart.html              # Shopping cart
├── login.html             # Authentication page
├── css/
│   └── style.css          # Main stylesheet
├── js/
│   ├── main.js            # Main JavaScript functionality
│   ├── products.js        # Products page functionality
│   ├── cart.js            # Cart functionality
│   └── auth.js            # Authentication functionality
├── img/                   # Image assets
└── README.md              # This file
```

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No server required - runs entirely in the browser

### Installation
1. Clone or download the project files
2. Open `index.html` in your web browser
3. Start shopping!

### Running Locally
```bash
# If you have Python installed
python -m http.server 8000

# If you have Node.js installed
npx serve .

# Then open http://localhost:8000 in your browser
```

## 🛒 How to Use

### Browsing Products
1. Visit the homepage to see featured products
2. Click "Products" to browse all items
3. Use filters to narrow down your search
4. Sort products by price, name, or rating
5. Search for specific products using the search bar

### Shopping Cart
1. Click "Add to Cart" on any product
2. View your cart by clicking the cart icon
3. Adjust quantities or remove items
4. Apply coupon codes for discounts
5. Proceed to checkout

### User Account
1. Click the user icon to access login/register
2. Create a new account or sign in
3. Your session will be remembered
4. Access your profile and order history

## 🎯 Demo Credentials

### Test Users
- **Email**: john@example.com | **Password**: password123
- **Email**: jane@example.com | **Password**: password123

### Coupon Codes
- `SAVE10` - 10% discount
- `WELCOME` - 10% discount
- `DISCOUNT` - 10% discount

## 🛠️ Customization

### Adding Products
Edit the `products` array in `js/main.js`:

```javascript
const products = [
    {
        id: 1,
        name: "Product Name",
        price: 99.99,
        category: "Category",
        image: "image-url.jpg",
        rating: 4.5,
        reviews: 100,
        description: "Product description"
    }
    // Add more products...
];
```

### Styling
- Modify `css/style.css` to change colors, fonts, and layout
- Update CSS variables for consistent theming
- Add custom animations and effects

### Functionality
- Extend JavaScript files to add new features
- Integrate with backend APIs for real data
- Add payment gateway integration

## 📱 Responsive Design

The website is fully responsive and works on:
- **Desktop**: Full feature set with sidebar navigation
- **Tablet**: Optimized layout with touch-friendly buttons
- **Mobile**: Hamburger menu and mobile-optimized interface

## 🔒 Security Features

- Form validation and sanitization
- Secure password handling (demo)
- Session management
- Input validation

## 🚀 Performance Features

- Optimized images and assets
- Efficient JavaScript code
- Minimal dependencies
- Fast loading times

## 🎨 Design System

### Colors
- **Primary**: #3498db (Blue)
- **Secondary**: #2c3e50 (Dark Blue)
- **Success**: #27ae60 (Green)
- **Warning**: #f39c12 (Orange)
- **Error**: #e74c3c (Red)

### Typography
- **Font Family**: Poppins (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700

### Components
- Buttons, forms, cards, modals
- Consistent spacing and sizing
- Smooth animations and transitions

## 🔧 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 📈 Future Enhancements

- [ ] Backend integration with Node.js/Python
- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] Email notifications
- [ ] Order tracking system
- [ ] Admin dashboard
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Advanced search filters
- [ ] Multi-language support

## 🤝 Contributing

1. Fork the project
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Support

For support or questions:
- Create an issue on GitHub
- Email: support@shophub.com
- Phone: +1 234 567 8900

## 🙏 Acknowledgments

- Font Awesome for icons
- Google Fonts for typography
- Unsplash for sample images
- Modern CSS Grid and Flexbox for layout

---

**ShopHub** - Your Ultimate Shopping Destination 🛍️