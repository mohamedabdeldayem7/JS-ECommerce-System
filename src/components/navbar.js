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

    const isLoggedIn = this.checkAuth();
    const authButton = isLoggedIn 
      ? `<button class="btn-login" id="btn-logout" style="background-color: #dc3545; border-color: #dc3545;">Logout</button>`
      : `<a href="${this.basePath}pages/auth/login.html" class="btn-login">Login</a>`;

    this.container.innerHTML = `
      <div class="container-fluid">
        <div class="navbar-brand">
          <span class="brand-icon">🔷</span>
          <h1>Lafyuu</h1>
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
          ${authButton}
        </div>
      </div>
    `;

    if (isLoggedIn) {
      const logoutBtn = document.getElementById("btn-logout");
      if (logoutBtn) {
        logoutBtn.addEventListener("click", () => this.handleLogout());
      }
    }
  }

  checkAuth() {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'session_user_id' && value) {
        return true;
      }
    }
    return false;
  }

  handleLogout() {
    document.cookie = 'session_user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.href = `${this.basePath}pages/auth/login.html`;
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
        <h1>Lafyuu</h1>
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
