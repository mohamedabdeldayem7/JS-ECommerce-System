export class Navbar {
  constructor(containerId, basePath = "") {
    this.container = document.getElementById(containerId);
    this.basePath = basePath;
  }

  render() {
    if (!this.container) {
      console.warn("Navbar container not found");
      return;
    }

    this.container.innerHTML = `
      <div class="container-fluid">
        <div class="navbar-brand">
          <span class="brand-icon">🔷</span>
          <h1>ShopSmart</h1>
        </div>
        
        <div class="navbar-search">
          <input 
            type="search" 
            id="navbar-search" 
            class="navbar-search-input" 
            placeholder="Search for products, brands..."
          />
        </div>

        <div class="navbar-menu">
          <a href="${this.basePath}index.html" class="nav-link">Home</a>
          <a href="${this.basePath}pages/customer/orders.html" class="nav-link">My Orders</a>
          <a href="${this.basePath}pages/customer/wishlist.html" class="nav-link nav-link-with-badge">
            Wishlist
            <span class="nav-badge" id="wishlist-count">0</span>
          </a>
          <a href="#" class="nav-link nav-link-with-badge">
            Cart
            <span class="nav-badge" id="cart-count">0</span>
          </a>
        </div>

        <div class="navbar-actions">
          <button class="btn-login" disabled title="Login page - Coming soon">Login</button>
        </div>
      </div>
    `;
  }

  updateBadges(wishlistCount, cartCount) {
    const wishlistBadge = document.getElementById("wishlist-count");
    const cartBadge = document.getElementById("cart-count");
    
    if (wishlistBadge) wishlistBadge.textContent = wishlistCount;
    if (cartBadge) cartBadge.textContent = cartCount;
  }
}

export function renderNavbar(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="container-fluid">
      <div class="navbar-brand">
        <span class="brand-icon">🔷</span>
        <h1>ShopSmart</h1>
      </div>
      
      <div class="navbar-search">
        <input 
          type="search" 
          id="navbar-search" 
          class="navbar-search-input" 
          placeholder="Search for products, brands..."
        />
      </div>

      <div class="navbar-menu">
        <a href="index.html" class="nav-link">Home</a>
        <a href="pages/customer/orders.html" class="nav-link">My Orders</a>
        <a href="pages/customer/wishlist.html" class="nav-link nav-link-with-badge">
          Wishlist
          <span class="nav-badge" id="wishlist-count">0</span>
        </a>
        <a href="#" class="nav-link nav-link-with-badge">
          Cart
          <span class="nav-badge" id="cart-count">0</span>
        </a>
      </div>

      <div class="navbar-actions">
        <button class="btn-login" disabled title="Login page - Coming soon">Login</button>
      </div>
    </div>
  `;
}
