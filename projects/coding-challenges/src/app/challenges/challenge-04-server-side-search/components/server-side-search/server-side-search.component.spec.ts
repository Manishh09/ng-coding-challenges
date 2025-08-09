import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerSideSearchComponent } from './server-side-search.component';

describe('ServerSideSearchComponent', () => {
  let component: ServerSideSearchComponent;
  let fixture: ComponentFixture<ServerSideSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServerSideSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServerSideSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
