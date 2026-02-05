const CARTS_KEY  = "carts";
const ORDERS_KEY = "orders";
const PRODUCTS_KEY = "products";
const CURRENT_USER_KEY = "currentUser";

/* ===================== NEW ===================== */
// ADDED: use cookies instead of localStorage for current user
import StorageManager from "./storage-helper.js";
import KEYS from "../keys.js";

const storage = new StorageManager();
/* ===================== END NEW ===================== */

class CartService {

  /* ===== USER ===== */

  static getCurrentUser() {
 /* ===================== MODIFIED ===================== */
    // MODIFIED: read current user id from cookies
    const userId = storage.getCookie(KEYS.CURRENT_USER);
    if (!userId) return null;
    return { id: userId };
    /* ===================== END MODIFIED ===================== */
  }

  /* ===== PRODUCTS ===== */

  static getAllProducts() {
    return JSON.parse(localStorage.getItem(PRODUCTS_KEY)) || [];
  }

  /* ===== CARTS OBJECT ===== */

  static getAllCarts() {
    return JSON.parse(localStorage.getItem(CARTS_KEY)) || {};
  }

  static saveAllCarts(carts) {
    localStorage.setItem(CARTS_KEY, JSON.stringify(carts));
  }

  /* ===== CURRENT USER CART ===== */

  static getCart() {
    const user = this.getCurrentUser();
    if (!user) return [];

    const carts = this.getAllCarts();

    return carts[user.id] || [];
  }

  static saveCart(cartItems) {
    const user = this.getCurrentUser();
    if (!user) return;

    const carts = this.getAllCarts();

    carts[user.id] = cartItems;

    this.saveAllCarts(carts);
  }

  /* ===== TOTALS ===== */

  static calculateTotals(cartItems) {

    const products = this.getAllProducts();

    let subtotal = 0;

    cartItems.forEach(item => {

      const product = products.find(p => p.id === item.productId);
      if (!product) return;

      subtotal += product.price * item.quantity;
    });

    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    return { subtotal, tax, total };
  }

  /* ===== PLACE ORDER ===== */

  static placeOrder() {

    const user = this.getCurrentUser();
    if (!user) return;

    const cart = this.getCart();
    if (!cart.length) return;

    const products = this.getAllProducts();

    let total = 0;
    const orderItems = [];

    for (const item of cart) {

      const product = products.find(p => p.id === item.productId);

      if (!product) continue;

      if (item.quantity > product.stockQuantity) {
        alert(`Not enough stock for ${product.name}`);
        return;
      }

      total += product.price * item.quantity;

      orderItems.push({
        productId: product.id,
        quantity: item.quantity
      });
    }

    const orders = JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];

    const newOrder = {
      id: "o" + Date.now(),
      customerId: user.id,
      items: orderItems,
      total: Number((total * 1.08).toFixed(2)),
      status: "pending",
      date: new Date().toISOString().split("T")[0]
    };

    orders.unshift(newOrder);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));

    this.saveCart([]);

    window.location.href = "my-orders.html";
  }
}

/* EXPORTS */

export const getCart = () =>
  CartService.getCart();

export const saveCart = (items) =>
  CartService.saveCart(items);

export const calculateTotals = (items) =>
  CartService.calculateTotals(items);

export const placeOrder = () =>
  CartService.placeOrder();