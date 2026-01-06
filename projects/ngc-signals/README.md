# Angular Signals Challenges (ngc-signals)

A category application within the ng-coding-challenges monorepo focused on **Angular Signals** - reactive state management patterns, computed signals, effects, and signal-based architectures.

## 📋 Overview

This category contains challenges designed to help developers master Angular's Signals API introduced in Angular 16+ and enhanced in Angular 19+. Challenges cover fundamental concepts, advanced patterns, component communication, and migration strategies from RxJS.

## 🎯 Learning Objectives

- Understand core Signals API (signal, computed, effect)
- Build reactive UIs with fine-grained reactivity
- Implement component communication with signals
- Master signal-based state management patterns
- Learn when to use Signals vs RxJS Observables
- Migrate from RxJS to Signals effectively
- Optimize performance with signal-based change detection

## 📁 Structure

```
src/app/
├── challenges/                    # All challenge implementations
│   ├── challenge-XX-[name]/       # Individual challenge folder
│   │   ├── components/            # Challenge workspace components
│   │   ├── services/              # Optional services
│   │   ├── models/                # Optional TypeScript interfaces
│   │   └── docs/                  # Challenge documentation
│   │       ├── CH-XX-REQUIREMENT.md
│   │       └── CH-XX-SOLUTION_GUIDE.md
├── app.component.ts               # Root component (RouterOutlet)
├── app.config.ts                  # Application configuration
└── app.routes.ts                  # Three-level routing configuration
```

## 🚀 Getting Started

### Prerequisites
- Angular 19+
- Node.js 18+
- Basic understanding of Angular fundamentals

### Development

1. **Run the development server:**
   ```bash
   npm start ngc-signals
   # or
   ng serve ngc-signals
   ```

2. **Build the application:**
   ```bash
   npm run build ngc-signals
   # or
   ng build ngc-signals
   ```

3. **Run tests:**
   ```bash
   ng test ngc-signals
   ```

## 📚 Challenge Topics

Challenges will cover:

1. **Signal Basics**
   - Creating and updating signals
   - Reading signal values
   - Signal vs variable comparison

2. **Computed Signals**
   - Derived state
   - Memoization and performance
   - Multi-dependency computed signals

3. **Effects**
   - Side effects with signals
   - Effect cleanup
   - Effect scheduling

4. **Component Communication**
   - Input signals
   - Output with signals
   - Signal-based parent-child communication

5. **State Management**
   - Global state with signals
   - Signal stores pattern
   - Reactive services

6. **Migration Patterns**
   - RxJS to Signals migration
   - Interop between Observables and Signals
   - Best practices for hybrid approaches

7. **Performance Optimization**
   - Zone-less applications
   - OnPush with signals
   - Fine-grained reactivity

## 🔗 Integration

This category is lazy-loaded in the main shell application:

**Route:** `/challenges/angular-signals`

**Import Alias:** `@ngc-signals`

**Exported Routes:** `NGC_SIGNALS_ROUTES`

## 📖 Documentation

- [Create New Challenge](../../docs/CREATE_CHALLENGE.md)
- [Architecture Guide](../../docs/ARCHITECTURE.md)
- [Three-Level Routing](../../docs/THREE_LEVEL_ROUTING_IMPLEMENTATION.md)

## 🛠️ Tech Stack

- Angular 19+
- TypeScript
- Signals API
- Standalone Components
- SCSS

## 📝 Creating New Challenges

Use the automated script:

```bash
npm run create:challenge
# Select: ngc-signals
# Follow the prompts
```

The script will:
- Auto-assign the next sequential challenge number
- Generate folder structure
- Create component scaffolding
- Generate documentation templates

## 🤝 Contributing

Please read [CONTRIBUTING.md](../../docs/CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

---

**Category ID:** angular-signals  
**Category Order:** 5  
**Status:** Active
