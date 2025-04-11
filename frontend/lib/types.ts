export interface Item {
  id: number;
  name: string;
  description?: string;
  category: string;
  brand: string;
  price: number;
  status: "in stock" | "low stock" | "out of stock";
  color: string;
  image_url: string;
  sku: string;
  created_at: string;
  updated_at: string;
  weight: number;
  dimension: string;
}

export type Category =
  | "Electronics"
  | "Clothing"
  | "Home"
  | "Beauty"
  | "Toys"
  | "Books"
  | "Fitness";
export type Brand =
  | "Sony"
  | "Samsung"
  | "Apple"
  | "Dell"
  | "Asus"
  | "HP"
  | "LG";
export type Status = "in stock" | "low stock" | "out of stock";
export type Color =
  | "Red"
  | "Blue"
  | "Green"
  | "Black"
  | "White"
  | "Gray"
  | "Yellow";
