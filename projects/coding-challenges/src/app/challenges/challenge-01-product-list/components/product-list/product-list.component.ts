import { Component, inject, OnDestroy, OnInit, HostBinding } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CurrencyPipe } from '@angular/common';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { ThemeService } from '@ng-coding-challenges/shared/services';
import { ChallengeNavComponent } from '../../../shared/components/challenge-nav/challenge-nav.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CurrencyPipe, ChallengeNavComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit, OnDestroy {

  protected productList: Product[] = [];

  // inject ProductService
  #productService = inject(ProductService);

  // clear subscription on destroy
  #destroy$ = new Subject<void>();

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.#getProducts()

  }

  /**
   * Fetches products from the product service and updates the component's product list.
   * The observable subscription is automatically cleaned up when the component is destroyed
   * using the takeUntil operator with the destroy$ subject.
   *
   * @private
   * @returns {void}
   * @memberof ProductListComponent
   */
  #getProducts(): void {
    this.#productService.getProducts().pipe(takeUntil(this.#destroy$)).subscribe({
      next: (products) => {
        if (products) {
          this.productList = products;
        }
        console.log('Products fetched successfully', this.productList);
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      },
      complete: () => {
        console.log('Product fetch completed');
      }
    });
  }

  ngOnDestroy(): void {
    this.#destroy$.next();     // 1. Emit a value: Tells all 'takeUntil' operators to complete
    this.#destroy$.complete(); // 2. Complete the Subject: Cleans up the Subject itself, releasing resources
  }

}
