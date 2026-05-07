import { Component, signal, computed } from '@angular/core';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { debounceTime, distinctUntilChanged, switchMap, startWith } from 'rxjs/operators';
import { Job } from '../../models/job.model';
import { JobService } from '../../services/job.service';

@Component({
  selector: 'app-job-search',
  imports: [MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatSliderModule, MatChipsModule, MatProgressSpinnerModule, MatIconModule],
  templateUrl: './job-search.component.html',
  styleUrl: './job-search.component.scss'
})
export class JobSearchComponent {
  /** Source signal — bound to search input */
  searchKeyword = signal('');

  /** Filter signals */
  jobType = signal<string>('all');
  location = signal<string>('');
  minSalary = signal<number>(0);

  /**
   * RxJS bridge:
   * signal → toObservable → debounce → switchMap(HTTP) → startWith(null) → toSignal
   */
  private rawJobs = toSignal<Job[] | null>(
    toObservable(this.searchKeyword).pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(keyword => this.jobService.searchJobs(keyword)),
      startWith(null)
    ),
    { initialValue: null }
  );

  /** Loading state derived from the null sentinel */
  isLoading = computed(() => this.rawJobs() === null);

  /** Client-side filters applied on top of API results */
  filteredJobs = computed(() => {
    const jobs = this.rawJobs();
    if (!jobs) return [];

    const type = this.jobType();
    const loc = this.location().toLowerCase().trim();
    const salary = this.minSalary();

    return jobs.filter(j =>
      (type === 'all' || j.type === type) &&
      (!loc || j.location.toLowerCase().includes(loc)) &&
      j.salary >= salary
    );
  });

  /** Stats */
  jobStats = computed(() => {
    const total = this.rawJobs()?.length ?? 0;
    const filtered = this.filteredJobs().length;
    return { total, filtered };
  });

  constructor(private jobService: JobService) {}

  /** Input handlers */
  onSearch(event: Event): void {
    this.searchKeyword.set((event.target as HTMLInputElement).value);
  }

  onTypeChange(event: Event): void {
    this.jobType.set((event.target as HTMLSelectElement).value);
  }

  onLocationInput(event: Event): void {
    this.location.set((event.target as HTMLInputElement).value);
  }

  onSalaryChange(event: Event): void {
    this.minSalary.set(+(event.target as HTMLInputElement).value);
  }

  clearFilters(): void {
    this.jobType.set('all');
    this.location.set('');
    this.minSalary.set(0);
  }
}
