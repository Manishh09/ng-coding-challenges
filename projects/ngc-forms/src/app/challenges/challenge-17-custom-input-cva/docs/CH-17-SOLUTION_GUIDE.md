# Solution: ControlValueAccessor (CVA)

## 🧠 Approach
Angular Forms (Reactive & Template) talk to DOM elements via `ControlValueAccessor`.
To make a custom component "speak the same language", we implement this interface.
It acts as a bridge:
*   **Write**: Model -> View (`writeValue`)
*   **Listen**: View -> Model (`registerOnChange`, `registerOnTouched`)

## 🚀 Step-by-Step Implementation

### Step 1: The Provider Configuration
This is the "boilerplate" required to register your component as a valid form control.
```typescript
@Component({
  selector: 'app-custom-input',
  standalone: true,
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputComponent),
      multi: true
    }
  ]
})
```

### Step 2: Implementing the Interface
```typescript
export class CustomInputComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() type = 'text';
  
  value = '';
  isDisabled = false;

  // Placeholder functions for the callbacks
  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  // 1. Write: Angular asks you to update your view
  writeValue(value: string): void {
    this.value = value || '';
  }

  // 2. Listen: Angular gives you a function to call when data changes
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // 3. Listen: Angular gives you a function to call when element is touched
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // 4. Disable: Angular asks you to disable the input
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  // Helper handling user input
  onInput(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.value = val;
    this.onChange(val); // Notify Angular!
  }

  onBlur() {
    this.onTouched(); // Notify Angular!
  }
}
```

### Step 3: The Template (Binding)
We bind the internal state to the native input.
```html
<label>{{ label }}</label>
<input 
  [type]="type"
  [value]="value" 
  [disabled]="isDisabled"
  (input)="onInput($event)"
  (blur)="onBlur()">
```

## 🌟 Best Practices Used
*   **forwardRef**: Crucial because the class is referenced in its own metadata decorator.
*   **Dummy Functions**: Initializing `onChange` and `onTouched` with `() => {}` prevents errors if the specialized component is used without a form context.
*   **Separation**: Keep validation in the *Parent Form*, not inside the CVA. The CVA should just be a dumb pipe for data.
