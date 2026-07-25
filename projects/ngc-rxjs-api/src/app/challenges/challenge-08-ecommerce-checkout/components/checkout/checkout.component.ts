import { Component, DestroyRef, inject, signal } from '@angular/core';
import { Product } from '../../models/product.model';
import { Order } from '../../models/order.model';
import { ProductService } from '../../services/product.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CheckoutFacadeService } from '../../services/checkuot-facade.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe } from '@angular/common';
@Component({
  selector: 'app-checkout',
  imports: [MatCardModule, MatButtonModule, MatCheckboxModule, MatListModule, MatProgressSpinnerModule, MatDividerModule, MatIconModule, CurrencyPipe],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent {
  products = signal<Product[]>([]);
  orderResult = signal<Order | null>(null);
  isLoading = signal(false);

  isOrderLoading = signal(false);
  error = signal<string | null>(null);

  selectedProducts = signal<Product[]>([]);
  private destroyRef = inject(DestroyRef);

  private productService = inject(ProductService);

  private checkoutFacade = inject(CheckoutFacadeService);

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getProducts();
  }


  private getProducts() {
    this.isLoading.set(true);
    this.productService.getProducts().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (products) => this.products.set(products),
      error: (error) => this.error.set(error),
      complete: () => this.isLoading.set(false)
    });
  }

  isSelected(product: Product): boolean {
    return this.selectedProducts().some(p => p.id === product.id);
  }

  // select product for checkout
  onProductSelect(checked: boolean, product: Product): void {
    if (checked) {
      if (!this.selectedProducts().some(p => p.id === product.id)) {
        this.selectedProducts.update(products => [...products, product]);
      }
    } else {
      this.selectedProducts.update(products => products.filter(p => p.id !== product.id));
    }
  }

  // place order
  placeOrder() {
    if (this.selectedProducts().length === 0) {
      alert('No products selected for checkout. Please select products to proceed.');
      return;
    }

    const order: Order = { products: this.selectedProducts() };
    this.isOrderLoading.set(true);
    this.error.set(null);

    // checkout using facade
    this.checkoutFacade.checkout(order).subscribe({
      next: (result: Order) => {
        this.orderResult.set(result);
        this.isOrderLoading.set(false);
      },
      error: () => {
        this.error.set('Checkout failed');
        this.isOrderLoading.set(false);
      },
    });
  }

}
