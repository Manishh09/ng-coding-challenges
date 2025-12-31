# Challenge 18: Server Driven Dynamic Forms

**Estimated Time:** 45-60 minutes
**Difficulty:** Expert

## 1. Challenge 🎯
**Scenario:**
Your backend returns a JSON description of a form (e.g., specific fields for a specific user type). You cannot hardcode the HTML.

**Task:**
Build a component that intakes a JSON Schema and renders a Reactive Form on the fly.

## 2. Requirements 📋
*   [ ] **Schema Driven**: Accept an array of `FieldConfig` (name, type, validators).
*   [ ] **Support Types**: Text, Select, Checkbox.
*   [ ] **Validation**: Map string validators ("required") to Angular Validators.
*   [ ] **Ordering**: Sort fields by `order` attribute.

## 3. Expected Output 🖼️
**Input JSON**:
```json
[
  { "name": "age", "type": "number", "order": 2 },
  { "name": "name", "type": "text", "order": 1, "validators": ["required"] }
]
```
**Output**:
1.  Input for Name (Required)
2.  Input for Age

## 4. Edge Cases / Constraints ⚠️
*   **Unknown Types**: If the JSON asks for "calendar", fallback to text or ignore safely.
*   **Security**: Do not use `innerHTML` blindly. Use dedicated components/templates for each field type (`@switch`).

## 5. Success Criteria ✅
*   [ ] Form is generated from JSON.
*   [ ] Reactive Forms implementation (FormGroup).
*   [ ] Validation works correctly.
*   [ ] Submission outputs a clean JSON object of values.
