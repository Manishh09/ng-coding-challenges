import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-create-product',
  imports: [CommonModule, MatSelectModule, MatFormFieldModule, MatOptionModule],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class CreateProductComponent {
  categories = signal<Category[]>([]);
  selectedCategory = signal<number | null>(null);

  private categoryService = inject(CategoryService);

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe(cats => {
      console.log('ProductCreationComponent received categories');
      this.categories.set(cats);
    });
  }
}
