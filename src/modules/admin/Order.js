//imports
import Product from "./Product.js";
import {
  getProductById,
  saveProduct,
  deleteProduct,
  getAllProducts,
  renderTable,
} from "./product-crud.js";
import StorageManager from "./../../utils/storage/storage-helper.js";

const storageManager = new StorageManager();
document.addEventListener("DOMContentLoaded", () => {
  
  renderOrders( "all", "oldest");
  updateOrdersCount();
});

// ------------------------------------------------------------------------

const sampleOrders = [
  {
    id: "o1770069661433",
    customerId: 1,
    items: [
      { productId: "1", quantity: 1 },
      { productId: "3", quantity: 1 },
    ],
    total: 1555.2,
    status: "pending",
    date: "2026-02-02",
  },
  {
    id: "o1770069661434",
    customerId: 2,
    items: [{ productId: "2", quantity: 2 }],
    total: 500.0,
    status: "pending",
    date: "2026-02-02",
  },
  {
    id: "o1770069661435",
    customerId: 3,
    items: [{ productId: "4", quantity: 1 }],
    total: 300.0,
    status: "pending",
    date: "2026-02-01",
  },
  {
    id: "o1770069661436",
    customerId: 4,
    items: [{ productId: "1", quantity: 3 }],
    total: 900.0,
    status: "pending",
    date: "2026-01-30",
  },
];

storageManager.set("orders",sampleOrders)
// localStorage.setItem("orders", JSON.stringify(sampleOrders));

// ----------------------------------------------------------------------------------
export function getOrders() {
  return storageManager.get("orders");
}

function renderOrders(filterType = "all", sortType = "oldest") {
    const orders = getOrders();


    const filteredOrders = orders.filter((order) => {
        if (filterType === "pending") {
            return order.status === "pending";
        } else if (filterType === "completed") {
           
            return order.status === "confirmed" || order.status === "rejected";
        }
        return true;
    });

   
   filteredOrders.sort((a, b) => {
        if (sortType === "oldest") {
      return new Date(a.date) - new Date(b.date);
    }

    if (sortType === "newest") {
      return new Date(b.date) - new Date(a.date);
    }

    if (sortType === "highest") {
      return b.total - a.total;
    }

    if (sortType === "lowest") {
      return a.total - b.total;
    }
    });

    const tableBody = document.getElementById("ordersTableBody");
    tableBody.innerHTML = ""; 

    // 3. عرض البيانات في الجدول
    filteredOrders.forEach((order) => {
        // تحديد لون الـ Badge بناءً على الحالة
        const statusClass = 
            order.status === "pending" ? "bg-warning text-dark" : 
            order.status === "confirmed" ? "bg-success text-white" : "bg-danger text-white";

        tableBody.innerHTML += `
            <tr id="row-${order.id}">
                <td>#${order.id}</td>
                <td>Customer #${order.customerId}</td>
                <td>${order.date}</td>
                <td>$${order.total}</td>
                <td>
                    <span class="status-badge ${statusClass}">${order.status}</span>
                </td>
                <td>
                    ${order.status === 'pending' ? `
                        <button class="btn btn-primary btn-sm" onclick="confirmOrder('${order.id}')">Confirm</button>
                        <button class="btn btn-outline-danger btn-sm" onclick="rejectOrder('${order.id}')">Reject</button>
                    ` : `<span class="text-muted">No Actions</span>`}
                </td>
            </tr>
        `;
    });
}
document.getElementById("sortOrders").addEventListener("change", function () {
  renderOrders("all", this.value); // 'all' للفلترة، this.value للترتيب
});


document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const filter = btn.getAttribute("data-filter").toLowerCase();
    const sort = document.getElementById("sortOrders").value.toLowerCase();
    renderOrders(filter, sort);
   
  });
});

window.rejectOrder = function(orderId) {
    const ord = getOrders();
    const index = ord.findIndex(o => o.id === orderId);

    if (index !== -1) {
        ord[index].status = "rejected";
        storageManager.set("orders", ord);

        // تحديث الجدول مباشرة
        const row = document.getElementById(`row-${orderId}`);
        if (row) {
            const badge = row.querySelector(".status-badge");
            badge.textContent = "rejected";
            badge.className = "status-badge bg-danger text-white";

            const actionsTd = row.querySelector("td:last-child");
            actionsTd.innerHTML = `<span class="text-muted">No Actions</span>`;
        }

        updateOrdersCount();
    }
  }

function updateOrderStatus(orderId, newStatus) {
  let orders = getOrders();

  orders = orders.map((order) => {
    if (order.id === orderId) {
      return { ...order, status: newStatus };
    }
    return order;
  });

  storageManager.set("orders", orders);
  

  const row = storageManager.get(`row-${orderId}`);
  if (row) row.remove();

  
  updateOrdersCount();
}


window.confirmOrder = function (orderId) {
  const ord = getOrders();
  const products = getAllProducts();
  const orderIndex = ord.findIndex((o) => o.id === orderId);

  if (orderIndex !== -1) {
    const currentOrder = ord[orderIndex];

    currentOrder.items.forEach((orderItem) => {
      const productInStock = products.find((p) => p.id === orderItem.productId);

      if (productInStock) {
        // check if the product is available
        if (productInStock.stockQuantity >= orderItem.quantity) {
             productInStock.stockQuantity -= orderItem.quantity;
        } else {
             productInStock.stockQuantity = 0; 
             console.warn(`the product ${productInStock.name} is out of stock`);
        }
      }
    });

    ord[orderIndex].status = "confirmed";


    storageManager.set("orders", ord);
    storageManager.set("products", products);
const row = document.getElementById(`row-${orderId}`);
        if (row) {
            // تغيير الـ status badge
            const badge = row.querySelector(".status-badge");
            badge.textContent = "confirmed";
            badge.className = "status-badge bg-success text-white";

            // تغيير الـ actions
            const actionsTd = row.querySelector("td:last-child");
            actionsTd.innerHTML = `<span class="text-muted">No Actions</span>`;
        }
   
    // const row = document.getElementById(`row-${orderId}`);
    // if (row) row.remove(); 
// renderOrders("all", this.value);

    updateOrdersCount(); 
    
   
    
    
  }
};


// -----------------------------------------
// اظها عدد الاوردار ف ال cart و order اللي ف السايد بار
function updateOrdersCount() {
  const orders = getOrders(); 

  // 1️⃣ عدد كل الطلبات
  const totalCount = orders.length;

  const totalOrdersElement = document.getElementById("total-orders-count");
  if (totalOrdersElement) {
    totalOrdersElement.innerText = totalCount.toLocaleString();
  }

  // 2️⃣ عدد الـ pending فقط للـ sidebar
  const pendingCount = orders.filter(order => order.status.toLowerCase() === "pending").length;

  const sidebarBadge = document.getElementById("sidebar-orders-badge");
  if (sidebarBadge) {
    sidebarBadge.innerText = pendingCount;
    sidebarBadge.style.display = pendingCount > 0 ? "inline-block" : "none";
  }
}


// const order = {
//   customerId: 2,
//   date: "2026-02-02",
//   id: "o1770069661434",
//   items: [
//     { productId: 2, quantity: 2 },
//     { productId: 2, quantity: 2 },
//   ],
//   status: "pending",
//   total: 500,
// };

// order.items.forEach((it) => {
//   const prod = getProductById(it.productId);
//   if (prod.setStockQuantity >= it.quantity)
//     prod.setStockQuantity -= it.quantity;
//   else console.error("blablabla");
// });
