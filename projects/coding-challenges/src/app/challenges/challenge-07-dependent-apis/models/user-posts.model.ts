import { User } from './user.model';
import { Post } from './post.model';

export interface UserWithPosts extends User {
  posts: Post[];
  postsCount: number;
  displayName: string; // normalized name to show in UI
}
