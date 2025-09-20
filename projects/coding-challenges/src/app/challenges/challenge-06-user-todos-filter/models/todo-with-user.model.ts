import { Todo } from './todo.model';

export interface TodoWithUser extends Todo {
  userName: string;
}
