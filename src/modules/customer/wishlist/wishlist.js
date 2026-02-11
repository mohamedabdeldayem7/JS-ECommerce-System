import {
  getWishlist,
  removeFromWishlist,
  moveToCart
} from "./WishlistService.js";
import { getCart } from "../cart/CartService.js";
import { Navbar } from "../../../components/navbar.js";
import { Footer } from "../../../components/footer.js";

/* ===================== NEW IMPORT ===================== */
// ADDED: to read current user from cookies (same as orders)
import StorageManager from "../../../utils/storage/storage-helper.js";
import KEYS from "../../../utils/keys.js";
/* ===================== END NEW IMPORT ===================== */

// ADDED: storage instance
const storage = new StorageManager();

function getProducts() {
  return JSON.parse(localStorage.getItem("products")) || [];
}

function initializeNavbar() {
  const navbar = new Navbar("navbar-container", "../../");
  navbar.render();
}

function initializeFooter() {
  const footer = new Footer("footer-container");
  footer.render();
  footer.updateYear();
}

function updateNavbarCounts() {
  const wishlist = getWishlist();
  const cart = getCart();
  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  const wishlistBadge = document.getElementById("wishlist-count");
  const cartBadge = document.getElementById("cart-count");
  
  if (wishlistBadge) {
    wishlistBadge.textContent = wishlist.length;
  }
  if (cartBadge) {
    cartBadge.textContent = totalCartItems;
  }
}

function renderWishlist() {

  const grid = document.getElementById("wishlist-grid");
  const empty = document.getElementById("empty-wishlist");

 /* ===================== MODIFIED ===================== */
  // ADDED: get current user id from cookies (same logic as orders)
  const currentUserId = storage.getCookie(KEYS.CURRENT_USER);

  // ADDED: if user not logged in, show empty state
  if (!currentUserId) {
    empty.classList.remove("d-none");
    updateNavbarCounts();
    return;
  }
  /* ===================== END MODIFIED ===================== */



  const wishlistIds = getWishlist();
  const products = getProducts();

  grid.innerHTML = "";

  if (!wishlistIds.length) {
    empty.classList.remove("d-none");
    updateNavbarCounts();
    return;
  }

  empty.classList.add("d-none");

  wishlistIds.forEach(productId => {

    const product = products.find(p => p.id === productId);
    if (!product) return;

    const col = document.createElement("div");
    col.className = "col-12 col-sm-6 col-md-4 col-lg-3";

    col.innerHTML = `
      <div class="wishlist-card">

        <div class="wishlist-img-wrapper">
          <div class="remove-btn" data-id="${product.id}">
            <i class="bi bi-trash"></i>
          </div>

          <img src="${product.image}" class="wishlist-img" alt="${product.name}">
        </div>

        <div class="wishlist-body">
          <div class="wishlist-title">${product.name}</div>
          <div class="wishlist-price">${product.price}</div>

          <button
            class="btn btn-primary w-100 move-btn"
            data-id="${product.id}"
            ${product.stockQuantity === 0 ? "disabled" : ""}
          >
            <i class="bi bi-cart-plus"></i>
            Move to Cart
          </button>
        </div>
      </div>
    `;

    grid.appendChild(col);
  });

  document.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      removeFromWishlist(+btn.dataset.id);
      renderWishlist();
    });
  });

  document.querySelectorAll(".move-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      moveToCart(+btn.dataset.id);
      renderWishlist();
    });
  });
  
  updateNavbarCounts();
}

document.addEventListener("DOMContentLoaded", () => {
  initializeNavbar();
  initializeFooter();
  renderWishlist();
});
