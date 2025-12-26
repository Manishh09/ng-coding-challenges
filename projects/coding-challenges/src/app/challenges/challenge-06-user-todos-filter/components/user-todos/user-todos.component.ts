import { Component, inject, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { UserTodoFacadeService } from '../../services/user-todo-facade.service';
import { ChallengeNavComponent } from "../../../shared/components/challenge-nav/challenge-nav.component";
import { CommonModule, NgClass } from "@angular/common";
import { MatChipsModule } from '@angular/material/chips';
import { MatRadioModule } from '@angular/material/radio';
import { ChallengeHeaderComponent } from "../../../shared/components/challenge-header/challenge-header.component";

@Component({
  selector: 'app-user-todos',
  standalone: true,
  imports: [AsyncPipe, CommonModule, MatRadioModule, MatChipsModule, MatTableModule, MatSelectModule, NgClass, ChallengeHeaderComponent],
  templateUrl: './user-todos.component.html',
  styleUrls: ['./user-todos.component.scss']
})
export class UserTodosComponent {
  private facade = inject(UserTodoFacadeService);

  filterStatus = this.facade.filterStatus;

  // Basic - Good for interview
  todosWithUsers$ = this.facade.todosWithUsers$;

  // Advanced - for production apps
  filteredTodos$ = this.facade.filteredTodos$;


  // FOR UI SEPARATION ONLY - STARTS HERE

  // Signal for view mode toggle
  viewMode = signal<'basic' | 'advanced'>('basic');

  // Handler for view mode change
  onViewModeChange(mode: 'basic' | 'advanced') {
    this.viewMode.set(mode);
  }

  // FOR UI SEPARATION ONLY - ENDS HERE


  // Handler for filter change
  onFilterChange(value: 'all' | 'completed' | 'pending') {
    this.filterStatus.set(value);
  }
}
