import {
  getCart,
  saveCart,
  calculateTotals,
  placeOrder,
} from "../../utils/storage/CartService.js";
import { getWishlist } from "../../utils/storage/WishlistService.js";
import { Navbar } from "../../components/navbar.js";

function getProducts() {
  return JSON.parse(localStorage.getItem("products")) || [];
}

function initializeNavbar() {
  const navbar = new Navbar("navbar-container", "../../");
  navbar.render();
}

function updateNavbarCounts() {
  const cart = getCart();
  const wishlist = getWishlist();
  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const cartBadge = document.getElementById("cart-count");
  const wishlistBadge = document.getElementById("wishlist-count");

  if (cartBadge) {
    cartBadge.textContent = totalCartItems;
  }
  if (wishlistBadge) {
    wishlistBadge.textContent = wishlist.length;
  }
}

function updateQuantity(productId, type) {
  const cart = getCart();
  const item = cart.find((i) => i.productId === productId);
  if (!item) return;

  const products = getProducts();
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  if (type === "inc") {
    if (item.quantity < product.stockQuantity) {
      item.quantity++;
    }
  } else {
    if (item.quantity === 1) {
      const index = cart.findIndex((i) => i.productId === productId);
      cart.splice(index, 1);
    } else {
      item.quantity--;
    }
  }

  saveCart(cart);
  renderCart();
}

function removeItem(productId) {
  const cart = getCart().filter((i) => i.productId !== productId);
  saveCart(cart);
  renderCart();
}

function clearCart() {
  saveCart([]);
  renderCart();
}

function renderCart() {
  const container = document.getElementById("cart-items");
  const empty = document.getElementById("empty-cart");
  const summary = document.getElementById("order-summary");
  const count = document.getElementById("items-count");

  const cart = getCart();
  const products = getProducts();

  container.innerHTML = "";

  if (!cart.length) {
    empty.classList.remove("d-none");
    summary.classList.add("d-none");
    count.textContent = "0 Items";
    updateNavbarCounts();
    return;
  }

  empty.classList.add("d-none");
  summary.classList.remove("d-none");

  cart.forEach((item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) return;

    const div = document.createElement("div");
    div.className = "cart-item mb-3";

    div.innerHTML = `
      <div class="product-image">
        <img src="${product.image}">
      </div>

      <div class="product-info">
        <div class="product-title">${product.name}</div>
        <div>In stock: ${product.stockQuantity}</div>

        <div class="quantity-box">
          <button onclick="updateQuantity(${product.id}, 'dec')">-</button>
          <strong>${item.quantity}</strong>
          <button onclick="updateQuantity(${product.id}, 'inc')"
            ${item.quantity >= product.stockQuantity ? "disabled" : ""}>+</button>
        </div>
      </div>

      <div class="text-end">
        <div>${product.price} each</div>
        <div class="price-total">${(product.price * item.quantity).toFixed(2)}</div>
        <button class="btn btn-link text-danger p-0"
          onclick="removeItem(${product.id})">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    `;

    container.appendChild(div);
  });

  const totals = calculateTotals(cart);

  document.getElementById("subtotal").textContent =
    `${totals.subtotal.toFixed(2)}`;
  document.getElementById("tax").textContent = `${totals.tax.toFixed(2)}`;
  document.getElementById("total").textContent = `${totals.total.toFixed(2)}`;

  count.textContent = cart.length + " Items";
  updateNavbarCounts();
}

document.addEventListener("DOMContentLoaded", () => {
  initializeNavbar();
  // initializeFooter();
  renderCart();
  document.getElementById("clear-cart").onclick = clearCart;
  document.getElementById("place-order").onclick = placeOrder;
});

window.updateQuantity = updateQuantity;
window.removeItem = removeItem;
window.clearCart = clearCart;
