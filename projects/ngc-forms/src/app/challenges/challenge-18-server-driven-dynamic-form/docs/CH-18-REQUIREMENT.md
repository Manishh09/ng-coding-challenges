# Challenge 18: Server-Driven Dynamic Form

## 1️⃣ Problem Statement

Build a dynamic form system that renders forms from **JSON schema** with runtime validators. Instead of hardcoding forms, the structure comes from configuration at runtime.

### The Challenge

Create a component that:

- Reads a JSON schema defining form fields and validators
- Dynamically builds Angular FormGroup at runtime
- Renders different field types conditionally
- Applies validators using a factory pattern
- Shows custom error messages from the schema

### Why This Matters

**Real-world applications:**

- CMS platforms with user-defined forms
- Multi-tenant apps (different forms per customer)
- Survey/questionnaire builders
- A/B testing different form layouts
- Workflow engines with configurable steps

**Core Pattern:** Validator Factory - converting string configs (`"required"`, `"minLength"`) to Angular's `ValidatorFn`.

---

## 2️⃣ Requirements

### Models

Create TypeScript interfaces to define the schema structure:

```typescript
interface FormSchema {
  title: string;
  fields: FieldConfig[];
}

interface FieldConfig {
  name: string;
  type: 'text' | 'email' | 'number' | 'select' | 'checkbox';
  label: string;
  validators?: ValidatorConfig[];
  options?: SelectOption[];
  defaultValue?: any;
  order?: number;
}

interface ValidatorConfig {
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'min' | 'max';
  value?: any;
  message?: string;
}
```

### Services

**Optional**: Create a `FormService` to fetch schema. For this challenge, hardcode the schema in the component.

### Component

**Core functionality to implement:**

1. **Dynamic Form Builder** - Build FormGroup from JSON schema
2. **Validator Factory** - Map string validator types to Angular ValidatorFn
3. **Template with @switch** - Render different field types conditionally
4. **Error Handler** - Display custom error messages from schema

**Key Methods:**

```typescript
// Build form dynamically
buildForm() {
  this.fields.forEach(field => {
    const validators = this.getValidators(field.validators);
    group[field.name] = [field.defaultValue || '', validators];
  });
  this.dynamicForm = this.fb.group(group);
}

// Validator factory
getValidators(configs: ValidatorConfig[]): ValidatorFn[] {
  return configs.map(config => {
    switch (config.type) {
      case 'required': return Validators.required;
      case 'minLength': return Validators.minLength(config.value);
      // ... other validators
    }
  });
}
```

### JSON Schema Example

```json
{
  "title": "User Registration Form",
  "fields": [
    {
      "name": "fullName",
      "type": "text",
      "label": "Full Name",
      "validators": [
        { "type": "required", "message": "Name is required" },
        { "type": "minLength", "value": 3, "message": "Min 3 characters" }
      ]
    },
    {
      "name": "country",
      "type": "select",
      "label": "Country",
      "options": [
        { "value": "us", "label": "United States" },
        { "value": "in", "label": "India" }
      ]
    }
    // Add: email, number, checkbox fields
  ]
}
```

**Support Required:**

- **Field Types**: text, email, number, select, checkbox
- **Validators**: required, email, minLength, maxLength, min, max

---

## 3️⃣ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Angular 17+** | Framework with standalone components |
| **ReactiveFormsModule** | Dynamic form construction |
| **FormBuilder** | Build FormGroup programmatically |
| **Validators** | Built-in validation functions |
| **@switch / @for** | Control flow for conditional rendering |
| **TypeScript** | Type-safe interfaces |

---

## 4️⃣ Expected Output (Functional Flow)

### User Flow

1. **Page loads** → Form renders dynamically from JSON schema
2. **User sees fields** → Text inputs, email, number, select dropdown, checkbox (sorted by order)
3. **User interacts** → Real-time validation displays custom error messages
4. **User submits** → Form data displayed as JSON (if valid)

### Functional Requirements

**On Load:**

- FormGroup constructed with all fields from schema
- Fields sorted by `order` property
- Default values populated

**During Input:**

- Validators execute in real-time
- Custom error messages display below invalid fields
- Messages come from schema config (not hardcoded)

**On Submit:**

- Validate entire form
- Display form values as JSON if valid
- Show validation errors if invalid

### Test Verification

| Scenario | Expected Behavior |
|----------|-------------------|
| Empty required field | Shows: "Name is required" |
| Type "ab" in fullName | Shows: "Min 3 characters" |
| Invalid email format | Shows: "Invalid email" |
| Country dropdown | Renders options from schema |
| Valid form submission | Displays JSON with all values |

---

## 5️⃣ Success Criteria (Evaluation)

### Implementation Checklist

**Must Have:**

- [ ] TypeScript interfaces defined (FormSchema, FieldConfig, ValidatorConfig)
- [ ] FormGroup built dynamically from JSON schema at runtime
- [ ] Validator factory pattern implemented (string → ValidatorFn)
- [ ] 5 field types supported: text, email, number, select, checkbox
- [ ] 5+ validators: required, email, minLength, maxLength, min, max
- [ ] @switch used for conditional field rendering
- [ ] Custom error messages from schema display correctly
- [ ] Fields sorted by order property
- [ ] Form submission shows data as JSON

**Code Quality:**

- [ ] Clean, readable TypeScript with proper types
- [ ] No hardcoded error messages (all from schema)
- [ ] Proper null/undefined handling
- [ ] Reusable validator factory

### Interview Discussion

**Be ready to explain:**

| Topic | Key Points |
|-------|-----------|
| **Why dynamic forms?** | Runtime configuration, CMS platforms, multi-tenant apps, no redeployment needed |
| **Validator factory** | Maps strings to ValidatorFn, decouples schema from Angular, easily extensible |
| **Trade-offs** | Flexibility vs type safety, small runtime cost, security requires server validation |
| **When NOT to use** | Stable forms should use traditional reactive forms (simpler, type-safe) |

### Time Expectation

⏱️ **30-45 minutes** for complete implementation

### Bonus (Optional)

- Pattern validator (regex)
- Conditional field visibility
- Async validators
- Component-per-field architecture
