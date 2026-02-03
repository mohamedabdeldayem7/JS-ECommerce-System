import StorageManager from "../../utils/storage/storage-helper.js";
import { getAllCategories } from "./category-crud.js";
import Product from "./Product.js";

const storageManager = new StorageManager();

// get all products
export function getAllProducts() {
  return toProductList(storageManager.get("products"));
}

// function to get a product by ID
export function getProductById(id) {
  return getAllProducts().find((p) => p.id === id);
}

export function saveProduct(product) {
  const products = getAllProducts();

  if (getProductById(product.id)) {
    products.forEach((p) => {
      if (p.id === product.id) {
        p.name = product.name;
        p.description = product.description;
        p.categoryId = product.categoryId;
        p.image = product.image;
        p.price = product.price;
        p.stockQuantity = product.stockQuantity;
      }
    });
  } else {
    products.push(product);
  }

  storageManager.set("products", products);
  renderTable(products);
}
// end save function
// function to delete
export function deleteProduct(id) {
  if (confirm("Are you sure you want to delete this product?")) {
    const newProducts = getAllProducts().filter((p) => p.id !== id);
    storageManager.set("products", newProducts);
    renderTable(newProducts);
  }
}

// window.onload = function () {success
//   const data = storageManager.get("products");
//   renderTable(toProductList(data));
// };

function toProductList(data) {
  //   console.log(data);

  if (Array.isArray(data)) {
    return data.map(
      (p) =>
        new Product(
          p.name,
          p.description,
          p.categoryId,
          p.image,
          p.price,
          p.stockQuantity,
          p.id,
        ),
    );
  }
}

// function to write products in table
export function renderTable(products) {
  const categories = getAllCategories();
  if (Array.isArray(products)) {
    const isAllProducts = products.every((p) => p instanceof Product);
    const productBody = document.getElementById("productBody");
    productBody.innerHTML = "";
    if (isAllProducts) {
      products.forEach((p) => {
        const category = categories.find((c) => c.id === p.categoryId);

        const stockDotColor =
          p.stockQuantity > 140
            ? "success"
            : p.stockQuantity > 30
              ? "warning"
              : "danger";

        productBody.innerHTML += `<tr>
                  <td class="ps-4">
                    <div class="d-flex align-items-center gap-2 gap-md-3">
                      <img
                        style="width: 50px; height: 50px; object-fit: cover"
                        src="${p.image}"
                        class="rounded-3 border shadow-sm flex-shrink-0"
                        alt="product"
                      />
                      <div class="product-info">
                        <span class="d-block fw-bold text-dark lh-sm"
                          >${p.name}</span
                        >
                      </div>
                    </div>
                  </td>
                  <td>
                    <span
                      class="badge bg-primary-subtle text-primary border-0 px-2 py-1 px-md-3 py-md-2 rounded-pill small"
                      >${category.name}</span
                    >
                  </td>
                  <td class="fw-bold">$${p.price}</td>
                  <td>
                    <div class="d-flex align-items-center gap-2">
                      <span class="dot bg-${stockDotColor}"></span>
                      <span class="text-muted small">${p.stockQuantity}</span>
                    </div>
                  </td>
                  <td class="text-end pe-4">
                    <div class="d-flex justify-content-end gap-1">
                      <button
                        class="btn btn-action text-primary p-1"
                        onclick="openEditModal(${p.id})"
                      >
                        <span class="material-symbols-rounded fs-5">edit</span>
                      </button>
                      <button class="btn btn-action text-danger p-1" onclick="deleteProduct(${p.id})">
                        <span class="material-symbols-rounded fs-5"
                          >delete</span
                        >
                      </button>
                    </div>
                  </td>
                </tr>`;
      });
    } else {
      console.log("cannot complete writing..");
    }
  } else {
    console.log("cannot complete writing..");
  }
}
