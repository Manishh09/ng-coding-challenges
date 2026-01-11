import { Pipe, PipeTransform, inject, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/**
 * Pipe to highlight matching text in search results
 *
 * Usage:
 * <p [innerHTML]="text | highlightText:searchTerm"></p>
 *
 * Features:
 * - Case-insensitive matching
 * - Multiple search terms (splits by space)
 * - HTML sanitization for security
 * - Escapes regex special characters
 */
@Pipe({
  name: 'highlightText',
  standalone: true,
  pure: true
})
export class HighlightTextPipe implements PipeTransform {
  private readonly sanitizer = inject(DomSanitizer);

  transform(text: string, search: string): SafeHtml {
    if (!search || !text) {
      return text;
    }

    // Split search term by spaces and filter empty strings
    const searchTerms = search
      .trim()
      .split(/\s+/)
      .filter(term => term.length > 0)
      .map(term => this.escapeRegex(term));

    if (searchTerms.length === 0) {
      return text;
    }

    // Create regex pattern for all search terms
    const pattern = searchTerms.join('|');
    const regex = new RegExp(`(${pattern})`, 'gi');

    // Replace matches with highlighted markup
    const highlighted = text.replace(
      regex,
      '<mark class="highlight-match">$1</mark>'
    );

    // Sanitize the HTML to prevent XSS attacks
    return this.sanitizer.sanitize(SecurityContext.HTML, highlighted) || text;
  }

  /**
   * Escape special regex characters to treat search term as literal string
   */
  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
