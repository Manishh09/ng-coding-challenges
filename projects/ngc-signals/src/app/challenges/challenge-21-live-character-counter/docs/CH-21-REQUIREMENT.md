# Challenge 21: X (Twitter) — Post Composer

**Estimated Time:** 20-30 minutes  
**Difficulty:** Beginner

## 1. Challenge 🎯

**Scenario:**  
You're on X's (Twitter) web team. Build the post composer box with a live character counter, progress ring, and post-strength indicator using signals and `computed()`.

**Task:**  
X's post composer is one of the most recognisable UI patterns — a textarea with a live countdown, a circular progress ring that shifts from green to amber to red, and a disabled Post button until valid content exists. Bind a signal to the textarea, chain multiple `computed()` signals from it, and use `effect()` to trigger a warning when the limit is nearly breached.

## 2. Requirements 📋

* [ ] **Character Tracking**: Create `signal<string>('')` bound to a textarea — compute `charsUsed`, `charsRemaining` (max 280), `percentageUsed`, `isNearLimit` (>80%), and `isOverLimit` (>100%) — prevent post beyond 280 chars.
* [ ] **Progress Ring**: Render a circular SVG progress ring whose stroke changes color: teal (0–79%) → amber (80–99%) → red (100%) — driven entirely by computed signals, no manual DOM manipulation.
* [ ] **Telemetry Effect**: Implement `effect()` that fires a console warning when `percentageUsed` crosses 90% — simulating X's internal telemetry that tracks composer engagement drop-off.
* [ ] **Post Strength**: Add a `postStrength` computed returning `'too short'` (<10 chars) | `'good'` (10–200) | `'long'` (>200) — display as a label beneath the composer; disable the "Post" button when content is empty or over limit.

## 3. Expected Output 🖼️

| User Action | Result |
|-------------|--------|
| Type in textarea | Character count updates live |
| Type past 224 chars (>80%) | Ring turns amber, `isNearLimit` true |
| Type past 280 chars (>100%) | Ring turns red, Post button disabled |
| Type < 10 chars | Strength shows "too short" |
| Type 10–200 chars | Strength shows "good" |
| Type > 200 chars | Strength shows "long" |
| Cross 90% threshold | Console warning fires |
| Clear textarea | Resets all counters to initial state |

**Visual Feedback:**

* **Progress Ring**: Circular SVG that fills as characters are typed — teal → amber → red.
* **Remaining Count**: Appears inside the ring when near limit.
* **Strength Label**: Color-coded badge beneath the composer.

## 4. Edge Cases / Constraints ⚠️

* **Over-limit typing**: Users *can* keep typing past 280, but the Post button must disable and the ring turns red.
* **Empty content**: Post button disabled when `charsUsed === 0`.
* **Percentage rounding**: Use `Math.round()` for percentageUsed display.
* **SVG stroke-dashoffset**: Progress must animate smoothly via CSS transitions, not JS timers.
* **Effect firing**: `effect()` runs on every change where condition is met — not just the first crossing.

## 5. Success Criteria ✅

* [ ] `signal<string>('')` is the single source signal for textarea content.
* [ ] At least 5 `computed()` signals chain from it: `charsUsed`, `charsRemaining`, `percentageUsed`, `isNearLimit`, `isOverLimit`.
* [ ] `postStrength` computed returns correct category based on length.
* [ ] SVG ring color changes reactively at 80% and 100% thresholds.
* [ ] `effect()` logs warning when >= 90%.
* [ ] Post button disabled when empty or over limit.
* [ ] No RxJS — only signal primitives are used.

### Key Concepts

| Concept | Example |
|---------|---------|
| Chained computed | `charsUsed → percentageUsed → isNearLimit` |
| Conditional effect | `effect(() => { if (pct >= 90) warn() })` |
| Template class binding | `[class.over-limit]="isOverLimit()"` |
| SVG data binding | `[attr.stroke-dashoffset]="offset()"` |
