import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { AuthService } from '../../services/auth.service';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatListModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent {
  auth = inject(AuthService);

  products: Product[] = [
    { id: 1, name: 'Laptop', price: 999, description: 'High-performance laptop' },
    { id: 2, name: 'Mouse', price: 29, description: 'Wireless optical mouse' },
    { id: 3, name: 'Keyboard', price: 79, description: 'Mechanical keyboard' },
    { id: 4, name: 'Monitor', price: 299, description: '27-inch 4K monitor' },
    { id: 5, name: 'Headphones', price: 149, description: 'Noise-cancelling headphones' },
  ];

  onLogout() {
    this.auth.logout();
  }
}
