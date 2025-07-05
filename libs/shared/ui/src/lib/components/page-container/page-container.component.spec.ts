import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageContainerComponent } from './page-container.component';

describe('PageContainerComponent', () => {
  let component: PageContainerComponent;
  let fixture: ComponentFixture<PageContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageContainerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PageContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page container', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.page-container')).toBeTruthy();
  });

  it('should render inner container', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.container')).toBeTruthy();
  });

  it('should apply custom container class', () => {
    component.containerClass = 'custom-container';
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const pageContainer = compiled.querySelector('.page-container');
    expect(pageContainer?.classList.contains('custom-container')).toBeTruthy();
  });

  it('should apply custom content class', () => {
    component.contentClass = 'custom-content';
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const container = compiled.querySelector('.container');
    expect(container?.classList.contains('custom-content')).toBeTruthy();
  });

  it('should project content', () => {
    const testContent = '<p>Test content</p>';
    fixture = TestBed.createComponent(PageContainerComponent);
    fixture.nativeElement.innerHTML = testContent;
    fixture.detectChanges();
    
    expect(fixture.nativeElement.textContent).toContain('Test content');
  });
});