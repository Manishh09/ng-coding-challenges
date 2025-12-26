import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkipLinksComponent } from './skip-links.component';

describe('SkipLinksComponent', () => {
  let component: SkipLinksComponent;
  let fixture: ComponentFixture<SkipLinksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkipLinksComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SkipLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render default skip links', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const links = compiled.querySelectorAll('.skip-link');
    expect(links.length).toBe(3);
  });

  it('should have accessible labels', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const nav = compiled.querySelector('nav');
    expect(nav?.getAttribute('aria-label')).toBe('Skip navigation links');
  });

  it('should render custom links', () => {
    const customLinks = [
      { text: 'Skip to content', target: '#content' }
    ];
    fixture.componentRef.setInput('links', customLinks);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const links = compiled.querySelectorAll('.skip-link');
    expect(links.length).toBe(1);
    expect(links[0].textContent?.trim()).toBe('Skip to content');
  });
});
