const express = require("express");
const path = require("path");
const products = require("./data/products.json");

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory storage for demo (no database)
const orders = [];
const contactMessages = [];
let nextOrderId = 1;
let nextContactId = 1;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/products", (req, res) => {
  res.json(products);
});

app.post("/api/orders", (req, res) => {
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

  const order = {
    id: nextOrderId++,
    customer_name: String(customer_name).trim(),
    email: String(email).trim(),
    address: String(address).trim(),
    total: parsedTotal,
    created_at: new Date().toISOString(),
  };

  orders.push(order);
  res.status(201).json(order);
});

app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      error: "name, email, and message are required",
    });
  }

  const contact = {
    id: nextContactId++,
    name: String(name).trim(),
    email: String(email).trim(),
    message: String(message).trim(),
    created_at: new Date().toISOString(),
  };

  contactMessages.push(contact);
  res.status(201).json(contact);
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`QuickCart running on http://localhost:${PORT}`);
});
