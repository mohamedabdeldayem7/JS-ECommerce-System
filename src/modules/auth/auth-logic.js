import StorageManager from "../../utils/storage/storage-helper.js";
import KEYS from "../../utils/keys.js";
import { User } from "./User.js";

export class AuthService {
  static storageManager = new StorageManager();

  static register(firstName, lastName, email, password) {
    const users = AuthService.storageManager.get(KEYS.USERS) || [];

    if (!users.length) {
      AuthService.createNewAdmin();
    }
    if (users.some((u) => u.email === email.toLowerCase())) {
      throw new Error("Email already registered!");
    }

    const newUser = new User(firstName, lastName, email, password, "user");
    AuthService.storageManager.pushToItem(KEYS.USERS, newUser.toJSON());
    AuthService.storageManager.setCookie(KEYS.CURRENT_USER, newUser.id, 7);
    AuthService.storageManager.set("currentUser", newUser.toJSON());
    return newUser;
  }

  static login(email, password) {
    const users = AuthService.storageManager.get(KEYS.USERS) || [];

    console.log(users);

    if (!users.length) {
      AuthService.createNewAdmin();
    }

    const user = users.find(
      (u) => u.email === email.toLowerCase() && u.password === password,
    );

    if (!user) {
      throw new Error("Invalid email or password");
    }

    AuthService.storageManager.setCookie(KEYS.CURRENT_USER, user.id, 7);
    AuthService.storageManager.set("currentUser", user);
    return user;
  }

  static logout() {
    AuthService.storageManager.eraseCookie(KEYS.CURRENT_USER);
    AuthService.storageManager.remove("currentUser");
    window.location.href = "../../../pages/auth/login.html";
    // window.location.href = "/JS-ECommerce-System/pages/auth/login.html";
  }

  static checkAuth() {
    const user = AuthService.storageManager.getCookie(KEYS.CURRENT_USER);
    // if (user === null) return null;
    return user;
  }

  static isAuthorized(role) {
    const userId = parseInt(AuthService.checkAuth());
    const users = AuthService.storageManager.get(KEYS.USERS) || [];

    // console.log(userId, users, users.find((u) => u.id === userId).role);

    if (
      !userId ||
      users.find((u) => u.id === userId).role.toLowerCase() !==
        role.toLowerCase()
    ) {
      console.log(users.find((u) => u.id === userId));
      return false;
    }
    return true;
  }

  static createNewAdmin() {
    const users = AuthService.storageManager.get(KEYS.USERS) || [];
    const adminUser = users.find((u) => u.id == 99);

    console.log(adminUser);

    if (!adminUser) {
      const admin = new User(
        "admin",
        "admin",
        "admin@Lafyuu.com",
        "Admin@123",
        "admin",
        99,
      );
      users.push(admin.toJSON());
      AuthService.storageManager.set(KEYS.USERS, users);
    }
  }
}
