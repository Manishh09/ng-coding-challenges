import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HomeComponent,
        RouterTestingModule,
        NoopAnimationsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render hero title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.hero-title')?.textContent).toContain('Challenge 01:');
    expect(compiled.querySelector('.gradient-text')?.textContent).toContain('Async Data Fetch');
  });

  it('should render hero subtitle', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.hero-subtitle')?.textContent)
      .toContain('Master asynchronous data fetching in Angular');
  });

  it('should have call-to-action buttons', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const ctaButton = compiled.querySelector('.cta-button');
    const secondaryButton = compiled.querySelector('.secondary-button');
    
    expect(ctaButton?.textContent).toContain('Start Challenge');
    expect(secondaryButton?.textContent).toContain('Learn More');
  });

  it('should render all feature cards', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const featureCards = compiled.querySelectorAll('.feature-card');
    expect(featureCards.length).toBe(4);
    
    const titles = Array.from(featureCards).map(card => 
      card.querySelector('h3')?.textContent
    );
    
    expect(titles).toContain('HTTP Client Mastery');
    expect(titles).toContain('RxJS Operators');
    expect(titles).toContain('Angular 19 Signals');
    expect(titles).toContain('Caching Strategies');
  });

  it('should render requirement cards', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const requirementCards = compiled.querySelectorAll('.requirement-card');
    expect(requirementCards.length).toBe(3);
  });

  it('should render API endpoint cards', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const apiCards = compiled.querySelectorAll('.api-card');
    expect(apiCards.length).toBe(4);
    
    const endpoints = Array.from(apiCards).map(card => 
      card.querySelector('h4')?.textContent
    );
    
    expect(endpoints).toContain('/posts');
    expect(endpoints).toContain('/users');
    expect(endpoints).toContain('/comments');
    expect(endpoints).toContain('/todos');
  });

  it('should have proper router links', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const challengeLink = compiled.querySelector('button[routerLink="/challenge"]');
    const aboutLink = compiled.querySelector('button[routerLink="/about"]');
    
    expect(challengeLink).toBeTruthy();
    expect(aboutLink).toBeTruthy();
  });

  it('should have responsive design classes', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const heroSection = compiled.querySelector('.hero-section');
    const featuresGrid = compiled.querySelector('.features-grid');
    const requirementsGrid = compiled.querySelector('.requirements-grid');
    
    expect(heroSection).toBeTruthy();
    expect(featuresGrid).toBeTruthy();
    expect(requirementsGrid).toBeTruthy();
  });
});