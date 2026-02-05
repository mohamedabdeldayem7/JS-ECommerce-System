const ORDERS_KEY = "orders";
const PRODUCTS_KEY = "products";

class OrderService {

  /* ===== ORDERS ===== */
 // 🔽 MODIFIED: allow fetching orders for a specific customerId
  static getOrders(customerId = null) {
    const orders = JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];

    // 🔽 if no customerId provided, return all orders (admin usage)
    if (!customerId) return orders;

    // 🔽 filter orders by logged-in customerId
    return orders.filter(order => order.customerId == customerId);
  }
  static saveOrders(orders) {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }
//////////////////////////
  /* ===== PRODUCTS ===== */
  static getAllProducts() {
    return JSON.parse(localStorage.getItem(PRODUCTS_KEY)) || [];
  }

  /* ===== STATUS BADGE ===== */
  static getStatusBadge(status) {
    if (status === "confirmed") return "success";
    if (status === "rejected") return "danger";
    return "warning";
  }
}

/* EXPORTS */
export const getOrders = (customerId) => OrderService.getOrders(customerId);
////////////////
export const saveOrders     = (o) => OrderService.saveOrders(o);
export const getAllProducts = () => OrderService.getAllProducts();
export const getStatusBadge = (s) => OrderService.getStatusBadge(s);
