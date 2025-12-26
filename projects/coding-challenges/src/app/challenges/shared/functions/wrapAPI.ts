import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiResponse } from '../models/api-response';

export function wrapApi<T>(obs$: Observable<T>, fallbackMsg = 'Failed to fetch'): Observable<ApiResponse<T>> {
  return obs$.pipe(
    map((data): ApiResponse<T> => ({
      data,
      status: 'success',
      error: null,
    })),
    catchError((error: HttpErrorResponse) => {
      return of<ApiResponse<T>>({
        data: null,
        status: 'error',
        error,
        message: fallbackMsg,
      });
    })
  );
}
