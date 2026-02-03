export default class Category {
  constructor(name, description, id = Date.now()) {
    this.id = id;
    this.setName = name;
    this.setDescription = description;
  }

  // ID
  get getId() {
    return this.id;
  }

  // Name
  get getName() {
    return this.name;
  }
  set setName(value) {
    if (typeof value !== "string" || value.trim() === "")
      console.error("Invalid name.");
    this.name = value;
  }

  // Description
  get getDescription() {
    return this.description;
  }
  set setDescription(value) {
    this.description = value.trim() === "" ? "No description provided." : value;
  }
}
