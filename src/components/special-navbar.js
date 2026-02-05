export function loadSpecialNavbar(containerId, basePath = "") {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
<nav class="navbar navbar-expand-lg bg-white border-bottom">
  <div class="container">

    <!-- BRAND -->
    <a class="navbar-brand d-flex align-items-center gap-2" href="${basePath}index.html">
      <span class="fs-4">🔷</span>
      <span class="fw-bold">ShopSmart</span>
    </a>

    <button class="navbar-toggler" type="button"
      data-bs-toggle="collapse"
      data-bs-target="#mainNav">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="mainNav">

      <!-- SEARCH -->
      <form class="d-flex mx-lg-4 flex-grow-1 my-3 my-lg-0">
        <input class="form-control"
          type="search"
          placeholder="Search for products, brands...">
      </form>

      <!-- LINKS -->
      <ul class="navbar-nav align-items-lg-center gap-lg-2">

        <li class="nav-item">
          <a class="nav-link" href="${basePath}index.html">Home</a>
        </li>

        <li class="nav-item">
          <a class="nav-link" href="${basePath}pages/customer/orders.html">
            My Orders
          </a>
        </li>

        <li class="nav-item position-relative">
          <a class="nav-link" href="${basePath}pages/customer/wishlist.html">
            Wishlist
            <span id="wishlist-count"
              class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary">
              0
            </span>
          </a>
        </li>

        <li class="nav-item position-relative">
          <a class="nav-link" href="${basePath}pages/customer/cart.html">
            Cart
            <span id="cart-count"
              class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary">
              0
            </span>
          </a>
        </li>

        <li class="nav-item ms-lg-3">
          <button class="btn btn-dark" disabled>
            Login
          </button>
        </li>

      </ul>
    </div>

  </div>
</nav>
  `;
}
