import { Component, DestroyRef, inject } from '@angular/core';
import { finalize, tap } from 'rxjs';
import { DashboardService } from '../../services/dashboard.service';
import { Post } from '../../models/post';
import { User } from '../../models/user';
import { DashboardResponse } from '../../models/dasboard';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChallengeNavComponent } from '../../../../shared/components/challenge-nav/challenge-nav.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ChallengeNavComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  // Data variables
  users: User[] = [];
  posts: Post[] = [];

  // State variables
  loading = false;
  errorObj = {
    message: '',
    hasError: false
  };

  // Injecting the DashboardService
  // Using inject() function to get the service instance
  private readonly dashboardService = inject(DashboardService);
  // Injecting DestroyRef to manage component destruction
  // This allows us to automatically unsubscribe from observables when the component is destroyed
  private readonly destroyRef = inject(DestroyRef);


  // Lifecycle hook to load data when the component initializes
  ngOnInit() {
    this.loadDashboardData();
    // Advanced: Using the wrapApi function for better error handling
    //this.loadDashboardDataWithFallback();
  }

  // Method to load dashboard data
  // It fetches users and posts from the service and handles loading and error states
  // Basic
  private loadDashboardData() {
    this.loading = true;
    this.dashboardService.getDashboardData()
      .pipe(
        finalize(() => this.loading = false),
        takeUntilDestroyed(this.destroyRef) // Automatically unsubscribes when the component is destroyed
      )
      .subscribe({
        next: (data: DashboardResponse) => {
          this.users = Array.isArray(data.users) ? data.users.slice(0, 5) : [];
          this.posts = Array.isArray(data.posts) ? data.posts.slice(0, 5) : [];
          this.errorObj.hasError = false; // Reset error state on successful fetch
        },
        error: (error) => {
          this.errorObj.message = 'Failed to fetch dashboard data';
          this.errorObj.hasError = true; // Indicate that there was an error
          console.error('Error fetching dashboard data:', error);
        }
      });
  }

  // Advanced: Using the wrapApi function for better error handling
  private loadDashboardDataWithFallback() {
    this.loading = true;
    this.dashboardService.getDashboardDataWithFallback()
      .pipe(
        finalize(() => this.loading = false),
        takeUntilDestroyed(this.destroyRef) // Automatically unsubscribes when the component is destroyed
      )
      .subscribe({
        next: (response) => {
          if(response.users.status === 'error' || response.posts.status === 'error') {
            this.errorObj.message = response.users.message || response.posts.message || 'Failed to fetch data';
            this.errorObj.hasError = true; // Indicate that there was an error
            console.error('Error fetching dashboard data:', this.errorObj.message);
            return;
          }
          // If any users or posts are successfully fetched, assign them to the component variables
          if(response.users.status === 'success') {
            this.users = response.users.data?.slice(0,5) || [];
          }
          if(response.posts.status === 'success') {
            this.posts = response.posts.data?.slice(0,5) || [];
          }
          this.errorObj.hasError = false; // Reset error state on successful fetch
        },
       });
  }
}
