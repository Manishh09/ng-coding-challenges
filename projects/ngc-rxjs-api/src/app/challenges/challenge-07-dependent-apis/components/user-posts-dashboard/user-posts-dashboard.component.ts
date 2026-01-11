import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { UserWithPosts } from '../../models/user-posts.model';
import { UserService } from '../../services/user.service';
import { PostService } from '../../services/post.service';
import { catchError, forkJoin, map, merge, mergeMap, of, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-user-posts-dashboard',
  imports: [],
  templateUrl: './user-posts-dashboard.component.html',
  styleUrls: ['./user-posts-dashboard.component.scss']
})
export class UserPostsDashboardComponent implements OnInit, OnDestroy {
  usersWithPosts: UserWithPosts[] = [];
  isLoading = false;
  error: string | null = null;
  private destroy$ = new Subject<void>();

  // services injection can be done here
  private userService = inject(UserService);
  private postService = inject(PostService);

  // load data on component initialization
  ngOnInit() {
    this.loadUserPosts();
  }

  // Method to load user posts
  /**
   * Get users.
   *
   * For each user, get their posts.
   *
   * If posts fail → keep empty list.
   *
   * Combine everything into one big list.
   *
   * Use that list to show data in the UI.
   */
  loadUserPosts() {
    this.isLoading = true;
    // Simulate loading users with posts

    this.userService.getUsers().pipe(
      // For each user, fetch their posts and combine the data
      mergeMap(users => {
        // Use forkJoin to wait for all post requests to complete
        // forkJoin([...array of inner observables...])
        return forkJoin(

          users.map(user =>
            this.postService.getPostsByUser(user.id).pipe(
              catchError(() => of([])),        // return empty posts if this user's posts fail
              map(posts => ({ ...user, posts })) // attach posts to user
            )
          ),
        );
      }),
      takeUntil(this.destroy$) // unsubscribe when component is destroyed
    ).subscribe({
      next: usersWithPosts => {
        this.isLoading = false;
        this.usersWithPosts = usersWithPosts.map(user => ({
          ...user,
          posts: user.posts || [],
          postsCount: user.posts?.length || 0,
          displayName: `${user.firstName} ${user.lastName}`.trim() || user.username || 'Unknown'
        }));
        this.error = null;
      },
      error: () => {
        this.error = 'Failed to load user posts';
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
