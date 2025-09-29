import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorySummaryComponent } from './category-summary.component';

describe('CategorySummaryComponent', () => {
  let component: CategorySummaryComponent;
  let fixture: ComponentFixture<CategorySummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategorySummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategorySummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
