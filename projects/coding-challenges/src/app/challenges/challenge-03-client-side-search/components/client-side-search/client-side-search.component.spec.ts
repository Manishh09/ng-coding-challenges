import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientSideSearchComponent } from './client-side-search.component';

describe('ClientSideSearchComponent', () => {
  let component: ClientSideSearchComponent;
  let fixture: ComponentFixture<ClientSideSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientSideSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientSideSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
