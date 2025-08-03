import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { User } from '../models/user';
import { Post } from '../models/post';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  #apiUrl = 'https://jsonplaceholder.typicode.com';

  #httpClient = inject(HttpClient);

  getDashboardData(): Observable<{ users: User[], posts: Post[] }> {
    return forkJoin({
      users: this.#httpClient.get<User[]>(`${this.#apiUrl}/users`),
      posts: this.#httpClient.get<Post[]>(`${this.#apiUrl}/posts`),
    });
  }

}
