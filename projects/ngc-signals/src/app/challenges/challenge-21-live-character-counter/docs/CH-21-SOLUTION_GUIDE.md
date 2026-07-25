# Solution: X (Twitter) — Post Composer

## 🧠 Approach

Chain multiple `computed()` signals from a single `signal<string>` source to derive all UI state — character counts, percentage, color thresholds, and post validity. Use `effect()` for threshold-based telemetry.

**Signal dependency graph:**
```
content (signal)
  ├─ charsUsed (computed)
  │    ├─ charsRemaining (computed)
  │    ├─ percentageUsed (computed)
  │    │    ├─ isNearLimit (computed)
  │    │    ├─ isOverLimit (computed)
  │    │    └─ ringColor (computed)
  │    └─ postStrength (computed)
  └─ canPost (computed)
```

## 🚀 Step-by-Step Implementation

### Step 1: Source Signal & Textarea Binding

```typescript
content = signal<string>('');

onInput(event: Event): void {
  const value = (event.target as HTMLTextAreaElement).value;
  this.content.set(value);
}
```

```html
<textarea [value]="content()" (input)="onInput($event)"></textarea>
```

Bind via `(input)` event — not `ngModel` — to keep things signals-only with no FormsModule dependency.

### Step 2: Chain Computed Signals

```typescript
private readonly MAX_CHARS = 280;

charsUsed      = computed(() => this.content().length);
charsRemaining = computed(() => this.MAX_CHARS - this.charsUsed());
percentageUsed = computed(() => Math.round((this.charsUsed() / this.MAX_CHARS) * 100));
isNearLimit    = computed(() => this.percentageUsed() > 80);
isOverLimit    = computed(() => this.percentageUsed() > 100);
```

Each `computed()` reads other computed signals — Angular auto-tracks the dependency chain. When `content` changes, everything downstream updates.

### Step 3: Post Strength

```typescript
postStrength = computed<PostStrength>(() => {
  const len = this.charsUsed();
  if (len < 10) return 'too short';
  if (len <= 200) return 'good';
  return 'long';
});
```

### Step 4: SVG Progress Ring

```typescript
private readonly RADIUS = 18;
private readonly CIRCUMFERENCE = 2 * Math.PI * this.RADIUS;

ringColor = computed(() => {
  const pct = this.percentageUsed();
  if (pct >= 100) return '#ef4444';   // red
  if (pct >= 80)  return '#f59e0b';   // amber
  return '#14b8a6';                    // teal
});

strokeDashoffset = computed(() => {
  const pct = Math.min(this.percentageUsed(), 100);
  return this.CIRCUMFERENCE - (pct / 100) * this.CIRCUMFERENCE;
});
```

```html
<circle
  [attr.r]="radius"
  [attr.stroke]="ringColor()"
  [attr.stroke-dasharray]="circumference"
  [attr.stroke-dashoffset]="strokeDashoffset()" />
```

The SVG `stroke-dashoffset` technique draws a partial circle — reduce the offset to fill more of the ring. CSS transition on `stroke-dashoffset` makes it animate smoothly.

### Step 5: Telemetry Effect

```typescript
constructor() {
  effect(() => {
    if (this.percentageUsed() >= 90) {
      console.warn('⚠️ [Telemetry] Composer near limit:', {
        percentageUsed: this.percentageUsed(),
        charsRemaining: this.charsRemaining(),
        timestamp: new Date().toISOString()
      });
    }
  });
}
```

The `effect()` tracks `percentageUsed()` — it re-runs whenever the percentage changes, and only logs when the condition is met.

### Step 6: Conditional Template Classes

```html
<div class="composer"
  [class.near-limit]="isNearLimit() && !isOverLimit()"
  [class.over-limit]="isOverLimit()">
```

Angular's class binding reads the computed signals directly — no manual classList manipulation needed.

## 🌟 Key Takeaways

* **Chained `computed()` signals** form a dependency graph — Angular only recalculates what changed.
* **SVG stroke-dashoffset** is the standard technique for circular progress — no canvas or libraries needed.
* **`effect()` with conditions** — the effect still tracks the signal and re-runs; the `if` just guards the side-effect.
* **No FormsModule** — raw `(input)` event binding with `signal.set()` is simpler for single-field use cases.
* **CSS transitions on SVG attributes** give smooth animations for free.
