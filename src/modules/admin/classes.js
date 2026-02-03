export class Product {
  constructor(
    id = Date.now(),
    name,
    description,
    categoryId,
    image,
    price,
    stockQuantity,
    features = [],
  ) {
    // validation need in each field
    this.id = id;
    this.setName = name;
    this.setCategoryId = categoryId;
    this.setDescription = description;
    this.setImage = image;
    this.setPrice = price;
    this.setStockQuantity = stockQuantity;
    this.setFeatures = features;
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
      throw new Error("Invalid name.");
    this.name = value;
  }

  // Description
  get getDescription() {
    return this.description;
  }
  set setDescription(value) {
    this.description = value || "No description provided.";
  }

  // Category ID
  get gerCategoryId() {
    return this.categoryId;
  }
  set setCategoryId(value) {
    if (!value) throw new Error("Category ID is required.");
    this.categoryId = value;
  }

  // Image
  get getImage() {
    return this.image;
  }
  set setImage(value) {
    this.image = value || "default-placeholder.png";
  }

  // Price
  get getPrice() {
    return this.price;
  }
  set setPrice(value) {
    if (typeof value !== "number" || value < 0)
      throw new Error("Price must be a positive number.");
    this.price = value;
  }

  // Stock Quantity
  get getStockQuantity() {
    return this.stockQuantity;
  }
  set setStockQuantity(value) {
    if (!Number.isInteger(value) || value < 0)
      throw new Error("Stock must be a non-negative integer.");
    this.stockQuantity = value;
  }

  // Features
  get getFeatures() {
    return this.features;
  }
  set setFeatures(value) {
    this.features = Array.isArray(value) ? value : [];
  }
}

export class Category {
  constructor(id = Date.now(), name, description) {
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
      throw new Error("Invalid name.");
    this.name = value;
  }

  // Description
  get getDescription() {
    return this.description;
  }
  set setDescription(value) {
    this.description = value || "No description provided.";
  }
}
