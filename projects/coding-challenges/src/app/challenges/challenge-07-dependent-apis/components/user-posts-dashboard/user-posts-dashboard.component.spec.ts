import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPostsDashboardComponent } from './user-posts-dashboard.component';

describe('UserPostsDashboardComponent', () => {
  let component: UserPostsDashboardComponent;
  let fixture: ComponentFixture<UserPostsDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPostsDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserPostsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
