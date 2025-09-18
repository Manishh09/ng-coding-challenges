import { ChangeDetectionStrategy, Component, inject, Input, signal } from '@angular/core';
import { Category } from '../../models/category.model';
import { MatCardModule } from '@angular/material/card';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-category-summary',
  imports: [MatCardModule],
  templateUrl: './category-summary.component.html',
  styleUrl: './category-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class CategorySummaryComponent {
  categories = signal<Category[]>([]);

  private categoryService = inject(CategoryService);

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe(cats => {
      console.log('CategorySummaryComponent received categories');
      this.categories.set(cats);
    });
  }
}
