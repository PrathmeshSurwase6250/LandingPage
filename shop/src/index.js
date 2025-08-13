import path from 'path';
import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { database, ensureDatabaseInitialized, getAllProducts, getProductById, createOrderWithItems } from './lib/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// View engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

// Static files
app.use('/public', express.static(path.join(__dirname, '../public')));

// Body parsing
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Sessions for cart
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'devsecret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);

function ensureCart(req, _res, next) {
  if (!req.session.cart) {
    req.session.cart = { items: {}, totalItems: 0, totalCents: 0 };
  }
  next();
}

function formatPrice(cents) {
  return `$${(cents / 100).toFixed(2)}`;
}

function recalcCartTotals(cart) {
  let totalItems = 0;
  let totalCents = 0;
  for (const item of Object.values(cart.items)) {
    totalItems += item.quantity;
    totalCents += item.quantity * item.unitPriceCents;
  }
  cart.totalItems = totalItems;
  cart.totalCents = totalCents;
}

app.use(ensureCart);

// Middleware to expose cart length to templates
app.use((req, res, next) => {
  res.locals.cartCount = req.session.cart?.totalItems || 0;
  res.locals.formatPrice = formatPrice;
  next();
});

// Home
app.get('/', async (req, res) => {
  const products = getAllProducts();
  res.render('index', { products });
});

// Products list
app.get('/products', (req, res) => {
  const products = getAllProducts();
  res.render('products', { products });
});

// Product detail
app.get('/product/:id', (req, res) => {
  const id = Number(req.params.id);
  const product = getProductById(id);
  if (!product) return res.status(404).send('Product not found');
  res.render('product', { product });
});

// Cart page
app.get('/cart', (req, res) => {
  const cart = req.session.cart;
  res.render('cart', { cart });
});

// Add to cart
app.post('/cart/add', (req, res) => {
  const productId = Number(req.body.productId);
  const quantity = Math.max(1, Number(req.body.quantity || 1));
  const product = getProductById(productId);
  if (!product) return res.status(404).send('Product not found');

  const cart = req.session.cart;
  const existing = cart.items[productId];
  const newQty = (existing?.quantity || 0) + quantity;
  if (newQty > product.stock) {
    return res.status(400).send('Not enough stock');
  }
  cart.items[productId] = {
    productId,
    name: product.name,
    unitPriceCents: product.price_cents,
    imageUrl: product.image_url,
    quantity: newQty,
  };
  recalcCartTotals(cart);
  res.redirect('/cart');
});

// Update cart item quantity
app.post('/cart/update', (req, res) => {
  const productId = Number(req.body.productId);
  let quantity = Number(req.body.quantity);
  const cart = req.session.cart;
  const product = getProductById(productId);
  if (!product) return res.status(404).send('Product not found');

  if (isNaN(quantity) || quantity < 0) quantity = 0;
  if (quantity === 0) {
    delete cart.items[productId];
  } else if (quantity <= product.stock) {
    if (cart.items[productId]) {
      cart.items[productId].quantity = quantity;
    } else {
      cart.items[productId] = {
        productId,
        name: product.name,
        unitPriceCents: product.price_cents,
        imageUrl: product.image_url,
        quantity,
      };
    }
  } else {
    return res.status(400).send('Not enough stock');
  }

  recalcCartTotals(cart);
  res.redirect('/cart');
});

// Remove from cart
app.post('/cart/remove', (req, res) => {
  const productId = Number(req.body.productId);
  const cart = req.session.cart;
  if (cart.items[productId]) {
    delete cart.items[productId];
  }
  recalcCartTotals(cart);
  res.redirect('/cart');
});

// Checkout
app.get('/checkout', (req, res) => {
  const cart = req.session.cart;
  if (cart.totalItems === 0) return res.redirect('/products');
  res.render('checkout', { cart });
});

app.post('/checkout', (req, res) => {
  const cart = req.session.cart;
  if (!cart || cart.totalItems === 0) return res.redirect('/products');

  const { fullName, email, address, city, country } = req.body;
  try {
    const orderId = createOrderWithItems({
      fullName,
      email,
      address,
      city,
      country,
      items: Object.values(cart.items),
      totalCents: cart.totalCents,
    });

    // Clear cart
    req.session.cart = { items: {}, totalItems: 0, totalCents: 0 };
    res.redirect(`/order/${orderId}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to place order');
  }
});

// Order success page
app.get('/order/:id', (req, res) => {
  const orderId = Number(req.params.id);
  const order = database
    .prepare('SELECT * FROM orders WHERE id = ?')
    .get(orderId);
  const items = database
    .prepare(
      'SELECT oi.*, p.name, p.image_url FROM order_items oi JOIN products p ON p.id = oi.product_id WHERE oi.order_id = ?'
    )
    .all(orderId);
  if (!order) return res.status(404).send('Order not found');
  res.render('order_success', { order, items });
});

// Simple API endpoints
app.get('/api/products', (_req, res) => {
  res.json(getAllProducts());
});

app.get('/api/cart', (req, res) => {
  res.json(req.session.cart);
});

async function start() {
  ensureDatabaseInitialized();
  app.listen(PORT, () => {
    console.log(`Shop server running at http://localhost:${PORT}`);
  });
}

start();