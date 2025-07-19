import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ThemeToggleComponent } from './theme-toggle.component';
import { ThemeService } from '../../../../../services/src/lib/theme/theme.service';

describe('ThemeToggleComponent', () => {
  let component: ThemeToggleComponent;
  let fixture: ComponentFixture<ThemeToggleComponent>;
  let themeService: jasmine.SpyObj<ThemeService>;

  beforeEach(async () => {
    const themeServiceSpy = jasmine.createSpyObj('ThemeService', ['toggleTheme'], {
      isDarkMode: jasmine.createSpy().and.returnValue(false)
    });

    await TestBed.configureTestingModule({
      imports: [
        ThemeToggleComponent,
        NoopAnimationsModule
      ],
      providers: [
        { provide: ThemeService, useValue: themeServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ThemeToggleComponent);
    component = fixture.componentInstance;
    themeService = TestBed.inject(ThemeService) as jasmine.SpyObj<ThemeService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render toggle button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('.theme-toggle-btn');
    expect(button).toBeTruthy();
  });

  it('should show dark_mode icon when in light mode', () => {
    themeService.isDarkMode.and.returnValue(false);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const icon = compiled.querySelector('mat-icon');
    expect(icon?.textContent).toContain('dark_mode');
  });

  it('should show light_mode icon when in dark mode', () => {
    themeService.isDarkMode.and.returnValue(true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const icon = compiled.querySelector('mat-icon');
    expect(icon?.textContent).toContain('light_mode');
  });

  it('should call toggleTheme when button is clicked', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('.theme-toggle-btn') as HTMLButtonElement;

    button.click();
    expect(themeService.toggleTheme).toHaveBeenCalled();
  });

  it('should have proper tooltip text for light mode', () => {
    themeService.isDarkMode.and.returnValue(false);
    expect(component.tooltipText()).toBe('Switch to dark theme');
  });

  it('should have proper tooltip text for dark mode', () => {
    themeService.isDarkMode.and.returnValue(true);
    expect(component.tooltipText()).toBe('Switch to light theme');
  });

  it('should have proper aria-label', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('.theme-toggle-btn');
    expect(button?.getAttribute('aria-label')).toBe('Toggle theme');
  });
});
