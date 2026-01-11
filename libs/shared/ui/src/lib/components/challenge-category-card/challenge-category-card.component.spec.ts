import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallengeCategoryCardComponent } from './challenge-category-card.component';

describe('ChallengeCategoryCardComponent', () => {
  let component: ChallengeCategoryCardComponent;
  let fixture: ComponentFixture<ChallengeCategoryCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChallengeCategoryCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChallengeCategoryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
