import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError, retry, shareReplay } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Post } from '../models/post.model';

@Injectable({ providedIn: 'root' })
export class PostService {
  private http = inject(HttpClient);
  private baseURL = 'https://dummyjson.com';

  /**
   * Fetch posts for a given userId from dummyjson:
   * GET /posts/user/{userId}
   *
   * The API returns { posts: Post[], total: number, ... } — map to Post[] defensively.
   */
  getPostsByUser(userId: number): Observable<Post[]> {
    return this.http.get<{posts: Post[]}>(`${this.baseURL}/posts/user/${userId}`).pipe(
      retry(1),
      map(resp => resp.posts),
      catchError(err => {
        console.error(`Failed to fetch posts for user ${userId}`, err);
        return of([] as Post[]);
      })
    );
  }
}
