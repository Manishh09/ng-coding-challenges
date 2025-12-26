import { TestBed } from '@angular/core/testing';
import { ProjectFormComponent } from './project-form.component';
import { ProjectService } from '../../services/project.service';
import { ReactiveFormsModule } from '@angular/forms';

describe('ProjectFormComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectFormComponent, ReactiveFormsModule],
      providers: [ProjectService]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ProjectFormComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    const fixture = TestBed.createComponent(ProjectFormComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.projectForm.get('name')?.value).toBe('');
    expect(component.projectForm.get('description')?.value).toBe('');
  });

    const fixture = TestBed.createComponent(ProjectFormComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    const nameControl = component.projectForm.get('name');
    nameControl?.setValue('AB');

    expect(nameControl?.hasError('minlength')).toBeTruthy();
  });

  it('should detect duplicate project names', () => {
    const fixture = TestBed.createComponent(ProjectFormComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    const nameControl = component.projectForm.get('name');
    nameControl?.setValue('Project Alpha');
    nameControl?.markAsTouched();

    expect(nameControl?.hasError('duplicateName')).toBeTruthy();
  });

  it('should accept unique project names', () => {
    const fixture = TestBed.createComponent(ProjectFormComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    const nameControl = component.projectForm.get('name');
    const descControl = component.projectForm.get('description');

    nameControl?.setValue('Unique Project Name');
    descControl?.setValue('This is a valid description with enough characters');
    nameControl?.markAsTouched();
    descControl?.markAsTouched();

    expect(nameControl?.hasError('duplicateName')).toBeFalsy();
    expect(component.projectForm.valid).toBeTruthy();
  });

it('should compute normalized preview', () => {
    const fixture = TestBed.createComponent(ProjectFormComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.projectForm.get('name')?.setValue('Test Project');
    expect(component.normalizedPreview()).toBe('test-project');
  });

  it('should return error messages for invalid fields', () => {
    const fixture = TestBed.createComponent(ProjectFormComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    const nameControl = component.projectForm.get('name');
    nameControl?.markAsTouched();

    expect(component.getErrorMessage('name')).toContain('required');
  });

  it('should disable submit button when form is invalid', () => {
    const fixture = TestBed.createComponent(ProjectFormComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.submitted.set(true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const submitButton = compiled.querySelector('.btn-primary') as HTMLButtonElement;

    expect(submitButton?.disabled).toBeTruthy();
  });
});
