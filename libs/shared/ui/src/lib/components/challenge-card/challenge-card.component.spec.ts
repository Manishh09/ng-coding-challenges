import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ChallengeCardComponent } from './challenge-card.component';

describe('ChallengeCardComponent', () => {
  let component: ChallengeCardComponent;
  let fixture: ComponentFixture<ChallengeCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ChallengeCardComponent,
        RouterTestingModule,
        NoopAnimationsModule,
      ],
      providers: [],
    }).compileComponents();

    fixture = TestBed.createComponent(ChallengeCardComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
