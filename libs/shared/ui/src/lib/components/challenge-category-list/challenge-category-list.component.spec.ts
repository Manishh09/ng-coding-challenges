import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallengeCategoryListComponent } from './challenge-category-list.component';

describe('ChallengeCategoryListComponent', () => {
  let component: ChallengeCategoryListComponent;
  let fixture: ComponentFixture<ChallengeCategoryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChallengeCategoryListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChallengeCategoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
