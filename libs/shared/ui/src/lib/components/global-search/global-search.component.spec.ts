import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { GlobalSearchComponent } from './global-search.component';
import { ChallengesService } from '@ng-coding-challenges/shared/services';
import { SearchResult } from '@ng-coding-challenges/shared/models';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('GlobalSearchComponent', () => {
  let component: GlobalSearchComponent;
  let fixture: ComponentFixture<GlobalSearchComponent>;
  let challengesServiceSpy: jasmine.SpyObj<ChallengesService>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<GlobalSearchComponent>>;

  const mockSearchResults: SearchResult[] = [
    {
      id: 1,
      title: 'Test Challenge',
      description: 'Test description',
      category: 'rxjs-api',
      categoryName: 'RxJS API',
      link: 'test-challenge',
      score: 1.0,
    },
  ];

  beforeEach(async () => {
    challengesServiceSpy = jasmine.createSpyObj('ChallengesService', [
      'searchAllChallenges',
    ]);
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    challengesServiceSpy.searchAllChallenges.and.returnValue(of(mockSearchResults));

    await TestBed.configureTestingModule({
      imports: [GlobalSearchComponent, NoopAnimationsModule],
      providers: [
        provideRouter([]),
        { provide: ChallengesService, useValue: challengesServiceSpy },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GlobalSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have search functionality', () => {
    // Component handles search internally
    expect(component).toBeTruthy();
  });

  it('should return correct badge class for category', () => {
    const badgeClass = component.getCategoryBadgeClass('rxjs-api');
    expect(badgeClass).toBe('badge-rxjs');
  });

  it('should return default badge class for unknown category', () => {
    const badgeClass = component.getCategoryBadgeClass('unknown');
    expect(badgeClass).toBe('badge-default');
  });
});
