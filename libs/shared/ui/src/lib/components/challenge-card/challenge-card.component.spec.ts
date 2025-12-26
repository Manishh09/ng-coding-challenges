import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ChallengeCardComponent } from './challenge-card.component';
import { Challenge } from '@ng-coding-challenges/shared/models';
import { NavigationService, NotificationService } from '@ng-coding-challenges/shared/services';
describe('ChallengeCardComponent', () => {
  let component: ChallengeCardComponent;
  let fixture: ComponentFixture<ChallengeCardComponent>;
  let navigationService: jasmine.SpyObj<NavigationService>;
  let notificationService: jasmine.SpyObj<NotificationService>;

  const mockChallenge: Challenge = {
    id: 1,
    title: 'Test Challenge',
    description: 'This is a test challenge description',
    link: '/test-challenge',
    requirement: 'https://github.com/test/repo/blob/master/README.md',
    gitHub: 'https://github.com/test/repo'
  };

  beforeEach(async () => {
    const navigationServiceSpy = jasmine.createSpyObj('NavigationService', [
      'openChallengeRequirement',
      'openExternalLink',
      'getHostname'
    ]);
    const notificationServiceSpy = jasmine.createSpyObj('NotificationService', [
      'error',
      'success',
      'info',
      'warning'
    ]);

    await TestBed.configureTestingModule({
      imports: [
        ChallengeCardComponent,
        RouterTestingModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: NavigationService, useValue: navigationServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ChallengeCardComponent);
    component = fixture.componentInstance;
    navigationService = TestBed.inject(NavigationService) as jasmine.SpyObj<NavigationService>;
    notificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;

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

  describe('goToChallenge', () => {
    it('should call navigationService.openChallengeRequirement with correct URL', async () => {
      navigationService.openChallengeRequirement.and.returnValue(Promise.resolve(true));

      await component.goToChallenge(mockChallenge.requirement);

      expect(navigationService.openChallengeRequirement).toHaveBeenCalledWith(mockChallenge.requirement);
    });

    it('should show error notification when navigation fails', async () => {
      navigationService.openChallengeRequirement.and.returnValue(Promise.resolve(false));

      await component.goToChallenge(mockChallenge.requirement);

      expect(notificationService.error).toHaveBeenCalledWith(
        'Unable to open challenge requirement. Please check if popups are blocked.'
      );
    });

    it('should handle navigation service errors with error notification', async () => {
      navigationService.openChallengeRequirement.and.returnValue(Promise.reject(new Error('Test error')));

      await component.goToChallenge(mockChallenge.requirement);

      expect(notificationService.error).toHaveBeenCalledWith(
        'An error occurred while opening the challenge requirement.'
      );
    });
  });

  describe('openGitHub', () => {
    it('should call navigationService.openExternalLink with correct URL', async () => {
      navigationService.openExternalLink.and.returnValue(Promise.resolve(true));

      await component.openGitHub(mockChallenge.gitHub);

      expect(navigationService.openExternalLink).toHaveBeenCalledWith(mockChallenge.gitHub);
    });

    it('should show error notification when GitHub navigation fails', async () => {
      navigationService.openExternalLink.and.returnValue(Promise.resolve(false));

      await component.openGitHub(mockChallenge.gitHub);

      expect(notificationService.error).toHaveBeenCalledWith(
        'Unable to open GitHub repository. Please check if popups are blocked.'
      );
    });

    it('should handle GitHub navigation errors with error notification', async () => {
      navigationService.openExternalLink.and.returnValue(Promise.reject(new Error('Test error')));

      await component.openGitHub(mockChallenge.gitHub);

      expect(notificationService.error).toHaveBeenCalledWith(
        'An error occurred while opening the GitHub repository.'
      );
    });
  });

  describe('getDomain', () => {
    it('should return hostname from navigationService', () => {
      navigationService.getHostname.and.returnValue('github.com');

      const result = component.getDomain('https://github.com/test/repo');

      expect(result).toBe('github.com');
      expect(navigationService.getHostname).toHaveBeenCalledWith('https://github.com/test/repo');
    });
  });

  describe('UI interactions', () => {
    it('should call goToChallenge when challenge button is clicked', () => {
      spyOn(component, 'goToChallenge');

      const button = fixture.nativeElement.querySelector('.challenge-button');
      button.click();

      expect(component.goToChallenge).toHaveBeenCalledWith(mockChallenge.requirement);
    });

    it('should disable challenge button when no requirement URL', () => {
      component.challenge = { ...mockChallenge, requirement: '' };
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('.challenge-button');
      expect(button.disabled).toBe(true);
    });

    it('should disable requirements button when no requirement URL', () => {
      component.challenge = { ...mockChallenge, requirement: '' };
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('.requirement-button');
      expect(button.disabled).toBe(true);
    });

    it('should show more options menu when GitHub URL is available', () => {
      const menuTrigger = fixture.nativeElement.querySelector('.more-options');
      expect(menuTrigger).toBeTruthy();
    });

    it('should not show more options menu when no GitHub URL', () => {
      component.challenge = { ...mockChallenge, gitHub: '' };
      fixture.detectChanges();

      const menuTrigger = fixture.nativeElement.querySelector('.more-options');
      expect(menuTrigger).toBeFalsy();
    });
  });
});
