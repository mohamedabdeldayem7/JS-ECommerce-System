import StorageManager from "../../utils/storage/storage-helper.js";
import { Filter } from "../../components/filter.js";
import { Navbar } from "../../components/navbar.js";
import { Footer } from "../../components/footer.js";
import {
  saveCategoriesDummy,
  saveProductsDummy,
} from "../../utils/storage/dummyData.js";
import KEYS from "../../utils/keys.js";

const storage = new StorageManager();

function migrateOldCartWishlistData() {
  const carts = storage.get("carts");
  const wishlists = storage.get("wishlists");

  if (carts && typeof carts === "object") {
    let needsMigration = false;
    const newCarts = {};

    for (const userId in carts) {
      if (carts[userId].items && carts[userId].usrID) {
        needsMigration = true;
        newCarts[userId] = carts[userId].items.map((item) => ({
          productId: item.pId,
          quantity: item.qnt,
        }));
      } else {
        newCarts[userId] = carts[userId];
      }
    }

    if (needsMigration) {
      storage.set("carts", newCarts);
      console.log("Migrated carts to new format");
    }
  }

  if (wishlists && typeof wishlists === "object") {
    let needsMigration = false;
    const newWishlists = {};

    for (const userId in wishlists) {
      if (wishlists[userId].items && wishlists[userId].usrID) {
        needsMigration = true;
        newWishlists[userId] = wishlists[userId].items.map((item) => item.pId);
      } else {
        newWishlists[userId] = wishlists[userId];
      }
    }

    if (needsMigration) {
      storage.set("wishlists", newWishlists);
      console.log("Migrated wishlists to new format");
    }
  }
}

migrateOldCartWishlistData();

if (!storage.get("categories") || storage.get("categories").length === 0) {
  saveCategoriesDummy();
}
if (!storage.get("products") || storage.get("products").length === 0) {
  saveProductsDummy();
}

function getCurrentUserId() {
  const userId = storage.getCookie(KEYS.CURRENT_USER);
  return userId || null;
}

function isUserLoggedIn() {
  return getCurrentUserId() !== null;
}

function checkAdminRedirect() {
  const currentUser = storage.get("currentUser");
  if (currentUser && currentUser.role === "admin") {
    alert("Admin users should use the admin dashboard!");
    window.location.href = "pages/auth/login.html";
  }
}

const productsContainer = document.getElementById("products-container");
const emptyState = document.getElementById("empty-state");
const categoryTitle = document.getElementById("category-title");
const categoryDescription = document.getElementById("category-description");
const sortSelect = document.getElementById("sort-select");

let allProducts = [];
let allCategories = [];
let wishlist = [];
let filteredProducts = [];
let currentFilters = {
  category: "all",
  priceRange: { min: 0, max: 2500 },
  search: "",
  sort: "popular",
};

let filterComponent;

function init() {
  checkAdminRedirect();
  initializeNavbar();
  loadData();
  initializeFilter();
  initializeFooter();
  applyFilters();
  updateWishlistCount();
  updateCartCount();
  attachEventListeners();
}

function initializeNavbar() {
  const navbar = new Navbar("navbar-container");
  navbar.render();
}

function loadData() {
  allProducts = storage.get("products") || [];
  allCategories = storage.get("categories") || [];

  if (isUserLoggedIn()) {
    const userId = getCurrentUserId();
    const wishlists = storage.get("wishlists") || {};
    const userWishlistIds = wishlists[userId] || [];

    console.log("Loading wishlist:", {
      userId,
      userWishlistIds,
      allWishlists: wishlists,
    });

    wishlist = userWishlistIds
      .map((id) => allProducts.find((p) => p.id === id))
      .filter((p) => p);
  } else {
    wishlist = [];
  }

  if (
    allProducts.length > 0 &&
    allProducts[0].features &&
    typeof allProducts[0].features === "number"
  ) {
    allProducts = allProducts.map((product) => {
      const correctId = product.features;
      product.id = correctId;
      product.features = [];
      return product;
    });
    storage.set("products", allProducts);
  }

  console.log("Loaded products:", allProducts.length);
  console.log("Loaded categories:", allCategories.length);
}

function initializeFilter() {
  filterComponent = new Filter("filter-sidebar", handleFilterChange);
  filterComponent.render(allCategories);
}

function initializeFooter() {
  const footer = new Footer("footer-container");
  footer.render();
  footer.updateYear();
}

function handleFilterChange(filters) {
  currentFilters.category = filters.category;
  currentFilters.priceRange = filters.priceRange;
  applyFilters();
  updateCategoryHeader();
}

function applyFilters() {
  filteredProducts = allProducts;

  if (currentFilters.category !== "all") {
    filteredProducts = filteredProducts.filter(
      (product) => product.categoryId === parseInt(currentFilters.category),
    );
  }

  filteredProducts = filteredProducts.filter(
    (product) =>
      product.price >= currentFilters.priceRange.min &&
      product.price <= currentFilters.priceRange.max,
  );

  if (currentFilters.search) {
    filteredProducts = filteredProducts.filter((product) =>
      product.name.toLowerCase().includes(currentFilters.search.toLowerCase()),
    );
  }

  sortProducts();
  displayProducts(filteredProducts);
}

function sortProducts() {
  switch (currentFilters.sort) {
    case "price-low":
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case "price-high":
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case "name":
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "rating":
      filteredProducts.sort(() => Math.random() - 0.5);
      break;
    case "popular":
    default:
      break;
  }
}

function updateCategoryHeader() {
  if (currentFilters.category === "all") {
    categoryTitle.textContent = "All Products";
    categoryDescription.textContent =
      "Browse our complete collection of Our products.";
  } else {
    const category = allCategories.find(
      (cat) => cat.id === parseInt(currentFilters.category),
    );
    if (category) {
      categoryTitle.textContent = category.name;
      categoryDescription.textContent =
        category.description || "Browse our latest collection.";
    }
  }
}

function displayProducts(products) {
  productsContainer.innerHTML = "";

  if (products.length === 0) {
    productsContainer.style.display = "none";
    emptyState.style.display = "block";
    return;
  }

  productsContainer.style.display = "grid";
  emptyState.style.display = "none";

  products.forEach((product) => {
    const productCard = createProductCard(product);
    productsContainer.appendChild(productCard);
  });
}

function createProductCard(product) {
  const card = document.createElement("div");
  card.className = "product-card";

  const category = allCategories.find((cat) => cat.id === product.categoryId);
  const categoryName = category ? category.name : "Uncategorized";

  let isInWishlist = false;
  if (isUserLoggedIn()) {
    const userId = getCurrentUserId();
    const wishlists = storage.get("wishlists") || {};
    const userWishlistIds = wishlists[userId] || [];
    isInWishlist = userWishlistIds.includes(product.id);
  }

  const rating = (Math.random() * (5 - 4) + 4).toFixed(1);

  card.innerHTML = `
    <div class="product-image-container">
      <img src="${product.image}" alt="${product.name}" class="product-image" />
      <button 
        class="btn-wishlist-card ${isInWishlist ? "active" : ""}" 
        data-product-id="${product.id}"
        title="${isInWishlist ? "Remove from wishlist" : "Add to wishlist"}"
      >
        ${isInWishlist ? "❤️" : "🤍"}
      </button>
    </div>
    <div class="product-body">
      <div class="product-category-tag">${categoryName.toUpperCase()}</div>
      <h3 class="product-name">${product.name}</h3>
      <div class="product-footer">
        <div class="product-price">$${product.price.toFixed(2)}</div>
        <div class="product-rating">
          <span class="rating-star">⭐</span>
          <span class="rating-value">${rating}</span>
        </div>
      </div>
      <button class="btn-add-cart" ${product.stockQuantity === 0 ? "disabled" : ""}>
        <span>🛒</span>
        ${product.stockQuantity === 0 ? "Out of Stock" : "Add to Cart"}
      </button>
    </div>
  `;

  const wishlistBtn = card.querySelector(".btn-wishlist-card");
  wishlistBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  });

  card.addEventListener("click", () => {
    window.location.href = `pages/customer/product-details.html?id=${product.id}`;
  });

  const addToCartBtn = card.querySelector(".btn-add-cart");
  addToCartBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    addToCart(product);
  });

  return card;
}

function toggleWishlist(productId) {
  if (!isUserLoggedIn()) {
    alert("You should Login FIRST");
    window.location.href = "pages/auth/login.html";
    return;
  }

  const product = allProducts.find((p) => p.id === productId);
  if (!product) return;

  const userId = getCurrentUserId();
  const wishlists = storage.get("wishlists") || {};
  let userWishlistIds = wishlists[userId] || [];

  const index = userWishlistIds.indexOf(productId);

  if (index !== -1) {
    userWishlistIds.splice(index, 1);
  } else {
    userWishlistIds.push(productId);
  }

  wishlists[userId] = userWishlistIds;
  storage.set("wishlists", wishlists);

  console.log("Wishlist saved:", {
    userId,
    wishlist: userWishlistIds,
    allWishlists: wishlists,
  });

  wishlist = userWishlistIds
    .map((id) => allProducts.find((p) => p.id === id))
    .filter((p) => p);
  updateWishlistCount();

  const allWishlistButtons = document.querySelectorAll(
    `[data-product-id="${productId}"]`,
  );
  const isInWishlist = userWishlistIds.includes(productId);

  allWishlistButtons.forEach((btn) => {
    if (isInWishlist) {
      btn.classList.add("active");
      btn.innerHTML = "❤️";
      btn.title = "Remove from wishlist";
    } else {
      btn.classList.remove("active");
      btn.innerHTML = "🤍";
      btn.title = "Add to wishlist";
    }
  });
}

function addToCart(product) {
  if (!isUserLoggedIn()) {
    alert("You should Login FIRST");
    window.location.href = "pages/auth/login.html";
    return;
  }

  if (product.stockQuantity === 0) return;

  const userId = getCurrentUserId();
  const carts = storage.get("carts") || {};
  let userCart = carts[userId] || [];

  const existingItem = userCart.find((item) => item.productId === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    userCart.push({ productId: product.id, quantity: 1 });
  }

  carts[userId] = userCart;
  storage.set("carts", carts);

  console.log("Cart saved:", { userId, cart: userCart, allCarts: carts });

  updateCartCount();
  alert("Added to cart!");
}

function updateWishlistCount() {
  const wishlistCountBadge = document.getElementById("wishlist-count");
  if (wishlistCountBadge) {
    wishlistCountBadge.textContent = wishlist.length;
  }
}

function updateCartCount() {
  if (!isUserLoggedIn()) {
    const cartCountBadge = document.getElementById("cart-count");
    if (cartCountBadge) {
      cartCountBadge.textContent = 0;
    }
    return;
  }

  const userId = getCurrentUserId();
  const carts = storage.get("carts") || {};
  const userCart = carts[userId] || [];
  const totalItems = userCart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCountBadge = document.getElementById("cart-count");
  if (cartCountBadge) {
    cartCountBadge.textContent = totalItems;
  }
}

function attachEventListeners() {
  sortSelect?.addEventListener("change", (e) => {
    currentFilters.sort = e.target.value;
    applyFilters();
  });

  const navbarSearch = document.getElementById("navbar-search");
  navbarSearch?.addEventListener("input", (e) => {
    currentFilters.search = e.target.value;
    applyFilters();
  });
}

init();
