import {
  Component,
  input,
  output,
  signal,
  Signal,
  computed,
  DestroyRef,
  inject,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
})
export class SearchBarComponent {
  private destroyRef = inject(DestroyRef);

  // Inputs using signal inputs (Angular 19)
  placeholder = input<string>('Search...');
  label = input<string>('');
  debounceTime = input<number>(300);
  disabled = input<boolean>(false);
  ariaLabel = input<string>('Search input');

  // Output using signal outputs (Angular 19)
  searchChange = output<string>();
  searchClear = output<void>();

  // Internal state
  searchTerm = signal<string>('');

  // Computed signal for showing clear button
  showClearButton: Signal<boolean> = computed(
    () => this.searchTerm().length > 0
  );

  constructor() {
    // Convert searchTerm signal to observable and apply debounce
    toObservable(this.searchTerm)
      .pipe(
        debounceTime(this.debounceTime()),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(term => {
        this.searchChange.emit(term);
      });
  }

  onSearchInput(value: string): void {
    this.searchTerm.set(value);
  }

  clearSearch(): void {
    this.searchTerm.set('');
    this.searchClear.emit();
  }
}
