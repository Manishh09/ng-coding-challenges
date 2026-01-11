import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomInputComponent } from './custom-input.component';

describe('CustomInputComponent', () => {
  let component: CustomInputComponent;
  let fixture: ComponentFixture<CustomInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomInputComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should implement writeValue', () => {
    component.writeValue('test value');
    expect(component.value).toBe('test value');
  });

  it('should handle null in writeValue', () => {
    component.writeValue(null);
    expect(component.value).toBe('');
  });

  it('should register onChange callback', () => {
    const mockFn = jasmine.createSpy('onChange');
    component.registerOnChange(mockFn);

    const event = new Event('input');
    Object.defineProperty(event, 'target', { value: { value: 'new value' } });
    component.onInputChange(event);

    expect(mockFn).toHaveBeenCalledWith('new value');
  });

  it('should register onTouched callback', () => {
    const mockFn = jasmine.createSpy('onTouched');
    component.registerOnTouched(mockFn);

    component.onInputBlur();

    expect(mockFn).toHaveBeenCalled();
  });

  it('should handle disabled state', () => {
    component.setDisabledState(true);
    expect(component.disabled).toBe(true);

    component.setDisabledState(false);
    expect(component.disabled).toBe(false);
  });

  it('should update value on input change', () => {
    const event = new Event('input');
    Object.defineProperty(event, 'target', { value: { value: 'user input' } });

    component.onInputChange(event);

    expect(component.value).toBe('user input');
  });

  it('should call onTouched on blur', () => {
    const mockFn = jasmine.createSpy('onTouched');
    component.registerOnTouched(mockFn);

    component.onInputBlur();

    expect(mockFn).toHaveBeenCalled();
  });
});
