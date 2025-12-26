import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTodosComponent } from './user-todos.component';

describe('UserTodosComponent', () => {
  let component: UserTodosComponent;
  let fixture: ComponentFixture<UserTodosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserTodosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserTodosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
