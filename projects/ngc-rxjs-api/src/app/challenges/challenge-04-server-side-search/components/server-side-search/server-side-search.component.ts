import { Component, DestroyRef, inject, signal } from '@angular/core';
import { UserSearchService } from '../../services/user-search.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs';
import { User } from '../../models/user.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
 @Component({
  selector: 'app-server-side-search',
  imports: [
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './server-side-search.component.html',
  styleUrl: './server-side-search.component.scss'
})
export class ServerSideSearchComponent {
  hasSearched = signal(false);
  searchControl = new FormControl('');

  // State variables
  users = signal<User[]>([]);
  loading = signal(false);
  error = signal('');

  // Services
  private readonly userSearchService = inject(UserSearchService);

  // DestroyRef
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap((query) => {
          this.hasSearched.set(!!query?.trim());
          this.loading.set(true);
          this.error.set('');
        }),
        switchMap(query =>
          this.userSearchService.searchUsers(query ?? '')
        ),
        takeUntilDestroyed(this.destroyRef) // Ensure to unsubscribe on component destroy
      )
      .subscribe({
        next: (res) => {
          this.users.set(res.users);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Something went wrong!');
          this.loading.set(false);
        }
      })
  }
}
