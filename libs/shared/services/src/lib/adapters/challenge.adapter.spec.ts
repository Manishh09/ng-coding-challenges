import { TestBed } from '@angular/core/testing';
import { ChallengeAdapter } from './challenge.adapter';
import { IChallengeAdapter } from './challenge.adapter.interface';
import { ChallengeData, CategorySlug } from '@ng-coding-challenges/shared/models';

describe('ChallengeAdapter', () => {
  let adapter: IChallengeAdapter;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: IChallengeAdapter, useClass: ChallengeAdapter }
      ]
    });
    adapter = TestBed.inject(IChallengeAdapter);
  });

  describe('adaptToChallenge', () => {
    it('should adapt ChallengeData to Challenge interface', () => {
      const mockData: ChallengeData = {
        id: 1,
        slug: 'test-challenge',
        title: 'Test Challenge',
        categoryId: 'rxjs-api' as CategorySlug,
        difficulty: 'Beginner',
        enabled: true,
        order: 1,
        description: 'Test description',
        longDescription: 'Long description',
        tags: ['RxJS', 'Observables'],
        estimatedTime: '30 min',
        prerequisites: [],
        learningOutcomes: ['Learn testing'],
        requirementList: [],
        links: {
          requirement: 'https://example.com/req',
          solution: 'https://example.com/sol',
          github: 'https://github.com/test'
        },
        workspace: {
          componentPath: 'test/path',
          componentName: 'TestComponent'
        }
      };

      const result = adapter.adaptToChallenge(mockData);

      expect(result.id).toBe(1);
      expect(result.title).toBe('Test Challenge');
      expect(result.link).toBe('test-challenge');
      expect(result.category).toBe('rxjs-api');
      expect(result.difficulty).toBe('Beginner');
      expect(result.tags).toEqual(['RxJS', 'Observables']);
      expect(result.gitHub).toBe('https://github.com/test');
    });

    it('should handle empty tags array', () => {
      const mockData: ChallengeData = {
        id: 1,
        slug: 'test',
        title: 'Test',
        categoryId: 'angular-core' as CategorySlug,
        difficulty: 'Intermediate',
        enabled: true,
        order: 1,
        description: 'Test',
        longDescription: 'Test',
        tags: [],
        estimatedTime: '1h',
        prerequisites: [],
        learningOutcomes: [],
        requirementList: [],
        links: {
          requirement: '',
          solution: '',
          github: ''
        },
        workspace: {
          componentPath: '',
          componentName: ''
        }
      };

      const result = adapter.adaptToChallenge(mockData);

      expect(result.tags).toEqual([]);
    });
  });

  describe('adaptToChallengeDetails', () => {
    it('should adapt ChallengeData to ChallengeDetails with all extended properties', () => {
      const mockData: ChallengeData = {
        id: 2,
        slug: 'advanced-rxjs',
        title: 'Advanced RxJS',
        categoryId: 'rxjs-api' as CategorySlug,
        difficulty: 'Advanced',
        enabled: true,
        order: 5,
        description: 'Advanced RxJS patterns',
        longDescription: 'Deep dive into advanced RxJS operators and patterns',
        tags: ['RxJS', 'Advanced'],
        estimatedTime: '2h',
        prerequisites: ['Basic RxJS knowledge'],
        learningOutcomes: [
          'Master switchMap',
          'Understand error handling'
        ],
        requirementList: [
          'Implement custom operators',
          'Handle complex streams'
        ],
        links: {
          requirement: 'https://example.com/req',
          solution: 'https://example.com/sol',
          github: 'https://github.com/advanced'
        },
        workspace: {
          componentPath: 'advanced/path',
          componentName: 'AdvancedComponent'
        }
      };

      const result = adapter.adaptToChallengeDetails(mockData);

      // Base Challenge properties
      expect(result.id).toBe(2);
      expect(result.title).toBe('Advanced RxJS');

      // Extended ChallengeDetails properties
      expect(result.longDescription).toBe('Deep dive into advanced RxJS operators and patterns');
      expect(result.learningOutcomes).toEqual(['Master switchMap', 'Understand error handling']);
      expect(result.techStack).toEqual(['RxJS', 'Advanced']);
      expect(result.requirementList).toEqual(['Implement custom operators', 'Handle complex streams']);
      expect(result.estimatedTime).toBe('2h');
      expect(result.prerequisites).toEqual(['Basic RxJS knowledge']);

      // Author
      expect(result.author.name).toBe('Manish Boge');
      expect(result.author.profileUrl).toBe('https://github.com/Manishh09');
    });
  });

  describe('adaptToChallengeList', () => {
    it('should adapt array of ChallengeData to array of Challenge', () => {
      const mockDataArray: ChallengeData[] = [
        {
          id: 1,
          slug: 'challenge-1',
          title: 'Challenge 1',
          categoryId: 'rxjs-api' as CategorySlug,
          difficulty: 'Beginner',
          enabled: true,
          order: 1,
          description: 'First challenge',
          longDescription: 'Long desc 1',
          tags: ['RxJS'],
          estimatedTime: '30min',
          prerequisites: [],
          learningOutcomes: [],
          requirementList: [],
          links: {
            requirement: '',
            solution: '',
            github: ''
          },
          workspace: {
            componentPath: '',
            componentName: ''
          }
        },
        {
          id: 2,
          slug: 'challenge-2',
          title: 'Challenge 2',
          categoryId: 'angular-core' as CategorySlug,
          difficulty: 'Intermediate',
          enabled: true,
          order: 2,
          description: 'Second challenge',
          longDescription: 'Long desc 2',
          tags: ['Angular'],
          estimatedTime: '1h',
          prerequisites: [],
          learningOutcomes: [],
          requirementList: [],
          links: {
            requirement: '',
            solution: '',
            github: ''
          },
          workspace: {
            componentPath: '',
            componentName: ''
          }
        }
      ];

      const result = adapter.adaptToChallengeList(mockDataArray);

      expect(result.length).toBe(2);
      expect(result[0].id).toBe(1);
      expect(result[0].title).toBe('Challenge 1');
      expect(result[1].id).toBe(2);
      expect(result[1].title).toBe('Challenge 2');
    });

    it('should handle empty array', () => {
      const result = adapter.adaptToChallengeList([]);
      expect(result).toEqual([]);
    });
  });

  describe('adaptCategoryIdToSlug', () => {
    it('should map valid category IDs to slugs', () => {
      expect(adapter.adaptCategoryIdToSlug('rxjs-api')).toBe('rxjs-api');
      expect(adapter.adaptCategoryIdToSlug('angular-core')).toBe('angular-core');
      expect(adapter.adaptCategoryIdToSlug('angular-routing')).toBe('angular-routing');
    });

    it('should handle deprecated "http" category', () => {
      spyOn(console, 'warn');
      const result = adapter.adaptCategoryIdToSlug('http');

      expect(result).toBe('rxjs-api');
      expect(console.warn).toHaveBeenCalledWith(
        '[ChallengeAdapter] Category "http" is deprecated, using "rxjs-api" instead'
      );
    });
  });
});

/**
 * Example: Testing with Mock Adapter
 * Demonstrates how the Adapter Pattern enables easy mocking
 */
describe('ChallengeAdapter - Mock Example', () => {
  class MockChallengeAdapter implements IChallengeAdapter {
    adaptToChallenge = jasmine.createSpy('adaptToChallenge').and.returnValue({
      id: 999,
      title: 'Mocked Challenge',
      description: 'Mocked',
      link: 'mocked',
      category: 'rxjs-api',
      difficulty: 'Beginner',
      tags: []
    });

    adaptToChallengeDetails = jasmine.createSpy('adaptToChallengeDetails');
    adaptToChallengeList = jasmine.createSpy('adaptToChallengeList');
    adaptCategoryIdToSlug = jasmine.createSpy('adaptCategoryIdToSlug');
  }

  it('should allow easy mocking for testing', () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: IChallengeAdapter, useClass: MockChallengeAdapter }
      ]
    });

    const mockAdapter = TestBed.inject(IChallengeAdapter);
    const result = mockAdapter.adaptToChallenge({} as ChallengeData);

    expect(result.id).toBe(999);
    expect(result.title).toBe('Mocked Challenge');
    expect(mockAdapter.adaptToChallenge).toHaveBeenCalled();
  });
});
