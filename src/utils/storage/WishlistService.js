const WISHLIST_KEY = "wishlist";
const CART_KEY = "cart";

class WishlistService {

  /* ===== WISHLIST ===== */
  static getWishlist() {
    return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
  }

  static saveWishlist(wishlist) {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  }

  static removeFromWishlist(pId) {
    const wishlist = this.getWishlist().filter(p => p.id !== pId);
    this.saveWishlist(wishlist);
  }

  /* ===== CART ===== */
  static getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  }

  static saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }

  static moveToCart(pId) {

    const wishlist = this.getWishlist();
    const product = wishlist.find(p => p.id === pId);
    if (!product) return;

    let cart = this.getCart();
    const existing = cart.find(item => item.id === pId);

    if (existing) {
      if (existing.quantity < product.stockQuantity) {
        existing.quantity++;
      }
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        stockQuantity: product.stockQuantity,
        quantity: 1
      });
    }

    this.saveCart(cart);
    this.removeFromWishlist(pId);
  }
}

/* EXPORT */
export const getWishlist        = () => WishlistService.getWishlist();
export const removeFromWishlist = (id) => WishlistService.removeFromWishlist(id);
export const moveToCart         = (id) => WishlistService.moveToCart(id);
