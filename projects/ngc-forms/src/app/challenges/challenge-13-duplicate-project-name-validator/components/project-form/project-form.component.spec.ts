import { TestBed } from '@angular/core/testing';
import { ProjectFormComponent } from './project-form.component';
import { ProjectService } from '../../services/project.service';
import { ReactiveFormsModule } from '@angular/forms';

describe('ProjectFormComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectFormComponent, ReactiveFormsModule],
      providers: [ProjectService]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ProjectFormComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

});
