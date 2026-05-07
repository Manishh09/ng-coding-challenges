import { Component, signal, computed } from '@angular/core';
import { Task, TaskPriority, TaskStatus, PriorityFilter, BoardStats } from '../../models/task.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-task-board',
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatChipsModule, MatProgressBarModule, MatDividerModule],
  templateUrl: './task-board.component.html',
  styleUrl: './task-board.component.scss'
})
export class TaskBoardComponent {
  private nextId = 1;

  /** Source signals */
  tasks = signal<Task[]>([]);
  priorityFilter = signal<PriorityFilter>('all');

  /** New task form state */
  newTaskTitle = signal<string>('');
  newTaskPriority = signal<TaskPriority>('medium');

  /** Track which task card is expanded to show move actions */
  expandedTaskId = signal<number | null>(null);

  /** Filtered column signals — react to both tasks AND priorityFilter */
  todoTasks = computed(() => this.filterByStatusAndPriority('todo'));
  inProgressTasks = computed(() => this.filterByStatusAndPriority('in-progress'));
  doneTasks = computed(() => this.filterByStatusAndPriority('done'));

  /** Board statistics */
  boardStats = computed<BoardStats>(() => {
    const all = this.tasks();
    const total = all.length;
    const todoCount = all.filter(t => t.status === 'todo').length;
    const inProgressCount = all.filter(t => t.status === 'in-progress').length;
    const doneCount = all.filter(t => t.status === 'done').length;
    const completionRate = total > 0 ? Math.round((doneCount / total) * 100) : 0;
    return { total, todoCount, inProgressCount, doneCount, completionRate };
  });

  /** CRUD operations — all immutable */
  addTask(): void {
    const title = this.newTaskTitle().trim();
    if (!title) return;

    this.tasks.update(tasks => [
      ...tasks,
      {
        id: this.nextId++,
        title,
        priority: this.newTaskPriority(),
        status: 'todo' as TaskStatus
      }
    ]);

    this.newTaskTitle.set('');
  }

  deleteTask(id: number): void {
    this.tasks.update(tasks => tasks.filter(t => t.id !== id));
    if (this.expandedTaskId() === id) {
      this.expandedTaskId.set(null);
    }
  }

  moveTask(id: number, newStatus: TaskStatus): void {
    this.tasks.update(tasks =>
      tasks.map(t => t.id === id ? { ...t, status: newStatus } : t)
    );
    this.expandedTaskId.set(null);
  }

  /** Toggle move actions on a task card */
  toggleExpand(id: number): void {
    this.expandedTaskId.update(current => current === id ? null : id);
  }

  /** Priority filter change */
  setFilter(filter: PriorityFilter): void {
    this.priorityFilter.set(filter);
  }

  /** Form input handlers */
  onTitleInput(event: Event): void {
    this.newTaskTitle.set((event.target as HTMLInputElement).value);
  }

  onPriorityChange(event: Event): void {
    this.newTaskPriority.set((event.target as HTMLSelectElement).value as TaskPriority);
  }

  /** Get the two statuses a task can move to */
  getMoveTargets(currentStatus: TaskStatus): { label: string; status: TaskStatus }[] {
    const all: { label: string; status: TaskStatus }[] = [
      { label: 'Todo', status: 'todo' },
      { label: 'In Progress', status: 'in-progress' },
      { label: 'Done', status: 'done' }
    ];
    return all.filter(t => t.status !== currentStatus);
  }

  private filterByStatusAndPriority(status: TaskStatus): Task[] {
    const filter = this.priorityFilter();
    return this.tasks().filter(t =>
      t.status === status && (filter === 'all' || t.priority === filter)
    );
  }
}
