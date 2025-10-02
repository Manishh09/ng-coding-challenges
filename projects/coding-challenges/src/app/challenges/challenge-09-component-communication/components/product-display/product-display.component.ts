import { Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ProductCategory } from '../../models/product-category.model';

@Component({
  selector: 'app-product-display',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './product-display.component.html',
  styleUrls: ['./product-display.component.scss'],
})
export class ProductDisplayComponent {
  // Use new Angular input() API
  product = input<ProductCategory | null>(null);
}
