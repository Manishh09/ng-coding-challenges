import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HeaderComponent,
        RouterTestingModule,
        NoopAnimationsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render app name', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.logo-text')?.textContent).toContain('ng-coding-challenges');
  });

  it('should render logo icon', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const logoIcon = compiled.querySelector('.logo-icon');
    expect(logoIcon?.textContent).toContain('code');
  });

  it('should have router link to home', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const logoLink = compiled.querySelector('.logo-link');
    expect(logoLink?.getAttribute('routerLink')).toBe('/');
  });

  it('should render theme toggle', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const themeToggle = compiled.querySelector('ng-coding-challenges-theme-toggle');
    expect(themeToggle).toBeTruthy();
  });

  it('should show mobile menu button when showMobileMenu is true', () => {
    component.showMobileMenu = true;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const mobileMenuBtn = compiled.querySelector('.mobile-menu-btn');
    expect(mobileMenuBtn).toBeTruthy();
  });

  it('should hide mobile menu button when showMobileMenu is false', () => {
    component.showMobileMenu = false;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const mobileMenuBtn = compiled.querySelector('.mobile-menu-btn');
    expect(mobileMenuBtn).toBeFalsy();
  });

  it('should have proper aria-label for logo link', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const logoLink = compiled.querySelector('.logo-link');
    expect(logoLink?.getAttribute('aria-label')).toBe('Go to ng-coding-challenges home page');
  });

  it('should accept custom app name', () => {
    component.appName = 'Custom App';
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.logo-text')?.textContent).toContain('Custom App');
  });
});