import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginFormComponent } from './login-form.component';

describe('LoginFormComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginFormComponent, ReactiveFormsModule]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(LoginFormComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    const fixture = TestBed.createComponent(LoginFormComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.loginForm.get('email')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
  });

  it('should mark form as invalid when empty', () => {
    const fixture = TestBed.createComponent(LoginFormComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.loginForm.valid).toBeFalsy();
  });

  it('should validate email format', () => {
    const fixture = TestBed.createComponent(LoginFormComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    const emailControl = component.loginForm.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBeTruthy();

    emailControl?.setValue('valid@email.com');
    expect(emailControl?.hasError('email')).toBeFalsy();
  });

  it('should validate password minimum length', () => {
    const fixture = TestBed.createComponent(LoginFormComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    const passwordControl = component.loginForm.get('password');
    passwordControl?.setValue('12345');
    expect(passwordControl?.hasError('minlength')).toBeTruthy();

    passwordControl?.setValue('123456');
    expect(passwordControl?.hasError('minlength')).toBeFalsy();
  });

  it('should mark form as valid when all fields are valid', () => {
    const fixture = TestBed.createComponent(LoginFormComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.loginForm.get('email')?.setValue('test@example.com');
    component.loginForm.get('password')?.setValue('password123');

    expect(component.loginForm.valid).toBeTruthy();
  });

  it('should handle form submission', () => {
    const fixture = TestBed.createComponent(LoginFormComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.loginForm.get('email')?.setValue('test@example.com');
    component.loginForm.get('password')?.setValue('password123');

    component.onSubmit();
    expect(component.submitted()).toBeTruthy();
  });

  it('should reset form correctly', () => {
    const fixture = TestBed.createComponent(LoginFormComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.loginForm.get('email')?.setValue('test@example.com');
    component.loginForm.get('password')?.setValue('password123');
    component.submitted.set(true);

    component.resetForm();

    expect(component.loginForm.get('email')?.value).toBeNull();
    expect(component.loginForm.get('password')?.value).toBeNull();
    expect(component.submitted()).toBeFalsy();
  });
});
