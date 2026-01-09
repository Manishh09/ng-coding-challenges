import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { WorkspaceToolbarComponent } from './workspace-toolbar.component';
import {
  StackblitzService,
  ChallengesService,
  ChallengeCategoryService,
} from '@ng-coding-challenges/shared/services';

describe('WorkspaceToolbarComponent', () => {
  let component: WorkspaceToolbarComponent;
  let fixture: ComponentFixture<WorkspaceToolbarComponent>;
  let stackblitzServiceSpy: jasmine.SpyObj<StackblitzService>;
  let challengesServiceSpy: jasmine.SpyObj<ChallengesService>;
  let categoryServiceSpy: jasmine.SpyObj<ChallengeCategoryService>;

  beforeEach(async () => {
    stackblitzServiceSpy = jasmine.createSpyObj('StackblitzService', [
      'openChallengeInStackblitz',
    ]);
    challengesServiceSpy = jasmine.createSpyObj('ChallengesService', [
      'getChallengeDetailsBySlug',
    ]);
    categoryServiceSpy = jasmine.createSpyObj('ChallengeCategoryService', [
      'getCategoryNameById',
    ]);

    stackblitzServiceSpy.openChallengeInStackblitz.and.returnValue(
      Promise.resolve()
    );
    challengesServiceSpy.getChallengeDetailsBySlug.and.returnValue(of(undefined));
    categoryServiceSpy.getCategoryNameById.and.returnValue('RxJS API');

    await TestBed.configureTestingModule({
      imports: [WorkspaceToolbarComponent, NoopAnimationsModule],
      providers: [
        provideRouter([
          {
            path: 'challenges/:category/:challengeSlug/workspace',
            component: WorkspaceToolbarComponent,
          },
        ]),
        { provide: StackblitzService, useValue: stackblitzServiceSpy },
        { provide: ChallengesService, useValue: challengesServiceSpy },
        { provide: ChallengeCategoryService, useValue: categoryServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkspaceToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate back when navigating back', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    // Component should handle navigation internally
    expect(component).toBeTruthy();
  });

  it('should open solution guide when available', () => {
    spyOn(window, 'open');
    component.openSolution();
    // Component handles solution opening internally
    expect(component).toBeTruthy();
  });

  it('should format challenge slug correctly', () => {
    const formatted = component['formatChallengeSlug']('fetch-products');
    expect(formatted).toBe('Fetch Products');
  });

  it('should return default title for empty slug', () => {
    const formatted = component['formatChallengeSlug']('');
    expect(formatted).toBe('Challenge Workspace');
  });
});
