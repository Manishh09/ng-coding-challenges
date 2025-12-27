# Challenge 16: Dynamic FormArray (Experience Section)

## 📋 Challenge Description

Create a dynamic work experience form where users can add/remove multiple experience entries. Each entry should capture company name, role, and years of experience.

## 🎯 Learning Objectives

- Master **FormArray** for managing dynamic form controls
- Handle **nested FormGroups** within FormArray
- Implement **add/remove operations** for array entries
- Apply **array constraints** (min/max entries)
- Use **computed signals** with FormArray

## 📌 Requirements

### Functional Requirements

1. **Form Structure**
   - FormArray named `experiences`
   - Each entry contains: company, role, years
   - Start with 1 empty entry (minimum requirement)

2. **Dynamic Operations**
   - ➕ **Add Entry**: Button to add new experience (max 5 entries)
   - ➖ **Remove Entry**: Button per entry to remove it (min 1 entry)
   - Add button disabled at 5 entries
   - Remove button disabled at 1 entry

3. **Validation Rules**
   - **Company**: Required, 2-100 characters
   - **Role**: Required, 2-50 characters
   - **Years**: Required, 0.5-50 (numeric, allows decimals)
   - Show validation errors below each field
   - Mark all as touched on submit if invalid

4. **Display Features**
   - Entry counter: "2 of 5 entries"
   - Computed total years across all experiences
   - Success message after submission
   - Reset button to clear form

### Technical Requirements

1. **Angular Features**
   - Standalone component
   - Reactive Forms with FormArray
   - Signals for state management
   - TypeScript interfaces for type safety

2. **Code Quality**
   - Factory method for creating FormGroups
   - FormArray getter for easy access
   - Reusable error handling methods
   - Proper type casting: `as FormArray`

3. **Template Requirements**
   - Use `formArrayName` directive
   - Iterate with `@for` over FormArray controls
   - Dynamic `[formGroupName]="index"` binding
   - Unique IDs for accessibility: `[id]="'field-' + i"`
   - Track by index for efficient rendering

## 💡 Key Concepts

### 1. FormArray Structure
```typescript
FormGroup {
  experiences: FormArray [
    FormGroup { company, role, years },
    FormGroup { company, role, years },
    ...
  ]
}
```

### 2. FormArray Operations
- **push()**: Add new FormGroup to array
- **removeAt(index)**: Remove FormGroup at index
- **at(index)**: Access FormGroup at index
- **length**: Get array length
- **clear()**: Remove all entries

### 3. Template Iteration
```html
<div formArrayName="experiences">
  @for (exp of experiences.controls; track $index; let i = $index) {
    <div [formGroupName]="i">
      <!-- fields here -->
    </div>
  }
</div>
```

## 🎨 UI/UX Requirements

1. **Visual Design**
   - Card-based layout for each entry
   - Clear entry numbering (Entry #1, Entry #2)
   - Visual separation between entries
   - Gradient buttons with hover effects

2. **User Feedback**
   - Disabled state styling for buttons
   - Error messages with icons
   - Success message with auto-dismiss
   - Form validation state indicators

3. **Responsive Design**
   - Grid layout: 3 columns on desktop (company, role, years)
   - Single column on mobile
   - Proper spacing and padding

## ⏱️ Interview Context

**Time Allocation**: 40-50 minutes

**Breakdown**:
- Understand requirements: 5 minutes
- Create model interface: 3 minutes
- Build component logic: 20 minutes
- Create template: 15 minutes
- Testing & refinement: 7 minutes

**Key Discussion Points**:
- Why FormArray vs multiple separate controls?
- How to handle array constraints?
- Type casting: Why `as FormArray`?
- Performance: Why track by index?
- When to use FormArray vs FormControl?

## 🔑 Success Criteria

✅ FormArray with nested FormGroups created correctly  
✅ Add/remove operations working with constraints  
✅ All validations applied and displaying correctly  
✅ Entry counter and total years computed accurately  
✅ Form submission handling invalid states  
✅ Reset functionality restoring initial state  
✅ Clean, maintainable code with proper types  
✅ Accessible template with unique IDs  

## 📚 Related Concepts

- **FormArray vs FormGroup**: When to use each
- **Dynamic Forms**: Building forms at runtime
- **Type Safety**: Proper TypeScript interfaces
- **Computed Signals**: Reactive calculations
- **Template Iteration**: @for with track expressions
- **Form Validation**: Field-level and form-level

## 🚀 Extension Ideas (Post-Interview)

1. **Drag & Drop**: Reorder experiences
2. **Form Persistence**: Save to localStorage
3. **Conditional Fields**: Show/hide based on experience type
4. **Nested Arrays**: Add projects array within each experience
5. **Async Validators**: Check company name against API
6. **Custom Validators**: Validate total years doesn't exceed age
