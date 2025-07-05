import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ChallengeCardComponent, ChallengeCardData } from './challenge-card.component';

describe('ChallengeCardComponent', () => {
  let component: ChallengeCardComponent;
  let fixture: ComponentFixture<ChallengeCardComponent>;

  const mockChallenge: ChallengeCardData = {
    id: '1',
    title: 'Test Challenge',
    description: 'This is a test challenge description',
    difficulty: 'intermediate',
    category: 'RxJS',
    tags: ['rxjs', 'observables', 'operators'],
    estimatedTime: 30,
    isCompleted: false,
    isFeatured: false
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ChallengeCardComponent,
        RouterTestingModule,
        NoopAnimationsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ChallengeCardComponent);
    component = fixture.componentInstance;
    component.challenge = mockChallenge;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render challenge title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('mat-card-title')?.textContent).toContain('Test Challenge');
  });

  it('should render challenge description', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.description')?.textContent)
      .toContain('This is a test challenge description');
  });

  it('should render difficulty badge', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const difficultyBadge = compiled.querySelector('.difficulty');
    expect(difficultyBadge?.textContent).toContain('Intermediate');
    expect(difficultyBadge?.classList.contains('difficulty-intermediate')).toBeTruthy();
  });

  it('should render category', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.category')?.textContent).toContain('RxJS');
  });

  it('should render tags', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const chips = compiled.querySelectorAll('mat-chip');
    expect(chips.length).toBe(3); // All 3 tags should be shown
  });

  it('should render estimated time', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.time-estimate span')?.textContent).toContain('30min');
  });

  it('should render start button for uncompleted challenge', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('mat-card-actions button');
    expect(button?.textContent).toContain('Start Challenge');
  });

  it('should render review button for completed challenge', () => {
    component.challenge = { ...mockChallenge, isCompleted: true };
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('mat-card-actions button');
    expect(button?.textContent).toContain('Review');
  });

  it('should show completed status for completed challenge', () => {
    component.challenge = { ...mockChallenge, isCompleted: true };
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const statusIndicator = compiled.querySelector('.status-indicator');
    expect(statusIndicator?.textContent).toContain('Completed');
  });

  it('should show featured badge for featured challenge', () => {
    component.challenge = { ...mockChallenge, isFeatured: true };
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const featuredBadge = compiled.querySelector('.featured-badge');
    expect(featuredBadge?.textContent).toContain('Featured');
  });

  it('should not show featured badge for non-featured challenge', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const featuredBadge = compiled.querySelector('.featured-badge');
    expect(featuredBadge).toBeFalsy();
  });

  it('should show more tags indicator when there are more than 3 tags', () => {
    component.challenge = { 
      ...mockChallenge, 
      tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5'] 
    };
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const moreTagsChip = compiled.querySelector('.more-tags');
    expect(moreTagsChip?.textContent).toContain('+2 more');
  });

  it('should have proper router link', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('button[routerLink]');
    expect(button?.getAttribute('ng-reflect-router-link')).toBe('/challenges,1');
  });

  it('should apply completed class when challenge is completed', () => {
    component.challenge = { ...mockChallenge, isCompleted: true };
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const card = compiled.querySelector('.challenge-card');
    expect(card?.classList.contains('completed')).toBeTruthy();
  });

  it('should apply featured class when challenge is featured', () => {
    component.challenge = { ...mockChallenge, isFeatured: true };
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const card = compiled.querySelector('.challenge-card');
    expect(card?.classList.contains('featured')).toBeTruthy();
  });
});