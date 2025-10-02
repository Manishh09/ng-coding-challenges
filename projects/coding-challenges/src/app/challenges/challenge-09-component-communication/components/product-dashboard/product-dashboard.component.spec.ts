import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDashboardComponent } from './product-dashboard.component';

describe('ProductDashboardComponent', () => {
  let component: ProductDashboardComponent;
  let fixture: ComponentFixture<ProductDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
