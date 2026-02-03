import StorageManager from "../../utils/storage/storage-helper.js";
import Category from "./Category.js";
import Product from "./Category.js";

const storageManager = new StorageManager();

// get all categories
export function getAllCategories() {
  return toCategoryList(storageManager.get("categories"));
}

// function to get a category by ID
export function getCategoryById(id) {
  return getAllCategories().find((c) => c.id === id);
}

function toCategoryList(data) {
  //   console.log(data);

  if (Array.isArray(data)) {
    console.log("from cat-crud", data);
    return data.map((c) => new Category(c.name, c.description, c.id));
  }
}
