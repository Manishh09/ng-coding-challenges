export interface Product {
  id: number;
  title: string;
  price: number;
  stock: number;
  quantity?: number; // quantity to order
}
