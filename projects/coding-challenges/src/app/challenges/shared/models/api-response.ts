import { HttpErrorResponse } from "@angular/common/http";

export type Status = 'success' | 'error' | 'loading';

export interface ApiResponse<T> {
  data: T | null;
  status: Status;
  message?: string;
  error: HttpErrorResponse | null;
}

