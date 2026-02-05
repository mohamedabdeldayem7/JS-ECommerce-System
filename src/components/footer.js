export class Footer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  render() {
    if (!this.container) {
      console.warn("Footer container not found");
      return;
    }

    const currentYear = new Date().getFullYear();

    this.container.innerHTML = `
      <div class="footer-content">
        <div class="footer-brand">
          <span class="brand-icon">🔷</span>
          <span class="brand-name">Lafyuu</span>
        </div>
        <div class="footer-links">
          <a href="#" class="footer-link">Privacy Policy</a>
          <a href="#" class="footer-link">Terms of Service</a>
          <a href="#" class="footer-link">Help Center</a>
        </div>
      </div>
      <p class="footer-copyright">© ${currentYear} Lafyuu Inc. All rights reserved.</p>
    `;
  }

  setBrandName(name) {
    const brandName = this.container.querySelector(".brand-name");
    if (brandName) {
      brandName.textContent = name;
    }
  }

  updateYear() {
    const copyright = this.container.querySelector(".footer-copyright");
    if (copyright) {
      const currentYear = new Date().getFullYear();
      copyright.textContent = `© ${currentYear} Lafyuu Inc. All rights reserved.`;
    }
  }
}

export function renderFooter(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const currentYear = new Date().getFullYear();

  container.innerHTML = `
    <div class="footer-content">
      <div class="footer-brand">
        <span class="brand-icon">🔷</span>
        <span class="brand-name">ShopEase</span>
      </div>
      <div class="footer-links">
        <a href="#" class="footer-link">Privacy Policy</a>
        <a href="#" class="footer-link">Terms of Service</a>
        <a href="#" class="footer-link">Help Center</a>
      </div>
    </div>
    <p class="footer-copyright">© ${currentYear} Lafyuu Inc. All rights reserved.</p>
  `;
}
