# Challenge 18: Server-Driven Dynamic Form

## 🎯 Overview
Build a dynamic form system that renders forms from JSON schema at runtime. This challenge demonstrates how to construct FormGroups dynamically, implement a validator factory pattern, and conditionally render different field types based on server-provided configuration.

## 📚 What You'll Learn
- Build forms dynamically from JSON configuration
- Implement validator factory pattern for runtime validator mapping
- Map string-based configs to Angular ValidatorFn
- Render different field types conditionally with @switch
- Handle form submission with dynamic structure
- Apply scalability patterns for schema-driven UI
- Understand trade-offs between flexibility and type safety

## 🏗️ Project Structure

```
challenge-18-server-driven-dynamic-form/
├── models/
│   └── form-schema.model.ts          # JSON schema interfaces
├── components/
│   └── dynamic-form/                 # Main dynamic form component
│       ├── dynamic-form.component.ts
│       ├── dynamic-form.component.html
│       ├── dynamic-form.component.scss
│       └── dynamic-form.component.spec.ts
└── docs/
    ├── CH-18-REQUIREMENT.md          # Detailed requirements
    └── CH-18-SOLUTION_GUIDE.md       # Step-by-step solution guide
```

## 🔑 Key Concepts

### Server-Driven Forms
Forms generated at **runtime** from JSON schema rather than being hardcoded. The form structure, fields, validators, and error messages come from a server or configuration file.

### Validator Factory Pattern
The core pattern for dynamic forms - converting string-based validator configurations to Angular's `ValidatorFn`:

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

### Dynamic FormGroup Construction
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

## 🚀 Features

### JSON Schema Structure
```typescript
{
  title: "User Registration Form",
  fields: [
    {
      name: "fullName",
      type: "text",
      label: "Full Name",
      required: true,
      validators: [
        { type: "required", message: "Name is required" },
        { type: "minLength", value: 3, message: "Min 3 characters" }
      ],
      order: 1
    },
    // More fields...
  ]
}
```

### Supported Field Types
- ✅ **text** - Standard text input
- ✅ **email** - Email input with validation
- ✅ **number** - Numeric input with min/max
- ✅ **select** - Dropdown with options
- ✅ **checkbox** - Boolean toggle

### Supported Validators
- ✅ **required** - Field must have value
- ✅ **email** - Email format validation
- ✅ **minLength** - Minimum string length
- ✅ **maxLength** - Maximum string length
- ✅ **min** - Minimum numeric value
- ✅ **max** - Maximum numeric value

### Custom Error Messages
Error messages defined in JSON schema:
```typescript
validators: [
  { type: "minLength", value: 3, message: "Name must be at least 3 characters" }
]
```

## 📖 Documentation

- **[Requirement Document](./docs/CH-18-REQUIREMENT.md)**: Detailed challenge requirements, acceptance criteria, and test scenarios
- **[Solution Guide](./docs/CH-18-SOLUTION_GUIDE.md)**: Step-by-step implementation guide with explanations, best practices, and interview talking points

## 🧪 Running Tests

```bash
# Run all tests
npm test

# Run tests for dynamic form component
npm test -- --include='**/dynamic-form.component.spec.ts'
```

## 💡 Usage Example

```html
<!-- Template automatically renders all fields from schema -->
<form [formGroup]="dynamicForm">
  @for (field of fields; track field.name) {
    <div class="form-field">
      <label>{{ field.label }}</label>
      
      @switch (field.type) {
        @case ('text') {
          <input type="text" [formControlName]="field.name">
        }
        @case ('select') {
          <select [formControlName]="field.name">
            @for (opt of field.options; track opt.value) {
              <option [value]="opt.value">{{ opt.label }}</option>
            }
          </select>
        }
        // Other field types...
      }
      
      @if (shouldShowError(field.name)) {
        <div class="error">{{ getErrorMessage(field.name) }}</div>
      }
    </div>
  }
</form>
```

## 🎓 Interview Preparation

### Common Questions

1. **Why use dynamic forms instead of traditional reactive forms?**
   - CMS platforms where admins create forms
   - Multi-tenant apps with custom forms per tenant
   - A/B testing different form structures
   - Survey tools with user-created forms
   - Workflow engines with process-driven forms

2. **What is the validator factory pattern?**
   - Maps string-based validator configs to Angular ValidatorFn
   - Enables runtime validator construction
   - Scalable - adding validators is one new case
   - Decouples schema from Angular implementation

3. **What are the trade-offs?**
   - **Pro**: Maximum flexibility, runtime form changes
   - **Con**: Loss of TypeScript type safety
   - **Pro**: Reusable schemas across platforms
   - **Con**: Small runtime performance cost
   - **Pro**: Perfect for user-generated forms
   - **Con**: More complex testing and debugging

## 🏆 Learning Outcomes

After completing this challenge, you will be able to:
- ✅ Build forms dynamically from JSON at runtime
- ✅ Implement validator factory pattern
- ✅ Map string configs to Angular validators
- ✅ Conditionally render field types
- ✅ Display custom error messages from schema
- ✅ Handle form submission with dynamic structure
- ✅ Discuss dynamic form patterns in interviews

## 📚 Use Cases

### Real-World Applications
- **Admin Panels**: Configurable forms for content management
- **Survey Platforms**: User-created questionnaires
- **Multi-tenant SaaS**: Custom forms per customer
- **Workflow Engines**: Process-driven data collection
- **A/B Testing**: Test different form structures
- **Mobile Apps**: Shared schemas across platforms

## ⏱️ Estimated Time
**30-45 minutes** (interview-focused implementation)

---

**Difficulty**: Advanced  
**Category**: Angular Forms  
**Tags**: Dynamic Forms, JSON Schema, FormBuilder, Runtime Form Construction, Validator Factory, Schema-Driven UI, Scalability Patterns
