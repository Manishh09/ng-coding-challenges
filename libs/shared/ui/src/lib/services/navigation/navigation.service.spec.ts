import { TestBed } from '@angular/core/testing';
import { NavigationService } from './navigation.service';

describe('NavigationService', () => {
  let service: NavigationService;
  let windowOpenSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NavigationService);
    
    // Mock window.open
    windowOpenSpy = spyOn(window, 'open').and.returnValue({
      opener: null
    } as any);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('openExternalLink', () => {
    it('should open valid GitHub URL', async () => {
      const url = 'https://github.com/user/repo';
      const result = await service.openExternalLink(url);
      
      expect(result).toBe(true);
      expect(windowOpenSpy).toHaveBeenCalledWith(url, '_blank', 'noopener,noreferrer');
    });

    it('should reject invalid URLs', async () => {
      const result = await service.openExternalLink('invalid-url');
      
      expect(result).toBe(false);
      expect(windowOpenSpy).not.toHaveBeenCalled();
    });

    it('should handle blocked popups gracefully', async () => {
      windowOpenSpy.and.returnValue(null);
      
      const result = await service.openExternalLink('https://github.com/user/repo');
      
      expect(result).toBe(false);
    });
  });

  describe('openChallengeRequirement', () => {
    it('should open challenge requirement with specific window name', async () => {
      const url = 'https://github.com/user/repo/blob/master/README.md';
      const result = await service.openChallengeRequirement(url);
      
      expect(result).toBe(true);
      expect(windowOpenSpy).toHaveBeenCalledWith(url, 'challenge_requirement', 'noopener,noreferrer');
    });

    it('should handle empty requirement URL', async () => {
      const result = await service.openChallengeRequirement('');
      
      expect(result).toBe(false);
      expect(windowOpenSpy).not.toHaveBeenCalled();
    });
  });

  describe('getHostname', () => {
    it('should extract hostname from valid URL', () => {
      const hostname = service.getHostname('https://github.com/user/repo');
      expect(hostname).toBe('github.com');
    });

    it('should return empty string for invalid URL', () => {
      const hostname = service.getHostname('invalid-url');
      expect(hostname).toBe('');
    });
  });
});
