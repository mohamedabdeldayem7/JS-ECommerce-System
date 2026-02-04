import StorageManager from "../../utils/storage/storage-helper.js";
import KEYS from "../../utils/keys.js";
import { User } from "./User.js";

export class AuthService {
  // declare storage service provider
  static storageManager = new StorageManager();

  static register(firstName, lastName, email, password) {
    const users = AuthService.storageManager.get(KEYS.USERS) || [];

    if (users.length < 1) {
      const admin = new User(
        "admin",
        "admin",
        "admin@gmail.com",
        "admin@123",
        "admin",
      );
      users.push(admin);
      users.push(admin.toJSON());
      AuthService.storageManager.set(KEYS.USERS, users);
    }
    if (users.some((u) => u.email === email.toLowerCase())) {
      // Check Duplicates
      throw new Error("Email already registered!");
    }

    // Create User (Validation happens automatically inside the Class)
    const newUser = new User(firstName, lastName, email, password, "user");
    // users.push(newUser.toJSON());
    // Save
    AuthService.storageManager.pushToItem(KEYS.USERS, newUser.toJSON());
    AuthService.storageManager.setCookie(KEYS.CURRENT_USER, newUser.id, 7);
    return newUser;
  }

  static login(email, password) {
    const users = AuthService.storageManager.get(KEYS.USERS);

    if (users.length < 1) {
      const admin = new User(
        "admin",
        "admin",
        "admin@gmail.com",
        "admin@123",
        "admin",
      );
      users.push(admin);
      users.push(admin.toJSON());
      AuthService.storageManager.set(KEYS.USERS, users);
    }

    const user = users.find(
      (u) => u.email === email.toLowerCase() && u.password === password,
    );

    if (!user) {
      throw new Error("Invalid email or password");
    }

    // save current user in cookies
    AuthService.storageManager.setCookie(KEYS.CURRENT_USER, user.id, 7);
    return user;
  }

  static logout() {
    AuthService.storageManager.eraseCookie(KEYS.CURRENT_USER);
  }
  // auth function
  static checkAuth() {
    const user = AuthService.storageManager.getCookie(KEYS.CURRENT_USER);
    if (!user || !user.email) return null;
    return user;
  }
}
