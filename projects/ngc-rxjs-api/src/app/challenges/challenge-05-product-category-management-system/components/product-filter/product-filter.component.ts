import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { Category } from '../../models/category.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-product-filter',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, MatOptionModule],
  templateUrl: './product-filter.component.html',
  styleUrl: './product-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductFilterComponent {
  categories = signal<Category[]>([]);
  selectedCategory = signal<number | null>(null);

  private categoryService = inject(CategoryService);

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe(cats => {
      console.log('ProductFilterComponent received categories');
      this.categories.set(cats);
    });
  }
}
