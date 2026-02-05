import {
  getOrders,
  getAllProducts,
  getStatusBadge,
} from "../../utils/storage/OrderService.js";
////////
import StorageManager from "../../utils/storage/storage-helper.js";
import KEYS from "../../utils/keys.js";
///////
import { getCart } from "../../utils/storage/CartService.js";
import { getWishlist } from "../../utils/storage/WishlistService.js";
import { Navbar } from "../../components/navbar.js";

const storage = new StorageManager();


function initializeNavbar() {
  const navbar = new Navbar("navbar-container", "../../");
  navbar.render();
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
//////
function renderOrders() {
  const container = document.getElementById("orders-container");
  const empty = document.getElementById("empty-orders");

  // 🔽 NEW: get logged-in customerId from cookies
  const customerId = storage.getCookie(KEYS.CURRENT_USER);

  // 🔽 if no logged-in user, show empty state
  if (!customerId) {
    empty.classList.remove("d-none");
    return;
  }

  // 🔽 MODIFIED: fetch orders for current customer only
  const orders = getOrders(customerId);
  /////////////////////
  const products = getAllProducts();

  container.innerHTML = "";

  if (!orders.length) {
    empty.classList.remove("d-none");
    return;
  }

  empty.classList.add("d-none");

  orders.forEach((order) => {
    const detailsId = `details-${order.id}`;
    const badge = getStatusBadge(order.status);

    const mainRow = document.createElement("tr");

    mainRow.innerHTML = `
      <td>#${order.id}</td>
      <td>${order.date}</td>
      <td>
        <span class="badge bg-${badge}">
          ${order.status}
        </span>
      </td>
      <td class="fw-bold text-primary">${order.total}</td>
      <td>
        <button
          class="btn btn-sm btn-outline-primary"
          data-bs-toggle="collapse"
          data-bs-target="#${detailsId}">
          View Details
        </button>
      </td>
    `;

    const detailsRow = document.createElement("tr");

    detailsRow.innerHTML = `
      <td colspan="5" class="p-0">
        <div class="collapse bg-light" id="${detailsId}">
          <div class="p-4">
            ${order.items
              .map((item) => {
                const product = products.find((p) => p.id == item.productId);
                if (!product) return "";

                return `
                <div class="order-product">
                  <img src="${product.image}">
                  <div class="flex-grow-1">
                    <div class="fw-semibold">${product.name}</div>
                    <div class="text-muted">Quantity: ${item.quantity}</div>
                  </div>
                  <div class="fw-bold text-primary">
                    ${(product.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              `;
              })
              .join("")}
          </div>
        </div>
      </td>
    `;

    container.appendChild(mainRow);
    container.appendChild(detailsRow);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initializeNavbar();
    // initializeFooter();

  updateNavbarCounts();
  renderOrders();
});
