import {
  getWishlist,
  removeFromWishlist,
  moveToCart
} from "../../utils/storage/WishlistService.js";

function renderWishlist() {

  const grid = document.getElementById("wishlist-grid");
  const empty = document.getElementById("empty-wishlist");

  const wishlist = getWishlist();

  grid.innerHTML = "";

  if (!wishlist.length) {
    empty.classList.remove("d-none");
    return;
  }

  empty.classList.add("d-none");

  wishlist.forEach(product => {

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
          <div class="wishlist-price">$${product.price}</div>

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

  /* EVENTS */
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
}

document.addEventListener("DOMContentLoaded", renderWishlist);
