// imports
import KEYS from "../../utils/keys.js";
import { AuthService } from "./auth-logic.js";

const loginForm = document.getElementById("loginForm");
const messageEl = document.getElementById("message");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  messageEl.textContent = "";
  messageEl.className = "text-danger text-center mb-3";

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    messageEl.textContent = "Please enter both email and password.";
    return;
  }

  try {
    const user = AuthService.login(email, password);

    if (user.role === "admin") {
      window.location.href = "../../pages/admin/dashboard.html";
    } else {
      window.location.href = "../../index.html";
    }
  } catch (error) {
    messageEl.textContent = error.message;
  }
});
