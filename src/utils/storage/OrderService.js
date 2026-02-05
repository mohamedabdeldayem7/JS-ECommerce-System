const ORDERS_KEY = "orders";
const PRODUCTS_KEY = "products";

class OrderService {

  /* ===== ORDERS ===== */
  static getOrders() {
    return JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
  }

  static saveOrders(orders) {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }

  /* ===== PRODUCTS ===== */
  static getAllProducts() {
    return JSON.parse(localStorage.getItem(PRODUCTS_KEY)) || [];
  }

  /* ===== STATUS BADGE ===== */
  static getStatusBadge(status) {
    if (status === "approved") return "success";
    if (status === "rejected") return "danger";
    return "warning";
  }
}

/* EXPORTS */

export const getOrders      = () => OrderService.getOrders();
export const saveOrders     = (o) => OrderService.saveOrders(o);
export const getAllProducts = () => OrderService.getAllProducts();
export const getStatusBadge = (s) => OrderService.getStatusBadge(s);
