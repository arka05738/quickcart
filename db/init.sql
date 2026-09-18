-- QuickCart database schema and sample data

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  description TEXT,
  image VARCHAR(500),
  category VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  customer_name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL,
  address TEXT NOT NULL,
  total NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO products (name, price, description, image, category) VALUES
(
  'Wireless Headphones',
  79.99,
  'Comfortable over-ear headphones with clear sound and long battery life.',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop',
  'Audio'
),
(
  'Smart Watch',
  129.99,
  'Track fitness, notifications, and daily activity with a sleek smartwatch.',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop',
  'Wearables'
),
(
  'Canvas Backpack',
  49.99,
  'Durable everyday backpack with padded laptop sleeve and multiple pockets.',
  'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop',
  'Bags'
),
(
  'Running Shoes',
  89.99,
  'Lightweight sneakers designed for comfort, support, and everyday movement.',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop',
  'Footwear'
),
(
  'Desk Lamp',
  34.99,
  'Modern LED desk lamp with adjustable brightness for study and work.',
  'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop',
  'Home'
),
(
  'Stainless Water Bottle',
  24.99,
  'Insulated bottle that keeps drinks cold or hot for hours on the go.',
  'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop',
  'Lifestyle'
);
