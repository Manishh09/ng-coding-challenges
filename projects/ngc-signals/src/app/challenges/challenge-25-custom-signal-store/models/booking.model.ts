export interface Flight {
  id: number;
  airline: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  baseFare: number;
}

export interface Traveller {
  id: number;
  name: string;
  age: number;
}

export type PaymentStatus = 'pending' | 'processing' | 'success' | 'failed';

export interface BookingState {
  selectedFlight: Flight | null;
  travellers: Traveller[];
  promoCode: string;
  promoDiscount: number;
  paymentStatus: PaymentStatus;
}

export interface FareBreakdown {
  baseFare: number;
  travellersCount: number;
  subtotal: number;
  taxes: number;
  promoDiscount: number;
  total: number;
}
