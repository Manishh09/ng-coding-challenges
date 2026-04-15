import { inject, Injectable, signal, computed } from '@angular/core';
import { BookingState, FareBreakdown, Flight, PaymentStatus, Traveller } from '../models/booking.model';
import { FlightDataService } from './flight-data.service';

const INITIAL_STATE: BookingState = {
  selectedFlight: null,
  travellers: [],
  promoCode: '',
  promoDiscount: 0,
  paymentStatus: 'pending'
};

@Injectable({ providedIn: 'root' })
export class BookingStore {
  private flightData = inject(FlightDataService);

  /** Private writable signal — single source of truth */
  private _state = signal<BookingState>({ ...INITIAL_STATE });

  /** Public readonly exposure */
  readonly state = this._state.asReadonly();

  /** Selectors — computed from state */
  readonly selectedFlight = computed(() => this._state().selectedFlight);
  readonly travellers = computed(() => this._state().travellers);
  readonly promoCode = computed(() => this._state().promoCode);
  readonly paymentStatus = computed(() => this._state().paymentStatus);

  readonly fareBreakdown = computed<FareBreakdown>(() => {
    const flight = this._state().selectedFlight;
    const count = this._state().travellers.length;
    const discount = this._state().promoDiscount;

    const baseFare = flight?.baseFare ?? 0;
    const subtotal = baseFare * Math.max(count, 1);
    const taxes = Math.round(subtotal * 0.12);
    const total = Math.max(subtotal + taxes - discount, 0);

    return { baseFare, travellersCount: count, subtotal, taxes, promoDiscount: discount, total };
  });

  readonly isBookingValid = computed(() => {
    const s = this._state();
    return (
      s.selectedFlight !== null &&
      s.travellers.length >= 1 &&
      s.travellers.every(t => t.name.trim().length > 0 && t.age > 0)
    );
  });

  /** Actions — mutate private state via update() */
  selectFlight(flight: Flight): void {
    this._state.update(s => ({ ...s, selectedFlight: flight }));
  }

  addTraveller(traveller: Traveller): void {
    this._state.update(s => ({ ...s, travellers: [...s.travellers, traveller] }));
  }

  removeTraveller(id: number): void {
    this._state.update(s => ({
      ...s,
      travellers: s.travellers.filter(t => t.id !== id)
    }));
  }

  applyPromoCode(code: string): void {
    const discount = this.flightData.getDiscount(code);
    this._state.update(s => ({ ...s, promoCode: code, promoDiscount: discount }));
  }

  setPaymentStatus(status: PaymentStatus): void {
    this._state.update(s => ({ ...s, paymentStatus: status }));
  }

  /** Snapshot for optimistic update / rollback */
  private _snapshot: BookingState | null = null;

  bookingSnapshot(): void {
    this._snapshot = structuredClone(this._state());
  }

  rollback(): void {
    if (this._snapshot) {
      this._state.set(this._snapshot);
      this._snapshot = null;
    }
  }

  reset(): void {
    this._state.set({ ...INITIAL_STATE });
    this._snapshot = null;
  }
}
