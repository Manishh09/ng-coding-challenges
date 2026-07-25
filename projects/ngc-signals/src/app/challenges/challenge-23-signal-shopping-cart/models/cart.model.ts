export interface MenuItem {
  id: number;
  name: string;
  price: number;
  description: string;
  isVeg: boolean;
  isBestseller: boolean;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  label: string;
}

export interface Restaurant {
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  costForTwo: number;
}

export interface OrderSummary {
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  isDeliveryFree: boolean;
  couponDiscount: number;
  gst: number;
  grandTotal: number;
  savings: number;
}
