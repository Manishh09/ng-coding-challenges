# Challenge 12: Reactive Login Form

**Estimated Time:** 20-30 minutes
**Difficulty:** Beginner

## 1. Challenge 🎯
**Scenario:**
You are building the "Login Page" for a bank app. It must be secure, validate inputs strictly, and provide immediate feedback.

**Task:**
Create a **Reactive Form** with extensive validations and conditional error messages.

## 2. Requirements 📋
*   [ ] **FormGroup**: Use `formBuilder` or `new FormGroup`.
*   [ ] **Validation**:
    *   Email: Required, Valid email format.
    *   Password: Required, Min length 6.
*   [ ] **State**: Button disabled if invalid.

## 3. Expected Output 🖼️
*   **Inputs**: Email, Password.
*   **Errors**: Red text appears *only after* the user touches the field and leaves it invalid.
*   **Success**: Clicking Login logs the `{ email, password }` object to console.

## 4. Edge Cases / Constraints ⚠️
*   **UX**: Don't show errors on load. Wait for `touched` or `dirty`.
*   **Security**: Minimal requirements, but password should be masked.

## 5. Success Criteria ✅
*   [ ] Form uses `ReactiveFormsModule`.
*   [ ] Validators work as expected.
*   [ ] Submit button is disabled when form is invalid.
