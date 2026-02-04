import { AuthService } from "./../../modules/auth/auth-logic.js";

document.getElementById("logoutMe").addEventListener("click", () => {
  console.log("llogout");
  AuthService.logout();
});
