# Challenge 18: Server-Driven Dynamic Form

## 📋 Overview

Build a dynamic form system that renders forms from JSON schema with runtime validators. This challenge demonstrates how to construct FormGroups dynamically, implement a validator factory pattern, and support multiple field types based on server-provided configuration.

## 🎯 Learning Objectives

By completing this challenge, you will learn:

- ✅ Build forms dynamically from JSON configuration
- ✅ Implement validator factory pattern
- ✅ Map string-based configs to Angular ValidatorFn
- ✅ Render different field types conditionally
- ✅ Handle dynamic form submission
- ✅ Apply scalability patterns for schema-driven UI
- ✅ Understand trade-offs between flexibility and type safety

## 🔑 Key Concepts

### What is a Server-Driven Dynamic Form?

A dynamic form is generated at **runtime** from a JSON schema, rather than being hardcoded in the template. The form structure, fields, validators, and even error messages come from a server or configuration file.

### Why Use Dynamic Forms?

- ✅ **CMS Platforms**: Admin panels with configurable forms
- ✅ **Multi-tenant Apps**: Different forms per tenant/customer
- ✅ **A/B Testing**: Test different form structures
- ✅ **Survey Tools**: User-created custom forms
- ✅ **Workflow Engines**: Process-driven form generation

### Validator Factory Pattern

The core pattern: converting string-based validator configurations to Angular's `ValidatorFn`:

```typescript
private getValidators(configs: ValidatorConfig[]): ValidatorFn[] {
  return configs.map(config => {
    switch (config.type) {
      case 'required': return Validators.required;
      case 'email': return Validators.email;
      case 'minLength': return Validators.minLength(config.value);
      case 'min': return Validators.min(config.value);
      default: return Validators.nullValidator;
    }
  });
}
```

## 📝 Requirements

### Part 1: Models

Create TypeScript interfaces for type-safe schema structure:

```typescript
export interface FormSchema {
  title: string;
  description?: string;
  fields: FieldConfig[];
}

export interface FieldConfig {
  name: string;
  type: 'text' | 'email' | 'number' | 'select' | 'checkbox';
  label: string;
  placeholder?: string;
  defaultValue?: any;
  required?: boolean;
  validators?: ValidatorConfig[];
  options?: SelectOption[];  // For select fields
  order?: number;
}

export interface ValidatorConfig {
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'min' | 'max';
  value?: any;
  message?: string;
}

export interface SelectOption {
  value: string | number;
  label: string;
}
```

### Part 2: JSON Schema Example

You'll work with a hardcoded schema (simulating server response):

```json
{
  "title": "User Registration Form",
  "description": "Complete your profile",
  "fields": [
    {
      "name": "fullName",
      "type": "text",
      "label": "Full Name",
      "placeholder": "Enter your name",
      "required": true,
      "validators": [
        { "type": "required", "message": "Name is required" },
        { "type": "minLength", "value": 3, "message": "Min 3 characters" }
      ],
      "order": 1
    },
    {
      "name": "email",
      "type": "email",
      "label": "Email Address",
      "required": true,
      "validators": [
        { "type": "required", "message": "Email is required" },
        { "type": "email", "message": "Invalid email" }
      ],
      "order": 2
    },
    {
      "name": "age",
      "type": "number",
      "label": "Age",
      "validators": [
        { "type": "min", "value": 18, "message": "Must be 18+" }
      ],
      "order": 3
    },
    {
      "name": "country",
      "type": "select",
      "label": "Country",
      "required": true,
      "options": [
        { "value": "us", "label": "United States" },
        { "value": "uk", "label": "United Kingdom" },
        { "value": "in", "label": "India" }
      ],
      "order": 4
    },
    {
      "name": "subscribe",
      "type": "checkbox",
      "label": "Subscribe to newsletter",
      "defaultValue": false,
      "order": 5
    }
  ]
}
```

### Part 3: Dynamic Form Builder

Construct FormGroup at runtime:

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

### Part 4: Template with Conditional Rendering

Use `@switch` to render different field types:

```html
@for (field of fields; track field.name) {
  <div class="form-field">
    <label>{{ field.label }}</label>
    
    @switch (field.type) {
      @case ('text') {
        <input type="text" [formControlName]="field.name">
      }
      @case ('email') {
        <input type="email" [formControlName]="field.name">
      }
      @case ('number') {
        <input type="number" [formControlName]="field.name">
      }
      @case ('select') {
        <select [formControlName]="field.name">
          @for (opt of field.options; track opt.value) {
            <option [value]="opt.value">{{ opt.label }}</option>
          }
        </select>
      }
      @case ('checkbox') {
        <input type="checkbox" [formControlName]="field.name">
      }
    }
    
    @if (shouldShowError(field.name)) {
      <div class="error">{{ getErrorMessage(field.name) }}</div>
    }
  </div>
}
```

### Part 5: Custom Error Messages

Display error messages from schema configuration:

```typescript
getErrorMessage(fieldName: string): string {
  const control = this.dynamicForm.get(fieldName);
  const field = this.fields.find(f => f.name === fieldName);
  
  if (!control?.errors || !field) return '';
  
  // Find matching validator config for custom message
  const errorKey = Object.keys(control.errors)[0];
  const validatorConfig = field.validators?.find(v => 
    v.type === errorKey || 
    (errorKey === 'minlength' && v.type === 'minLength')
  );
  
  return validatorConfig?.message || 'Invalid value';
}
```

## ✅ Acceptance Criteria

- [ ] FormSchema and FieldConfig interfaces defined
- [ ] FormGroup built dynamically from JSON schema
- [ ] Validator factory maps string types to ValidatorFn
- [ ] Support 5 field types: text, email, number, select, checkbox
- [ ] Support 5 validators: required, email, minLength, min, max
- [ ] Fields sorted by order property
- [ ] Template uses @switch for field type rendering
- [ ] Select fields render options with @for loop
- [ ] Custom error messages display from schema
- [ ] Form submission shows submitted data

## 🧪 Test Scenarios

### Scenario 1: Dynamic Form Construction

1. Component initializes
2. **Expected**: FormGroup created with 5 controls
3. **Expected**: Fields sorted by order (fullName, email, age, country, subscribe)

### Scenario 2: Validator Factory

1. Set fullName to empty string
2. **Expected**: required validator applied
3. Set fullName to "ab" (2 chars)
4. **Expected**: minLength(3) validator fails

### Scenario 3: Field Type Rendering

1. Check template
2. **Expected**: Text input for fullName
3. **Expected**: Email input for email
4. **Expected**: Select dropdown for country with options
5. **Expected**: Checkbox for subscribe

### Scenario 4: Custom Error Messages

1. Touch fullName field (leave empty)
2. **Expected**: "Name is required" (from schema)
3. Type "ab" in fullName
4. **Expected**: "Min 3 characters" (from schema)

### Scenario 5: Form Submission

1. Fill all required fields
2. Click Submit
3. **Expected**: Form valid, data displayed
4. **Expected**: JSON shows all field values

## 💡 Interview Talking Points

### Why Server-Driven Forms?

"Dynamic forms enable runtime form generation based on configuration. This is critical for CMS platforms where administrators create forms, multi-tenant applications where each tenant has custom forms, or A/B testing scenarios where we test different form structures without deploying new code."

### Validator Factory Pattern

"The validator factory maps string identifiers to Angular's ValidatorFn. This decouples the schema definition from Angular's implementation, making forms truly data-driven. The factory pattern is scalable - adding a new validator is just one new case in the switch."

### Trade-offs

"**Flexibility vs Type Safety**: We gain runtime flexibility but lose some TypeScript type safety. The form structure is unknown at compile time. **Performance**: Building forms at runtime has a small initialization cost. **Validation**: Server-side schema validation is essential for security."

### When to Use Dynamic Forms?

"Use dynamic forms when form structure changes frequently, comes from external sources, or differs per user/tenant. Don't over-engineer - if your form structure is stable, traditional reactive forms are simpler and more type-safe."

## 📚 Resources

- [Angular Dynamic Forms Guide](https://angular.io/guide/dynamic-form)
- [FormBuilder API](https://angular.io/api/forms/FormBuilder)
- [Validators Documentation](https://angular.io/api/forms/Validators)

## ⏱️ Estimated Time

**30-45 minutes** (interview-focused scope)

## 🏆 Success Indicators

- ✅ FormGroup constructed from JSON at runtime
- ✅ Validator factory pattern implemented
- ✅ All 5 field types rendering correctly
- ✅ Custom error messages displaying
- ✅ Fields sorted by order property
- ✅ Form submission working
- ✅ Clean, well-commented code

## 🚀 Challenge Yourself

If you finish early:

- Add support for `pattern` validator (regex)
- Implement conditional field visibility (show field based on another field's value)
- Add async validators (e.g., username availability check)
- Create separate field component for each type
- Add form-level validators (cross-field validation)
