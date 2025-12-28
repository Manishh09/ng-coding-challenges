# Challenge 13: Duplicate Project Name Validator - Solution Guide

## 📋 Overview

This guide shows how to implement a **custom synchronous validator** with name normalization and edit mode support. The validator factory pattern enables dynamic configuration for context-aware validation.

**Folder Structure:**

```
challenge-13/
├── models/project.model.ts
├── validators/duplicate-name.validator.ts
├── services/project.service.ts
└── components/project-form/
    ├── project-form.component.ts
    ├── project-form.component.html
    └── project-form.component.scss
```

---

## 🔧 Implementation Steps

### Step 1: Define Models

**File**: `models/project.model.ts`

```typescript
export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
}

export interface ProjectFormData {
  name: string;
  description: string;
}
```

### Step 2: Custom Validator Factory

**File**: `validators/duplicate-name.validator.ts` (continued)

```typescript
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function duplicateNameValidator(
  existingNames: string[],
  currentProjectName?: string
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null; // Let required validator handle empty
    
    const inputValue = control.value.toLowerCase().trim();
    
    // Check against existing names (excluding current in edit mode)
    const duplicate = existingNames.find(name => {
      const nameMatch = name.toLowerCase().trim() === inputValue;
      const notCurrent = !currentProjectName || 
                         name.toLowerCase().trim() !== currentProjectName.toLowerCase().trim();
      return nameMatch && notCurrent;
    });
    
    if (duplicate) {
      return {
        duplicateName: {
          value: control.value,
          existingName: duplicate,
          message: `Project name "${control.value}" already exists (matches "${duplicate}")`
        }
      };
    }
    
    return null;
  };
}
```

**Key Concepts:**

- **Factory Pattern**: Returns configured ValidatorFn
- **Edit Mode**: Exclude current name via `currentProjectName` parameter
- **Error Object**: Includes original value, matching name, message

### Step 3: Project Service with Signals

**File**: `services/project.service.ts`

```typescript
import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private projectsSignal = signal<Project[]>([
    { id: '1', name: 'Project-Alpha', description: '...', createdAt: new Date() },
    // ... initial data
  ]);

  // Public readonly signal for component consumption
  public readonly projects = this.projectsSignal.asReadonly();
  
  // Computed signal for project names array (for validator)
  public readonly projectNames = computed(() =>
    this.projectsSignal().map(p => p.name)
  );
}
```

**Key Points:**
- `projects` - Readonly signal for displaying project list in template
- `projectNames` - Computed signal that extracts names for validator
- **Signal Benefits**: Reactive updates, computed values, no subscriptions needed

### Step 4: Component Setup

**File**: `components/project-form/project-form.component.ts`

```typescript
export class ProjectFormComponent implements OnInit {
  projectForm!: FormGroup;
  mode = signal<'create' | 'edit'>('create');
  selectedProject = signal<Project | null>(null);

  constructor(
    private fb: FormBuilder,
    public projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.projectForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        duplicateNameValidator(this.projectService.projectNames())
      ]],
      description: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(200)
      ]]
    });
  }
}
        duplicateNameValidator(this.projectService.projectNames())
      ]],
      description: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(200)
      ]]
    });
  }
}
```

### Step 5: Dynamic Validator Updates

**Critical**: Update validator when mode changes or projects list changes

```typescript
private updateNameValidator(): void {
  const nameControl = this.projectForm.get('name');
  if (!nameControl) return;

  const currentName = this.mode() === 'edit' && this.selectedProject()
    ? this.selectedProject()!.name
    : undefined;

  nameControl.setValidators([
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(50),
    duplicateNameValidator(this.projectService.projectNames(), currentName)
  ]);

  nameControl.updateValueAndValidity();
}

 
```

---

## 🔄 Flow Summary

**User Action** → Enter project name → Validator checks against existing names (case-insensitive) → Show real-time feedback (valid/duplicate)

---

## 💡 Interview Discussion Points

### Custom Validator Pattern
"Factory function returns ValidatorFn configured with parameters (existingNames, optionally currentName for edit scenarios). Enables context-aware validation - same validator, different configuration."

### Case-Insensitive Comparison
"Use `toLowerCase().trim()` for consistent comparison. 'Project-Alpha' matches 'project alpha' but user sees the actual duplicate name in error message."

### Signals for Reactive Data
"Service uses signals for projects list. Computed signal `projectNames` automatically updates when projects change. No manual subscriptions needed."

---

## ⚠️ Common Pitfalls

| Issue | Solution |
|-------|----------|
| Case sensitivity issues | Use `.toLowerCase().trim()` consistently in validator |
| Empty values trigger error | Check `!control.value` first, return null |
| Poor error messages | Include both user input and matching name in error object |
| Validation not showing | Check `touched` state or `submitted` flag in component |

---

## 🧪 Key Tests

```typescript
// Validator - Duplicate (case-insensitive)
const validator = duplicateNameValidator(['Project-Alpha', 'Project-Beta']);
expect(validator(new FormControl('project-alpha'))).not.toBeNull();
expect(validator(new FormControl('PROJECT ALPHA'))).not.toBeNull();

// Validator - Unique
expect(validator(new FormControl('New Project'))).toBeNull();
expect(validator(new FormControl('Project-Gamma'))).toBeNull();
```

---

## ✅ Implementation Checklist

- [ ] Custom validator factory with existingNames parameter
- [ ] Case-insensitive comparison (toLowerCase + trim)
- [ ] Proper ValidationErrors object with helpful message
- [ ] ProjectService with Signals (projects, projectNames)
- [ ] Form with combined validators (required, minLength, maxLength, duplicateNameValidator)
- [ ] Real-time validation feedback
- [ ] Display existing projects list in template
- [ ] Success/error messages based on validation state

---

## 🎯 Key Takeaways

✅ Custom validators are **factory functions** returning ValidatorFn  
✅ **Case-insensitive comparison** (`toLowerCase().trim()`) ensures consistent validation  
✅ **ValidationErrors object** should include helpful context (value, existingName, message)  
✅ **Computed signals** automatically derive data from source signals  
✅ **Signals** simplify reactive state management without subscriptions  
✅ Return `null` for valid, return error object for invalid
- **Component**: UI logic and user interaction

### 3. Signal-based Reactivity

```typescript
// Computed signal auto-updates when projectsSignal changes
public readonly projectNames = computed(() => 
  this.projectsSignal().map(p => p.name)
);

// Component can use this directly
duplicateNameValidator(this.projectService.projectNames())
```

### 4. Dynamic Validator Updates

**Why needed?**

- Validator is created once during form initialization
- Need to update when:
  - Switching modes (create/edit)
  - Data changes (create/update/delete)
  - Context changes (different project selected)

**How to update:**

```typescript
control.setValidators([...validators]);
control.updateValueAndValidity();
```

### 5. Error Message Strategies

**Approach 1: Component Method**

```typescript
getErrorMessage(fieldName: string): string {
  // Centralized error message logic
}
```

**Approach 2: Template Helper**

```html
@if (control.hasError('duplicateName')) {
  {{ control.errors?.['duplicateName']?.message }}
}
```

**Approach 3: Error Object with Message**

```typescript
return {
  duplicateName: {
    message: 'User-friendly message'
  }
};
```

---

## 🧪 Testing Strategy

### Unit Test: Normalization Function

```typescript
describe('normalizeProjectName', () => {
  it('should convert to lowercase', () => {
    expect(normalizeProjectName('Project Alpha')).toBe('project-alpha');
  });

  it('should trim whitespace', () => {
    expect(normalizeProjectName('  Project  ')).toBe('project');
  });

  it('should replace multiple spaces with single hyphen', () => {
    expect(normalizeProjectName('Project   Alpha')).toBe('project-alpha');
  });

  it('should treat hyphens and spaces as equivalent', () => {
    expect(normalizeProjectName('Project-Alpha')).toBe('project-alpha');
    expect(normalizeProjectName('Project Alpha')).toBe('project-alpha');
  });
});
```

### Unit Test: Validator Function

```typescript
describe('duplicateNameValidator', () => {
  const existingNames = ['Project Alpha', 'Project Beta'];

  it('should return null for unique name', () => {
    const validator = duplicateNameValidator(existingNames);
    const control = new FormControl('New Project');
    expect(validator(control)).toBeNull();
  });

  it('should return error for exact duplicate', () => {
    const validator = duplicateNameValidator(existingNames);
    const control = new FormControl('Project Alpha');
    const result = validator(control);
    expect(result).not.toBeNull();
    expect(result?.['duplicateName']).toBeDefined();
  });

  it('should detect case-insensitive duplicate', () => {
    const validator = duplicateNameValidator(existingNames);
    const control = new FormControl('project alpha');
    expect(validator(control)).not.toBeNull();
  });

  it('should exclude current project in edit mode', () => {
    const validator = duplicateNameValidator(existingNames, 'Project Alpha');
    const control = new FormControl('Project Alpha');
    expect(validator(control)).toBeNull();
  });
});
```

### Component Test: Mode Switching

```typescript
describe('ProjectFormComponent', () => {
  it('should switch to edit mode and populate form', () => {
    const project = { id: '1', name: 'Test', description: 'Desc' };
    component.switchToEditMode(project);
    
    expect(component.mode()).toBe('edit');
    expect(component.selectedProject()).toEqual(project);
    expect(component.projectForm.get('name')?.value).toBe('Test');
  });

  it('should update validator when switching modes', () => {
    spyOn<any>(component, 'updateNameValidator');
    component.switchToEditMode(testProject);
    expect(component['updateNameValidator']).toHaveBeenCalled();
  });
});
```

---

## 💡 Common Pitfalls & Solutions

### Pitfall 1: Validator Not Updating

**Problem**: Validator still uses old list of names after creating project

**Solution**: Call `updateNameValidator()` after any CRUD operation

```typescript
onSubmit(): void {
  if (this.mode() === 'create') {
    this.projectService.createProject(formData);
    this.updateNameValidator(); // ← Critical!
  }
}
```

### Pitfall 2: False Positive in Edit Mode

**Problem**: Can't save edited project because it matches itself

**Solution**: Pass current project name to validator

```typescript
duplicateNameValidator(
  this.projectService.projectNames(),
  this.selectedProject()?.name // ← Exclude current project
)
```

### Pitfall 3: Empty Value Causes Confusion

**Problem**: Duplicate validator shows error when field is empty

**Solution**: Return `null` for empty values, let `required` handle it

```typescript
if (!value) {
  return null; // Let required validator handle empty
}
```

### Pitfall 4: Validation Not Showing

**Problem**: Error message doesn't appear even when invalid

**Solution**: Check touched state or submitted flag

```typescript
shouldShowValidation(fieldName: string): boolean {
  const control = this.projectForm.get(fieldName);
  return !!(control && (control.touched || this.submitted()));
}
```

---

## 📚 Key Takeaways

1. **Custom validators are factory functions** that return `ValidatorFn`
2. **Normalization is critical** for consistent comparison
3. **Dynamic validator updates** enable context-aware validation
4. **Edit mode requires special handling** to exclude current entity
5. **Signals simplify reactivity** and automatic updates
6. **Separation of concerns** makes code testable and maintainable
7. **Error objects should be descriptive** for better UX
8. **Always trigger validation updates** after changing validator configuration

## 🎯 Success Criteria Checklist

- ✅ Custom validator function implemented
- ✅ Normalization handles case, whitespace, hyphens
- ✅ Edit mode excludes current project from validation
- ✅ Real-time validation with immediate feedback
- ✅ Clear error messages with matched name displayed
- ✅ Normalized preview shows transformation
- ✅ Mode toggle switches between create/edit
- ✅ Form integrates with built-in validators
- ✅ Projects list with CRUD operations
- ✅ Visual indicators for valid/invalid states
- ✅ Success messages after operations
- ✅ Validation examples section for user guidance

---

**Congratulations!** You've implemented a production-ready custom validator with advanced features. This pattern is applicable to many real-world scenarios like username validation, email uniqueness, product SKU checking, and more.
