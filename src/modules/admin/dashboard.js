//imports
import Product from "./Product.js";
import {
  getProductById,
  saveProduct,
  deleteProduct,
  getAllProducts,
  renderTable,
} from "./product-crud.js";
import {
  saveCategory,
  getAllCategories,
  getCategoryById,
  deleteCategory,
  renderCategoriesTable,
} from "./category-crud.js";
import Category from "./Category.js";

// sidebar

// activate background color with low opacity under sidebar
window.toggleSidebar = function () {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");

  sidebar.classList.toggle("active");
  overlay.classList.toggle("active");
};

document.querySelectorAll(".sidebar .nav-link[data-target]").forEach((link) => {
  link.addEventListener("click", function (e) {
    document
      .querySelectorAll(".sidebar .nav-link")
      .forEach((l) => l.classList.remove("active"));
    this.classList.add("active");
    document.getElementById("main-dashboard").classList.add("active");

    document
      .querySelectorAll(".content-section")
      .forEach((section) => section.classList.add("d-none"));

    const targetId = this.getAttribute("data-target");
    document.getElementById(targetId).classList.remove("d-none");

    if (window.innerWidth < 768) {
      toggleSidebar();
    }
  });
});

// for product modal
const modalEl = document.getElementById("productModal");
const productModal = new bootstrap.Modal(modalEl);
const productForm = document.getElementById("productForm");

// for add new
window.openAddModal = function () {
  productForm.reset();
  document.getElementById("editProductId").value = "";
  document.getElementById("modalTitle").innerText = "Add New Product";
  const prodCategory = document.getElementById("prodCategory");

  prodCategory.innerHTML = "";

  getAllCategories().forEach((c) => {
    prodCategory.innerHTML += `<option value="${c.name}">${c.name}</option>`;
  });
  productModal.show();
};

// for edit
window.openEditModal = function (id) {
  const p = getProductById(id);
  if (p) {
    document.getElementById("modalTitle").innerText = "Edit Product";
    document.getElementById("editProductId").value = p.id;
    document.getElementById("prodName").value = p.name;
    document.getElementById("prodPrice").value = p.price;
    document.getElementById("prodStock").value = p.stockQuantity;
    document.getElementById("pImage").value = p.image;
    document.getElementById("pDes").value = p.description;
    const prodCategory = document.getElementById("prodCategory");

    const categories = getAllCategories();
    console.log("cat from openEditModal", categories);

    const activeCatName = categories.find((c) => c.id == p.categoryId).name;

    prodCategory.innerHTML = "";
    prodCategory.innerHTML += `<option value="${activeCatName}">${activeCatName}</option>`;

    categories.forEach((c) => {
      if (c.id !== p.categoryId)
        prodCategory.innerHTML += `<option value="${c.name}">${c.name}</option>`;
    });
    productModal.show();
  }
};

// submit product form
productForm.onsubmit = function (e) {
  e.preventDefault();

  const idInput = parseInt(document.getElementById("editProductId").value);
  const nameInput = document.getElementById("prodName").value;
  const priceInput = parseFloat(document.getElementById("prodPrice").value);
  const stockInput = parseInt(document.getElementById("prodStock").value);
  const imageInput = document.getElementById("pImage").value;
  const descriptionInput = document.getElementById("pDes").value;
  const prodCategory = document.getElementById("prodCategory");

  const category = getAllCategories().find(
    (c) => c.name === prodCategory.value,
  );

  console.log("price from modal", typeof priceInput);

  let product,
    flag = true;

  if (idInput) {
    product = new Product(
      nameInput,
      descriptionInput,
      category.id,
      imageInput,
      priceInput,
      stockInput,
      idInput,
    );
    flag = false;
  } else {
    product = new Product(
      nameInput,
      descriptionInput,
      category.id,
      imageInput,
      priceInput,
      stockInput,
    );
  }
  saveProduct(product);
  let alertMsg = flag ? "added" : "modified";
  alert(`Product with name "${product.name}" ${alertMsg} successfully`);
  productModal.hide();
  changePage(1);
};

// on delete clicked
window.deleteProduct = function (id) {
  deleteProduct(id);
  changePage(1);
};

// configure pagination
let currentPage = 1;
const rowsPerPage = 5;

function renderPagination(totalItems) {
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const container = document.getElementById("paginationContainer");
  container.innerHTML = "";

  // Previous Button
  const prevDisabled = currentPage === 1 ? "disabled" : "";
  container.innerHTML += `
        <li class="page-item ${prevDisabled}">
            <a class="page-link" href="javascript:void(0)" onclick="changePage(${currentPage - 1})">&laquo;</a>
        </li>`;

  // pages numbers
  for (let i = 1; i <= totalPages; i++) {
    const activeClass = i === currentPage ? "active" : "";
    container.innerHTML += `
            <li class="page-item ${activeClass}">
                <a class="page-link" href="javascript:void(0)" onclick="changePage(${i})">${i}</a>
            </li>`;
  }

  // Next Button
  const nextDisabled = currentPage === totalPages ? "disabled" : "";
  container.innerHTML += `
        <li class="page-item ${nextDisabled}">
            <a class="page-link" href="javascript:void(0)" onclick="changePage(${currentPage + 1})">&raquo;</a>
        </li>`;
}

// to change page
window.changePage = function (page) {
  const products = getAllProducts();
  const totalPages = Math.ceil(products.length / rowsPerPage);

  if (page < 1 || page > totalPages) return;

  currentPage = page;

  // start and end index to slice from products list for each page
  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const paginatedItems = products.slice(start, end);

  renderTable(paginatedItems);
  renderPagination(products.length);
  updatePaginationInfo(
    start + 1,
    Math.min(end, products.length),
    products.length,
  );
};

function updatePaginationInfo(start, end, total) {
  document.getElementById("paginationInfo").innerText =
    `Showing ${start} to ${end} of ${total} entries`;
}

changePage(1);

// Categories
// for Categories modal
const modalElelment = document.getElementById("categoryModal");
const categoryModal = new bootstrap.Modal(modalElelment);
const categoryForm = document.getElementById("categoryForm");

// for add new
window.openAddCategoryModal = function () {
  categoryForm.reset();
  document.getElementById("editCategoryId").value = "";
  document.getElementById("catModalTitle").innerText = "Add New Category";
  categoryModal.show();
};

// for edit
window.openEditCategoryModal = function (id) {
  const p = getCategoryById(id);
  if (p) {
    document.getElementById("modalTitle").innerText = "Edit Category";
    document.getElementById("editCategoryId").value = p.id;
    document.getElementById("catName").value = p.name;
    document.getElementById("catDesc").value = p.description;

    categoryModal.show();
  }
};

// submit product form
categoryForm.onsubmit = function (e) {
  e.preventDefault();

  const idInput = parseInt(document.getElementById("editCategoryId").value);
  const nameInput = document.getElementById("catName").value;
  const descriptionInput = document.getElementById("catDesc").value;

  let category,
    flag = true;

  if (idInput) {
    category = new Category(nameInput, descriptionInput, idInput);
    flag = false;
  } else {
    category = new Category(nameInput, descriptionInput);
  }
  saveCategory(category);
  categoryModal.hide();
  let alertMsg = flag ? "added" : "modified";
  alert(`Category with name "${category.name}" ${alertMsg} successfully`);
};

window.deleteCategory = function (id) {
  deleteCategory(id);
};

renderCategoriesTable();

setInterval(() => {
  document.getElementById("totalProd").textContent = getAllProducts().length;
  document.getElementById("lowStockProd").textContent = getAllProducts().filter(
    (p) => p.getStockQuantity < 140,
  ).length;
}, 10);

window.showToast = function (message, type = "success") {
  const toastEl = document.getElementById("liveToast");
  const toastMsg = document.getElementById("toastMessage");

  // تحديد اللون بناءً على النوع
  const colors = {
    success: "bg-success",
    danger: "bg-danger",
    warning: "bg-warning",
    info: "bg-primary",
  };

  // إزالة أي كلاسات قديمة وإضافة الجديدة
  toastEl.className = `toast align-items-center text-white border-0 ${colors[type]}`;
  toastMsg.innerText = message;

  const toast = new bootstrap.Toast(toastEl, { delay: 3000 }); // تختفي بعد 3 ثواني
  toast.show();
};
///////
document.addEventListener("DOMContentLoaded", () => {
  const user = AuthService.checkAuth();

  if (user) {
    document.getElementById("adminName").textContent =
      `${user.firstName} ${user.lastName}`;

    document.getElementById("adminEmail").textContent = user.email;
  } else {
    AuthService.logout();
  }

  const logoutBtn = document.getElementById("logoutMe");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();

      if (confirm("Are you sure you want to logout?")) {
        AuthService.logout();
      }
    });
  }
});
