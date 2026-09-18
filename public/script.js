const CART_KEY = "quickcart_cart";

const homeProductsEl = document.getElementById("homeProducts");
const productsGridEl = document.getElementById("productsGrid");
const productsStatusEl = document.getElementById("productsStatus");
const cartItemsEl = document.getElementById("cartItems");
const cartCountEl = document.getElementById("cartCount");
const cartTotalEl = document.getElementById("cartTotal");
const checkoutForm = document.getElementById("checkoutForm");
const checkoutMessage = document.getElementById("checkoutMessage");
const contactForm = document.getElementById("contactForm");
const contactMessage = document.getElementById("contactMessage");
const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");

let products = [];

function money(value) {
  return `$${Number(value).toFixed(2)}`;
}

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartUI();
}

function getCartCount(cart = getCart()) {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function getCartTotal(cart = getCart()) {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function showPage(pageId) {
  document.querySelectorAll(".page").forEach((page) => {
    page.classList.toggle("active", page.id === pageId);
  });

  document.querySelectorAll("[data-nav]").forEach((link) => {
    link.classList.toggle("active", link.dataset.nav === pageId);
  });

  mainNav.classList.remove("open");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function createProductCard(product) {
  const card = document.createElement("article");
  card.className = "product-card";
  card.innerHTML = `
    <img src="${product.image}" alt="${product.name}" loading="lazy" />
    <div class="product-body">
      <div class="product-category">${product.category || "General"}</div>
      <h3>${product.name}</h3>
      <p>${product.description || ""}</p>
      <div class="product-footer">
        <span class="price">${money(product.price)}</span>
        <button class="btn btn-secondary" type="button">Add to cart</button>
      </div>
    </div>
  `;

  card.querySelector("button").addEventListener("click", () => {
    addToCart(product);
  });

  return card;
}

function renderProducts() {
  homeProductsEl.innerHTML = "";
  productsGridEl.innerHTML = "";

  if (!products.length) {
    productsStatusEl.textContent = "No products found.";
    homeProductsEl.innerHTML =
      '<div class="empty-state">No featured products available.</div>';
    return;
  }

  productsStatusEl.textContent = `${products.length} products loaded from the database.`;

  products.slice(0, 3).forEach((product) => {
    homeProductsEl.appendChild(createProductCard(product));
  });

  products.forEach((product) => {
    productsGridEl.appendChild(createProductCard(product));
  });
}

async function loadProducts() {
  productsStatusEl.textContent = "Loading products...";
  try {
    const response = await fetch("/api/products");
    if (!response.ok) {
      throw new Error("Failed to load products");
    }
    products = await response.json();
    renderProducts();
  } catch (error) {
    productsStatusEl.textContent =
      "Could not load products. Make sure PostgreSQL is running.";
    homeProductsEl.innerHTML = `<div class="empty-state">${error.message}</div>`;
  }
}

function addToCart(product) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.image,
      quantity: 1,
    });
  }

  saveCart(cart);
}

function changeQuantity(productId, delta) {
  const cart = getCart()
    .map((item) => {
      if (item.id === productId) {
        return { ...item, quantity: item.quantity + delta };
      }
      return item;
    })
    .filter((item) => item.quantity > 0);

  saveCart(cart);
}

function removeFromCart(productId) {
  saveCart(getCart().filter((item) => item.id !== productId));
}

function updateCartUI() {
  const cart = getCart();
  cartCountEl.textContent = String(getCartCount(cart));
  cartTotalEl.textContent = money(getCartTotal(cart));

  if (!cart.length) {
    cartItemsEl.innerHTML =
      '<div class="empty-state">Your cart is empty. Add products to get started.</div>';
    return;
  }

  cartItemsEl.innerHTML = "";

  cart.forEach((item) => {
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <img src="${item.image}" alt="${item.name}" />
      <div>
        <h3>${item.name}</h3>
        <p>${money(item.price)} each</p>
        <div class="qty-controls">
          <button type="button" data-action="dec">−</button>
          <span>${item.quantity}</span>
          <button type="button" data-action="inc">+</button>
        </div>
      </div>
      <div class="cart-item-actions">
        <strong>${money(item.price * item.quantity)}</strong>
        <button class="btn btn-danger" type="button" data-action="remove">Remove</button>
      </div>
    `;

    row.querySelector('[data-action="dec"]').addEventListener("click", () => {
      changeQuantity(item.id, -1);
    });
    row.querySelector('[data-action="inc"]').addEventListener("click", () => {
      changeQuantity(item.id, 1);
    });
    row.querySelector('[data-action="remove"]').addEventListener("click", () => {
      removeFromCart(item.id);
    });

    cartItemsEl.appendChild(row);
  });
}

checkoutForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  checkoutMessage.className = "form-message";
  checkoutMessage.textContent = "";

  const cart = getCart();
  if (!cart.length) {
    checkoutMessage.classList.add("error");
    checkoutMessage.textContent = "Your cart is empty.";
    return;
  }

  const formData = new FormData(checkoutForm);
  const payload = {
    customer_name: formData.get("customer_name"),
    email: formData.get("email"),
    address: formData.get("address"),
    total: getCartTotal(cart),
  };

  try {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Order failed");
    }

    saveCart([]);
    checkoutForm.reset();
    checkoutMessage.classList.add("success");
    checkoutMessage.textContent = `Order #${data.id} placed successfully. Total ${money(
      data.total
    )}.`;
  } catch (error) {
    checkoutMessage.classList.add("error");
    checkoutMessage.textContent = error.message;
  }
});

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  contactMessage.className = "form-message";
  contactMessage.textContent = "";

  const formData = new FormData(contactForm);
  const payload = {
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  };

  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to send message");
    }

    contactForm.reset();
    contactMessage.classList.add("success");
    contactMessage.textContent = "Message sent. Thank you!";
  } catch (error) {
    contactMessage.classList.add("error");
    contactMessage.textContent = error.message;
  }
});

document.querySelectorAll("[data-nav]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    showPage(link.dataset.nav);
  });
});

navToggle.addEventListener("click", () => {
  mainNav.classList.toggle("open");
});

document.getElementById("year").textContent = String(new Date().getFullYear());

updateCartUI();
loadProducts();
showPage("home");
