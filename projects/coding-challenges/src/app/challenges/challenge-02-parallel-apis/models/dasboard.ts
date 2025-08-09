import { HttpErrorResponse } from "@angular/common/http";
import { Post } from "./post";
import { User } from "./user";

export interface DashboardResponse {
  users: User[] | HttpErrorResponse;
  posts: Post[] | HttpErrorResponse;
}
