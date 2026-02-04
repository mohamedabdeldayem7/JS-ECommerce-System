import {
  getOrders,
  getAllProducts
} from "../../utils/storage/OrderService.js";

function renderOrders() {
  const container = document.getElementById("orders-container");
  const empty = document.getElementById("empty-orders");

  const orders = getOrders();
  const products = getAllProducts();

  if (!orders.length) {
    empty.classList.remove("d-none");
    return;
  }

  empty.classList.add("d-none");
  container.innerHTML = "";

  orders.forEach(order => {
    const detailsId = `details-${order.id}`;

    const mainRow = document.createElement("tr");
    mainRow.innerHTML = `
      <td>#${order.id}</td>
      <td>${order.date}</td>
      <td>
        <span class="order-status status-${order.status}">
          ${order.status}
        </span>
      </td>
      <td class="fw-bold text-primary">$${order.total}</td>
      <td>
        <button
          class="btn btn-sm btn-outline-primary"
          data-bs-toggle="collapse"
          data-bs-target="#${detailsId}">
          View Details
        </button>
      </td>
    `;

    const detailsRow = document.createElement("tr");
    detailsRow.innerHTML = `
      <td colspan="5" class="p-0">
        <div class="collapse bg-light" id="${detailsId}">
          <div class="p-4">
            ${order.items.map(item => {
              const product = products.find(p => p.id == item.productId);
              if (!product) return "";
              return `
                <div class="order-product">
                  <img src="${product.image}">
                  <div class="flex-grow-1">
                    <div class="fw-semibold">${product.name}</div>
                    <div class="text-muted">Quantity: ${item.quantity}</div>
                  </div>
                  <div class="fw-bold text-primary">
                    $${(product.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        </div>
      </td>
    `;

    container.appendChild(mainRow);
    container.appendChild(detailsRow);
  });
}

document.addEventListener("DOMContentLoaded", renderOrders);
