# Challenge 13: Duplicate Project Name Validator

## 📋 Overview

**Difficulty**: Intermediate  
**Category**: Angular Forms - Custom Validators  
**Learning Focus**: Custom Synchronous Validators, Form Validation Patterns, Business Logic Validation

## 🎯 Objective

Implement a custom synchronous validator that prevents users from creating or updating a project with a name that already exists in the system. The validator should handle various edge cases including case-insensitive comparison, whitespace normalization, and special character handling.

## 📝 Requirements

### Core Functionality

1. **Custom Validator Implementation**
   - Create a reusable `duplicateNameValidator` function
   - Implement as a `ValidatorFn` that can be attached to form controls
   - Return appropriate `ValidationErrors` when duplicate is detected

2. **Name Normalization**
   - **Case-insensitive comparison**: "Project Alpha" = "project alpha" = "PROJECT ALPHA"
   - **Whitespace handling**: Trim leading/trailing spaces
   - **Multiple spaces**: "Project   Alpha" = "Project Alpha"
   - **Hyphen/Space equivalence**: "Project-Alpha" = "Project Alpha" = "project alpha"

3. **Edit Mode Support**
   - Allow editing a project without triggering duplicate error for its own name
   - Dynamically update validator when switching between create/edit modes
   - Pass current project name as an exclusion parameter

4. **Real-time Validation**
   - Validate as user types (after field is touched)
   - Show clear error messages immediately
   - Display normalized version of entered name for transparency

5. **Form Integration**
   - Use `ReactiveFormsModule` with `FormBuilder`
   - Combine custom validator with built-in validators (`required`, `minLength`, etc.)
   - Handle form submission with validation state checks

### User Interface Requirements

1. **Form Fields**
   - Project Name (required, 3-50 chars, custom duplicate validator)
   - Description (required, 10-200 chars)

2. **Validation Feedback**
   - Show error message when duplicate detected
   - Display normalized version of entered name
   - Visual indicators (red border for invalid, green for valid)
   - Success message when name is available

3. **Mode Toggle**
   - Button to switch between Create and Edit modes
   - In Edit mode, allow selecting a project from the list
   - Update form values when project selected
   - Clear form when switching back to Create mode

4. **Projects List**
   - Display all existing projects in cards
   - Show normalized version of each project name
   - Edit and Delete actions for each project
   - Visual indicator for currently selected project in edit mode

5. **Validation Examples Section**
   - Show valid name examples
   - Show invalid name examples (duplicates)
   - Explain normalization rules

### Technical Requirements

1. **TypeScript Interfaces**
   - `Project`: id, name, description, createdAt
   - `ProjectFormData`: name, description
   - `ValidationContext`: existingNames, currentProjectId, mode

2. **Service Layer**
   - `ProjectService` with Angular Signals for state management
   - In-memory data storage with CRUD operations
   - Computed signal for project names array
   - Methods: getProjectById, createProject, updateProject, deleteProject

3. **Validator Factory Pattern**
   - Create validator function that accepts parameters
   - Return configured ValidatorFn
   - Support dynamic validator updates

4. **Error Message Format**
   - Include original entered value
   - Show matching existing name
   - Display normalized version
   - Provide clear user-friendly message

## 🧪 Test Cases

### Validation Test Cases

1. **Exact Match**
   - Input: "Project Alpha" (exists)
   - Expected: Validation error

2. **Case Variation**
   - Input: "project alpha" (exists as "Project Alpha")
   - Expected: Validation error

3. **Whitespace Variation**
   - Input: "Project   Alpha" (exists as "Project Alpha")
   - Expected: Validation error

4. **Hyphen/Space Equivalence**
   - Input: "Project-Alpha" (exists as "Project Alpha")
   - Expected: Validation error

5. **Unique Name**
   - Input: "New Project XYZ"
   - Expected: Valid (no error)

6. **Edit Mode - Same Name**
   - Editing: "Project Alpha"
   - Input: "Project Alpha"
   - Expected: Valid (excluded from validation)

7. **Edit Mode - Different Existing Name**
   - Editing: "Project Alpha"
   - Input: "Project Beta" (exists)
   - Expected: Validation error

8. **Empty Input**
   - Input: ""
   - Expected: Required validator handles this, duplicate validator returns null

## 🎨 Design Specifications

### Visual Indicators

1. **Valid State**
   - Green border on input field
   - Green checkmark with "Project name is available" message
   - Light green background on input

2. **Invalid State**
   - Red border on input field
   - Red warning icon with specific error message
   - Light red background on input

3. **Normalized Preview**
   - Blue background box
   - Shows "Normalized: project-alpha" format
   - Displayed below name input when value exists

4. **Form Status**
   - Success alert (green) after successful create/update
   - Auto-dismiss after 3 seconds
   - Error summary at bottom of form if validation fails

## 🔧 Implementation Notes

### Normalization Function

```typescript
function normalizeProjectName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[\s-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
```

### Validator Structure

```typescript
export function duplicateNameValidator(
  existingNames: string[],
  currentProjectName?: string
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    // Implementation
  };
}
```

### Error Object Format

```typescript
{
  duplicateName: {
    value: 'entered value',
    existingName: 'matching existing name',
    normalizedValue: 'normalized-value',
    message: 'User-friendly error message'
  }
}
```

## 📚 Learning Outcomes

After completing this challenge, you will understand:

1. **Custom Validators**: How to create reusable validator functions
2. **ValidatorFn**: The signature and return type of Angular validators
3. **ValidationErrors**: How to structure and return validation error objects
4. **Dynamic Validators**: How to update validators at runtime based on context
5. **Normalization**: Techniques for comparing user input consistently
6. **Business Logic**: Implementing domain-specific validation rules
7. **Edit Mode Patterns**: Handling validation differently in create vs edit scenarios
8. **Validator Composition**: Combining multiple validators on a single control

## 🚀 Extension Ideas (Optional)

1. **Async Validator**: Simulate API call to check name uniqueness
2. **Debouncing**: Add delay before validation triggers
3. **Similar Names Warning**: Suggest when name is similar but not exact duplicate
4. **Custom Error Display**: Create reusable error component
5. **Cross-field Validation**: Validate name + category combination
6. **Validator Composition**: Create compound validators combining multiple rules

## 📖 References

- [Angular Reactive Forms Documentation](https://angular.io/guide/reactive-forms)
- [Angular Form Validation Guide](https://angular.io/guide/form-validation)
- [Custom Validators](https://angular.io/guide/form-validation#custom-validators)
- [ValidatorFn](https://angular.io/api/forms/ValidatorFn)
- [ValidationErrors](https://angular.io/api/forms/ValidationErrors)
