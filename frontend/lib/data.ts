import type { Item, Category, Brand } from "./types";

const API_BASE_URL = "http://localhost:8000";

// Fetch all items from the API
export async function fetchItems(): Promise<Item[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/products/`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
}

// Get item by ID from the API
export async function getItemById(id: string): Promise<Item | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching item with ID ${id}:`, error);
    throw error;
  }
}

// Get all categories
export async function getCategories(): Promise<Category[]> {
  try {
    // In a real API, this might be a separate endpoint
    // For now, we'll fetch all products and extract unique categories
    const items = await fetchItems();
    const categories = Array.from(
      new Set(items.map((item) => item.category))
    ) as Category[];
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [
      "Electronics",
      "Clothing",
      "Home",
      "Beauty",
      "Toys",
      "Books",
      "Fitness",
    ];
  }
}

// Get all brands
export async function getBrands(): Promise<Brand[]> {
  try {
    const items = await fetchItems();
    const brands = Array.from(
      new Set(items.map((item) => item.brand))
    ) as Brand[];
    return brands;
  } catch (error) {
    console.error("Error fetching brands:", error);
    return ["Sony", "Samsung", "Apple", "Dell", "Asus", "HP", "LG"];
  }
}

// Get related items
export async function getRelatedItems(category: string): Promise<Item[]> {
  try {
    const items = await fetchItems();
    return items.filter((item) => item.category === category).slice(0, 6);
  } catch (error) {
    console.error(
      `Error fetching related items for category ${category}:`,
      error
    );
    return [];
  }
}
