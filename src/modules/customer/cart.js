import {
  getCart,
  saveCart,
  calculateTotals,
  placeOrder
} from "../../utils/storage/CartService.js";

/* ===== UPDATE QUANTITY ===== */
function updateQuantity(id, type) {

  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;

  if (type === "inc") {
    if (item.quantity < item.stockQuantity) {
      item.quantity++;
    }
  } else {
    if (item.quantity === 1) {
      const index = cart.findIndex(i => i.id === id);
      cart.splice(index, 1);
    } else {
      item.quantity--;
    }
  }

  saveCart(cart);
  renderCart();
}

/* ===== REMOVE ITEM ===== */
function removeItem(id) {
  const cart = getCart().filter(i => i.id !== id);
  saveCart(cart);
  renderCart();
}

/* ===== CLEAR CART ===== */
function clearCart() {
  saveCart([]);
  renderCart();
}

/* ===== RENDER ===== */
function renderCart() {

  const container = document.getElementById("cart-items");
  const empty = document.getElementById("empty-cart");
  const summary = document.getElementById("order-summary");
  const count = document.getElementById("items-count");

  const cart = getCart();
  container.innerHTML = "";

  if (!cart.length) {
    empty.classList.remove("d-none");
    summary.classList.add("d-none");
    count.textContent = "0 Items";
    return;
  }

  empty.classList.add("d-none");
  summary.classList.remove("d-none");

  cart.forEach(item => {

    const div = document.createElement("div");
    div.className = "cart-item mb-3";

    div.innerHTML = `
      <div class="product-image">
        <img src="${item.image}">
      </div>

      <div class="product-info">
        <div class="product-title">${item.name}</div>
        <div>In stock: ${item.stockQuantity}</div>

        <div class="quantity-box">
          <button onclick="updateQuantity(${item.id}, 'dec')">-</button>
          <strong>${item.quantity}</strong>
          <button onclick="updateQuantity(${item.id}, 'inc')"
            ${item.quantity >= item.stockQuantity ? "disabled" : ""}>+</button>
        </div>
      </div>

      <div class="text-end">
        <div>$${item.price} each</div>
        <div class="price-total">$${(item.price * item.quantity).toFixed(2)}</div>
        <button class="btn btn-link text-danger p-0"
          onclick="removeItem(${item.id})">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    `;

    container.appendChild(div);
  });

  const totals = calculateTotals(cart);

  document.getElementById("subtotal").textContent = `$${totals.subtotal.toFixed(2)}`;
  document.getElementById("tax").textContent      = `$${totals.tax.toFixed(2)}`;
  document.getElementById("total").textContent    = `$${totals.total.toFixed(2)}`;

  count.textContent = cart.length + " Items";
}

/* INIT */
document.addEventListener("DOMContentLoaded", () => {
  renderCart();
  document.getElementById("clear-cart").onclick = clearCart;
  document.getElementById("place-order").onclick = placeOrder;
});

window.updateQuantity = updateQuantity;
window.removeItem = removeItem;
window.clearCart = clearCart;
