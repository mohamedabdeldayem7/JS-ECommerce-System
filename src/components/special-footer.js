export function loadSpecialFooter(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const year = new Date().getFullYear();

  container.innerHTML = `
<footer class="bg-dark text-white mt-5">
  <div class="container py-4">

    <div class="row align-items-center">

      <div class="col-md-4 mb-3 mb-md-0 d-flex align-items-center gap-2">
        <span class="fs-4">🔷</span>
        <span class="fw-bold fs-5">ShopEase</span>
      </div>

      <div class="col-md-8">
        <div class="d-flex flex-wrap justify-content-md-end gap-4">
          <a href="#" class="text-white text-decoration-none opacity-75 hover-opacity-100">
            Privacy Policy
          </a>

          <a href="#" class="text-white text-decoration-none opacity-75">
            Terms of Service
          </a>

          <a href="#" class="text-white text-decoration-none opacity-75">
            Help Center
          </a>
        </div>
      </div>

    </div>

    <hr class="opacity-25 my-3">

    <p class="text-center text-white-50 m-0 small">
      © ${year} ShopSmart Inc. All rights reserved.
    </p>

  </div>
</footer>
  `;
}
