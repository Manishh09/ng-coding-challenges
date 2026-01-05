import { Injectable } from '@angular/core';
import { Post } from '../../models/post.model';
@Injectable({
  providedIn: 'root'
})
export class PostService {
  private posts: Post[] = [
    { id: 1, title: 'Getting Started with Angular', author: 'John Doe', date: '2026-01-01' },
    { id: 2, title: 'Understanding RxJS', author: 'Jane Smith', date: '2026-01-02' },
    { id: 3, title: 'Angular Routing Guide', author: 'Bob Johnson', date: '2026-01-03' },
    { id: 4, title: 'State Management Patterns', author: 'Alice Brown', date: '2026-01-04' },
  ];

  getPosts(): Post[] {
    return this.posts;
  }

  getPostById(id: number): Post | undefined {
    return this.posts.find(post => post.id === id);
  }
}
