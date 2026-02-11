import { AuthService } from "./auth-logic.js";
import { UserValidations } from "./User.js";

const registrationForm = document.getElementById("registrationForm");
const message = document.getElementById("message");

const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const email = document.getElementById("email");
const password = document.getElementById("password");
const repeatPassword = document.getElementById("repeatPassword");

const firstNameError = document.getElementById("firstNameError");
const lastNameError = document.getElementById("lastNameError");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const repeatPasswordError = document.getElementById("repeatPasswordError");

registrationForm.addEventListener("submit", function (e) {
  e.preventDefault();

  try {
    console.log("try brfore register fun");

    if (password.value !== repeatPassword.value) {
      throw new Error("Passwords do not match!");
    }
    AuthService.register(
      firstName.value,
      lastName.value,
      email.value,
      password.value,
    );
    console.log("try after register fun");

    message.innerHTML =
      '<div class="alert alert-success">Registration successful!</div>';
    alert("Account Created Successfully!");
    setTimeout(() => {
      window.location.href = "../../index.html";
    }, 2000);
    registrationForm.reset();
  } catch (error) {
    message.textContent = error.message;
    message.classList.add("text-danger");
  }
});

firstName.addEventListener("blur", function () {
  try {
    UserValidations.validateName(this.value);
    this.classList.remove("is-invalid");
    this.classList.add("is-valid");
    firstNameError.innerText = "";
  } catch (error) {
    this.classList.add("is-invalid");
    firstNameError.innerText = error.message;
  }
});

lastName.addEventListener("blur", function () {
  try {
    UserValidations.validateName(this.value);
    this.classList.remove("is-invalid");
    this.classList.add("is-valid");
    lastNameError.innerText = "";
  } catch (error) {
    this.classList.add("is-invalid");
    lastNameError.innerText = error.message;
    console.log(error, message);
  }
});

email.addEventListener("blur", function () {
  try {
    UserValidations.validateEmail(this.value);
    this.classList.remove("is-invalid");
    this.classList.add("is-valid");
    emailError.innerText = "";
  } catch (error) {
    this.classList.add("is-invalid");
    emailError.innerText = error.message;
  }
});

password.addEventListener("blur", function () {
  try {
    UserValidations.validatePassword(this.value);
    this.classList.remove("is-invalid");
    this.classList.add("is-valid");
    passwordError.innerText = "";
  } catch (error) {
    this.classList.add("is-invalid");
    passwordError.innerText = error.message;
  }
});

repeatPassword.addEventListener("blur", function () {
  if (this.value === password.value) {
    this.classList.remove("is-invalid");
    this.classList.add("is-valid");
    repeatPasswordError.innerText = "";
  } else {
    this.classList.remove("is-valid");
    this.classList.add("is-invalid");
    repeatPasswordError.innerText = "Passwords do not match!";
  }
});
const inputs = document.querySelectorAll(".input-box input");

inputs.forEach((input) => {
  input.addEventListener("input", () => {
    if (input.value.trim() !== "") {
      input.classList.add("has-value");
    } else {
      input.classList.remove("has-value");
    }
  });

  // لو فيه قيمة بعد reload
  if (input.value.trim() !== "") {
    input.classList.add("has-value");
  }
});
