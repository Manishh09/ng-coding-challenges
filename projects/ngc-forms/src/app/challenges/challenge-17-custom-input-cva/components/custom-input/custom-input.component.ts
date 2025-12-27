import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

/**
 * Custom Input Component implementing ControlValueAccessor
 *
 * This component demonstrates how to create reusable form controls
 * that integrate seamlessly with Angular Reactive Forms.
 *
 * Key Concepts:
 * - ControlValueAccessor interface (4 methods)
 * - NG_VALUE_ACCESSOR provider token
 * - Bidirectional data flow with parent form
 * - Disabled state management
 *
 * @example
 * <ngc-input
 *   formControlName="email"
 *   label="Email"
 *   placeholder="Enter email">
 * </ngc-input>
 */
@Component({
  selector: 'ngc-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-input.component.html',
  styleUrl: './custom-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputComponent),
      multi: true
    }
  ]
})
export class CustomInputComponent implements ControlValueAccessor {
  /**
   * Input Properties
   * Configure the custom input from parent component
   */
  @Input() label = '';
  @Input() placeholder = '';
  @Input() type: 'text' | 'email' | 'tel' | 'password' | 'number' = 'text';

  /**
   * Internal State
   */
  value = '';
  disabled = false;

  /**
   * Callbacks registered by Angular Forms
   * These are initially empty functions that will be replaced
   * when Angular registers the real callbacks
   */
  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  /**
   * ControlValueAccessor Method 1: writeValue
   *
   * Called by Angular when the form value changes programmatically
   * Flow: Parent Form → This Component
   *
   * Example: form.patchValue({ name: 'John' })
   * This method receives 'John' and updates the component's internal value
   *
   * @param value - The new value from the form
   */
  writeValue(value: any): void {
    this.value = value || '';
  }

  /**
   * ControlValueAccessor Method 2: registerOnChange
   *
   * Angular calls this to register a callback function
   * We store this callback and call it whenever the user changes the input
   * Flow: This Component → Parent Form
   *
   * @param fn - Callback function to notify form of changes
   */
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  /**
   * ControlValueAccessor Method 3: registerOnTouched
   *
   * Angular calls this to register a callback for touch tracking
   * We call this callback when the input is blurred (loses focus)
   * This is how Angular knows to mark the control as 'touched'
   *
   * @param fn - Callback function to mark control as touched
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * ControlValueAccessor Method 4: setDisabledState (Optional)
   *
   * Called by Angular when the form control is enabled/disabled
   * Example: form.get('name')?.disable()
   *
   * @param isDisabled - Whether the control should be disabled
   */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /**
   * Handle user input events
   * When user types in the input, we:
   * 1. Update our internal value
   * 2. Call onChange callback to notify the parent form
   *
   * @param event - DOM input event
   */
  onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;

    // Notify parent form of the change
    this.onChange(this.value);
  }

  /**
   * Handle blur events (when input loses focus)
   * Call onTouched callback to mark the control as touched
   * This triggers validation error display in most cases
   */
  onInputBlur(): void {
    this.onTouched();
  }
}
