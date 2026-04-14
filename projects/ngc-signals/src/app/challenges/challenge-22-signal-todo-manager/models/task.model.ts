export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type PriorityFilter = 'all' | TaskPriority;

export interface Task {
  id: number;
  title: string;
  priority: TaskPriority;
  status: TaskStatus;
}

export interface BoardStats {
  total: number;
  todoCount: number;
  inProgressCount: number;
  doneCount: number;
  completionRate: number;
}
