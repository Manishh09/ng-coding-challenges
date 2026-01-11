import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { DynamicFormComponent } from './dynamic-form.component';
import { FormSchemaService } from '../../services/form-schema.service';

describe('DynamicFormComponent', () => {
  let component: DynamicFormComponent;
  let fixture: ComponentFixture<DynamicFormComponent>;
  let formSchemaService: FormSchemaService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicFormComponent, ReactiveFormsModule],
      providers: [FormSchemaService]
    }).compileComponents();

    fixture = TestBed.createComponent(DynamicFormComponent);
    component = fixture.componentInstance;
    formSchemaService = TestBed.inject(FormSchemaService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load schema and build form on init', () => {
    expect(component.formSchema).toBeDefined();
    expect(component.fields.length).toBe(5);
    expect(component.dynamicForm).toBeDefined();
  });

  it('should sort fields by order', () => {
    expect(component.fields[0].name).toBe('fullName');
    expect(component.fields[1].name).toBe('email');
    expect(component.fields[2].name).toBe('yearsExperience');
    expect(component.fields[3].name).toBe('position');
    expect(component.fields[4].name).toBe('remoteWork');
  });

  it('should create form controls for all fields', () => {
    expect(component.dynamicForm.get('fullName')).toBeDefined();
    expect(component.dynamicForm.get('email')).toBeDefined();
    expect(component.dynamicForm.get('yearsExperience')).toBeDefined();
    expect(component.dynamicForm.get('position')).toBeDefined();
    expect(component.dynamicForm.get('remoteWork')).toBeDefined();
  });

  it('should apply required validator', () => {
    const nameControl = component.dynamicForm.get('fullName');
    expect(nameControl?.hasError('required')).toBe(true);
  });

  it('should apply minLength validator', () => {
    const nameControl = component.dynamicForm.get('fullName');
    nameControl?.setValue('ab');
    expect(nameControl?.hasError('minlength')).toBe(true);
  });

  it('should apply email validator', () => {
    const emailControl = component.dynamicForm.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBe(true);
  });

  it('should apply min validator', () => {
    const experienceControl = component.dynamicForm.get('yearsExperience');
    experienceControl?.setValue(-1);
    expect(experienceControl?.hasError('min')).toBe(true);
  });

  it('should apply max validator', () => {
    const experienceControl = component.dynamicForm.get('yearsExperience');
    experienceControl?.setValue(51);
    expect(experienceControl?.hasError('max')).toBe(true);
  });

  it('should not show error for untouched field', () => {
    expect(component.shouldShowError('fullName')).toBe(false);
  });

  it('should show error for touched invalid field', () => {
    const nameControl = component.dynamicForm.get('fullName');
    nameControl?.markAsTouched();
    expect(component.shouldShowError('fullName')).toBe(true);
  });

  it('should return custom error message from schema', () => {
    const nameControl = component.dynamicForm.get('fullName');
    nameControl?.markAsTouched();
    expect(component.getErrorMessage('fullName')).toBe('Full name is required');
  });

  it('should return custom minLength error message', () => {
    const nameControl = component.dynamicForm.get('fullName');
    nameControl?.setValue('ab');
    nameControl?.markAsTouched();
    expect(component.getErrorMessage('fullName')).toBe('Name must be at least 3 characters');
  });

  it('should return custom email error message', () => {
    const emailControl = component.dynamicForm.get('email');
    emailControl?.setValue('invalid');
    emailControl?.markAsTouched();
    expect(component.getErrorMessage('email')).toBe('Please enter a valid email address');
  });

  it('should not submit invalid form', () => {
    component.onSubmit();
    expect(component.showSuccessMessage()).toBe(false);
  });

  it('should submit valid form', () => {
    component.dynamicForm.patchValue({
      fullName: 'John Doe',
      email: 'john@example.com',
      yearsExperience: 5,
      position: 'fullstack',
      remoteWork: true
    });

    component.onSubmit();

    expect(component.showSuccessMessage()).toBe(true);
    expect(component.submittedData()).toEqual({
      fullName: 'John Doe',
      email: 'john@example.com',
      yearsExperience: 5,
      position: 'fullstack',
      remoteWork: true
    });
  });

  it('should mark all fields as touched on submit', () => {
    component.onSubmit();

    expect(component.dynamicForm.get('fullName')?.touched).toBe(true);
    expect(component.dynamicForm.get('email')?.touched).toBe(true);
  });

  it('should reset form to initial state', () => {
    component.dynamicForm.patchValue({
      fullName: 'John',
      email: 'john@test.com'
    });
    component.submitted.set(true);
    component.showSuccessMessage.set(true);

    component.onReset();

    expect(component.dynamicForm.get('fullName')?.value).toBeNull();
    expect(component.submitted()).toBe(false);
    expect(component.showSuccessMessage()).toBe(false);
  });

  it('should reset checkbox to default value', () => {
    component.dynamicForm.get('remoteWork')?.setValue(true);

    component.onReset();

    expect(component.dynamicForm.get('remoteWork')?.value).toBe(false);
  });
});
