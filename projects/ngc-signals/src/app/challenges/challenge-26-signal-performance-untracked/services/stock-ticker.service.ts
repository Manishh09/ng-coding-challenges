import { Injectable, signal } from '@angular/core';
import { Stock } from '../models/stock.model';

const INITIAL_STOCKS: Stock[] = [
  { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2450, change: 0 },
  { symbol: 'TCS',      name: 'Tata Consultancy',    price: 3890, change: 0 },
  { symbol: 'INFY',     name: 'Infosys Ltd',          price: 1780, change: 0 },
  { symbol: 'WIPRO',    name: 'Wipro Ltd',            price: 550,  change: 0 },
];

@Injectable({ providedIn: 'root' })
export class StockTickerService {
  private readonly _stocks = signal<Stock[]>(INITIAL_STOCKS.map(s => ({ ...s })));

  /** Read-only view exposed to components — only the service can mutate prices */
  readonly stocks = this._stocks.asReadonly();

  /** Simulate one price tick — small random fluctuation per stock */
  tick(): void {
    this._stocks.update(stocks =>
      stocks.map(s => {
        const change = Math.round((Math.random() - 0.48) * 30);
        return { ...s, price: s.price + change, change };
      })
    );
  }
}
