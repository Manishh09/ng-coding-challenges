# Challenge 13: Duplicate Project Name Validator - Solution Guide

## 🎓 Solution Overview

This guide walks you through implementing a custom synchronous validator for duplicate name checking. The solution demonstrates validator factory patterns, normalization strategies, and dynamic validator updates for create/edit mode handling.

## 📁 File Structure

```
challenge-13-duplicate-project-name-validator/
├── components/
│   └── project-form/
│       ├── project-form.component.ts
│       ├── project-form.component.html
│       └── project-form.component.scss
├── validators/
│   └── duplicate-name.validator.ts
├── models/
│   └── project.model.ts
├── services/
│   └── project.service.ts
└── docs/
    ├── CH-13-REQUIREMENT.md
    └── CH-13-SOLUTION_GUIDE.md
```

## 🔧 Step-by-Step Implementation

### Step 1: Create Model Interfaces

**File**: `models/project.model.ts`

Define TypeScript interfaces for type safety:

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

export interface ValidationContext {
  existingNames: string[];
  currentProjectId?: string;
  mode: 'create' | 'edit';
}
```

**Key Concepts:**
- `Project`: Complete entity with system-generated fields
- `ProjectFormData`: User input without system fields
- `ValidationContext`: Metadata for validator configuration

---

### Step 2: Implement Normalization Logic

**File**: `validators/duplicate-name.validator.ts`

Create the normalization function first:

```typescript
export function normalizeProjectName(name: string): string {
  if (!name) return '';
  
  return name
    .toLowerCase()              // Case-insensitive
    .trim()                     // Remove leading/trailing whitespace
    .replace(/[\s-]+/g, '-')    // Replace spaces/hyphens with single hyphen
    .replace(/^-+|-+$/g, '');   // Remove leading/trailing hyphens
}
```

**Why Normalization?**
- Ensures consistent comparison regardless of user input format
- Handles common variations: case, whitespace, punctuation
- Makes validation predictable and transparent

**Examples:**
```typescript
normalizeProjectName("Project Alpha")      // "project-alpha"
normalizeProjectName("PROJECT   ALPHA")    // "project-alpha"
normalizeProjectName("project-alpha")      // "project-alpha"
normalizeProjectName("  Project - Alpha ") // "project-alpha"
```

---

### Step 3: Create Custom Validator Function

**File**: `validators/duplicate-name.validator.ts` (continued)

Implement the validator factory:

```typescript
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function duplicateNameValidator(
  existingNames: string[],
  currentProjectName?: string
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    
    // No validation if empty (let required validator handle this)
    if (!value) {
      return null;
    }

    const normalizedValue = normalizeProjectName(value);
    
    // Normalize existing names for comparison
    const normalizedExisting = existingNames
      .filter(name => {
        // Exclude current project name in edit mode
        if (currentProjectName) {
          return normalizeProjectName(name) !== normalizeProjectName(currentProjectName);
        }
        return true;
      })
      .map(name => normalizeProjectName(name));

    // Check if normalized name already exists
    const isDuplicate = normalizedExisting.includes(normalizedValue);

    if (isDuplicate) {
      // Find the actual matching name
      const matchingName = existingNames.find(
        name => normalizeProjectName(name) === normalizedValue
      );

      return {
        duplicateName: {
          value: control.value,
          existingName: matchingName,
          normalizedValue: normalizedValue,
          message: `Project name "${control.value}" already exists (matches "${matchingName}")`
        }
      };
    }

    return null;
  };
}
```

**Validator Pattern Breakdown:**

1. **Factory Function**: `duplicateNameValidator(...)` returns a `ValidatorFn`
   - Allows passing configuration (existingNames, currentProjectName)
   - Creates closure over configuration parameters

2. **ValidatorFn Signature**: `(control: AbstractControl) => ValidationErrors | null`
   - Receives form control as parameter
   - Returns `null` if valid, error object if invalid

3. **Empty Value Handling**:
   ```typescript
   if (!value) return null;
   ```
   - Allows `required` validator to handle empty values separately
   - Follows single responsibility principle

4. **Edit Mode Exclusion**:
   ```typescript
   .filter(name => {
     if (currentProjectName) {
       return normalizeProjectName(name) !== normalizeProjectName(currentProjectName);
     }
     return true;
   })
   ```
   - Excludes current project's name when in edit mode
   - Prevents false positive when user doesn't change name

5. **Error Object Structure**:
   ```typescript
   {
     duplicateName: {          // Error key
       value: '...',           // Original input
       existingName: '...',    // Matching existing name
       normalizedValue: '...', // Normalized form
       message: '...'          // User-friendly message
     }
   }
   ```

---

### Step 4: Create Project Service with Signals

**File**: `services/project.service.ts`

Implement state management with Angular Signals:

```typescript
import { Injectable, signal, computed } from '@angular/core';
import { Project, ProjectFormData } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  
  // Private writable signal
  private projectsSignal = signal<Project[]>([
    {
      id: '1',
      name: 'Project Alpha',
      description: 'First project in the system',
      createdAt: new Date('2024-01-15')
    },
    // ... more initial data
  ]);

  // Public readonly signal
  public readonly projects = this.projectsSignal.asReadonly();

  // Computed signal for validator
  public readonly projectNames = computed(() => 
    this.projectsSignal().map(p => p.name)
  );

  createProject(formData: ProjectFormData): Project {
    const newProject: Project = {
      id: this.generateId(),
      name: formData.name,
      description: formData.description,
      createdAt: new Date()
    };

    this.projectsSignal.update(projects => [...projects, newProject]);
    return newProject;
  }

  // ... other CRUD methods
}
```

**Signal Patterns:**

1. **Private Writable Signal**: `projectsSignal` for internal updates
2. **Public Readonly Signal**: `projects` for component consumption
3. **Computed Signal**: `projectNames` derived from projects, auto-updates
4. **Immutable Updates**: Using spread operator in `update()`

**Why Signals?**
- Reactive: Components auto-update when data changes
- Performant: Fine-grained change detection
- Type-safe: Full TypeScript support
- Simple: No subscriptions to manage

---

### Step 5: Build Project Form Component

**File**: `components/project-form/project-form.component.ts`

Create the form component with dynamic validator updates:

```typescript
import { Component, OnInit, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectService } from '../../services/project.service';
import { duplicateNameValidator, normalizeProjectName } from '../../validators/duplicate-name.validator';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.scss'
})
export class ProjectFormComponent implements OnInit {
  projectForm!: FormGroup;
  
  // Component state with signals
  mode = signal<'create' | 'edit'>('create');
  selectedProject = signal<Project | null>(null);
  submitted = signal(false);

  // Computed values
  formTitle = computed(() => 
    this.mode() === 'create' ? 'Create New Project' : 'Edit Project'
  );
  
  normalizedPreview = computed(() => {
    const nameValue = this.projectForm?.get('name')?.value;
    return nameValue ? normalizeProjectName(nameValue) : '';
  });

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
```

**Critical Method: Dynamic Validator Update**

```typescript
private updateNameValidator(): void {
  const nameControl = this.projectForm.get('name');
  if (!nameControl) return;

  // Get current project name for edit mode exclusion
  const currentName = this.mode() === 'edit' && this.selectedProject()
    ? this.selectedProject()!.name
    : undefined;

  // Set new validators with updated configuration
  nameControl.setValidators([
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(50),
    duplicateNameValidator(this.projectService.projectNames(), currentName)
  ]);

  // Trigger re-validation
  nameControl.updateValueAndValidity();
}
```

**When to Call `updateNameValidator()`:**
1. When switching to edit mode
2. When switching to create mode
3. After creating a new project (list changed)
4. After updating a project (list changed)
5. After deleting a project (list changed)

**Mode Switching Logic:**

```typescript
switchToEditMode(project: Project): void {
  this.mode.set('edit');
  this.selectedProject.set(project);
  
  // Populate form
  this.projectForm.patchValue({
    name: project.name,
    description: project.description
  });

  // Update validator to exclude current project
  this.updateNameValidator();
}

switchToCreateMode(): void {
  this.mode.set('create');
  this.selectedProject.set(null);
  this.projectForm.reset();
  
  // Update validator to check all projects
  this.updateNameValidator();
}
```

---

### Step 6: Implement Helper Methods

**Error Checking:**

```typescript
hasError(fieldName: string, errorType: string): boolean {
  const control = this.projectForm.get(fieldName);
  return !!(control && control.hasError(errorType) && 
           (control.touched || this.submitted()));
}

getErrorMessage(fieldName: string): string {
  const control = this.projectForm.get(fieldName);
  if (!control || (!control.touched && !this.submitted())) {
    return '';
  }

  if (control.hasError('required')) {
    return `${this.getFieldLabel(fieldName)} is required`;
  }

  if (control.hasError('duplicateName')) {
    const error = control.errors?.['duplicateName'];
    return error?.message || 'This project name already exists';
  }

  // ... other error types
  return '';
}
```

**Field Styling:**

```typescript
getFieldClass(fieldName: string): string {
  const control = this.projectForm.get(fieldName);
  if (!control) return '';

  const isTouched = control.touched || this.submitted();
  if (!isTouched) return '';
  
  return control.valid ? 'is-valid' : 'is-invalid';
}
```

---

### Step 7: Create Template with Validation Display

**File**: `components/project-form/project-form.component.html`

**Form Control with Validation:**

```html
<div class="form-group">
  <label for="name" class="form-label">
    Project Name <span class="required">*</span>
  </label>
  
  <input
    type="text"
    id="name"
    formControlName="name"
    class="form-control"
    [ngClass]="getFieldClass('name')"
    placeholder="Enter project name"
  />
  
  <!-- Normalized Preview -->
  @if (normalizedPreview() && projectForm.get('name')?.value) {
    <div class="normalized-preview">
      <small>
        <strong>Normalized:</strong> {{ normalizedPreview() }}
      </small>
    </div>
  }

  <!-- Error Message -->
  @if (shouldShowValidation('name') && getErrorMessage('name')) {
    <div class="error-message">
      <span class="error-icon">⚠</span>
      {{ getErrorMessage('name') }}
    </div>
  }

  <!-- Success Message -->
  @if (shouldShowValidation('name') && !getErrorMessage('name')) {
    <div class="success-message">
      <span class="success-icon">✓</span>
      Project name is available
    </div>
  }
</div>
```

**Projects List with Edit/Delete:**

```html
<div class="projects-grid">
  @for (project of projectService.projects(); track project.id) {
    <div class="project-card" 
         [class.selected]="selectedProject()?.id === project.id">
      <div class="project-header">
        <h4>{{ project.name }}</h4>
        <div class="project-actions">
          <button 
            type="button"
            (click)="selectProject(project)"
            title="Edit project">
            ✏️
          </button>
          <button 
            type="button"
            (click)="deleteProject(project)"
            title="Delete project">
            🗑️
          </button>
        </div>
      </div>
      <p>{{ project.description }}</p>
      <div class="project-normalized">
        <small>
          <strong>Normalized:</strong> {{ project.name | lowercase }}
        </small>
      </div>
    </div>
  }
</div>
```

---

## 🎨 Key Patterns & Best Practices

### 1. Validator Factory Pattern

**Benefits:**
- Reusable across multiple forms
- Configurable with parameters
- Testable in isolation
- Follows functional programming principles

**Example Usage:**
```typescript
// Different configurations for different forms
const userNameValidator = duplicateNameValidator(existingUserNames);
const projectValidator = duplicateNameValidator(existingProjects, currentProject);
```

### 2. Separation of Concerns

- **Validator**: Pure function, no dependencies, easy to test
- **Normalization**: Separate function, reusable
- **Service**: State management and business logic
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

## 🚀 Extension Ideas

### 1. Async Validator for API Check

```typescript
export function asyncDuplicateNameValidator(
  apiService: ProjectApiService
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) return of(null);
    
    return apiService.checkNameExists(control.value).pipe(
      debounceTime(500),
      map(exists => exists ? { duplicateName: true } : null),
      catchError(() => of(null))
    );
  };
}
```

### 2. Fuzzy Matching Warning

```typescript
function calculateSimilarity(str1: string, str2: string): number {
  // Levenshtein distance algorithm
  // Return similarity score 0-1
}

// Warn if > 80% similar
if (similarity > 0.8) {
  return {
    similarName: {
      message: `Similar to existing project: "${matchingName}"`
    }
  };
}
```

### 3. Validator Composition

```typescript
export function composeValidators(...validators: ValidatorFn[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const errors = validators
      .map(v => v(control))
      .filter(e => e !== null)
      .reduce((acc, err) => ({ ...acc, ...err }), {});
    
    return Object.keys(errors).length > 0 ? errors : null;
  };
}

// Usage
const nameValidator = composeValidators(
  Validators.required,
  Validators.minLength(3),
  duplicateNameValidator(existingNames)
);
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
