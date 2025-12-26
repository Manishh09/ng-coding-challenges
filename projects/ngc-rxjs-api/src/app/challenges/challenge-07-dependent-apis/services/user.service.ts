import { inject, Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { catchError, map, Observable, of, retry } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private http = inject(HttpClient);
  private baseURL = 'https://dummyjson.com/users';

  getUsers(): Observable<User[]> {
    return this.http.get<{users: User[]}>(this.baseURL).pipe(
      map(resp => resp.users),
      retry(1)
    );
  }
}
