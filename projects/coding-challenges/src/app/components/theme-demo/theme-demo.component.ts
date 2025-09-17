import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { ThemeToggleComponent } from '@ng-coding-challenges/shared/ui';

/**
 * Theme demo component showcasing angular.dev theme system
 */
@Component({
  selector: 'app-theme-demo',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatDividerModule,
    MatIconModule,
    FormsModule,
    ThemeToggleComponent
  ],
  templateUrl: './theme-demo.component.html',
  styleUrl: './theme-demo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThemeDemoComponent {
  // Sample data for demonstration
  sampleText = 'This is a sample input field';
  selectedChips: string[] = ['Angular', 'Material'];

  availableChips = [
    'Angular', 'Material', 'TypeScript', 'SCSS', 'RxJS', 'NgRx'
  ];

  toggleChip(chip: string): void {
    const index = this.selectedChips.indexOf(chip);
    if (index > -1) {
      this.selectedChips.splice(index, 1);
    } else {
      this.selectedChips.push(chip);
    }
  }

  isSelected(chip: string): boolean {
    return this.selectedChips.includes(chip);
  }
}
