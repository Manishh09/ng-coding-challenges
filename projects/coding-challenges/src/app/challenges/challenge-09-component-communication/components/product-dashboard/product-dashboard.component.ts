import { Component, signal } from '@angular/core';
import { ProductDisplayComponent } from "../product-display/product-display.component";
import { ProductSelectorComponent } from "../product-selector/product-selector.component";
import { ChallengeHeaderComponent } from "../../../shared/components/challenge-header/challenge-header.component";
import { ProductCategory } from '../../models/product-category.model';

@Component({
  selector: 'app-product-dashboard',
  imports: [ProductDisplayComponent, ProductSelectorComponent, ChallengeHeaderComponent],
  templateUrl: './product-dashboard.component.html',
  styleUrl: './product-dashboard.component.scss'
})
export class ProductDashboardComponent {
  selectedProduct = signal<ProductCategory | null>(null);

  onProductSelected(value: ProductCategory | null) {
    this.selectedProduct.set(value);
  }
}
