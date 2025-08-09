# Why Use Challenge Categories as Applications?

In a large-scale Angular monorepo like ours, organizing challenges into **application categories** (e.g., `ngc-rxjs`, `ngc-signals`, etc.) provides a scalable and maintainable structure.

This section outlines the key reasons and benefits behind this architectural choice.

---

## ✅ Benefits of Categorizing Challenges into Applications

### 1. **Separation of Concerns**
Each category app (e.g., `ngc-rxjs`) represents a focused domain, such as RxJS patterns, Angular Signals, Forms, Routing, etc. This separation ensures that:
- Related challenges are grouped logically.
- Shared imports, utilities, and styles remain scoped to the category.

---

### 2. **Improved Build Performance (with Nx)**
Nx optimizes the build and test process using affected commands. By splitting challenges into multiple apps:
- Only the affected category app is built/tested/linted.
- Reduces CI/CD time and improves developer feedback loop.

---

### 3. **Category-Specific Configurations**
Each app can have its own:
- `angular.json` build options
- Custom environment files
- Styling strategy (e.g., Tailwind for one, SCSS for another)
- Shared routing, state management

This is not easily achievable with a single app holding hundreds of unrelated components.

---

### 4. **Scalability & Maintenance**
As the number of challenges grows:
- A single app becomes bloated and harder to maintain.
- Categorized apps reduce noise and improve focus per domain.

Example:
```
projects/
  ngc-rxjs/
    01-async-data-fetch/
    02-parallel-api-calls/
  ngc-signals/
    01-reactive-state/
    02-computed-vs-effect/
```

---

### 5. **Lazy Loading and Deployment Flexibility**
Each app can be:
- Lazy-loaded independently if needed.
- Deployed as a standalone micro frontend or previewable module.
- Used for experiments without affecting other challenge categories.

---

### 6. **Future-Proof Structure**
Categorizing by domain sets you up for:
- Better documentation and navigation UX
- Feature toggles per category
- Easier onboarding for new contributors

---

## 🚫 Drawbacks of a Single App Holding All Challenges

| Problem                           | Impact                                       |
|----------------------------------|----------------------------------------------|
| Centralized routing clutter       | Becomes unmanageable over time              |
| Shared styles/components bloat    | Increased risk of unintentional regressions |
| Slow builds/tests                 | No support for Nx affected tooling          |
| Harder to modularize or extract   | Limited reuse and testing flexibility       |

---

## 🧩 Conclusion

By splitting challenges into **domain-specific applications**, you gain modularity, maintainability, and speed. It’s a clean architectural practice that scales with your learning ecosystem.

> 📌 Use this structure as your base template to scale Angular practice apps effectively.
