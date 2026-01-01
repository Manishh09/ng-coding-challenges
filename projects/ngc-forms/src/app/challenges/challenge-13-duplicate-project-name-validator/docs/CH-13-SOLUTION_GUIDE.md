# Solution: Custom Validators

## 🧠 Approach
A custom validator is just a function that takes a `AbstractControl` and returns `null` (valid) or an Error Object (invalid).
To pass parameters (like a list of existing names), we wrap it in a Factory Function.
`Factory(names) -> ValidatorFn(control)`

## 🚀 Step-by-Step Implementation

### Step 1: The Validator Factory
```typescript
export function uniqueNameValidator(existingNames: string[], currentName?: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null; // Let 'required' validator handle empty cases

    const normalize = (str: string) => str.trim().toLowerCase();
    const input = normalize(value);
    
    // Check if duplicate exists
    const duplicate = existingNames.some(name => {
      // If we are editing, ignore self
      if (currentName && normalize(name) === normalize(currentName)) {
        return false;
      }
      return normalize(name) === input;
    });

    return duplicate ? { uniqueName: true } : null;
  };
}
```

### Step 2: Component Usage
```typescript
@Component({ ... })
export class ProjectFormComponent {
  private fb = inject(FormBuilder);
  
  // Simulated Data
  existingProjects = ['Project A', 'Project B', 'Project C'];
  
  form = this.fb.group({
    name: ['', [
      Validators.required, 
      // Pass the list to our custom validator
      uniqueNameValidator(this.existingProjects)
    ]]
  });
}
```

### Step 3: Handling Edit Mode (Dynamic Validation)
If we switch to "Edit Mode" for "Project A", we need to *reconfigure* the validator to ignore "Project A".
```typescript
editProject(project: string) {
  this.form.controls.name.setValidators([
    Validators.required,
    // Pass the second argument 'currentName'
    uniqueNameValidator(this.existingProjects, project)
  ]);
  // Important: Must refresh validity after changing validators
  this.form.controls.name.updateValueAndValidity();
}
```

## 🌟 Best Practices Used
*   **Normalization**: Always trim and lowercase when comparing user input to prevent "Space" duplicates.
*   **Factory Pattern**: Allows us to inject dynamic data (the list of names) into a static validator function.
*   **Control Separation**: The validator doesn't know about the UI or Service. It just compares A to B. Pure logic.
