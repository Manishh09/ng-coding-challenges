import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkeletonLoaderComponent } from './skeleton-loader.component';

describe('SkeletonLoaderComponent', () => {
  let component: SkeletonLoaderComponent;
  let fixture: ComponentFixture<SkeletonLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonLoaderComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SkeletonLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render text variant by default', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const skeleton = compiled.querySelector('.skeleton--text');
    expect(skeleton).toBeTruthy();
  });

  it('should apply custom width and height', () => {
    fixture.componentRef.setInput('width', '200px');
    fixture.componentRef.setInput('height', '100px');
    fixture.detectChanges();

    const styles = component.getStyles();
    expect(styles['width']).toBe('200px');
    expect(styles['height']).toBe('100px');
  });

  it('should generate correct number of lines for text-block', () => {
    fixture.componentRef.setInput('variant', 'text-block');
    fixture.componentRef.setInput('lines', 5);
    fixture.detectChanges();

    const linesArray = component.getLinesArray();
    expect(linesArray.length).toBe(5);
  });

  it('should apply animation speed class', () => {
    fixture.componentRef.setInput('speed', 'fast');
    fixture.detectChanges();

    const classes = component.getClasses();
    expect(classes).toContain('skeleton--speed-fast');
  });

  it('should disable animation when noAnimation is true', () => {
    fixture.componentRef.setInput('noAnimation', true);
    fixture.detectChanges();

    const classes = component.getClasses();
    expect(classes).toContain('skeleton--no-animation');
  });
});
