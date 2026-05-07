# Challenge 26: Zerodha — Live Market Watch

**Category:** Angular Signals | **Difficulty:** Intermediate | **Time:** 30–45 min

---

## 🎯 Scenario

You're on Zerodha's frontend team. Build the live market watch dashboard — prices tick every 1.5 seconds. The component must derive portfolio stats reactively using `computed()` and use `ChangeDetectionStrategy.OnPush` so Angular only re-checks the view when a signal it reads actually changes.

---

## 📋 Requirements

### 1 — Stock Model

```typescript
export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;  // price delta from last tick
}
```

### 2 — StockTickerService

| Member | Type | Purpose |
| ------ | ---- | ------- |
| `_stocks` (private) | `signal<Stock[]>` | Mutable source of truth — 4 stocks |
| `stocks` (public) | `Signal<Stock[]>` readonly | Components can read but not mutate |
| `tick()` | method | Updates every stock price with a small random change via `update()` |

**Seed data (4 stocks):**

| Symbol   | Company             | Start Price |
| -------- | ------------------- | ----------- |
| RELIANCE | Reliance Industries | ₹2450       |
| TCS      | Tata Consultancy    | ₹3890       |
| INFY     | Infosys Ltd         | ₹1780       |
| WIPRO    | Wipro Ltd           | ₹550        |

### 3 — StockDashboardComponent

**Signals & Computeds:**

| Name             | Type              | Logic                            |
| ---------------- | ----------------- | -------------------------------- |
| `stocks`         | Signal (from svc) | `ticker.stocks`                  |
| `isLive`         | `signal<boolean>` | Tracks whether ticker is running |
| `portfolioTotal` | `computed`        | Sum of all `stock.price`         |
| `gainersCount`   | `computed`        | Count where `change > 0`         |
| `losersCount`    | `computed`        | Count where `change < 0`         |

**Change Detection:**

```typescript
changeDetection: ChangeDetectionStrategy.OnPush
```

**Lifecycle:**

- `ngOnInit` — start `setInterval(() => ticker.tick(), 1500)`
- `ngOnDestroy` — clear the interval (no memory leaks)
- **Pause / Resume** button that toggles `isLive` and starts/stops the interval

### 4 — Template

Display:

- **Header** — brand logo + Pause/Resume button with a pulsing live indicator
- **3 stat cards** — Portfolio Total, Gainers (▲), Losers (▼) — all from computed signals
- **Stock table** — Symbol, Company, Price, Change — with green/red colour for positive/negative change

---

## 💡 Key Concepts

| Concept | What it solves |
| ------- | -------------- |
| `signal.asReadonly()` | Service exposes state as read-only — only the service can mutate it |
| `computed()` | Derives stats from live prices automatically — lazy, cached, no manual wiring |
| `ChangeDetectionStrategy.OnPush` | Angular skips CD for this component unless a signal it reads changes |
| `setInterval` + `ngOnDestroy` | Live ticker pattern — always clean up to prevent memory leaks |

---

## ✅ Success Criteria

- [ ] `StockTickerService` holds prices in a private signal and exposes `asReadonly()`
- [ ] `portfolioTotal`, `gainersCount`, `losersCount` are all `computed()` signals
- [ ] Component uses `ChangeDetectionStrategy.OnPush`
- [ ] Interval is cleared in `ngOnDestroy`
- [ ] Pause/Resume button correctly starts and stops the ticker
- [ ] Table rows show ▲ green / ▼ red for price direction
