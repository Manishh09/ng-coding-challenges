import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LoadingSpinnerComponent } from './loading-spinner.component';

describe('LoadingSpinnerComponent', () => {
  let component: LoadingSpinnerComponent;
  let fixture: ComponentFixture<LoadingSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LoadingSpinnerComponent,
        NoopAnimationsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render loading container', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.loading-container')).toBeTruthy();
  });

  it('should render mat-spinner', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('mat-spinner')).toBeTruthy();
  });

  it('should render message when provided', () => {
    component.message = 'Loading data...';
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.loading-message')?.textContent).toContain('Loading data...');
  });

  it('should not render message when not provided', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.loading-message')).toBeFalsy();
  });

  it('should apply custom diameter', () => {
    component.diameter = 60;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const spinner = compiled.querySelector('mat-spinner');
    expect(spinner?.getAttribute('ng-reflect-diameter')).toBe('60');
  });

  it('should apply custom stroke width', () => {
    component.strokeWidth = 6;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const spinner = compiled.querySelector('mat-spinner');
    expect(spinner?.getAttribute('ng-reflect-stroke-width')).toBe('6');
  });

  it('should apply custom color', () => {
    component.color = 'accent';
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const spinner = compiled.querySelector('mat-spinner');
    expect(spinner?.getAttribute('ng-reflect-color')).toBe('accent');
  });

  it('should apply custom container class', () => {
    component.containerClass = 'custom-loading';
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const container = compiled.querySelector('.loading-container');
    expect(container?.classList.contains('custom-loading')).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.diameter).toBe(40);
    expect(component.strokeWidth).toBe(4);
    expect(component.color).toBe('primary');
    expect(component.message).toBe('');
    expect(component.containerClass).toBe('');
  });
});