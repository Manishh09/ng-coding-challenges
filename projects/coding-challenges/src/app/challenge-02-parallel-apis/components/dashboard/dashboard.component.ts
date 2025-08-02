import { Component, inject } from '@angular/core';
import { tap } from 'rxjs';
import { DashboardService } from '../../services/dashboard.service';
import { Post } from '../../models/post';
import { User } from '../../models/user';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  users: User[] = [];
  posts: Post[] = [];
  loading = false;
  error = false;

  protected readonly dashboardService = inject(DashboardService);

  ngOnInit() {
    this.loading = true;

    this.loadDashboardData();
  }

  private loadDashboardData() {
    this.dashboardService.getDashboardData()
      .pipe(tap(() => this.loading = false))
      .subscribe({
        next: (data) => {
          this.users = data.users.slice(0, 5);
          this.posts = data.posts.slice(0, 5);
        },
        error: () => this.error = true
      });
  }
}
