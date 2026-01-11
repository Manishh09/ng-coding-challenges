# Solution: Server-Driven Forms

## 🧠 Approach
We iterate over the Configuration Array to:
1.  Build the **FormGroup** logic controls.
2.  Render the **HTML** templates using `@for` and `@switch`.
We use a **Factory Pattern** to convert string validator names into actual functions.

## 🚀 Step-by-Step Implementation

### Step 1: The Build Logic
```typescript
buildForm(schema: FieldConfig[]) {
  const group: any = {};

  // 1. Sort by Order
  const sortedFields = schema.sort((a, b) => a.order - b.order);

  // 2. Loop and Create Controls
  sortedFields.forEach(field => {
    const validators = this.mapValidators(field.validators);
    group[field.name] = [field.initialValue || '', validators];
  });

  // 3. Create Group
  this.form = this.fb.group(group);
  this.fields.set(sortedFields); // Save for template
}
```

### Step 2: The Validator Factory
```typescript
mapValidators(validations: string[]): ValidatorFn[] {
  if (!validations) return [];
  
  return validations.map(v => {
    switch(v) {
      case 'required': return Validators.required;
      case 'email': return Validators.email;
      default: return Validators.nullValidator;
    }
  });
}
```

### Step 3: The Dynamic Template
```html
<form [formGroup]="form" (ngSubmit)="submit()">
  
  @for (field of fields(); track field.name) {
    <div class="field-row">
      <label>{{ field.label }}</label>
      
      @switch (field.type) {
        @case ('text') {
          <input type="text" [formControlName]="field.name">
        }
        @case ('select') {
          <select [formControlName]="field.name">
            @for (opt of field.options; track opt) {
              <option [value]="opt">{{ opt }}</option>
            }
          </select>
        }
        @case ('checkbox') {
          <input type="checkbox" [formControlName]="field.name">
        }
      }

      <!-- Error Message -->
      @if (form.get(field.name)?.invalid && form.get(field.name)?.touched) {
        <span class="error">Invalid {{ field.label }}</span>
      }
    </div>
  }

  <button>Submit</button>

</form>
```

## 🌟 Best Practices Used
*   **Validator Mapping**: Never execute raw code strings from the backend. Always map allowed keys ('required') to trusted internal functions.
*   **Template Switching**: Logic-less templates are safer. Using `@switch` allows you to strictly control which HTML elements are rendered.
*   **Touch-First Errors**: A dynamic form can feel overwhelming if all errors light up instantly. Only show errors on `touched`.
