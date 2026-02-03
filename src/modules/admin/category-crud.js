import StorageManager from "../../utils/storage/storage-helper.js";
import Category from "./Category.js";
import { getAllProducts } from "./product-crud.js";

const storageManager = new StorageManager();

// get all categories
export function getAllCategories() {
  return toCategoryList(storageManager.get("categories"));
}

// function to get a category by ID
export function getCategoryById(id) {
  return getAllCategories().find((c) => c.id === id);
}

export function saveCategory(category) {
  const categories = getAllCategories();

  if (getCategoryById(category.id)) {
    categories.forEach((c) => {
      if (c.id === category.id) {
        c.name = category.name;
        c.description = category.description;
      }
    });
  } else {
    categories.push(category);
  }

  storageManager.set("categories", categories);
  renderCategoriesTable();
}
// end save function
// function to delete
export function deleteCategory(catId) {
  const products = getAllProducts();

  const hasProducts = products.some((p) => p.categoryId === catId);

  if (hasProducts) {
    alert(
      "Cannot delete this category because it contains products. Please delete or move the products first.",
    );
    return;
  }

  if (confirm("Are you sure you want to delete this category?")) {
    const categories = getAllCategories();
    const updatedCats = categories.filter((c) => c.id !== catId);
    storageManager.set("categories", updatedCats);
    renderCategoriesTable();
  }
}
// end delete function

function toCategoryList(data) {
  //   console.log(data);

  if (Array.isArray(data)) {
    return data.map((c) => new Category(c.name, c.description, c.id));
  }
}

// render function to diplay all categories in table
export function renderCategoriesTable() {
  const categories = getAllCategories();
  const products = getAllProducts();
  const tbody = document.getElementById("categoriesTableBody");

  tbody.innerHTML = "";

  if (categories.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" class="text-center py-4 text-muted">No categories found.</td></tr>`;
    return;
  }

  categories.forEach((cat) => {
    const productCount = products.filter((p) => p.categoryId === cat.id).length;
    const stockDotColor =
      productCount > 4 ? "success" : productCount > 2 ? "warning" : "danger";
    tbody.innerHTML += `
            <tr>
                <td>
                    <span class="fw-bold text-dark">${cat.name}</span>
                </td>
                <td>
                    <span class="description-text text-muted small">${cat.description || "No description"}</span>
                </td>
                <td class="text-center">
                    <div class="d-flex align-items-center gap-2">
                      <span class="dot bg-${stockDotColor}"></span>
                      <span class="text-muted small">${productCount} Items</span>
                    </div>
                </td>
                <td class="text-end pe-4">
                    <div class="d-flex justify-content-end gap-1">
                      <button
                        class="btn btn-action text-primary p-1"
                        onclick="openEditCategoryModal(${cat.id})"
                      >
                        <span class="material-symbols-rounded fs-5">edit</span>
                      </button>
                      <button class="btn btn-action text-danger p-1" onclick="deleteCategory(${cat.id})">
                        <span class="material-symbols-rounded fs-5"
                          >delete</span
                        >
                      </button>
                    </div>
                </td>
            </tr>
        `;
  });
}
