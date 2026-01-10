# Solution: Dynamic FormArray

## 🧠 Approach
`FormArray` is an indexed list of Controls (or Groups).
1.  **Define**: The structure of a single item (e.g., `createJobGroup()`).
2.  **Initialize**: Start with an array containing one item.
3.  **Manipulate**: Use `.push()` and `.removeAt(index)` to change the array.

## 🚀 Step-by-Step Implementation

### Step 1: Component Setup
```typescript
@Component({ ... })
export class WorkHistoryComponent {
  fb = inject(FormBuilder);

  form = this.fb.group({
    // Initialize with one empty group
    jobs: this.fb.array([this.createJob()])
  });

  // Helper to create a consistent row structure
  createJob(): FormGroup {
    return this.fb.group({
      company: ['', Validators.required],
      role: ['', Validators.required],
      years: [0, [Validators.required, Validators.min(0)]]
    });
  }

  // Helper to access the Array control easily in template
  get jobs() {
    return this.form.get('jobs') as FormArray;
  }
}
```

### Step 2: Add / Remove Logic
```typescript
addJob() {
  if (this.jobs.length < 5) {
    this.jobs.push(this.createJob());
  }
}

removeJob(index: number) {
  if (this.jobs.length > 1) {
    this.jobs.removeAt(index);
  }
}
```

### Step 3: Template Iteration
We use `@for` to loop through the controls. Note `formArrayName` and `formGroupName`.
```html
<form [formGroup]="form">
  <div formArrayName="jobs">
    
    @for (job of jobs.controls; track job; let i = $index) {
      <div [formGroupName]="i" class="job-row">
        <h3>Job #{{ i + 1 }}</h3>
        
        <input formControlName="company" placeholder="Company">
        <input formControlName="role" placeholder="Role">
        <input type="number" formControlName="years" placeholder="Years">

        <button type="button" (click)="removeJob(i)" [disabled]="jobs.length === 1">
          🗑️ Remove
        </button>
      </div>
    }

  </div>

  <button type="button" (click)="addJob()" [disabled]="jobs.length >= 5">
    + Add Job
  </button>
</form>
```

## 🌟 Best Practices Used
*   **Factory Method**: `createJob()` ensures that every new row has the exact same structure and validators.
*   **Getters**: `get jobs()` with `as FormArray` casting is essential for TypeScript to know that `.controls` and `.push` exist.
*   **formArrayName**: This directive tells Angular "Look inside this array". Then `[formGroupName]="i"` allows accessing each specific index.
