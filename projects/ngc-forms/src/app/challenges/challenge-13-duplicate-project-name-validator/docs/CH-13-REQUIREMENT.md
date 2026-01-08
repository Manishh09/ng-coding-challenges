# Challenge 13: Unique Name Validator

**Estimated Time:** 30-45 minutes
**Difficulty:** Intermediate

## 1. Challenge 🎯

**Scenario:**
You are managing a list of Projects. Project names must be **unique**. However, when Editing a project, its *own* name shouldn't count as a duplicate.

**Task:**
Create a Reusable Custom Validator `uniqueNameValidator(names)` that checks the input against a blacklist.

## 2. Requirements 📋

* [ ] **Custom Validator**: A function that returns a `ValidatorFn`.
* [ ] **Parameters**: It should accept an array of strings (existing names).
* [ ] **Edit Mode**: It needs to handle the edge case where "Project A" is allowed if we are editing "Project A".

## 3. Expected Output 🖼️

* **Input**: "Project A" -> Error "Name already exists".
* **Input**: "Project B" -> Valid (if B doesn't exist).
* **Validation**: Must be case-insensitive ("project a" == "Project A").

## 4. Edge Cases / Constraints ⚠️

* **Case Sensitivity**: Users will hate it if you allow "Test" and "test". Treat them as duplicates.
* **Whitespace**: " Test " should equal "Test". Trim inputs.

## 5. Success Criteria ✅

* [ ] Validator is a function that returns a `ValidatorFn`.
* [ ] Custom Synchronous Validator implementation.
* [ ] Validator correctly identifies duplicates.
* [ ] Validator correctly ignores case.
* [ ] Validator allows the current name in Edit Mode.
