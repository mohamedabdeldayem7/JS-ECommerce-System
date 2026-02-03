export class Filter {
  constructor(containerId, onFilterChange) {
    this.container = document.getElementById(containerId);
    this.onFilterChange = onFilterChange;
    this.selectedCategory = "all";
    this.priceRange = { min: 0, max: 2500 };
  }

  render(categories) {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="filter-group">
        <h3 class="filter-title">Categories</h3>
        <div class="category-list" id="category-list">
          <div class="category-item ${this.selectedCategory === "all" ? "active" : ""}" data-category="all">
            <span class="category-icon">📦</span>
            <span class="category-name">All Products</span>
          </div>
        </div>
      </div>

      <div class="filter-group">
        <h3 class="filter-title">Price Range</h3>
        <div class="price-range-container">
          <div class="price-inputs">
            <div class="price-input-group">
              <label>Min</label>
              <input type="number" id="min-price" class="price-input" value="${this.priceRange.min}" min="0" />
            </div>
            <div class="price-input-group">
              <label>Max</label>
              <input type="number" id="max-price" class="price-input" value="${this.priceRange.max}" min="0" />
            </div>
          </div>
          <div class="price-slider">
            <input type="range" id="price-slider-min" class="slider" min="0" max="2500" value="${this.priceRange.min}" step="10" />
            <input type="range" id="price-slider-max" class="slider" min="0" max="2500" value="${this.priceRange.max}" step="10" />
          </div>
          <div class="price-display">
            <span>$<span id="display-min">${this.priceRange.min}</span></span>
            <span>-</span>
            <span>$<span id="display-max">${this.priceRange.max}</span></span>
          </div>
        </div>
        <button class="btn-apply-filter" id="apply-filter-btn">Apply Filters</button>
      </div>
    `;

    this.addCategories(categories);
    this.attachEventListeners();
  }

  addCategories(categories) {
    const categoryList = document.getElementById("category-list");
    
    const categoryIcons = {
      "Men's Clothing": "👔",
      "Women's Clothing": "👗",
      "Jewelry": "💎",
      "Electronics": "📱",
    };

    categories.forEach((category) => {
      const icon = categoryIcons[category.name] || "📦";
      const categoryItem = document.createElement("div");
      categoryItem.className = `category-item ${this.selectedCategory === category.id ? "active" : ""}`;
      categoryItem.dataset.category = category.id;
      categoryItem.innerHTML = `
        <span class="category-icon">${icon}</span>
        <span class="category-name">${category.name}</span>
      `;
      categoryList.appendChild(categoryItem);
    });
  }

  attachEventListeners() {
    const categoryItems = document.querySelectorAll(".category-item");
    categoryItems.forEach((item) => {
      item.addEventListener("click", () => {
        this.handleCategoryClick(item);
      });
    });

    const minPriceInput = document.getElementById("min-price");
    const maxPriceInput = document.getElementById("max-price");
    const minSlider = document.getElementById("price-slider-min");
    const maxSlider = document.getElementById("price-slider-max");

    minPriceInput?.addEventListener("input", (e) => {
      this.updatePriceRange("min", parseInt(e.target.value));
      if (minSlider) minSlider.value = e.target.value;
    });

    maxPriceInput?.addEventListener("input", (e) => {
      this.updatePriceRange("max", parseInt(e.target.value));
      if (maxSlider) maxSlider.value = e.target.value;
    });

    minSlider?.addEventListener("input", (e) => {
      this.updatePriceRange("min", parseInt(e.target.value));
      if (minPriceInput) minPriceInput.value = e.target.value;
    });

    maxSlider?.addEventListener("input", (e) => {
      this.updatePriceRange("max", parseInt(e.target.value));
      if (maxPriceInput) maxPriceInput.value = e.target.value;
    });

    const applyBtn = document.getElementById("apply-filter-btn");
    applyBtn?.addEventListener("click", () => {
      this.applyFilters();
    });
  }

  handleCategoryClick(item) {
    document.querySelectorAll(".category-item").forEach((el) => {
      el.classList.remove("active");
    });

    item.classList.add("active");
    this.selectedCategory = item.dataset.category;
    this.applyFilters();
  }

  updatePriceRange(type, value) {
    const displayMin = document.getElementById("display-min");
    const displayMax = document.getElementById("display-max");

    if (type === "min") {
      this.priceRange.min = value;
      if (displayMin) displayMin.textContent = value;
    } else {
      this.priceRange.max = value;
      if (displayMax) displayMax.textContent = value;
    }
  }

  applyFilters() {
    if (this.onFilterChange) {
      this.onFilterChange({
        category: this.selectedCategory,
        priceRange: this.priceRange,
      });
    }
  }

  getFilters() {
    return {
      category: this.selectedCategory,
      priceRange: this.priceRange,
    };
  }

  reset() {
    this.selectedCategory = "all";
    this.priceRange = { min: 0, max: 2500 };
    this.render([]);
  }
}
