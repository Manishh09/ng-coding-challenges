import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../services/user/user.service';
import { User } from '../../models/user.model';
@Component({
  selector: 'app-user-list',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatListModule, MatIconModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent {
  private userService = inject(UserService);
  users: User[] = this.userService.getUsers();
}
