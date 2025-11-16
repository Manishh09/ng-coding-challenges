import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { HighlightTextPipe } from './highlight-text.pipe';

describe('HighlightTextPipe', () => {
  let pipe: HighlightTextPipe;
  let sanitizer: DomSanitizer;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DomSanitizer]
    });
    sanitizer = TestBed.inject(DomSanitizer);
    pipe = new HighlightTextPipe();
    // Inject sanitizer manually for testing
    (pipe as any).sanitizer = sanitizer;
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return original text when search term is empty', () => {
    const text = 'Hello World';
    expect(pipe.transform(text, '')).toBe(text);
  });

  it('should return original text when text is empty', () => {
    const result = pipe.transform('', 'search');
    expect(result).toBe('');
  });

  it('should highlight single matching word', () => {
    const text = 'Fetch Products from API';
    const result = pipe.transform(text, 'fetch') as string;
    expect(result).toContain('<mark class="highlight-match">Fetch</mark>');
  });

  it('should highlight multiple matching words', () => {
    const text = 'Fetch Products from API';
    const result = pipe.transform(text, 'fetch api') as string;
    expect(result).toContain('<mark class="highlight-match">Fetch</mark>');
    expect(result).toContain('<mark class="highlight-match">API</mark>');
  });

  it('should be case-insensitive', () => {
    const text = 'Angular RxJS Challenge';
    const result = pipe.transform(text, 'rxjs') as string;
    expect(result).toContain('<mark class="highlight-match">RxJS</mark>');
  });

  it('should escape special regex characters', () => {
    const text = 'What is API? Learn more';
    const result = pipe.transform(text, 'api?') as string;
    expect(result).toContain('API?');
  });
});
