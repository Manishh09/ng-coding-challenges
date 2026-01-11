# Challenge 17: Custom Input (ControlValueAccessor)

**Estimated Time:** 60 minutes
**Difficulty:** Expert

## 1. Challenge 🎯

**Scenario:**
You need a "branded" input component (`<app-custom-input>`) that works exactly like a standard HTML `<input>`.
It must work with `[formControl]`, `formControlName`, and `[(ngModel)]`.

**Task:**
Implement the `ControlValueAccessor` (CVA) interface to make your component compatible with Angular Forms.

## 2. Requirements 📋

* [ ] **Interface**: Implement `ControlValueAccessor`.
* [ ] **API**:
  * `writeValue`: Update the view from the model.
  * `registerOnChange`: Notify the model when the view changes.
  * `registerOnTouched`: Notify when the user blurs the input.
  * `setDisabledState`: Handle `form.disable()`.
* [ ] **Features**: Support `label`, `placeholder`, and `type`.

## 3. Expected Output 🖼️

```html
<!-- Parent Usage -->
<form [formGroup]="form">
  <app-custom-input formControlName="username" label="User"></app-custom-input>
</form>
```

* The parent form's validity should depend on the child's value.
* Disabling the parent control should visually disable the child input.

## 4. Edge Cases / Constraints ⚠️

* **ForwardRef**: You must use `forwardRef` in the providers array to handle circular dependencies during instantiation.
* **Touched**: Ensure `onTouched` is called on `blur`. If you forget this, validation messages won't show up at the right time.

## 5. Success Criteria ✅

* [ ] Component implements `ControlValueAccessor`.
* [ ] Component provides `NG_VALUE_ACCESSOR`.
* [ ] Two-way binding works.
* [ ] Validation status propagates (Valid/Invalid).
* [ ] Disabled state propagates.
