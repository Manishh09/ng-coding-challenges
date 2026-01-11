import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ConfigLoaderService } from './config-loader.service';
import { ChallengeConfig, CategoryConfig } from '@ng-coding-challenges/shared/models';

describe('ConfigLoaderService', () => {
  let service: ConfigLoaderService;
  let httpMock: HttpTestingController;

  const mockCategoryConfig: CategoryConfig = {
    version: '1.0.0',
    lastUpdated: '2025-11-30T00:00:00Z',
    metadata: {
      author: {
        name: 'Test Author',
        avatar: '/test.jpg',
        profileUrl: 'https://test.com'
      },
      repository: 'https://github.com/test/repo'
    },
    categories: [
      {
        id: 1,
        slug: 'rxjs-api',
        title: 'RxJS & APIs',
        description: 'Test description',
        icon: 'api',
        order: 1,
        enabled: true,
        route: {
          path: 'rxjs-api',
          moduleName: '@ngc-rxjs-api',
          exportName: 'NGC_RXJS_API_ROUTES'
        },
        techStack: ['Angular 19+', 'RxJS'],
        metadata: {
          color: '#DD0031',
          gradient: 'test-gradient'
        }
      }
    ]
  };

  const mockChallengeConfig: ChallengeConfig = {
    version: '1.0.0',
    lastUpdated: '2025-11-30T00:00:00Z',
    baseRepository: 'https://github.com/test/repo',
    defaultAuthor: {
      name: 'Test Author',
      avatar: '/test.jpg',
      profileUrl: 'https://test.com'
    },
    challenges: {
      'rxjs-api': {
        'fetch-products': {
          id: 1,
          slug: 'fetch-products',
          title: 'Test Challenge',
          categoryId: 'rxjs-api',
          difficulty: 'Beginner',
          enabled: true,
          order: 1,
          description: 'Test description',
          longDescription: 'Test long description',
          tags: ['HttpClient'],
          estimatedTime: '30 minutes',
          prerequisites: [],
          learningOutcomes: [],
          requirementsList: [],
          links: {
            requirement: 'test-req.md',
            solution: 'test-sol.md',
            github: 'test-repo'
          },
          workspace: {
            componentPath: './test',
            componentName: 'TestComponent'
          }
        }
      },
      'angular-core': {},
      'angular-routing': {}
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ConfigLoaderService]
    });
    service = TestBed.inject(ConfigLoaderService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCategoriesConfig', () => {
    it('should load and cache categories configuration', () => {
      service.getCategoriesConfig().subscribe(config => {
        expect(config).toEqual(mockCategoryConfig);
      });

      const req = httpMock.expectOne('/config/categories.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockCategoryConfig);
    });

    it('should cache categories config (single HTTP call)', () => {
      service.getCategoriesConfig().subscribe();
      service.getCategoriesConfig().subscribe();

      const req = httpMock.expectOne('/config/categories.json');
      req.flush(mockCategoryConfig);
    });
  });

  describe('getChallengesConfig', () => {
    it('should load and cache challenges configuration', () => {
      service.getChallengesConfig().subscribe(config => {
        expect(config).toEqual(mockChallengeConfig);
      });

      const req = httpMock.expectOne('/config/challenges.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockChallengeConfig);
    });
  });

  describe('getChallengesByCategory', () => {
    it('should return challenges for a specific category', (done) => {
      service.getChallengesByCategory('rxjs-api').subscribe(challenges => {
        expect(challenges.length).toBe(1);
        expect(challenges[0].slug).toBe('fetch-products');
        done();
      });

      const req = httpMock.expectOne('/config/challenges.json');
      req.flush(mockChallengeConfig);
    });

    it('should return empty array for non-existent category', (done) => {
      service.getChallengesByCategory('angular-core').subscribe(challenges => {
        expect(challenges.length).toBe(0);
        done();
      });

      const req = httpMock.expectOne('/config/challenges.json');
      req.flush(mockChallengeConfig);
    });
  });

  describe('getChallengeBySlug', () => {
    it('should return challenge with O(1) lookup', (done) => {
      service.getChallengeBySlug('rxjs-api', 'fetch-products').subscribe(challenge => {
        expect(challenge).toBeDefined();
        expect(challenge?.slug).toBe('fetch-products');
        done();
      });

      const req = httpMock.expectOne('/config/challenges.json');
      req.flush(mockChallengeConfig);
    });

    it('should return undefined for non-existent challenge', (done) => {
      service.getChallengeBySlug('rxjs-api', 'non-existent').subscribe(challenge => {
        expect(challenge).toBeUndefined();
        done();
      });

      const req = httpMock.expectOne('/config/challenges.json');
      req.flush(mockChallengeConfig);
    });
  });
});
