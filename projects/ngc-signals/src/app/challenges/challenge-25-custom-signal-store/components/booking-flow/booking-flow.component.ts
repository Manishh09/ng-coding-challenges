import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe, UpperCasePipe } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BookingStore } from '../../services/booking.store';
import { FlightDataService } from '../../services/flight-data.service';
import { Flight } from '../../models/booking.model';

@Component({
  selector: 'app-booking-flow',
  imports: [CurrencyPipe, UpperCasePipe, MatStepperModule, MatCardModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatListModule, MatDividerModule, MatProgressSpinnerModule],
  templateUrl: './booking-flow.component.html',
  styleUrl: './booking-flow.component.scss'
})
export class BookingFlowComponent {
  private flightData = inject(FlightDataService);
  store = inject(BookingStore);
  currentStep = signal(1);
  flights = this.flightData.getFlights();
  promoCodes = this.flightData.getPromoCodes();

  /** Traveller form state */
  tName = signal('');
  tAge = signal<number | null>(null);
  private nextTravellerId = 1;

  /** Promo input */
  promoInput = signal('');

  /** Booking reference on success */
  bookingRef = signal('');

  constructor() {
    this.store.reset();
  }

  isStepAccessible(step: number): boolean {
    const s = this.store.state();
    if (step === 2) {
      return s.selectedFlight !== null;
    } else if (step === 3) {
      return s.selectedFlight !== null && s.travellers.length > 0;
    } else if (step === 4) {
      return s.selectedFlight !== null && s.travellers.length > 0;
    }
    return true;
  }

  /** Navigation */
  goTo(step: number): void {
    this.currentStep.set(step);
  }

  next(): void {
    this.currentStep.update(s => Math.min(s + 1, 4));
  }

  prev(): void {
    this.currentStep.update(s => Math.max(s - 1, 1));
  }

  /** Step 1 — Search */
  pickFlight(flight: Flight): void {
    this.store.selectFlight(flight);
  }

  /** Step 2 — Travellers */
  onNameInput(e: Event): void {
    this.tName.set((e.target as HTMLInputElement).value);
  }

  onAgeInput(e: Event): void {
    this.tAge.set(+(e.target as HTMLInputElement).value || null);
  }

  addTraveller(): void {
    const name = this.tName().trim();
    const age = this.tAge();
    if (!name || !age || age <= 0) return;
    this.store.addTraveller({ id: this.nextTravellerId++, name, age });
    this.tName.set('');
    this.tAge.set(null);
  }

  /** Step 3 — Promo */
  onPromoInput(e: Event): void {
    this.promoInput.set((e.target as HTMLInputElement).value);
  }

  applyPromo(): void {
    this.store.applyPromoCode(this.promoInput());
  }

  applyPromoChip(code: string): void {
    this.promoInput.set(code);
  }

  /** Step 4 — Payment */
  pay(): void {
    this.store.bookingSnapshot();
    this.store.setPaymentStatus('processing');

    setTimeout(() => {
      const success = Math.random() > 0.3;
      if (success) {
        this.store.setPaymentStatus('success');
        this.bookingRef.set('MMT' + Math.random().toString(36).substring(2, 8).toUpperCase());
      } else {
        this.store.setPaymentStatus('failed');
        this.store.rollback();
      }
    }, 1500);
  }

  retryPayment(): void {
    this.store.setPaymentStatus('pending');
  }
}
