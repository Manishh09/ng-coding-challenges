import { Injectable } from '@angular/core';
import { Flight } from '../models/booking.model';

export interface PromoCode {
  code: string;
  discount: number;
  label: string;
}

@Injectable({ providedIn: 'root' })
export class FlightDataService {

  getFlights(): Flight[] {
    return [
      { id: 1, airline: 'IndiGo', from: 'DEL', to: 'BOM', departure: '06:00', arrival: '08:15', baseFare: 4500 },
      { id: 2, airline: 'Air India', from: 'DEL', to: 'BOM', departure: '09:30', arrival: '11:45', baseFare: 5200 },
      { id: 3, airline: 'SpiceJet', from: 'DEL', to: 'BOM', departure: '14:00', arrival: '16:10', baseFare: 3800 },
      { id: 4, airline: 'Vistara', from: 'DEL', to: 'BOM', departure: '18:45', arrival: '21:00', baseFare: 6100 },
      { id: 5, airline: 'Go First', from: 'DEL', to: 'BOM', departure: '21:30', arrival: '23:40', baseFare: 3200 },
    ];
  }

  getPromoCodes(): PromoCode[] {
    return [
      { code: 'MMT500', discount: 500, label: '₹500 off on all flights' },
      { code: 'FLYAWAY', discount: 300, label: '₹300 off on domestic flights' },
    ];
  }

  /** Returns discount amount for a given code, 0 if invalid */
  getDiscount(code: string): number {
    const promo = this.getPromoCodes().find(p => p.code === code.toUpperCase());
    return promo?.discount ?? 0;
  }
}
