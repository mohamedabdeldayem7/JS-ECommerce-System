// sidebar

// activate background color with low opacity under sidebar
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");

  sidebar.classList.toggle("active");
  overlay.classList.toggle("active");
}

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

// open product modal

let products = [
  {
    id: "P-8821",
    name: "Wireless Headphones Ultra",
    category: "Electronics",
    price: 249.0,
    stock: 124,
    status: "Active",
  },
  {
    id: "P-8822",
    name: "Full Grain Leather Wallet",
    category: "Accessories",
    price: 85.0,
    stock: 8,
    status: "Low Stock",
  },
];
const productModal = new bootstrap.Modal(
  document.getElementById("productModal"),
);
const productForm = document.getElementById("productForm");

// on add product btn
function openAddModal() {
  document.getElementById("modalTitle").innerText = "Add New Product";
  document.getElementById("saveBtn").innerText = "Save Product";
  document.getElementById("editProductId").value = "";
  productForm.reset();
  productModal.show();
}

// on edit product btn
function openEditModal(id) {
  const product = products.find((p) => p.id === id);

  if (product) {
    document.getElementById("modalTitle").innerText = "Edit Product";
    document.getElementById("saveBtn").innerText = "Update Changes";

    document.getElementById("editProductId").value = product.id;
    document.getElementById("prodName").value = product.name;
    document.getElementById("prodCategory").value = product.category;
    document.getElementById("prodPrice").value = product.price;
    document.getElementById("prodStock").value = product.stock;

    productModal.show();
  }
}
