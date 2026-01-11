import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { LandingPageComponent } from './landing-page.component';
import {
  ChallengeCategoryService,
  ChallengesService,
  NotificationService,
} from '@ng-coding-challenges/shared/services';
import { Challenge, ChallengeDifficulty } from '@ng-coding-challenges/shared/models';

describe('LandingPageComponent', () => {
  let component: LandingPageComponent;
  let fixture: ComponentFixture<LandingPageComponent>;
  let challengesServiceSpy: jasmine.SpyObj<ChallengesService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
  let categorySpy: jasmine.SpyObj<ChallengeCategoryService>;

  const mockChallenge: Challenge = {
    id: 1,
    title: 'Test Challenge',
    description: 'Test description',
    category: 'rxjs-api',
    link: 'test-challenge',
    difficulty: 'Beginner' as ChallengeDifficulty,
    tags: ['test'],
    gitHub: 'test/path',
    solutionGuide: 'test/solution',
  };

  beforeEach(async () => {
    challengesServiceSpy = jasmine.createSpyObj('ChallengesService', [
      'getChallenges',
      'getLatestChallenge',
      'getChallengeDetailsBySlug',
    ]);
    notificationServiceSpy = jasmine.createSpyObj('NotificationService', [
      'info',
      'error',
    ]);
    categorySpy = jasmine.createSpyObj('ChallengeCategoryService', [], {
      categories: of([]),
    });

    challengesServiceSpy.getChallenges.and.returnValue(of([mockChallenge]));
    challengesServiceSpy.getLatestChallenge.and.returnValue(of(mockChallenge));

    await TestBed.configureTestingModule({
      imports: [LandingPageComponent, NoopAnimationsModule],
      providers: [
        provideRouter([]),
        { provide: ChallengesService, useValue: challengesServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: ChallengeCategoryService, useValue: categorySpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to latest challenge when available', (done) => {
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigate');

    component.goToLatestChallenge();

    setTimeout(() => {
      expect(navigateSpy).toHaveBeenCalledWith([
        'challenges/rxjs-api/test-challenge',
      ]);
      done();
    }, 50);
  });

  it('should show notification when no challenges available', (done) => {
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigate');
    challengesServiceSpy.getLatestChallenge.and.returnValue(of(undefined));

    component.goToLatestChallenge();

    setTimeout(() => {
      expect(notificationServiceSpy.info).toHaveBeenCalledWith(
        'No challenges available yet. Check back soon!'
      );
      expect(navigateSpy).toHaveBeenCalledWith(['challenges']);
      done();
    }, 50);
  });

  it('should handle error when fetching latest challenge', (done) => {
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigate');
    challengesServiceSpy.getLatestChallenge.and.returnValue(
      throwError(() => new Error('Network error'))
    );

    component.goToLatestChallenge();

    setTimeout(() => {
      expect(notificationServiceSpy.error).toHaveBeenCalledWith(
        'Failed to load latest challenge'
      );
      expect(navigateSpy).toHaveBeenCalledWith(['challenges']);
      done();
    }, 50);
  });

  it('should navigate to category', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigate');

    component.navigateToCategory('rxjs-api');

    expect(navigateSpy).toHaveBeenCalledWith(['challenges', 'rxjs-api']);
  });
});
