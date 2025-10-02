import { Component, DestroyRef, inject } from '@angular/core';
import { User } from '../../models/user.model';
import { catchError, debounceTime, distinctUntilChanged, map, Observable, of, startWith, switchMap, tap } from 'rxjs';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { AsyncPipe } from '@angular/common';
import { ChallengeNavComponent } from '../../../shared/components/challenge-nav/challenge-nav.component';
import { ChallengeHeaderComponent } from "../../../shared/components/challenge-header/challenge-header.component";
@Component({
  selector: 'app-client-side-search',
  imports: [
    AsyncPipe,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    ChallengeHeaderComponent
],
  templateUrl: './client-side-search.component.html',
  styleUrl: './client-side-search.component.scss'
})
export class ClientSideSearchComponent {
  users: User[] = [];
  filteredUsers$!: Observable<User[]>;
  searchControl = new FormControl('');
  private destroyRef = inject(DestroyRef);
  error: string = '';
  loading: boolean = false;

  constructor(private userService: UserService) { }

  ngOnInitV2(): void {
    // Fetch users once
    this.userService.getUsers().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(users => {
      this.users = users;
    });

    // Set up filtered stream
    this.filteredUsers$ = this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef),
      map(searchTerm => this.getSearchedUsers(searchTerm as string))
    );
  }

  ngOnInit(): void {
    this.filteredUsers$ = this.userService.getUsers().pipe(
      tap(users => this.users = users),  // store fetched users
      catchError(() => {
        this.error = 'Failed to load users';
        this.loading = false;
        return of([] as User[]);
      }),
      switchMap(() =>
        this.searchControl.valueChanges.pipe(
          startWith(''),
          debounceTime(300),
          distinctUntilChanged(),
          map(searchTerm => this.getSearchedUsers(searchTerm ?? '')),
          takeUntilDestroyed(this.destroyRef)
        )
      ),
      takeUntilDestroyed(this.destroyRef)
    );
  }


  getSearchedUsers(searchTerm: string): User[] {
    if (!searchTerm.trim()) {
      return this.users;
    }
    const query = searchTerm.toLowerCase().trim();
    return this.users.filter(user =>
      user.name.toLowerCase().includes(query)
      // ||
      // user.email.toLowerCase().includes(query)
      // ||
      // user.username.toLowerCase().includes(query)
    );
  }

}
