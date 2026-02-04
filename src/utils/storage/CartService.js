const CART_KEY = "cart";
const ORDERS_KEY = "orders";

class CartService {

  /* ===== PRODUCTS ===== */
  static async getAllProducts() {
    return JSON.parse(localStorage.getItem("products")) || [];
  }

  /* ===== CART ===== */
  static getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  }

  static saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }

  /* ===== TOTALS ===== */
  static calculateTotals(cartItems) {
    let subtotal = 0;

    cartItems.forEach(item => {
      subtotal += item.price * item.quantity;
    });

    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    return { subtotal, tax, total };
  }

  /* ===== PLACE ORDER (الشكل لم يتغير) ===== */
  static async placeOrder() {

    const cart = this.getCart();
    if (!cart.length) return;

    let total = 0;
    const orderItems = [];

    for (const item of cart) {

      if (item.quantity > item.stockQuantity) {
        alert(`Not enough stock for ${item.name}`);
        return;
      }

      total += item.price * item.quantity;

      orderItems.push({
        productId: item.id,
        quantity: item.quantity
      });
    }

    const orders = JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];

    const newOrder = {
      id: "o" + Date.now(),
      customerId: 1,
      items: orderItems,
      total: Number((total * 1.08).toFixed(2)),
      status: "pending",
      date: new Date().toISOString().split("T")[0]
    };

    orders.unshift(newOrder);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));

    localStorage.removeItem(CART_KEY);

    window.location.href = "my-orders.html";
  }
}

/* EXPORT */
export const getCart         = () => CartService.getCart();
export const saveCart        = (c) => CartService.saveCart(c);
export const calculateTotals = (c) => CartService.calculateTotals(c);
export const placeOrder      = () => CartService.placeOrder();
