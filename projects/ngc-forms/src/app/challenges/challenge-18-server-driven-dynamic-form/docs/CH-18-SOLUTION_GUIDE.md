# Challenge 18: Solution Guide - Server-Driven Dynamic Form

## Overview

This guide shows how to build dynamic forms from JSON schema using the **validator factory pattern**. Forms are generated at runtime from configuration instead of hardcoded templates.

**Folder Structure:**
```
challenge-18/
├── models/form-schema.model.ts
└── components/dynamic-form/
    ├── dynamic-form.component.ts
    ├── dynamic-form.component.html
    └── dynamic-form.component.scss
```

---

## 🔧 Implementation Steps

### Step 1: Define Models

**File**: `models/form-schema.model.ts`

```typescript
export interface FormSchema {
  title: string;
  fields: FieldConfig[];
}

export interface FieldConfig {
  name: string;
  type: 'text' | 'email' | 'number' | 'select' | 'checkbox';
  label: string;
  validators?: ValidatorConfig[];
  options?: SelectOption[];
  defaultValue?: any;
  order?: number;
}

export interface ValidatorConfig {
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'min' | 'max';
  value?: any;
  message?: string;
}
```

### Step 2: Component Setup

**File**: `components/dynamic-form/dynamic-form.component.ts`

```typescript
export class DynamicFormComponent implements OnInit {
  dynamicForm!: FormGroup;
  fields: FieldConfig[] = [];
  
  constructor(private fb: FormBuilder) {}
  
  ngOnInit(): void {
    this.loadSchema();
    this.buildForm();
  }
}

---

### Step 3: Load & Sort Schema

```typescript
private loadSchema(): void {
  this.formSchema = MOCK_SCHEMA; // In production: HTTP call
  this.fields = this.formSchema.fields.sort((a, b) => 
    (a.order || 0) - (b.order || 0)
  );
}
```

### Step 4: Build Form Dynamically

```typescript
private buildForm(): void {
  const group: Record<string, any> = {};
  
  this.fields.forEach(field => {
    const validators = this.getValidators(field.validators || []);
    group[field.name] = [field.defaultValue || '', validators];
  });
  
  this.dynamicForm = this.fb.group(group);
}
```

**Key**: Iterate fields → get validators → create control → build FormGroup

---

### Step 5: Validator Factory (Core Pattern)

```typescript
private getValidators(configs: ValidatorConfig[]): ValidatorFn[] {
  return configs.map(config => {
    switch (config.type) {
      case 'required': return Validators.required;
      case 'email': return Validators.email;
      case 'minLength': return Validators.minLength(config.value);
      case 'maxLength': return Validators.maxLength(config.value);
      case 'min': return Validators.min(config.value);
      case 'max': return Validators.max(config.value);
      default: return Validators.nullValidator;
    }
  });
}
```

**Benefits**: Scalable (add validators easily), decouples schema from Angular, testable

---

### Step 6: Template with @switch

```html
<form [formGroup]="dynamicForm" (ngSubmit)="onSubmit()">
  @for (field of fields; track field.name) {
    <div class="form-field">
      <label>{{ field.label }}</label>
      
      @switch (field.type) {
        @case ('text') {
          <input type="text" [formControlName]="field.name" />
        }
        @case ('email') {
          <input type="email" [formControlName]="field.name" />
        }
        @case ('select') {
          <select [formControlName]="field.name">
            @for (opt of field.options; track opt.value) {
              <option [value]="opt.value">{{ opt.label }}</option>
            }
          </select>
        }
        @case ('checkbox') {
          <input type="checkbox" [formControlName]="field.name" />
        }
        // number case similar to text
      }
      
      @if (shouldShowError(field.name)) {
        <div class="error">{{ getErrorMessage(field.name) }}</div>
      }
    </div>
  }
  
  <button type="submit">Submit</button>
</form>
```

**Key**: Use `@for` to loop fields, `@switch` for field types, nested `@for` for options

---

### Step 7: Custom Error Messages

```typescript
getErrorMessage(fieldName: string): string {
  const control = this.dynamicForm.get(fieldName);
  const field = this.fields.find(f => f.name === fieldName);
  
  if (!control?.errors || !field) return '';
  
  const errorKey = Object.keys(control.errors)[0];
  const validatorConfig = field.validators?.find(v => {
    // Handle case mismatch: minlength → minLength
    return v.type.toLowerCase() === errorKey.toLowerCase();
  });
  
  return validatorConfig?.message || 'Invalid value';
}

shouldShowError(fieldName: string): boolean {
  const control = this.dynamicForm.get(fieldName);
  return control?.invalid && control?.touched || false;
}
```

### Step 8: Handle Submission

```typescript
onSubmit(): void {
  Object.keys(this.dynamicForm.controls).forEach(key => {
    this.dynamicForm.get(key)?.markAsTouched();
  });
  
  if (this.dynamicForm.valid) {
    console.log('Form Data:', this.dynamicForm.value);
    // Display or process form data
  }
}
```

---

## Flow Summary

**JSON Schema** → Load & Sort → **Validator Factory** → Build FormGroup → **Render (@switch)** → User Input → **Validation** → Show Errors → **Submit**

---

## Interview Discussion Points

### Why Dynamic Forms?
"Dynamic forms enable runtime form generation from JSON configuration. Use cases: CMS platforms (admins create forms), multi-tenant apps (custom forms per tenant), A/B testing (test structures without deployment), and workflow engines (process-driven forms)."

### Validator Factory Pattern
"Maps string configs to Angular's ValidatorFn. Example: `{ type: 'minLength', value: 3 }` → `Validators.minLength(3)`. Benefits: scalable (add validators easily), decouples schema from Angular, reusable across frameworks."

### Trade-offs
- **Flexibility**: Runtime changes without redeployment
- **Type Safety**: Form structure unknown at compile time
- **Performance**: Small runtime cost
- 🔒 **Security**: Must validate schema server-side

### When NOT to Use
"Avoid for stable forms with known structure. Traditional reactive forms are simpler and more type-safe. Use dynamic forms only when you need true runtime flexibility."

### Best Practices
- Always sort fields by order property
- Provide default values for checkboxes
- Cache parsed schemas
- Mark all controls touched on submit
- Never trust client-side validation alone

---

## Key Tests

```typescript
// Form construction
it('should build form from schema', () => {
  expect(component.dynamicForm.get('fullName')).toBeDefined();
  expect(component.fields.length).toBe(5);
});

// Field ordering
it('should sort fields by order property', () => {
  expect(component.fields[0].name).toBe('fullName');
});

// Validator application
it('should apply validators from config', () => {
  const control = component.dynamicForm.get('fullName');
  expect(control?.hasError('required')).toBe(true);
  control?.setValue('ab');
  expect(control?.hasError('minlength')).toBe(true);
});

// Custom messages
it('should display custom error messages', () => {
  const control = component.dynamicForm.get('fullName');
  control?.markAsTouched();
  expect(component.getErrorMessage('fullName')).toBe('Name is required');
});
```

---

## Common Pitfalls

| Issue | Solution |
|-------|----------|
| Fields in random order | Sort by `order` property |
| Checkbox errors on reset | Provide `defaultValue: false` |
| Validator case mismatch | Angular uses `minlength`, schema uses `minLength` |
| Type safety loss | Use type assertions carefully |

---

## Implementation Checklist

- [ ] FormSchema interfaces defined
- [ ] Validator factory maps strings to ValidatorFn
- [ ] FormGroup built dynamically from JSON
- [ ] Fields sorted by order property
- [ ] All 5 field types render (text, email, number, select, checkbox)
- [ ] Custom error messages from schema display
- [ ] Form submission works correctly
- [ ] All controls marked touched on submit

---

## Next Steps (Optional)

**Advanced features:**
- Conditional field visibility
- Async validators (server-side checks)
- Multi-page forms with stepper
- Custom field components
- Schema validation (Zod, JSON Schema)

---

## Key Takeaways

Validator factory decouples schema from Angular  
Runtime construction enables schema-driven UI  
@switch/@ for enable conditional rendering  
Trade-off: flexibility vs type safety  
Server-side validation is mandatory for security
