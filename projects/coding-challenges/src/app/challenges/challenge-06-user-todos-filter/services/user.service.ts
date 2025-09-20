import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
    private http = inject(HttpClient);
    private baseUrl = 'https://jsonplaceholder.typicode.com/users';

    getUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.baseUrl).pipe(
            shareReplay({ bufferSize: 1, refCount: true }) // Cache the latest emitted value and share the subscription
            // Can be shown in interview to demonstrate Performance optimization
        );
    }
}
