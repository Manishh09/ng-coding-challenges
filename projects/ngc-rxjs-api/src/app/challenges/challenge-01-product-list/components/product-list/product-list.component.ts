import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CurrencyPipe, MatCardModule, MatTableModule, MatChipsModule, MatProgressSpinnerModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit, OnDestroy {

  protected productList: Product[] = [];
  protected loading = true;
  readonly displayedColumns = ['id', 'title', 'category', 'price', 'rating'];

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
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.#destroy$.next();     // 1. Emit a value: Tells all 'takeUntil' operators to complete
    this.#destroy$.complete(); // 2. Complete the Subject: Cleans up the Subject itself, releasing resources
  }

}
