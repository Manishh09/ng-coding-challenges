import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
    private apiUrl = 'https://jsonplaceholder.typicode.com/users';

    private http = inject(HttpClient);

    getUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.apiUrl);
    }
}
