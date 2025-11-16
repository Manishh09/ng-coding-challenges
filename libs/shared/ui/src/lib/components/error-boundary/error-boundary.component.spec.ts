import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorBoundaryComponent } from './error-boundary.component';

describe('ErrorBoundaryComponent', () => {
  let component: ErrorBoundaryComponent;
  let fixture: ComponentFixture<ErrorBoundaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorBoundaryComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorBoundaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display content when no error', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.error-boundary')).toBeFalsy();
  });

  it('should display error UI when hasError is true', () => {
    fixture.componentRef.setInput('hasError', true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.error-boundary')).toBeTruthy();
  });

  it('should display custom error message', () => {
    const customMessage = 'Custom error message';
    fixture.componentRef.setInput('hasError', true);
    fixture.componentRef.setInput('errorMessage', customMessage);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const message = compiled.querySelector('.error-boundary__message');
    expect(message?.textContent?.trim()).toBe(customMessage);
  });

  it('should emit retry event when retry button clicked', () => {
    let retryClicked = false;
    component.retry.subscribe(() => {
      retryClicked = true;
    });

    fixture.componentRef.setInput('hasError', true);
    fixture.detectChanges();

    component.onRetry();
    expect(retryClicked).toBe(true);
  });

  it('should show retry button by default', () => {
    fixture.componentRef.setInput('hasError', true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const retryButton = compiled.querySelector('button');
    expect(retryButton?.textContent).toContain('Try again');
  });
});
