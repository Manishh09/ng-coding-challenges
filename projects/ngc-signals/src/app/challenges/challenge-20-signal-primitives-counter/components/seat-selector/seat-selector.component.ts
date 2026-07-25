import { Component, signal, computed, effect } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-seat-selector',
  imports: [CurrencyPipe, MatCardModule, MatButtonModule, MatIconModule, MatDividerModule],
  templateUrl: './seat-selector.component.html',
  styleUrl: './seat-selector.component.scss'
})
export class SeatSelectorComponent {
  private readonly PRICE_PER_SEAT = 250;
  private readonly MIN_SEATS = 1;
  private readonly MAX_SEATS = 10;

  /** Mutable signal — the single source of truth for seat count */
  seats = signal<number>(this.MIN_SEATS);

  /** Derived state — all computed from `seats` */
  totalPrice = computed(() => this.seats() * this.PRICE_PER_SEAT);
  isAtMin = computed(() => this.seats() <= this.MIN_SEATS);
  isAtMax = computed(() => this.seats() >= this.MAX_SEATS);
  priceBreakdown = computed(() => ({
    seats: this.seats(),
    pricePerSeat: this.PRICE_PER_SEAT,
    total: this.totalPrice()
  }));

  constructor() {
    /** Analytics side-effect — logs on every signal change */
    effect(() => {
      console.log('📊 [Analytics]', {
        seatsSelected: this.seats(),
        totalPrice: this.totalPrice(),
        timestamp: new Date().toISOString()
      });
    });
  }

  increment(): void {
    this.seats.update(s => Math.min(s + 1, this.MAX_SEATS));
  }

  decrement(): void {
    this.seats.update(s => Math.max(s - 1, this.MIN_SEATS));
  }

  reset(): void {
    this.seats.set(this.MIN_SEATS);
  }
}
