import StorageManager from "../../utils/storage/storage-helper.js";
import KEYS from "../../utils/keys.js";
import { User } from "./User.js";

export class AuthService {
  static storageManager = new StorageManager();

  static register(firstName, lastName, email, password) {
    const users = AuthService.storageManager.get(KEYS.USERS) || [];

    if (!users.length) {
      const admin = new User(
        "admin",
        "admin",
        "admin@gmail.com",
        "Admin@123",
        "admin",
        99,
      );
      users.push(admin.toJSON());
      AuthService.storageManager.set(KEYS.USERS, users);
    }
    if (users.some((u) => u.email === email.toLowerCase())) {
      throw new Error("Email already registered!");
    }

    const newUser = new User(firstName, lastName, email, password, "user");
    AuthService.storageManager.pushToItem(KEYS.USERS, newUser.toJSON());
    AuthService.storageManager.setCookie(KEYS.CURRENT_USER, newUser.id, 7);
    return newUser;
  }

  static login(email, password) {
    const users = AuthService.storageManager.get(KEYS.USERS) || [];

    console.log(users);

    if (!users.length) {
      const admin = new User(
        "admin",
        "admin",
        "admin@gmail.com",
        "Admin@123",
        "admin",
        999,
      );
      users.push(admin.toJSON());
      AuthService.storageManager.set(KEYS.USERS, users);
    }

    const user = users.find(
      (u) => u.email === email.toLowerCase() && u.password === password,
    );

    if (!user) {
      throw new Error("Invalid email or password");
    }

    AuthService.storageManager.setCookie(KEYS.CURRENT_USER, user.id, 7);
    return user;
  }

  static logout() {
    AuthService.storageManager.eraseCookie(KEYS.CURRENT_USER);
    window.location.href = "../../../pages/auth/login.html";
  }

  static checkAuth() {
    const user = AuthService.storageManager.getCookie(KEYS.CURRENT_USER);
    if (!user || !user.email) return null;
    return user;
    const cart = storageManager.get(KEYS.CART) || [];
    const cusCart = cart.find((c) => c.user_id === user.id);
    cusCart.items.push = {
      itemQnt: 4,
      itemId: prod.id,
    };
  }
}
