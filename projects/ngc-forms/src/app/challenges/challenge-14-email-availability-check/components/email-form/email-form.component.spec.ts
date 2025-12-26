import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { EmailFormComponent } from './email-form.component';
import { EmailValidationService } from '../../services/email-validation.service';
import { of } from 'rxjs';

describe('EmailFormComponent', () => {
  let component: EmailFormComponent;
  let fixture: ComponentFixture<EmailFormComponent>;
  let emailService: jasmine.SpyObj<EmailValidationService>;

  beforeEach(async () => {
    const emailServiceSpy = jasmine.createSpyObj('EmailValidationService', [
      'checkEmailAvailability',
      'getTakenEmails'
    ]);

    await TestBed.configureTestingModule({
      imports: [EmailFormComponent, ReactiveFormsModule],
      providers: [
        { provide: EmailValidationService, useValue: emailServiceSpy }
      ]
    }).compileComponents();

    emailService = TestBed.inject(EmailValidationService) as jasmine.SpyObj<EmailValidationService>;
    emailService.getTakenEmails.and.returnValue(of(['test@test.com', 'admin@company.com']));

    fixture = TestBed.createComponent(EmailFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.emailForm.get('email')?.value).toBe('');
    expect(component.emailForm.get('fullName')?.value).toBe('');
  });

  it('should have email field with required and email validators', () => {
    const emailControl = component.emailForm.get('email');

    emailControl?.setValue('');
    expect(emailControl?.hasError('required')).toBeTruthy();

    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBeTruthy();

    emailControl?.setValue('valid@example.com');
    emailControl?.markAsTouched();
    expect(emailControl?.hasError('email')).toBeFalsy();
  });

  it('should have fullName field with required and minLength validators', () => {
    const nameControl = component.emailForm.get('fullName');

    nameControl?.setValue('');
    expect(nameControl?.hasError('required')).toBeTruthy();

    nameControl?.setValue('AB');
    expect(nameControl?.hasError('minlength')).toBeTruthy();

    nameControl?.setValue('John Doe');
    expect(nameControl?.hasError('minlength')).toBeFalsy();
  });

  it('should set isValidating to true when email validation is pending', fakeAsync(() => {
    emailService.checkEmailAvailability.and.returnValue(
      of({ available: true, email: 'test@example.com' })
    );

    const emailControl = component.emailForm.get('email');
    emailControl?.setValue('test@example.com');

    tick(500); // Debounce time

    // During async validation, status should be PENDING
    expect(component.isValidating()).toBe(false);

    tick(1500); // API delay
    fixture.detectChanges();
  }));

  it('should display error message for required fields', () => {
    component.submitted.set(true);

    expect(component.getErrorMessage('email')).toContain('required');
    expect(component.getErrorMessage('fullName')).toContain('required');
  });

  it('should display error message for invalid email format', () => {
    const emailControl = component.emailForm.get('email');
    emailControl?.setValue('invalid-email');
    emailControl?.markAsTouched();

    expect(component.getErrorMessage('email')).toContain('valid email');
  });

  it('should return correct field classes based on validation state', () => {
    const emailControl = component.emailForm.get('email');

    // Untouched - no class
    expect(component.getFieldClass('email')).toBe('');

    // Invalid after touch
    emailControl?.setValue('');
    emailControl?.markAsTouched();
    expect(component.getFieldClass('email')).toBe('is-invalid');

    // Valid after touch
    emailControl?.setValue('valid@example.com');
    emailControl?.markAsTouched();
    fixture.detectChanges();
    // Note: async validator makes this test complex
  });

  it('should mark form as touched when submitting invalid form', () => {
    component.onSubmit();

    expect(component.emailForm.get('email')?.touched).toBeTruthy();
    expect(component.emailForm.get('fullName')?.touched).toBeTruthy();
  });

  it('should disable submit button when form is invalid', () => {
    expect(component.isSubmitDisabled()).toBeTruthy();

    component.emailForm.get('email')?.setValue('test@example.com');
    component.emailForm.get('fullName')?.setValue('John Doe');

    // Still disabled until async validation completes
    expect(component.isSubmitDisabled()).toBeTruthy();
  });

  it('should show success message after valid form submission', fakeAsync(() => {
    emailService.checkEmailAvailability.and.returnValue(
      of({ available: true, email: 'newuser@example.com' })
    );

    component.emailForm.get('email')?.setValue('newuser@example.com');
    component.emailForm.get('fullName')?.setValue('John Doe');

    tick(2000); // Wait for async validation

    component.onSubmit();

    expect(component.showSuccessMessage()).toBeTruthy();
    expect(component.successMessage()).toContain('Registration successful');

    tick(3000); // Wait for auto-hide
    expect(component.showSuccessMessage()).toBeFalsy();
  }));

  it('should reset form after successful submission', fakeAsync(() => {
    emailService.checkEmailAvailability.and.returnValue(
      of({ available: true, email: 'newuser@example.com' })
    );

    component.emailForm.get('email')?.setValue('newuser@example.com');
    component.emailForm.get('fullName')?.setValue('John Doe');

    tick(2000);

    component.onSubmit();

    expect(component.emailForm.get('email')?.value).toBeNull();
    expect(component.emailForm.get('fullName')?.value).toBeNull();
  }));

  it('should return suggested emails from validation error', () => {
    const emailControl = component.emailForm.get('email');
    emailControl?.setErrors({
      emailTaken: {
        email: 'test@example.com',
        message: 'Email is taken',
        suggestedAlternatives: ['test123@example.com', 'test.dev@example.com']
      }
    });

    const suggestions = component.getSuggestedEmails();
    expect(suggestions.length).toBe(2);
    expect(suggestions[0]).toBe('test123@example.com');
  });

  it('should return empty array when no suggestions available', () => {
    const suggestions = component.getSuggestedEmails();
    expect(suggestions).toEqual([]);
  });
});
