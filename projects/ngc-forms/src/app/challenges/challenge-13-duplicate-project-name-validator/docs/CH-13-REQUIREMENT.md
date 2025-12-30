# Challenge 13: Duplicate Project Name Validator

**Estimated Time:** 45 minutes  
**Difficulty:** Intermediate

---

## Problem Statement

Build a **custom synchronous validator** that prevents duplicate project names. The validator must handle case-insensitive comparison and support both create and edit modes.

### The Challenge

Create a reusable validator that:

- Prevents duplicate project names (case-insensitive)
- Supports edit mode (allows saving with same name)
- Shows real-time validation feedback
- Provides clear error messages

### Why This Matters

**Real-world applications:**

- Project management systems preventing duplicate entries
- User registration forms checking username availability
- Tag/category systems enforcing unique names
- Any CRUD application requiring unique identifiers

**Core Pattern:** Custom validator factory with dynamic configuration for context-aware validation.

---

## Requirements

### Models

Create TypeScript interfaces for type safety:

```typescript
interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
}

interface ProjectFormData {
  name: string;
  description: string;
}
```

### Services

**ProjectService**: Manage project state using Angular Signals

```typescript
class ProjectService {
  private projectsSignal = signal<Project[]>([]);
  projects = this.projectsSignal.asReadonly();
  projectNames = computed(() => this.projects().map(p => p.name));
  
  // Methods: create, update, delete, getById
}
```

**Key features:**

- In-memory storage with CRUD operations
- Computed signal for project names (for validator)
- Signal-based reactive state

### Component

**Core functionality to implement:**

1. **Custom Validator Factory** - Create `duplicateNameValidator(existingNames, currentName?)`
2. **Name Normalization** - Lowercase, trim, handle hyphens/spaces
3. **Form with Validators** - Combine custom + built-in validators
4. **Mode Management** - Toggle between Create/Edit modes
5. **Real-time Feedback** - Show validation status and normalized value

### Form Requirements

**Fields:**

- Project Name: required, minLength(3), maxLength(50), duplicateNameValidator
- Description: required, minLength(10), maxLength(200)

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **Angular 17+** | Framework with standalone components |
| **ReactiveFormsModule** | Form management and validation |
| **FormBuilder** | Programmatic form construction |
| **Signals** | Reactive state management |
| **Custom ValidatorFn** | Business logic validation |
| **TypeScript** | Type-safe interfaces |

---

## Expected Output (Functional Flow)

### User Flow

1. **Create Mode** → User enters project name → Validator checks for duplicates → Shows feedback
2. **Switch to Edit** → Select project from list → Form pre-fills → Same name allowed
3. **Save Project** → Validate form → Create/Update project → Show in list
4. **Delete Project** → Remove from list → Update validator context

### Validation Test Cases

| Scenario | Input | Existing Names | Expected Result |
|----------|-------|----------------|-----------------|
| Exact match | "Project Alpha" | ["Project Alpha"] | Duplicate error |
| Case variation | "project alpha" | ["Project Alpha"] | Duplicate error |

---

## Success Criteria (Evaluation)

### Implementation Checklist

**Must Have:**

- [ ] Custom `duplicateNameValidator` function implemented
- [ ] Case-insensitive comparison (lowercase, trim)
- [ ] ValidatorFn returns proper ValidationErrors object
- [ ] Support for Create mode (check all names)
- [ ] Support for Edit mode (exclude current name)
- [ ] ProjectService with Signals for state management
- [ ] Real-time validation feedback in UI
- [ ] Display normalized value to user
- [ ] Form integrates custom + built-in validators
- [ ] CRUD operations: Create, Update, Delete projects

**Code Quality:**

- [ ] Reusable validator factory pattern
- [ ] Type-safe interfaces (Project, ProjectFormData)
- [ ] Proper error object structure with helpful messages
- [ ] Clean separation: service, validator, component

### Interview Discussion

**Be ready to explain:**

| Topic | Key Points |
|-------|-----------|
| **Custom validators** | ValidatorFn signature, return ValidationErrors or null, factory pattern for configuration |
| **Edit mode pattern** | Exclude current name from validation, dynamic validator updates, passing context |
| **Error structure** | Include original value, matching name, normalized form, user-friendly message |
| **When to use** | Business logic validation, uniqueness checks, contextual rules, domain-specific requirements |

### Time Expectation

**30-45 minutes** for complete implementation

### Bonus (Optional)

- Async validator simulating API check
- Debounced validation (wait before checking)
- "Similar name" suggestions
- Custom error display component
- Cross-field validation patterns

## Learning Outcomes

After completing this challenge, you will understand:

1. **Custom Validators**: How to create reusable validator functions
2. **ValidatorFn**: The signature and return type of Angular validators
3. **ValidationErrors**: How to structure and return validation error objects
4. **Dynamic Validators**: How to update validators at runtime based on context
5. **Normalization**: Techniques for comparing user input consistently
6. **Business Logic**: Implementing domain-specific validation rules
7. **Edit Mode Patterns**: Handling validation differently in create vs edit scenarios
8. **Validator Composition**: Combining multiple validators on a single control

## Extension Ideas (Optional)

1. **Async Validator**: Simulate API call to check name uniqueness
2. **Debouncing**: Add delay before validation triggers
3. **Similar Names Warning**: Suggest when name is similar but not exact duplicate
4. **Custom Error Display**: Create reusable error component
5. **Cross-field Validation**: Validate name + category combination
6. **Validator Composition**: Create compound validators combining multiple rules

## References

- [Angular Reactive Forms Documentation](https://angular.io/guide/reactive-forms)
- [Angular Form Validation Guide](https://angular.io/guide/form-validation)
- [Custom Validators](https://angular.io/guide/form-validation#custom-validators)
- [ValidatorFn](https://angular.io/api/forms/ValidatorFn)
- [ValidationErrors](https://angular.io/api/forms/ValidationErrors)
