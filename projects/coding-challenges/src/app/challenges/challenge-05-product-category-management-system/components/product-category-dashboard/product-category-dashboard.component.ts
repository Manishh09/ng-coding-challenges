import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CreateProductComponent } from "../create-product/create-product.component";
import { ProductFilterComponent } from "../product-filter/product-filter.component";
import { CategorySummaryComponent } from "../category-summary/category-summary.component";
import { ChallengeNavComponent } from "../../../shared/components/challenge-nav/challenge-nav.component";

@Component({
  selector: 'app-product-category-dashboard',
  imports: [CreateProductComponent, ProductFilterComponent, CategorySummaryComponent, ChallengeNavComponent],
  templateUrl: './product-category-dashboard.component.html',
  styleUrl: './product-category-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCategoryDashboardComponent {

}
