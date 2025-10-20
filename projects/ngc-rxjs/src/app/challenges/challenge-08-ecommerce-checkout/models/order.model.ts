import { Product } from './product.model';
 
export interface Order {
  id?: number;
   
  products: Product[];
  total?: number;
  paymentStatus?: PaymentStatus;
}

export type PaymentStatus = 'pending' | 'completed' | 'failed';
