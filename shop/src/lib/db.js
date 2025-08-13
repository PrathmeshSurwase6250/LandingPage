import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../../data.sqlite');
export const database = new Database(dbPath);

database.pragma('journal_mode = WAL');

export function ensureDatabaseInitialized() {
  const createProducts = `
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      price_cents INTEGER NOT NULL,
      image_url TEXT NOT NULL,
      stock INTEGER NOT NULL DEFAULT 0
    );
  `;
  const createOrders = `
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      address TEXT NOT NULL,
      city TEXT NOT NULL,
      country TEXT NOT NULL,
      total_cents INTEGER NOT NULL,
      created_at TEXT NOT NULL
    );
  `;
  const createOrderItems = `
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      unit_price_cents INTEGER NOT NULL,
      FOREIGN KEY(order_id) REFERENCES orders(id),
      FOREIGN KEY(product_id) REFERENCES products(id)
    );
  `;

  database.exec(createProducts);
  database.exec(createOrders);
  database.exec(createOrderItems);

  const count = database.prepare('SELECT COUNT(*) as c FROM products').get().c;
  if (count === 0) {
    seedProducts();
  }
}

function seedProducts() {
  const sample = [
    {
      name: 'Vintage Backpack',
      description: 'Durable canvas backpack with leather straps. Perfect for daily carry and weekend trips.',
      price_cents: 8900,
      image_url: '/public/img/back.png',
      stock: 20,
    },
    {
      name: 'Classic Logo Tee',
      description: 'Soft cotton t-shirt with minimalist logo print. Unisex sizing.',
      price_cents: 2500,
      image_url: '/public/img/back.png',
      stock: 50,
    },
    {
      name: 'Insulated Bottle',
      description: 'Stainless steel bottle that keeps drinks cold for 24h or hot for 12h.',
      price_cents: 3200,
      image_url: '/public/img/back.png',
      stock: 35,
    },
    {
      name: 'Notebook Set',
      description: 'Set of 3 dotted notebooks with thick bleed-resistant paper.',
      price_cents: 1800,
      image_url: '/public/img/back.png',
      stock: 40,
    },
  ];
  const insert = database.prepare(
    'INSERT INTO products (name, description, price_cents, image_url, stock) VALUES (@name, @description, @price_cents, @image_url, @stock)'
  );
  const tx = database.transaction((rows) => {
    for (const row of rows) insert.run(row);
  });
  tx(sample);
}

export function getAllProducts() {
  return database.prepare('SELECT * FROM products ORDER BY id DESC').all();
}

export function getProductById(id) {
  return database.prepare('SELECT * FROM products WHERE id = ?').get(id);
}

export function createOrderWithItems({ fullName, email, address, city, country, items, totalCents }) {
  const now = new Date().toISOString();
  const insertOrder = database.prepare(
    'INSERT INTO orders (full_name, email, address, city, country, total_cents, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
  );

  const insertItem = database.prepare(
    'INSERT INTO order_items (order_id, product_id, quantity, unit_price_cents) VALUES (?, ?, ?, ?)'
  );

  const getProduct = database.prepare('SELECT stock, price_cents FROM products WHERE id = ?');
  const reduceStock = database.prepare('UPDATE products SET stock = stock - ? WHERE id = ?');

  const tx = database.transaction(() => {
    const orderInfo = insertOrder.run(fullName, email, address, city, country, totalCents, now);
    const orderId = orderInfo.lastInsertRowid;

    for (const item of items) {
      const product = getProduct.get(item.productId);
      if (!product) throw new Error('Product not found: ' + item.productId);
      if (product.stock < item.quantity) throw new Error('Insufficient stock for product ' + item.productId);
      insertItem.run(orderId, item.productId, item.quantity, item.unitPriceCents);
      reduceStock.run(item.quantity, item.productId);
    }

    return orderId;
  });

  return tx();
}