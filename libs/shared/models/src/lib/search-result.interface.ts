/**
 * Represents a search result item for global challenge search
 */
export interface SearchResult {
  id: number;
  title: string;
  description: string;
  category: string;
  categoryName: string;
  link: string;
  score: number;
}
