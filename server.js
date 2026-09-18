const express = require("express");
const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");

// Load .env for local development (no dotenv package required)
const envPath = path.join(__dirname, ".env");
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, "utf8")
    .split(/\r?\n/)
    .forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      const equalIndex = trimmed.indexOf("=");
      if (equalIndex === -1) return;
      const key = trimmed.slice(0, equalIndex).trim();
      const value = trimmed.slice(equalIndex + 1).trim();
      if (!process.env[key]) {
        process.env[key] = value;
      }
    });
}

const app = express();
const PORT = process.env.PORT || 3000;

if (!process.env.DATABASE_URL) {
  console.error(
    "DATABASE_URL is not set. Copy .env.example to .env or set it in Docker Compose."
  );
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/products", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, price, description, image, category FROM products ORDER BY id ASC"
    );

    const products = result.rows.map((row) => ({
      ...row,
      price: Number(row.price),
    }));

    res.json(products);
  } catch (error) {
    console.error("GET /api/products error:", error.message);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

app.post("/api/orders", async (req, res) => {
  try {
    const { customer_name, email, address, total } = req.body;

    if (!customer_name || !email || !address || total === undefined) {
      return res.status(400).json({
        error: "customer_name, email, address, and total are required",
      });
    }

    const parsedTotal = Number(total);
    if (Number.isNaN(parsedTotal) || parsedTotal < 0) {
      return res.status(400).json({ error: "total must be a valid number" });
    }

    const result = await pool.query(
      `INSERT INTO orders (customer_name, email, address, total)
       VALUES ($1, $2, $3, $4)
       RETURNING id, customer_name, email, address, total, created_at`,
      [
        String(customer_name).trim(),
        String(email).trim(),
        String(address).trim(),
        parsedTotal,
      ]
    );

    const order = result.rows[0];
    order.total = Number(order.total);

    res.status(201).json(order);
  } catch (error) {
    console.error("POST /api/orders error:", error.message);
    res.status(500).json({ error: "Failed to create order" });
  }
});

app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        error: "name, email, and message are required",
      });
    }

    const result = await pool.query(
      `INSERT INTO contact_messages (name, email, message)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, message, created_at`,
      [String(name).trim(), String(email).trim(), String(message).trim()]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("POST /api/contact error:", error.message);
    res.status(500).json({ error: "Failed to send message" });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`QuickCart running on http://localhost:${PORT}`);
});
