export interface Payment {
  id: number;
  orderId: number;
  amount: number;
  status: PaymentStatus;
}

export type PaymentStatus = 'pending' | 'completed' | 'failed';
