import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { DemoFormComponent } from './demo-form.component';
import { CustomInputComponent } from '../custom-input/custom-input.component';

describe('DemoFormComponent', () => {
  let component: DemoFormComponent;
  let fixture: ComponentFixture<DemoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemoFormComponent, CustomInputComponent, ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(DemoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.userForm.get('name')?.value).toBe('');
    expect(component.userForm.get('email')?.value).toBe('');
  });

  it('should have required validators on name field', () => {
    const nameControl = component.userForm.get('name');
    expect(nameControl?.hasError('required')).toBe(true);
  });

  it('should have minLength validator on name field', () => {
    const nameControl = component.userForm.get('name');
    nameControl?.setValue('ab');
    expect(nameControl?.hasError('minlength')).toBe(true);
  });

  it('should have email validator on email field', () => {
    const emailControl = component.userForm.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBe(true);
  });

  it('should not show error for untouched field', () => {
    expect(component.shouldShowError('name')).toBe(false);
  });

  it('should show error for touched invalid field', () => {
    const nameControl = component.userForm.get('name');
    nameControl?.markAsTouched();
    expect(component.shouldShowError('name')).toBe(true);
  });

  it('should get correct error message for required field', () => {
    const nameControl = component.userForm.get('name');
    nameControl?.markAsTouched();
    expect(component.getErrorMessage('name')).toBe('Name is required');
  });

  it('should get correct error message for minLength violation', () => {
    const nameControl = component.userForm.get('name');
    nameControl?.setValue('ab');
    nameControl?.markAsTouched();
    expect(component.getErrorMessage('name')).toBe('Name must be at least 3 characters');
  });

  it('should get correct error message for invalid email', () => {
    const emailControl = component.userForm.get('email');
    emailControl?.setValue('invalid');
    emailControl?.markAsTouched();
    expect(component.getErrorMessage('email')).toBe('Please enter a valid email address');
  });

  it('should not submit invalid form', () => {
    component.onSubmit();
    expect(component.showSuccessMessage()).toBe(false);
  });

  it('should submit valid form', () => {
    component.userForm.get('name')?.setValue('John Doe');
    component.userForm.get('email')?.setValue('john@example.com');

    component.onSubmit();

    expect(component.showSuccessMessage()).toBe(true);
    expect(component.formData()).toEqual({
      name: 'John Doe',
      email: 'john@example.com'
    });
  });

  it('should mark all fields as touched on submit', () => {
    component.onSubmit();

    expect(component.userForm.get('name')?.touched).toBe(true);
    expect(component.userForm.get('email')?.touched).toBe(true);
  });

  it('should reset form to initial state', () => {
    component.userForm.get('name')?.setValue('John');
    component.userForm.get('email')?.setValue('john@test.com');
    component.submitted.set(true);
    component.showSuccessMessage.set(true);

    component.onReset();

    expect(component.userForm.get('name')?.value).toBeNull();
    expect(component.userForm.get('email')?.value).toBeNull();
    expect(component.submitted()).toBe(false);
    expect(component.showSuccessMessage()).toBe(false);
  });
});
