# Solution Guide — Challenge 26: Zerodha Live Market Watch

---

## 🧠 Approach

Three things to wire together:

1. **Service** — owns the mutable signal; components only get a read-only view
2. **Computed signals** — derive portfolio stats; auto-update whenever `stocks` changes
3. **Lifecycle management** — `setInterval` in `ngOnInit`, cleared in `ngOnDestroy`

---

## 🚀 Step-by-Step

### Step 1 — Model

```typescript
// models/stock.model.ts
export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
}
```

---

### Step 2 — Service with `asReadonly()`

```typescript
@Injectable({ providedIn: 'root' })
export class StockTickerService {
  private readonly _stocks = signal<Stock[]>(structuredClone(INITIAL_STOCKS));

  // Components get read-only access — they cannot call _stocks.set() directly
  readonly stocks = this._stocks.asReadonly();

  tick(): void {
    this._stocks.update(stocks =>
      stocks.map(s => {
        const change = Math.round((Math.random() - 0.48) * 30);
        return { ...s, price: s.price + change, change };
      })
    );
  }
}
```

**Why `asReadonly()`?**
It returns a `Signal<T>` (not a `WritableSignal<T>`), so TypeScript prevents callers from using `.set()` or `.update()`. Only the service's own methods can mutate state — the same encapsulation principle used in NgRx stores.

---

### Step 3 — Component with `computed()` and `OnPush`

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StockDashboardComponent implements OnInit, OnDestroy {
  private readonly ticker = inject(StockTickerService);

  readonly stocks = this.ticker.stocks;   // read-only signal from service
  readonly isLive = signal(true);

  // Derived stats — recompute automatically when stocks changes
  readonly portfolioTotal = computed(() =>
    this.stocks().reduce((sum, s) => sum + s.price, 0)
  );

  readonly gainersCount = computed(() =>
    this.stocks().filter(s => s.change > 0).length
  );

  readonly losersCount = computed(() =>
    this.stocks().filter(s => s.change < 0).length
  );
}
```

`computed()` is **lazy and cached** — it only recomputes when `stocks` actually changes, and only when a template binding reads it.

---

### Step 4 — Ticker lifecycle

```typescript
private intervalId: ReturnType<typeof setInterval> | null = null;

ngOnInit(): void {
  this.startTicker();
}

ngOnDestroy(): void {
  this.stopTicker(); // ← critical — prevents memory leak after component is destroyed
}

toggleLive(): void {
  this.isLive.update(v => !v);
  this.isLive() ? this.startTicker() : this.stopTicker();
}

private startTicker(): void {
  this.intervalId = setInterval(() => this.ticker.tick(), 1500);
}

private stopTicker(): void {
  if (this.intervalId) {
    clearInterval(this.intervalId);
    this.intervalId = null;
  }
}
```

---

### Step 5 — Template (key bindings)

```html
<!-- Stat cards -->
<span>₹{{ portfolioTotal() | number:'1.0-0' }}</span>
<span>{{ gainersCount() }}</span>
<span>{{ losersCount() }}</span>

<!-- Table row -->
@for (stock of stocks(); track stock.symbol) {
  <tr>
    <td [class.up]="stock.change > 0" [class.dn]="stock.change < 0">
      {{ stock.price | number:'1.0-0' }}
    </td>
    <td [class.up]="stock.change > 0" [class.dn]="stock.change < 0">
      {{ stock.change > 0 ? '+' : '' }}{{ stock.change }}
    </td>
  </tr>
}
```

---

## 🌟 Key Takeaways

| Pattern | Rule |
| ------- | ---- |
| `asReadonly()` | Expose service state as `Signal<T>` — prevents external mutation at the type level |
| `computed()` | Never store derived values in a plain variable — let computed() keep them in sync |
| `OnPush` + signals | Angular marks only the affected component dirty when a signal changes — no wasted CD |
| Interval cleanup | Always store the interval ID and clear it in `ngOnDestroy` |
