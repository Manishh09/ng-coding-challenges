import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {  catchError, map, of } from 'rxjs';
 
@Injectable({ providedIn: 'root' })
export class UserSearchService {
    private readonly apiUrl = 'https://dummyjson.com/users';

    // http client
    private http = inject(HttpClient);

    searchUsers(query: string) {
        if (!query.trim()) {
            return of({ users: [] }); // Empty result for blank search
        }
        return this.http.get<{ users: any[] }>(`${this.apiUrl}/search?q=${query}`).pipe(
            catchError(() => of({ users: [] })) // Graceful error handling
        );
    }
}
