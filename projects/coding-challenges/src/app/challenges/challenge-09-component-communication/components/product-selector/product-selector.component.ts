import { Component, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ProductService } from '../../services/product.service';
import { ProductCategory } from '../../models/product-category.model';

@Component({
  selector: 'app-product-selector',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSelectModule, MatInputModule, MatButtonModule],
  templateUrl: './product-selector.component.html',
  styleUrls: ['./product-selector.component.scss'],
})
export class ProductSelectorComponent {
  // State Signals
  categories = signal<string[]>([]);
  loading = signal(true);
  error = signal(false);

  selectedCategory = signal('');
  customProduct = signal('');

  // Output API (signal-based output)
  productSelected = output<ProductCategory>();

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.fetchCategories();
  }

  private fetchCategories() {
    this.loading.set(true);
    this.error.set(false);
    this.productService.getCategories().subscribe({
      next: (cats) => {
        this.categories.set(cats);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  onCategoryChange(value: string) {
    this.selectedCategory.set(value);
    this.productSelected.emit({category: value, name: this.customProduct()}); // emit selected category
    // this.customProduct.set(''); // reset custom product when category is selected
  }

  sendCustomProduct() {
    const product = this.customProduct().trim();
    if (product) {
      this.productSelected.emit({category: this.selectedCategory(), name: product}); // emit custom product
      // Reset both fields if required
      // this.customProduct.set('');
      // this.selectedCategory.set('');
    }
  }
}
