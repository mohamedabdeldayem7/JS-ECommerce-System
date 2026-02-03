document.addEventListener("DOMContentLoaded", () => {
  renderPendingOrders("oldest");
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

localStorage.setItem("orders", JSON.stringify(sampleOrders));

// ----------------------------------------------------------------------------------
function getOrders() {
  return JSON.parse(localStorage.getItem("orders")) || [];
}
function renderPendingOrders(sortType = "oldest") {
  const orders = getOrders();

  const pendingOrders = orders.filter((order) => order.status === "pending");

  pendingOrders.sort((a, b) => {
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
  tableBody.innerHTML = ""; // نمسح القديم

  pendingOrders.forEach((order) => {
    tableBody.innerHTML += `
      <tr id="row-${order.id}">
        <td>#${order.id}</td>
        <td>Customer #${order.customerId}</td>
        <td>${order.date}</td>
        <td>$${order.total}</td>
        <td>
          <span class="status-badge bg-warning text-dark">Pending</span>
        </td>
        <td>
          <button class="btn btn-primary btn-sm order-btn-sm"
            onclick="confirmOrder('${order.id}')">
            Confirm
          </button>

          <button class="btn btn-outline-danger btn-sm order-btn-sm"
            onclick="rejectOrder('${order.id}')">
            Reject
          </button>
        </td>
      </tr>
    `;
  });
  
}
document.getElementById("sortOrders").addEventListener("change", function () {
  renderPendingOrders(this.value);
});

function confirmOrder(orderId) {
  updateOrderStatus(orderId, "confirmed");
}
function rejectOrder(orderId) {
  updateOrderStatus(orderId, "rejected");
}
function updateOrderStatus(orderId, newStatus) {
    let orders = getOrders();

    orders = orders.map((order) => {
        if (order.id === orderId) {
            return { ...order, status: newStatus };
        }
        return order;
    });

    localStorage.setItem("orders", JSON.stringify(orders));

    // 1. إزالة الصف من الجدول (كما فعلت أنت)
    const row = document.getElementById(`row-${orderId}`);
    if (row) row.remove();

    // 2. تحديث العدادات فوراً بعد تغيير الحالة
    updateOrdersCount();
}
function showToast(message, type) {
  const toast = document.getElementById("toast");

  toast.textContent = message;

  if (type === "success") {
    toast.style.backgroundColor = "#16a34a"; // أخضر
  } else {
    toast.style.backgroundColor = "#dc2626"; // أحمر
  }

  toast.style.display = "block";

  setTimeout(() => {
    toast.style.display = "none";
  }, 2500);
}


function confirmOrder(orderId) {
    // 1. جلب كل الطلبات وكل المنتجات من الـ LocalStorage
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    const products = JSON.parse(localStorage.getItem("products")) || [];

    // 2. البحث عن الطلب الحالي
    const orderIndex = orders.findIndex(o => o.id === orderId);

    if (orderIndex !== -1) {
        const currentOrder = orders[orderIndex];

        // 3. منطق خصم المخزون (تعديل مصفوفة المنتجات مباشرة هنا)
        currentOrder.items.forEach(orderItem => {
            // البحث عن المنتج المطابق في مصفوفة المنتجات
            const productInStock = products.find(p => p.id === orderItem.productId);
            
            if (productInStock) {
                // خصم الكمية
                productInStock.stockQuantity -= orderItem.quantity;
            }
        });

        // 4. تحديث حالة الطلب إلى confirmed
        orders[orderIndex].status = "confirmed";

        // 5. حفظ كل شيء مرة واحدة في الـ LocalStorage
        localStorage.setItem("orders", JSON.stringify(orders));
        localStorage.setItem("products", JSON.stringify(products));

        // 6. تحديث الواجهة
        const row = document.getElementById(`row-${orderId}`);
        if (row) row.remove(); // إخفاء الصف من جدول الطلبات المنتظرة
        
        updateOrdersCount(); // تحديث العداد في السايد بار
        showToast("تم التأكيد وخصم المخزون بنجاح ✅", "success");
    }
}

function rejectOrder(orderId) {
  updateOrderStatus(orderId, "rejected");
  showToast("Order Rejected ❌", "error");
}
// -----------------------------------------
// اظها عدد الاوردار ف ال cart و order اللي ف السايد بار 
function updateOrdersCount() {
    const orders = getOrders(); // استخدم الدالة اللي انت معرفها فوق

    // فلترة الأوردرات اللي حالتها pending فقط
    const pendingOrders = orders.filter(order => order.status === "pending");
    const count = pendingOrders.length;

    // تحديث الرقم في الكارد الرئيسي
    const totalOrdersElement = document.getElementById('total-orders-count');
    if (totalOrdersElement) {
        totalOrdersElement.innerText = count.toLocaleString();
    }

    // تحديث الرقم في السايد بار
    const sidebarBadge = document.getElementById('sidebar-orders-badge');
    if (sidebarBadge) {
        sidebarBadge.innerText = count;
        sidebarBadge.style.display = count > 0 ? 'inline-block' : 'none';
    }
}

