import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CreateProductComponent } from "../create-product/create-product.component";
import { ProductFilterComponent } from "../product-filter/product-filter.component";
import { CategorySummaryComponent } from "../category-summary/category-summary.component";
 @Component({
  selector: 'app-product-category-dashboard',
  imports: [CreateProductComponent, ProductFilterComponent, CategorySummaryComponent],
  templateUrl: './product-category-dashboard.component.html',
  styleUrl: './product-category-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCategoryDashboardComponent {

}
