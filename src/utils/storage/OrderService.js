import KEYS from "./../keys.js";

class OrderService {
  /* ===== ORDERS ===== */
  static getOrders() {
    return JSON.parse(localStorage.getItem(KEYS.ORDERS)) || [];
  }

  static saveOrders(orders) {
    localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
  }

  /* ===== PRODUCTS ===== */
  static getAllProducts() {
    return JSON.parse(localStorage.getItem(KEYS.PRODUCT)) || [];
  }

  /* ===== STATUS BADGE ===== */
  static getStatusBadge(status) {
    if (status === "confirmed") return "success";
    if (status === "rejected") return "danger";
    return "warning";
  }
}

/* EXPORTS */

export const getOrders = () => OrderService.getOrders();
export const saveOrders = (o) => OrderService.saveOrders(o);
export const getAllProducts = () => OrderService.getAllProducts();
export const getStatusBadge = (s) => OrderService.getStatusBadge(s);
