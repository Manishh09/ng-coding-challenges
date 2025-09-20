import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, shareReplay } from 'rxjs';
import { Todo } from '../models/todo.model';

@Injectable({ providedIn: 'root' })
export class TodoService {
    private http = inject(HttpClient);
    private baseUrl = 'https://jsonplaceholder.typicode.com/todos';

    getTodos(): Observable<Todo[]> {
        return this.http.get<Todo[]>(this.baseUrl).pipe(
            map(todos => todos.slice(0, 40)), // Limit to first 40 for demo purposes
            
            shareReplay({ bufferSize: 1, refCount: true }) // Cache the latest emitted value and share the subscription
            // Can be shown in interview to demonstrate Performance optimization
        ); 
    }
}
