import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EmptyStateComponent } from './empty-state.component';

describe('EmptyStateComponent', () => {
  let component: EmptyStateComponent;
  let fixture: ComponentFixture<EmptyStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        EmptyStateComponent,
        NoopAnimationsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EmptyStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render empty state container', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.empty-state-container')).toBeTruthy();
  });

  it('should render icon when provided', () => {
    component.icon = 'inbox';
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.empty-state-icon mat-icon')?.textContent).toContain('inbox');
  });

  it('should not render icon when not provided', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.empty-state-icon')).toBeFalsy();
  });

  it('should render title when provided', () => {
    component.title = 'No data found';
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.empty-state-title')?.textContent).toContain('No data found');
  });

  it('should not render title when not provided', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.empty-state-title')).toBeFalsy();
  });

  it('should render message when provided', () => {
    component.message = 'Try refreshing the page';
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.empty-state-message')?.textContent).toContain('Try refreshing the page');
  });

  it('should not render message when not provided', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.empty-state-message')).toBeFalsy();
  });

  it('should render action button when actionText and actionHandler are provided', () => {
    component.actionText = 'Retry';
    component.actionHandler = jasmine.createSpy('actionHandler');
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('.empty-state-actions button');
    expect(button?.textContent).toContain('Retry');
  });

  it('should not render action button when actionText or actionHandler is missing', () => {
    component.actionText = 'Retry';
    // actionHandler is not set
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.empty-state-actions')).toBeFalsy();
  });

  it('should call actionHandler when action button is clicked', () => {
    const actionHandler = jasmine.createSpy('actionHandler');
    component.actionText = 'Retry';
    component.actionHandler = actionHandler;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('.empty-state-actions button') as HTMLButtonElement;
    button.click();
    
    expect(actionHandler).toHaveBeenCalled();
  });

  it('should render action icon when provided', () => {
    component.actionText = 'Retry';
    component.actionIcon = 'refresh';
    component.actionHandler = jasmine.createSpy('actionHandler');
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.empty-state-actions mat-icon')?.textContent).toContain('refresh');
  });

  it('should apply custom container class', () => {
    component.containerClass = 'custom-empty-state';
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const container = compiled.querySelector('.empty-state-container');
    expect(container?.classList.contains('custom-empty-state')).toBeTruthy();
  });

  it('should apply custom action color', () => {
    component.actionText = 'Retry';
    component.actionHandler = jasmine.createSpy('actionHandler');
    component.actionColor = 'accent';
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('.empty-state-actions button');
    expect(button?.getAttribute('ng-reflect-color')).toBe('accent');
  });

  it('should have default values', () => {
    expect(component.icon).toBe('');
    expect(component.title).toBe('');
    expect(component.message).toBe('');
    expect(component.actionText).toBe('');
    expect(component.actionIcon).toBe('');
    expect(component.actionColor).toBe('primary');
    expect(component.actionHandler).toBeUndefined();
    expect(component.containerClass).toBe('');
  });
});