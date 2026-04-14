import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Job } from '../models/job.model';

const JOBS: Job[] = [
  { id: 1, title: 'Angular Developer', company: 'Flipkart', location: 'Bangalore', type: 'full-time', salary: 18 },
  { id: 2, title: 'React Developer', company: 'Amazon', location: 'Hyderabad', type: 'full-time', salary: 22 },
  { id: 3, title: 'Frontend Intern', company: 'Swiggy', location: 'Bangalore', type: 'internship', salary: 5 },
  { id: 4, title: 'Full Stack Developer', company: 'Paytm', location: 'Noida', type: 'full-time', salary: 16 },
  { id: 5, title: 'UI Developer', company: 'Razorpay', location: 'Bangalore', type: 'contract', salary: 14 },
  { id: 6, title: 'Angular Lead', company: 'Infosys', location: 'Pune', type: 'full-time', salary: 28 },
  { id: 7, title: 'React Native Developer', company: 'Zomato', location: 'Delhi', type: 'full-time', salary: 20 },
  { id: 8, title: 'Frontend Engineer', company: 'PhonePe', location: 'Bangalore', type: 'full-time', salary: 24 },
  { id: 9, title: 'Junior Developer', company: 'TCS', location: 'Mumbai', type: 'full-time', salary: 6 },
  { id: 10, title: 'Vue.js Developer', company: 'Ola', location: 'Bangalore', type: 'contract', salary: 15 },
  { id: 11, title: 'Frontend Intern', company: 'CRED', location: 'Bangalore', type: 'internship', salary: 4 },
  { id: 12, title: 'Senior Angular Developer', company: 'Atlassian', location: 'Bangalore', type: 'full-time', salary: 35 },
  { id: 13, title: 'Web Developer', company: 'Wipro', location: 'Hyderabad', type: 'full-time', salary: 8 },
  { id: 14, title: 'Frontend Architect', company: 'Google', location: 'Bangalore', type: 'full-time', salary: 45 },
  { id: 15, title: 'Part-time UI Dev', company: 'Freshworks', location: 'Chennai', type: 'part-time', salary: 10 },
];

@Injectable({ providedIn: 'root' })
export class JobService {

  /** Simulates an HTTP GET with a network delay */
  searchJobs(keyword: string): Observable<Job[]> {
    const q = keyword.toLowerCase().trim();
    const results = q
      ? JOBS.filter(j =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q)
        )
      : JOBS;

    return of(results).pipe(delay(500));
  }
}
