# Challenge 19: Unsaved Changes Guard

**Estimated Time:** 30-45 minutes  
**Difficulty:** Advanced

## 1. Challenge 🎯

**Scenario:**  
You are building a user profile form for an enterprise app. Users spend time filling out personal details, and if they accidentally navigate away, they lose all their work—leading to frustration and poor UX.

**Task:**  
Implement a **canDeactivate route guard** that prevents navigation when a form has unsaved changes, prompting the user with a confirmation dialog.

## 2. Requirements 📋

* [ ] **Guard**: Implement `canDeactivate` functional guard.
* [ ] **Interface**: Create `CanDeactivateComponent` interface for reusability.
* [ ] **Detection**: Check `form.dirty` and custom `saved` state.
* [ ] **Dialog**: Show confirmation when form has unsaved changes.
* [ ] **Navigation**:
  * Proceed if form is pristine (no changes).
  * Proceed after successful save.
  * Block and confirm if form is dirty and not saved.

## 3. Expected Output 🖼️

| User Action | Result |
|-------------|--------|
| Navigate away (pristine form) | ✅ Navigation allowed |
| Modify form → Navigate | ⚠️ Confirmation: "You have unsaved changes..." |
| Click "Cancel" | ❌ Stay on page |
| Click "OK" | ✅ Navigation proceeds |
| Save form → Navigate | ✅ Navigation allowed (no prompt) |

**Visual Feedback:**

* **Status Badge**: ⚠️ "You have unsaved changes" when `form.dirty`.
* **Success Message**: ✅ "Form saved successfully!" after save.
* **Confirmation Dialog**: Browser `confirm()` when attempting to leave.

## 4. Edge Cases / Constraints ⚠️

* **Post-Save Navigation**: After clicking "Save", the form must mark itself as `pristine` to allow navigation.
* **Browser Back Button**: Guard must intercept browser back/forward navigation.
* **Browser Refresh/Close**: Use `@HostListener('window:beforeunload')` to warn on browser close/refresh (separate from router guards).
* **Async Save**: If save is in progress, prevent navigation until complete.
* **Multiple Navigation Methods**: Must work with:
  * `routerLink` clicks
  * `router.navigate()` programmatic calls
  * Direct URL changes
  * Browser back/forward buttons

## 5. Success Criteria ✅

* [ ] Functional `canDeactivate` guard using `CanDeactivateFn<T>`.
* [ ] Guard checks component's `canDeactivate()` method.
* [ ] Component implements `CanDeactivateComponent` interface.
* [ ] Form tracks `dirty`, `pristine`, and custom `saved` state.
* [ ] Confirmation dialog appears only when needed.
* [ ] Browser refresh shows native warning (via `beforeunload`).
* [ ] Guard registered in route configuration with `canDeactivate: [...]`.

### Testing Scenarios

#### Scenario 1: Pristine Form

* Load the form → Click "Back to Challenges"
* **Expected**: ✅ Navigation proceeds without confirmation

#### Scenario 2: Modified Form

* Type in any field → Click "Back to Challenges"
* **Expected**: ⚠️ Confirmation dialog appears
* Click "Cancel" → Stay on page
* Click link again → Click "OK" → Navigate away

#### Scenario 3: Save and Navigate

* Fill form → Click "Save Profile" → After success, click "Back to Challenges"
* **Expected**: ✅ Navigation proceeds without confirmation

#### Scenario 4: Browser Back Button

* Type in any field → Press browser back button
* **Expected**: ⚠️ Confirmation dialog appears

#### Scenario 5: Browser Refresh

* Type in any field → Press F5 or Ctrl+R
* **Expected**: ⚠️ Browser native warning appears
