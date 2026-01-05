import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { UserListComponent } from '../user-list/user-list.component';
import { PostsComponent } from '../posts/posts.component';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, MatCardModule, MatButtonModule, UserListComponent, PostsComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  auth = inject(AuthService);
  activeTab: 'users' | 'posts' = 'users';

  onLogout() {
    this.auth.logout();
  }
}
