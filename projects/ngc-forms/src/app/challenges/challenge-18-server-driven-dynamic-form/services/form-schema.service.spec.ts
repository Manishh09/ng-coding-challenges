import { TestBed } from '@angular/core/testing';
import { FormSchemaService } from './form-schema.service';
import { FormSchema } from '../models/form-schema.model';

describe('FormSchemaService', () => {
  let service: FormSchemaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormSchemaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return form schema synchronously', () => {
    const schema = service.getFormSchemaSync();

    expect(schema).toBeDefined();
    expect(schema.title).toBe('Job Application Form');
    expect(schema.fields.length).toBe(5);
  });

  it('should return form schema as observable', (done) => {
    service.getFormSchema().subscribe(schema => {
      expect(schema).toBeDefined();
      expect(schema.title).toBe('Job Application Form');
      expect(schema.fields.length).toBe(5);
      done();
    });
  });

  it('should have all expected fields', () => {
    const schema = service.getFormSchemaSync();
    const fieldNames = schema.fields.map(f => f.name);

    expect(fieldNames).toContain('fullName');
    expect(fieldNames).toContain('email');
    expect(fieldNames).toContain('yearsExperience');
    expect(fieldNames).toContain('position');
    expect(fieldNames).toContain('remoteWork');
  });

  it('should have proper field configurations', () => {
    const schema = service.getFormSchemaSync();
    const fullNameField = schema.fields.find(f => f.name === 'fullName');

    expect(fullNameField).toBeDefined();
    expect(fullNameField?.type).toBe('text');
    expect(fullNameField?.required).toBe(true);
    expect(fullNameField?.validators?.length).toBe(3);
  });

  it('should have select field with options', () => {
    const schema = service.getFormSchemaSync();
    const positionField = schema.fields.find(f => f.name === 'position');

    expect(positionField).toBeDefined();
    expect(positionField?.type).toBe('select');
    expect(positionField?.options).toBeDefined();
    expect(positionField?.options?.length).toBeGreaterThan(0);
  });

  it('should have checkbox field with default value', () => {
    const schema = service.getFormSchemaSync();
    const remoteWorkField = schema.fields.find(f => f.name === 'remoteWork');

    expect(remoteWorkField).toBeDefined();
    expect(remoteWorkField?.type).toBe('checkbox');
    expect(remoteWorkField?.defaultValue).toBe(false);
  });
});
