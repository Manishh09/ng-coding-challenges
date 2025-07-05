import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FooterComponent,
        RouterTestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render app name', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.footer-logo-text')?.textContent).toContain('ng-coding-challenges');
  });

  it('should render description', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.footer-description')?.textContent)
      .toContain('Master Angular development through hands-on coding challenges.');
  });

  it('should render current year in copyright', () => {
    const currentYear = new Date().getFullYear();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.copyright')?.textContent).toContain(currentYear.toString());
  });

  it('should render Angular version in copyright', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.copyright')?.textContent).toContain('Angular 19');
  });

  it('should have footer sections', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const footerSections = compiled.querySelectorAll('.footer-section');
    expect(footerSections.length).toBe(4);
  });

  it('should have footer titles', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const footerTitles = compiled.querySelectorAll('.footer-title');
    const titles = Array.from(footerTitles).map(title => title.textContent);
    
    expect(titles).toContain('Quick Links');
    expect(titles).toContain('Categories');
    expect(titles).toContain('Community');
  });

  it('should accept custom app name', () => {
    component.appName = 'Custom App';
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.footer-logo-text')?.textContent).toContain('Custom App');
  });

  it('should accept custom description', () => {
    component.description = 'Custom description';
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.footer-description')?.textContent).toContain('Custom description');
  });

  it('should accept custom Angular version', () => {
    component.angularVersion = '18';
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.copyright')?.textContent).toContain('Angular 18');
  });
});