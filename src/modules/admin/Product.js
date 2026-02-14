export default class Product {
  constructor(
    name,
    description,
    categoryId,
    image,
    price,
    stockQuantity,
    features = [],
    id = Date.now(),
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
    if (
      typeof value !== "string" ||
      value.trim() === "" ||
      value.trim().length <= 3
    )
      throw new Error("Invalid name.");
    this.name = value;
  }

  // Description
  get getDescription() {
    return this.description;
  }
  set setDescription(value) {
    this.description = value.trim() === "" ? "No description provided." : value;
  }

  // Category ID
  get gerCategoryId() {
    return this.categoryId;
  }
  set setCategoryId(value) {
    if (!Validation.validateProductCategory(value))
      throw new Error("Category ID is required.");
    else this.categoryId = value;
  }

  // Image
  get getImage() {
    return this.image;
  }
  set setImage(value) {
    this.image = value.trim() === "" ? "default-placeholder.png" : value;
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

import StorageManager from "./../../utils/storage/storage-helper.js";
class Validation {
  static storageManager = new StorageManager();

  constructor() {}

  static validateProductCategory = function (categoryId) {
    const categories = Validation.storageManager.get("categories");

    if (!Array.isArray(categories)) {
      console.error("cannot read categories");
      return false;
    }

    return categories.some((cat) => cat.id === categoryId);
  };
}
