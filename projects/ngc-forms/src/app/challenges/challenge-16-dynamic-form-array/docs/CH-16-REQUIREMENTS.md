# Challenge 16: Dynamic FormArray (Experience Section)

**Difficulty:** 🟡 Intermediate  
**Estimated Time:** 40-50 minutes
---

## 🎯 Problem Statement

Build a **dynamic work experience form** using FormArray where users can add/remove multiple experience entries at runtime. Each entry captures company name, role, and years of experience.

### The Challenge

Create a form that:

- Manages variable-length list of work experiences
- Allows adding entries (max 5)
- Allows removing entries (min 1)
- Validates each entry independently
- Computes total years across all experiences

---

## 📋 Requirements

### 1. FormArray Structure

**Data Model:**

```typescript
interface Experience {
  company: string;
  role: string;
  years: number;
}

interface ExperienceFormData {
  experiences: Experience[];
}
```

**Form Structure:**

```
FormGroup {
  experiences: FormArray [
    FormGroup { company, role, years },  // Entry 1
    FormGroup { company, role, years },  // Entry 2
    ...
  ]
}
```

**Initial State:** Start with 1 empty entry (minimum requirement)

### 2. Dynamic Operations

| Operation | Constraint | Behavior |
|-----------|------------|----------|
| **Add Entry** | Max 5 entries | Button disabled at 5, uses `push()` |
| **Remove Entry** | Min 1 entry | Button disabled at 1, uses `removeAt(index)` |
| **Entry Counter** | Display current/max | "2 of 5 entries" |

**Key Methods:**

- `createExperienceGroup()` - Factory method for consistent FormGroup structure
- `addExperience()` - Check constraint then `push()`
- `removeExperience(index)` - Check constraint then `removeAt(index)`
- Getter: `get experiences(): FormArray { return ... as FormArray }`

### 3. Validation Rules

| Field | Validators |
|-------|------------|
| **Company** | Required, minLength(2), maxLength(100) |
| **Role** | Required, minLength(2), maxLength(50) |
| **Years** | Required, min(0.5), max(50), numeric with decimals |

**Error Handling:**

- Access nested control: `experiences.at(index)?.get(fieldName)`
- Show errors when touched or submitted
- Mark all nested controls as touched on submit if invalid

### 4. Computed Features

**Total Years Signal:**

```typescript
totalYears = computed(() => {
  return experiences.controls.reduce((sum, control) => {
    return sum + (control.get('years')?.value || 0);
  }, 0);
});
```

**Display Features:**

- Entry counter: "X of 5 entries"
- Total years: Sum across all experiences
- Success message after submission
- Reset button to restore initial state (1 empty entry)

### 5. Template Requirements

**Directives:**

- `formArrayName="experiences"` on wrapper
- `[formGroupName]="i"` dynamic binding per entry
- `@for` iteration: `@for (exp of experiences.controls; track $index; let i = $index)`
- Unique IDs: `[id]="'field-' + i"` for accessibility

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|----------|
| **FormArray** | Manage dynamic array of FormGroups |
| **FormGroup** | Structure for each experience entry |
| **FormBuilder** | Create form structure with `.array()` method |
| **Computed Signals** | Reactive calculation for total years |
| **@for control flow** | Template iteration with track expression |
| **Type Casting** | `as FormArray` for accessing array-specific methods |

**Key FormArray Methods:**

- `push(control)` - Add to array
- `removeAt(index)` - Remove from array
- `at(index)` - Access control at index
- `clear()` - Remove all
- `length` - Array size

---

## ✅ Expected Output

### User Flow

1. **Initial State** → 1 empty experience entry displayed
2. **Fill Entry** → Enter company, role, years with real-time validation
3. **Add Entry** → Click "Add Experience" (if < 5 entries)
4. **Remove Entry** → Click "Remove" button on entry (if > 1 entry)
5. **View Summary** → See entry count ("3 of 5") and total years
6. **Submit** → Validate all entries, show success or errors
7. **Reset** → Clear to initial state (1 empty entry)

### Test Scenarios

| Scenario | Expected Behavior |
|----------|-------------------|
| Start form | 1 empty entry, Add enabled, Remove disabled |
| Add 4 more entries | 5 total, Add disabled, Remove enabled |
| Remove to 1 entry | 1 total, Remove disabled, Add enabled |
| Submit with invalid | Errors shown on all invalid fields |
| Fill all valid | Total years computed, submit enabled |
| Reset form | Back to 1 empty entry |

### Validation Display

**Valid Entry:**

- ✅ Green border on inputs
- No error messages
- Contributes to total years

**Invalid Entry:**

- ❌ Red border on invalid inputs
- Error message below field: "Company is required" or "Minimum 2 characters required"
- Submit button remains disabled

---

## 🎯 Success Criteria

### Interview Discussion Topics

| Topic | Key Points |
|-------|------------|
| **FormArray vs FormGroup** | FormArray for dynamic lists, FormGroup for fixed structure |
| **Type Casting** | Why `as FormArray`? Access to `push()`, `removeAt()`, `at()` methods |
| **Factory Method** | Consistent FormGroup creation, reusable, single source of truth |
| **Nested Access** | `experiences.at(index)?.get(fieldName)` chain for nested controls |
| **Constraints** | Min/max checks before add/remove, prevent invalid state |
| **Track Expression** | `track $index` required for @for, enables efficient rendering |
| **Marking Touched** | Must iterate through FormArray, mark each nested control |

### Implementation Checklist

- [ ] FormArray created with factory method
- [ ] Getter with type casting: `get experiences(): FormArray`
- [ ] Add method with constraint check (max 5)
- [ ] Remove method with constraint check (min 1)
- [ ] Error handling for nested controls
- [ ] Template using `formArrayName="experiences"`
- [ ] Dynamic `[formGroupName]="i"` binding
- [ ] `@for` with `track $index`
- [ ] Unique IDs for accessibility: `[id]="'field-' + i"`
- [ ] Computed signal for total years
- [ ] Submit handler marks all nested controls as touched
- [ ] Reset restores to initial state (1 empty entry)

### Time Expectation

**Interview:** 5-10 minutes (explain approach, discuss patterns)  
**Implementation:** 40-45 minutes (complete working solution)
