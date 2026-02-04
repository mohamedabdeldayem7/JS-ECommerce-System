// imports

// my filters
// 1- search by name
// 2- filter category
// 3- f price (min to max, max to min)
// 4- f stock (min to max, max to min)
export default class FilterService {
  static filterProducts(products, { searchQuery, category, sortBy }) {
    let filtered = [...products];

    console.log(`from FilterService: ${searchQuery}, ${category}, ${sortBy}`);

    // search by name
    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // filter by category
    if (category && category !== "all") {
      console.log(category);

      filtered = filtered.filter((p) => p.categoryId === category);
    }

    // all sort
    if (sortBy != "all") {
      if (sortBy === "lowPrice") {
        filtered.sort((a, b) => a.price - b.price);
      } else if (sortBy === "highPrice") {
        filtered.sort((a, b) => b.price - a.price);
      } else if (sortBy === "lowStock") {
        filtered.sort((a, b) => a.stockQuantity - b.stockQuantity);
      } else if (sortBy === "highStock") {
        filtered.sort((a, b) => b.stockQuantity - a.stockQuantity);
      }
    }
    return filtered;
  }
}
