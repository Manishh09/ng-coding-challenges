import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCategoryDashboardComponent } from './product-category-dashboard.component';

describe('ProductCategoryDashboardComponent', () => {
  let component: ProductCategoryDashboardComponent;
  let fixture: ComponentFixture<ProductCategoryDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCategoryDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCategoryDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
