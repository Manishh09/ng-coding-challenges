# Challenge 14: Async Email Validator

**Estimated Time:** 45-60 minutes
**Difficulty:** Advanced

## 1. Challenge 🎯

**Scenario:**
You are building a Sign-Up form. You need to verify if the email is available *before* the user clicks submit.
The backend check takes time (~2 seconds).

**Task:**
Create an **Async Validator** that debounces input and calls a service.

## 2. Requirements 📋

* [ ] **Validation**: `emailAvailabilityValidator` (Async).
* [ ] **Debounce**: Wait 500ms after typing stops.
* [ ] **Feedback**: Show "Checking..." while pending.
* [ ] **Behavior**: If the user types "<test@test.com>", it should show "Email is taken".

## 3. Expected Output 🖼️

* **Input**: "<test@test.com>" (Wait 500ms) -> Spinner -> (Wait 1.5s) -> Error.
* **Input**: "<new@user.com>" (Wait 500ms) -> Spinner -> (Wait 1.5s) -> Success.

## 4. Edge Cases / Constraints ⚠️

* **Race Conditions**: If I type "a", then "ab", the check for "a" should be cancelled.
* **Fail-Open**: If the API fails, assume the email is valid (don't block the user).

## 5. Success Criteria ✅

* [ ] Custom Async Validator implementation.
* [ ] Validator returns an Observable.
* [ ] `switchMap` is used to cancel old requests.
* [ ] Input status changes to `PENDING` during the check.
