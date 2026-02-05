import KEYS from "./../keys.js";

class OrderService {
  /* ===== ORDERS ===== */
 // 🔽 MODIFIED: allow fetching orders for a specific customerId
  static getOrders(customerId = null) {
    const orders = JSON.parse(localStorage.getItem(KEYS.ORDERS)) || [];

    // 🔽 if no customerId provided, return all orders (admin usage)
    if (!customerId) return orders;

    // 🔽 filter orders by logged-in customerId
    return orders.filter(order => order.customerId == customerId);
  }
  static saveOrders(orders) {
    localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
  }
//////////////////////////
  /* ===== PRODUCTS ===== */
  static getAllProducts() {
    return JSON.parse(localStorage.getItem(KEYS.PRODUCT)) || [];
  }

  /* ===== STATUS BADGE ===== */
  static getStatusBadge(status) {
    if (status === "confirmed") return "success";
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
