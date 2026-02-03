import StorageManager from "../../utils/storage/storage-helper.js";
import { Navbar } from "../../components/navbar.js";
import { Footer } from "../../components/footer.js";

const storage = new StorageManager();

let allProducts = [];
let allCategories = [];
let wishlist = [];
let currentProduct = null;

function init() {
  initializeNavbar();
  initializeFooter();
  loadData();
  loadProduct();
  updateWishlistCount();
  updateCartCount();
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

function loadData() {
  allProducts = storage.get("products") || [];
  allCategories = storage.get("categories") || [];
  wishlist = storage.get("wishlist") || [];
}

function getProductIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return parseInt(urlParams.get("id"));
}

function loadProduct() {
  const productId = getProductIdFromURL();
  
  if (!productId) {
    window.location.href = "../../index.html";
    return;
  }

  currentProduct = allProducts.find((p) => p.id === productId);

  if (!currentProduct) {
    window.location.href = "../../index.html";
    return;
  }

  displayProduct(currentProduct);
  loadRelatedProducts(currentProduct.categoryId, currentProduct.id);
}

function displayProduct(product) {
  const category = allCategories.find((cat) => cat.id === product.categoryId);
  const categoryName = category ? category.name : "Uncategorized";
  const isInWishlist = wishlist.some((item) => item.id === product.id);
  const rating = (Math.random() * (5 - 4) + 4).toFixed(1);

  document.getElementById("product-image").src = product.image;
  document.getElementById("product-image").alt = product.name;
  document.getElementById("product-category").textContent = categoryName.toUpperCase();
  document.getElementById("product-title").textContent = product.name;
  document.getElementById("product-price").textContent = `$${product.price.toFixed(2)}`;
  document.getElementById("product-rating").textContent = rating;
  document.getElementById("product-description").textContent = product.description;

  const stockContainer = document.getElementById("product-stock");
  if (product.stockQuantity > 0) {
    stockContainer.innerHTML = `
      <span class="stock-icon">●</span>
      <span class="stock-text">Stock Status: ${product.stockQuantity} units remaining in local warehouse</span>
    `;
    stockContainer.className = "product-stock in-stock";
  } else {
    stockContainer.innerHTML = `
      <span class="stock-icon">●</span>
      <span class="stock-text">Out of Stock</span>
    `;
    stockContainer.className = "product-stock out-of-stock";
  }

  const addToCartBtn = document.getElementById("btn-add-cart");
  const wishlistBtn = document.getElementById("btn-wishlist");
  const wishlistIcon = document.getElementById("wishlist-icon");

  if (product.stockQuantity === 0) {
    addToCartBtn.disabled = true;
    addToCartBtn.innerHTML = `<span>🛒</span> Out of Stock`;
  }

  wishlistIcon.textContent = isInWishlist ? "❤️" : "🤍";
  if (isInWishlist) {
    wishlistBtn.classList.add("active");
  }

  addToCartBtn.addEventListener("click", () => addToCart(product));
  wishlistBtn.addEventListener("click", () => toggleWishlist(product.id));

  document.title = `${product.name} - ShopSmart`;
}

function loadRelatedProducts(categoryId, currentProductId) {
  const relatedProducts = allProducts
    .filter((p) => p.categoryId === categoryId && p.id !== currentProductId)
    .slice(0, 4);

  const relatedContainer = document.getElementById("related-products");

  if (relatedProducts.length === 0) {
    relatedContainer.innerHTML = '<p class="no-related">No related products found</p>';
    return;
  }

  relatedContainer.innerHTML = "";
  relatedProducts.forEach((product) => {
    const card = createRelatedProductCard(product);
    relatedContainer.appendChild(card);
  });
}

function createRelatedProductCard(product) {
  const card = document.createElement("div");
  card.className = "related-product-card";

  const category = allCategories.find((cat) => cat.id === product.categoryId);
  const categoryName = category ? category.name : "Uncategorized";

  card.innerHTML = `
    <div class="related-product-image-container">
      <img src="${product.image}" alt="${product.name}" class="related-product-image" />
    </div>
    <div class="related-product-body">
      <div class="related-product-category">${categoryName}</div>
      <h3 class="related-product-name">${product.name}</h3>
      <div class="related-product-price">$${product.price.toFixed(2)}</div>
    </div>
  `;

  card.addEventListener("click", () => {
    window.location.href = `product-details.html?id=${product.id}`;
  });

  return card;
}

function addToCart(product) {
  if (product.stockQuantity === 0) return;

  let cart = storage.get("cart") || [];
  const existingItem = cart.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  storage.set("cart", cart);
  updateCartCount();
  alert("Added to cart!");
}

function toggleWishlist(productId) {
  const product = allProducts.find((p) => p.id === productId);
  if (!product) return;

  const existingIndex = wishlist.findIndex((item) => item.id === productId);

  if (existingIndex !== -1) {
    wishlist.splice(existingIndex, 1);
    storage.set("wishlist", wishlist);
  } else {
    wishlist.push(product);
    storage.set("wishlist", wishlist);
  }

  updateWishlistCount();

  const wishlistBtn = document.getElementById("btn-wishlist");
  const wishlistIcon = document.getElementById("wishlist-icon");
  const isInWishlist = wishlist.some((item) => item.id === productId);

  if (isInWishlist) {
    wishlistBtn.classList.add("active");
    wishlistIcon.textContent = "❤️";
  } else {
    wishlistBtn.classList.remove("active");
    wishlistIcon.textContent = "🤍";
  }
}

function updateWishlistCount() {
  wishlist = storage.get("wishlist") || [];
  const wishlistCountBadge = document.getElementById("wishlist-count");
  if (wishlistCountBadge) {
    wishlistCountBadge.textContent = wishlist.length;
  }
}

function updateCartCount() {
  const cart = storage.get("cart") || [];
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const cartCountBadge = document.getElementById("cart-count");
  if (cartCountBadge) {
    cartCountBadge.textContent = totalItems;
  }
}

init();
