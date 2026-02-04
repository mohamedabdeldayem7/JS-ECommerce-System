import StorageManager from "../../utils/storage/storage-helper.js";
import { Filter } from "../../components/filter.js";
import { Navbar } from "../../components/navbar.js";
import { Footer } from "../../components/footer.js";
import { saveCategoriesDummy, saveProductsDummy } from "../../utils/storage/dummyData.js";
import KEYS from "../../utils/keys.js";

const storage = new StorageManager();

if (!storage.get("categories") || storage.get("categories").length === 0) {
  saveCategoriesDummy();
}
if (!storage.get("products") || storage.get("products").length === 0) {
  saveProductsDummy();
}

function getCurrentUserId() {
  const userId = storage.getCookie(KEYS.CURRENT_USER);
  return userId || "guest";
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
  
  const userId = getCurrentUserId();
  const wishlistKey = `wishlist_${userId}`;
  const wishlistData = storage.get(wishlistKey) || { id: wishlistKey, usrID: userId, items: [] };
  
  if (wishlistData.items) {
    wishlist = wishlistData.items.map(item => allProducts.find(p => p.id === item.pId)).filter(p => p);
  } else {
    wishlist = [];
  }

  if (allProducts.length > 0 && allProducts[0].features && typeof allProducts[0].features === 'number') {
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
      (product) => product.categoryId === parseInt(currentFilters.category)
    );
  }

  filteredProducts = filteredProducts.filter(
    (product) =>
      product.price >= currentFilters.priceRange.min &&
      product.price <= currentFilters.priceRange.max
  );

  if (currentFilters.search) {
    filteredProducts = filteredProducts.filter((product) =>
      product.name.toLowerCase().includes(currentFilters.search.toLowerCase())
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
      (cat) => cat.id === parseInt(currentFilters.category)
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
  
  const userId = getCurrentUserId();
  const wishlistKey = `wishlist_${userId}`;
  const wishlistData = storage.get(wishlistKey) || { items: [] };
  const isInWishlist = wishlistData.items && wishlistData.items.some((item) => item.pId === product.id);
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
  const product = allProducts.find((p) => p.id === productId);
  if (!product) return;

  const userId = getCurrentUserId();
  const wishlistKey = `wishlist_${userId}`;
  let wishlistData = storage.get(wishlistKey) || { id: wishlistKey, usrID: userId, items: [] };
  
  if (!wishlistData.items) {
    wishlistData = { id: wishlistKey, usrID: userId, items: [] };
  }

  const existingIndex = wishlistData.items.findIndex((item) => item.pId === productId);

  if (existingIndex !== -1) {
    wishlistData.items.splice(existingIndex, 1);
  } else {
    wishlistData.items.push({ pId: productId, qnt: 1 });
  }
  
  storage.set(wishlistKey, wishlistData);
  wishlist = wishlistData.items.map(item => allProducts.find(p => p.id === item.pId)).filter(p => p);
  updateWishlistCount();
  
  const allWishlistButtons = document.querySelectorAll(`[data-product-id="${productId}"]`);
  const isInWishlist = wishlistData.items.some((item) => item.pId === productId);
  
  allWishlistButtons.forEach(btn => {
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
  if (product.stockQuantity === 0) return;

  const userId = getCurrentUserId();
  const cartKey = `cart_${userId}`;
  let cart = storage.get(cartKey) || { id: cartKey, usrID: userId, items: [] };
  
  if (!cart.items) {
    cart = { id: cartKey, usrID: userId, items: [] };
  }

  const existingItem = cart.items.find((item) => item.pId === product.id);

  if (existingItem) {
    existingItem.qnt += 1;
  } else {
    cart.items.push({ pId: product.id, qnt: 1 });
  }

  storage.set(cartKey, cart);
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
  const userId = getCurrentUserId();
  const cartKey = `cart_${userId}`;
  const cart = storage.get(cartKey) || { items: [] };
  const totalItems = cart.items ? cart.items.reduce((sum, item) => sum + (item.qnt || 0), 0) : 0;
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

