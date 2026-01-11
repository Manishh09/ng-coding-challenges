import { inject, Injectable, signal, computed } from '@angular/core';
import { combineLatest, map, shareReplay } from 'rxjs';
import { TodoService } from './todo.service';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class UserTodoFacadeService {
    private todoService = inject(TodoService);
    private userService = inject(UserService);

    // Reactive state with Angular signals
    filterStatus = signal<'all' | 'completed' | 'pending'>('all');

    // Combine todos + users
    todosWithUsers$ = combineLatest([
        this.todoService.getTodos(),
        this.userService.getUsers()
    ]).pipe(
        map(([todos, users]) =>
            todos.map(todo => ({
                ...todo,
                userName: users.find(user => user.id === todo.userId)?.name ?? 'Unknown'
            }))
        ),

        // shareReplay({ bufferSize: 1, refCount: true })

        // Performance optimization to avoid multiple HTTP calls when there are multiple subscribers

        // Note: 
        
        // shareReplay can be applied here or in the individual services

        // If you only need todosWithUsers$ in this feature, applying shareReplay directly on the combined stream is fine.

        // If you plan to reuse todos$ or users$ elsewhere, keep them individually shared.

        // If you are using shareReplay here, then you need to remove it from todo.service and user.service
    );

    

    // Derived computed signal with filtering

    filteredTodos$ = computed(() => {
        const status = this.filterStatus();

        return this.todosWithUsers$.pipe(
            map(todos =>
                todos.filter(todo =>
                    status === 'all' ||
                    (status === 'completed' && todo.completed) ||
                    (status === 'pending' && !todo.completed)
                )
            )
        );
    });
}

