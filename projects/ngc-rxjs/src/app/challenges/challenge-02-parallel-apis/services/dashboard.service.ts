import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, EMPTY, forkJoin, map, Observable, of } from 'rxjs';
import { User } from '../models/user';
import { Post } from '../models/post';
 import { DashboardResponse } from '../models/dasboard';
import { ApiResponse } from 'projects/coding-challenges/src/app/challenges/shared/models/api-response';
import { wrapApi } from 'projects/coding-challenges/src/app/challenges/shared/functions/wrapAPI';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  #apiUrl = 'https://jsonplaceholder.typicode.com';

  #httpClient = inject(HttpClient);

  getDashboardData(): Observable<DashboardResponse> {
    const users$ = this.#httpClient.get<User[]>(`${this.#apiUrl}/users`)
      .pipe(
        map(users => users.slice(0, 5)), // Limit to 5 users
        catchError((error: HttpErrorResponse) => {
          console.error('Users API failed:', error);
          return of(error); // Return error on error
        })
      );

    const posts$ = this.#httpClient.get<Post[]>(`${this.#apiUrl}/posts`)
      .pipe(
        map(posts => posts.slice(0, 5)), // Limit to 5 posts
        catchError((error: HttpErrorResponse) => {
          console.error('Posts API failed:', error);
          return of(error); // Return error on error
        })
      );

    return forkJoin({ users: users$, posts: posts$ });
  }


  // ADVANCED: Using wrapApi function for better error handling
  /**
   * This method fetches users and posts data from the API.
   * This method wraps the API calls with error handling and returns a structured response.
   * It uses the wrapApi function to handle errors and return ApiResponse objects.
   */
  getDashboardDataWithFallback(): Observable<{
    users: ApiResponse<User[]>;
    posts: ApiResponse<Post[]>;
  }> {
    return forkJoin({
      users: wrapApi(this.#httpClient.get<User[]>(`${this.#apiUrl}/users`), 'Users fetch failed'),
      posts: wrapApi(this.#httpClient.get<Post[]>(`${this.#apiUrl}/posts`), 'Posts fetch failed')
    });
  }



}
