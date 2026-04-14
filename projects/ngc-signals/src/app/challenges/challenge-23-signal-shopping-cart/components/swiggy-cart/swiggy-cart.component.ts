import { Component, inject, signal, computed } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { CartItem, MenuItem, OrderSummary, Restaurant, Coupon } from '../../models/cart.model';
import { SwiggyMenuService } from '../../services/swiggy-menu.service';

@Component({
  selector: 'app-swiggy-cart',
  imports: [CurrencyPipe],
  templateUrl: './swiggy-cart.component.html',
  styleUrl: './swiggy-cart.component.scss'
})
export class SwiggyCartComponent {
  private readonly menuService = inject(SwiggyMenuService);

  readonly DELIVERY_FEE = 40;
  private readonly FREE_DELIVERY_THRESHOLD = 299;
  private readonly GST_RATE = 0.05;
  private readonly MIN_QTY = 1;
  private readonly MAX_QTY = 10;

  /** Data from service */
  restaurant: Restaurant = this.menuService.getRestaurant();
  menu: MenuItem[] = this.menuService.getMenuItems();
  availableCoupons: Coupon[] = this.menuService.getAvailableCoupons();

  /** Source signals */
  cartItems = signal<CartItem[]>([]);
  couponCode = signal<string>('');

  /** Chained computed pipeline */
  itemCount = computed(() =>
    this.cartItems().reduce((sum, item) => sum + item.quantity, 0)
  );

  isEmpty = computed(() => this.cartItems().length === 0);

  subtotal = computed(() =>
    this.cartItems().reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  deliveryFee = computed(() =>
    this.subtotal() >= this.FREE_DELIVERY_THRESHOLD ? 0 : this.DELIVERY_FEE
  );

  isDeliveryFree = computed(() => this.deliveryFee() === 0);

  couponDiscount = computed(() => {
    if (this.couponCode().toUpperCase() === 'SWIGGY20') {
      return Math.round(this.subtotal() * 0.20);
    }
    return 0;
  });

  discountedSubtotal = computed(() =>
    this.subtotal() - this.couponDiscount()
  );

  gst = computed(() =>
    Math.round(this.discountedSubtotal() * this.GST_RATE)
  );

  grandTotal = computed(() =>
    this.discountedSubtotal() + this.deliveryFee() + this.gst()
  );

  savings = computed(() =>
    this.couponDiscount() + (this.subtotal() >= this.FREE_DELIVERY_THRESHOLD ? this.DELIVERY_FEE : 0)
  );

  orderSummary = computed<OrderSummary>(() => ({
    itemCount: this.itemCount(),
    subtotal: this.subtotal(),
    deliveryFee: this.deliveryFee(),
    isDeliveryFree: this.isDeliveryFree(),
    couponDiscount: this.couponDiscount(),
    gst: this.gst(),
    grandTotal: this.grandTotal(),
    savings: this.savings()
  }));

  /** Free delivery suggestion banner */
  cartSuggestion = computed(() => {
    const sub = this.subtotal();
    if (sub === 0) return '';
    if (sub < this.FREE_DELIVERY_THRESHOLD) {
      const away = this.FREE_DELIVERY_THRESHOLD - sub;
      return `Add ₹${away} more for free delivery!`;
    }
    return 'You\'ve unlocked FREE delivery!';
  });

  isFreeDeliveryUnlocked = computed(() =>
    this.subtotal() >= this.FREE_DELIVERY_THRESHOLD
  );

  /** Cart operations — all immutable */
  addItem(menuItem: MenuItem): void {
    this.cartItems.update(items => {
      const existing = items.find(i => i.id === menuItem.id);
      if (existing) {
        return items.map(i =>
          i.id === menuItem.id
            ? { ...i, quantity: Math.min(i.quantity + 1, this.MAX_QTY) }
            : i
        );
      }
      return [...items, { id: menuItem.id, name: menuItem.name, price: menuItem.price, quantity: 1 }];
    });
  }

  removeItem(id: number): void {
    this.cartItems.update(items => items.filter(i => i.id !== id));
  }

  updateQuantity(id: number, delta: number): void {
    this.cartItems.update(items =>
      items.map(i =>
        i.id === id
          ? { ...i, quantity: Math.max(this.MIN_QTY, Math.min(i.quantity + delta, this.MAX_QTY)) }
          : i
      )
    );
  }

  clearCart(): void {
    this.cartItems.set([]);
    this.couponCode.set('');
  }

  onCouponInput(event: Event): void {
    this.couponCode.set((event.target as HTMLInputElement).value);
  }

  applyCoupon(code: string): void {
    this.couponCode.set(code);
  }

  /** Check if a menu item is already in cart */
  getCartQty(id: number): number {
    const item = this.cartItems().find(i => i.id === id);
    return item ? item.quantity : 0;
  }
}
