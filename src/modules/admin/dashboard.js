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
import {
  saveCategoriesDummy,
  saveProductsDummy,
} from "./../../utils/storage/dummyData.js";
import FilterService from "./filterService.js";
import { UserValidations, User } from "./../auth/User.js";
import StorageManager from "../../utils/storage/storage-helper.js";
import KEYS from "../../utils/keys.js";
import { AuthService } from "../auth/auth-logic.js";

// dummy data loader
if (getAllCategories().length === 0) saveCategoriesDummy();
if (getAllProducts().length === 0) saveProductsDummy();

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
  try {
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
        [],
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
        [],
      );
    }
    saveProduct(product);
    let alertMsg = flag ? "added" : "modified";
    alert(`Product with name "${product.name}" ${alertMsg} successfully`);
    productModal.hide();
    changePage(1);
  } catch (e) {
    alert(e.message);
  }
};

// search ,filter and sort
const searchInput = document.getElementById("searchInput");
const categorySelect = document.getElementById("categorySelect");
const sortSelect = document.getElementById("sortSelect");

// <option value="all">All Categories</option>
// <option value="electronics">Electronics</option>
categorySelect.innerHTML = "";
categorySelect.innerHTML = '<option value="all">All Categories</option>';
getAllCategories().forEach((c) => {
  categorySelect.innerHTML += `<option value="${c.name}">${c.name}</option>`;
});

function updateProductTable() {
  const products = getAllProducts();
  // console.log("from filter", products);

  let catId;
  if (categorySelect.value !== "all")
    catId = getAllCategories().find((c) => c.name === categorySelect.value);
  const filters = {
    searchQuery: searchInput.value,
    category: categorySelect.value === "all" ? categorySelect.value : catId.id,
    sortBy: sortSelect.value,
  };

  const filteredData = FilterService.filterProducts(products, filters);

  renderTable(filteredData);
}

searchInput.addEventListener("input", updateProductTable);
categorySelect.addEventListener("change", updateProductTable);
sortSelect.addEventListener("change", updateProductTable);
document
  .getElementById("resetFilters")
  .addEventListener("click", () => changePage(1));

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
window.changePage = function (page, products = getAllProducts()) {
  // const products = getAllProducts();
  const totalPages = Math.ceil(products.length / rowsPerPage);
  console.log(products);

  if (page < 1 || page > totalPages) {
    const productBody = document.getElementById("productBody");
    productBody.innerHTML = `<tr><td colspan="4" class="text-center py-4 text-muted">No Products found.</td></tr>`;
    return;
  }

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

// call first time
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
  try {
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
  } catch (e) {
    alert(e.message);
  }
};

window.deleteCategory = function (id) {
  deleteCategory(id);
};

renderCategoriesTable();

setInterval(() => {
  let inventoryValue = 0;
  const products = getAllProducts();
  products.forEach((p) => {
    inventoryValue += p.getPrice * p.getStockQuantity;
  });
  document.getElementById("inventoryValue").textContent = inventoryValue;
  document.getElementById("totalProd").textContent = products.length;
  document.getElementById("lowStockProd").textContent = products.filter(
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

// add admin section
window.updateAvatar = function (name) {
  const avatarEl = document.getElementById("dynamicAvatar");
  if (name.trim() !== "") {
    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
    avatarEl.innerText = initials;
    avatarEl.classList.remove("bg-opacity-10", "text-primary");
    avatarEl.classList.add("bg-primary", "text-white");
  } else {
    resetAvatar();
  }
};

window.resetAvatar = function () {
  const avatarEl = document.getElementById("dynamicAvatar");
  avatarEl.innerHTML = '<i class="bi bi-person-plus-fill"></i>';
  avatarEl.classList.add("bg-opacity-10", "text-primary");
  avatarEl.classList.remove("bg-primary", "text-white");
};

window.generatePassword = function () {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.*]{6,}$/;

  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  do {
    password = "";
    for (let i = 0; i < 12; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars[randomIndex];
    }
  } while (!regex.test(password));
  const passInput = document.getElementById("password");
  passInput.value = password;
  passInput.type = "text";
  document.getElementById("toggleIcon").textContent = "visibility_off";

  checkStrength(password);
};

window.togglePassVisibility = function () {
  const passInput = document.getElementById("password");
  const icon = document.getElementById("toggleIcon");
  if (passInput.type === "password") {
    passInput.type = "text";
    icon.textContent = "visibility_off";
  } else {
    passInput.type = "password";
    icon.textContent = "visibility";
  }
};

document.getElementById("password").addEventListener("input", function (e) {
  checkStrength(e.target.value);
});

function checkStrength(password) {
  const bar = document.getElementById("passStrengthBar");
  let strength = 0;
  if (password.length > 5) strength += 30;
  if (password.match(/[A-Z]/)) strength += 20;
  if (password.match(/[0-9]/)) strength += 20;
  if (password.match(/[^a-zA-Z0-9]/)) strength += 30;

  bar.style.width = strength + "%";

  if (strength < 50) bar.className = "progress-bar bg-danger";
  else if (strength < 80) bar.className = "progress-bar bg-warning";
  else bar.className = "progress-bar bg-success";
}

// -----------------------------------------------------
const storage = new StorageManager();

const addAdminForm = document.getElementById("addAdminForm");
// const message = document.getElementById("message");

// from inputs
const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const email = document.getElementById("email");
const password = document.getElementById("password");
// error-msg
// const firstNameError = document.getElementById("firstNameError");
// const lastNameError = document.getElementById("lastNameError");
// const emailError = document.getElementById("emailError");
// const passwordError = document.getElementById("passwordError");

addAdminForm.addEventListener("submit", function (e) {
  e.preventDefault();

  try {
    const users = storage.get(KEYS.USERS) || [];
    console.log("try brfore register fun");

    if (users.some((u) => u.email === email.value.trim().toLowerCase())) {
      // Check Duplicates
      // message.textContent = "Email already registered!";
      // message.classList.add("text-danger");
      throw new Error("Email already registered!");
    }

    const newAdmin = new User(
      firstName.value,
      lastName.value,
      email.value,
      password.value,
      "admin",
    );

    console.log("after create new admin obj in dashboard");

    storage.pushToItem(KEYS.USERS, newAdmin.toJSON());
    // message.innerHTML =
    //   '<div class="alert alert-success">Add new admin successful!</div>';
    alert("New admin account Created Successfully!");
    resetAvatar();
    // setTimeout(() => {
    //   window.location.href = "../../../pages/admin/dashboard.html";
    // }, 500);
    document
      .querySelectorAll(".is-invalid")
      .forEach((e) => e.classList.remove("is-invalid"));
    document
      .querySelectorAll(".is-valid")
      .forEach((e) => e.classList.remove("is-valid"));
    addAdminForm.reset();
  } catch (error) {
    // message.textContent = error.message;
    // message.classList.add("text-danger");
    alert(error.message);
  }
});

firstName.addEventListener("blur", function () {
  try {
    UserValidations.validateName(this.value);
    this.classList.remove("is-invalid");
    this.classList.add("is-valid");
    // firstNameError.innerText = "";
  } catch (error) {
    this.classList.add("is-invalid");
    // firstNameError.innerText = error.message;
  }
});

lastName.addEventListener("blur", function () {
  try {
    UserValidations.validateName(this.value);
    this.classList.remove("is-invalid");
    this.classList.add("is-valid");
    // lastNameError.innerText = "";
  } catch (error) {
    this.classList.add("is-invalid");
    // lastNameError.innerText = error.message;
    console.log(error.message);
  }
});

email.addEventListener("blur", function () {
  try {
    UserValidations.validateEmail(this.value);
    this.classList.remove("is-invalid");
    this.classList.add("is-valid");
    // emailError.innerText = "";
  } catch (error) {
    this.classList.add("is-invalid");
    // emailError.innerText = error.message;
  }
});

password.addEventListener("blur", function () {
  try {
    UserValidations.validatePassword(this.value);
    this.classList.remove("is-invalid");
    this.classList.add("is-valid");
    // passwordError.innerText = "";
  } catch (error) {
    this.classList.add("is-invalid");
    // passwordError.innerText = error.message;
  }
});
///////
// document.addEventListener("DOMContentLoaded", () => {
//   const user = AuthService.checkAuth();

//   if (user) {
//     document.getElementById("adminName").textContent =
//       `${user.firstName} ${user.lastName}`;

//     document.getElementById("adminEmail").textContent = user.email;
//   } else {
//     AuthService.logout();
//   }

//   const logoutBtn = document.getElementById("logoutMe");
//   if (logoutBtn) {
//     logoutBtn.addEventListener("click", (e) => {
//       e.preventDefault();

//       if (confirm("Are you sure you want to logout?")) {
//         AuthService.logout();
//       }
//     });
//   }
// });

// logout section
const cUser = storage.get("currentUser");
document.getElementById("p-avatar").textContent =
  cUser.firstName.toUpperCase()[0];
document.getElementById("p-name").textContent =
  cUser.firstName + " " + cUser.lastName;
document.getElementById("p-role").textContent = cUser.role;

const logoutBtn = document.getElementById("logoutMe");
if (logoutBtn) {
  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();

    if (confirm("Are you sure you want to logout?")) {
      AuthService.logout();
    }
  });
}

setInterval(() => {
  if (!AuthService.isAuthorized("admin")) {
    alert("you cannot reach this page..!");
    window.location.href = "../../../pages/auth/login.html";
  }
}, 500);

//footer
document.addEventListener("DOMContentLoaded", () => {
  renderAdminFooter();
});

function renderAdminFooter() {
  const footerContainer = document.getElementById("footerContainer");

  if (footerContainer) {
    footerContainer.classList.remove("footer");

    footerContainer.classList.add("admin-footer");

    footerContainer.innerHTML = ` 
      <div style="text-align: center; padding: 30px 20px; color: #7e8993; font-size: 14px; border-top: 1px solid #dee2e6;">
        &copy; 2026 Lafyuu Admin Panel. All rights reserved.
      </div>
    `;
  }
}
