const WISHLISTS_KEY = "wishlists";
const CARTS_KEY = "carts";
const CURRENT_USER_KEY = "currentUser";

/* ===================== NEW ===================== */
// ADDED: use cookies instead of localStorage for current user
import StorageManager from "./storage-helper.js";
import KEYS from "../keys.js";

const storage = new StorageManager();
/* ===================== END NEW ===================== */


class WishlistService {

  /* ================= USER ================= */

  static getCurrentUser() {

    /* ===================== MODIFIED ===================== */
    // MODIFIED: read current user id from cookies instead of localStorage
    const userId = storage.getCookie(KEYS.CURRENT_USER);
    if (!userId) return null;
    return { id: userId };
    /* ===================== END MODIFIED ===================== */
  }

  /* ================= WISHLISTS OBJECT ================= */

  static getAllWishlists() {
    return JSON.parse(localStorage.getItem(WISHLISTS_KEY)) || {};
  }

  static saveAllWishlists(wishlists) {
    localStorage.setItem(WISHLISTS_KEY, JSON.stringify(wishlists));
  }

  /* ================= CURRENT USER WISHLIST ================= */

  static getWishlist() {

    const user = this.getCurrentUser();
    if (!user) return [];

    const wishlists = this.getAllWishlists();

    return wishlists[user.id] || [];
  }

  static saveWishlist(productIds) {

    const user = this.getCurrentUser();
    if (!user) return;

    const wishlists = this.getAllWishlists();

    wishlists[user.id] = productIds;

    this.saveAllWishlists(wishlists);
  }

  static removeFromWishlist(productId) {

    const list = this.getWishlist().filter(id => id !== productId);

    this.saveWishlist(list);
  }

  /* ================= CART (reuse same storage shape) ================= */

  static getAllCarts() {
    return JSON.parse(localStorage.getItem(CARTS_KEY)) || {};
  }

  static saveAllCarts(carts) {
    localStorage.setItem(CARTS_KEY, JSON.stringify(carts));
  }

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

  /* ================= MOVE TO CART ================= */

  static moveToCart(productId) {

    const user = this.getCurrentUser();
    if (!user) return;

    // add to cart
    const cart = this.getCart();

    const item = cart.find(i => i.productId === productId);

    if (item) {
      item.quantity++;
    } else {
      cart.push({
        productId,
        quantity: 1
      });
    }

    this.saveCart(cart);

    // remove from wishlist
    this.removeFromWishlist(productId);
  }
}


/* EXPORTS */

export const getWishlist        = () => WishlistService.getWishlist();
export const removeFromWishlist = (id) => WishlistService.removeFromWishlist(id);
export const moveToCart         = (id) => WishlistService.moveToCart(id);
