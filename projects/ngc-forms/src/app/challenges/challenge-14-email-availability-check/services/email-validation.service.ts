import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { EmailAvailabilityResponse } from '../models/email.model';

/**
 * User interface from JSONPlaceholder API
 * Should generally be in models folder, but included here for simplicity
 */
interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

/**
 * Service to check email availability using JSONPlaceholder API
 * Fetches real user data and checks against existing emails
 */
@Injectable({
  providedIn: 'root'
})
export class EmailValidationService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://jsonplaceholder.typicode.com/users';

  /**
   * Checks if email is available by querying JSONPlaceholder API
   *
   * @param email - Email address to check
   * @returns Observable that emits availability response
   *
   * @example
   * this.emailService.checkEmailAvailability('test@example.com')
   *   .subscribe(response => {
   *     if (response.available) {
   *       console.log('Email is available');
   *     }
   *   });
   */
  checkEmailAvailability(email: string): Observable<EmailAvailabilityResponse> {
    if (!email) {
      return of({ available: true, email: '' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    return this.http.get<User[]>(this.apiUrl).pipe(
      map(users => {
        // Check if email exists in the user list
        const emailExists = users.some(
          user => user.email.toLowerCase() === normalizedEmail
        );

        return {
          available: !emailExists,
          email: normalizedEmail,
          suggestedAlternatives: emailExists ? this.generateSuggestions(normalizedEmail) : undefined
        };
      }),
      catchError(error => {
        console.error('Error checking email availability:', error);
        // Fail-open: on error, assume email is available
        return of({ available: true, email: normalizedEmail });
      })
    );
  }

  /**
   * Generates alternative email suggestions when email is taken
   *
   * @param email - The taken email address
   * @returns Array of suggested alternative emails
   */
  private generateSuggestions(email: string): string[] {
    const [username, domain] = email.split('@');

    if (!username || !domain) {
      return [];
    }

    return [
      `${username}123@${domain}`,
      `${username}.dev@${domain}`,
      `${username}2024@${domain}`
    ];
  }

  /**
   * Fetches all users from the API for display purposes
   * Returns list of emails from JSONPlaceholder
   */
  getTakenEmails(): Observable<string[]> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      map(users => users.map(user => user.email)),
      catchError(error => {
        console.error('Error fetching users:', error);
        return of([]);
      })
    );
  }
}
