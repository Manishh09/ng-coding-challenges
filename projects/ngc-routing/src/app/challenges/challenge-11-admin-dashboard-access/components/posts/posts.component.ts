import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { PostService } from '../../services/post/post.service';
import { Post } from '../../models/post.model';

@Component({
  selector: 'app-posts',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatListModule, MatIconModule],
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent {
  private postService = inject(PostService);
  posts: Post[] = this.postService.getPosts();
}
