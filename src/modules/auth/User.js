export class User {
  constructor(firstName, lastName, email, password, role = "user", id) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.role = role;
    this.id = id || Date.now();
  }

  set firstName(value) {
    UserValidations.validateName(value);
    this._firstName = value;
  }
  get firstName() {
    return this._firstName;
  }

  set lastName(value) {
    UserValidations.validateName(value);
    this._lastName = value;
  }
  get lastName() {
    return this._lastName;
  }

  set email(value) {
    UserValidations.validateEmail(value);
    this._email = value.toLowerCase();
  }
  get email() {
    return this._email;
  }

  set password(value) {
    UserValidations.validatePassword(value);
    this._password = value;
    console.log(value);
  }
  get password() {
    return this._password;
  }

  toJSON() {
    return {
      id: this.id,
      firstName: this._firstName,
      lastName: this._lastName,
      email: this._email,
      password: this._password,
      role: this.role,
    };
  }
}

export class UserValidations {
  static validateEmail(vlaue) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(vlaue.trim())) {
      console.log(vlaue);

      throw new Error("Format error: Please enter a valid email address.");
    }
    return true;
  }

  static validateName(name) {
    const regex = /^[a-zA-Z]{3,}$/;
    if (!regex.test(name.trim())) {
      throw new Error(
        "Name must be at least 3 characters and contain only letters.",
      );
    }
    return true;
  }

  static validatePassword(password) {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.* ]{6,}$/;

    if (!regex.test(password)) {
      throw new Error(
        "Password too weak: Must include Uppercase, Lowercase and Special Character (Min 6 chars).",
      );
    }
    return true;
  }
}
