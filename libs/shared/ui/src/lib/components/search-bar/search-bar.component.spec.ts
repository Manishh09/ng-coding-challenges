import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { SearchBarComponent } from './search-bar.component';

describe('SearchBarComponent', () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchBarComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default placeholder', () => {
    expect(component.placeholder()).toBe('Search...');
  });

  it('should have default debounce time of 300ms', () => {
    expect(component.debounceTime()).toBe(300);
  });

  it('should initialize with empty search term', () => {
    expect(component.searchTerm()).toBe('');
  });

  it('should not show clear button when search term is empty', () => {
    expect(component.showClearButton()).toBe(false);
  });

  it('should show clear button when search term has value', () => {
    component.searchTerm.set('test');
    fixture.detectChanges();
    expect(component.showClearButton()).toBe(true);
  });

  it('should update search term on input', () => {
    component.onSearchInput('test query');
    expect(component.searchTerm()).toBe('test query');
  });

  it('should clear search term and emit searchClear', (done) => {
    component.searchTerm.set('test');

    component.searchClear.subscribe(() => {
      expect(component.searchTerm()).toBe('');
      done();
    });

    component.clearSearch();
  });

  it('should emit debounced search term', (done) => {
    jasmine.clock().install();

    component.searchChange.subscribe((term) => {
      expect(term).toBe('test');
      jasmine.clock().uninstall();
      done();
    });

    component.onSearchInput('test');
    jasmine.clock().tick(300);
  });

  it('should not emit if cleared before debounce time', (done) => {
    jasmine.clock().install();
    let emitted = false;

    component.searchChange.subscribe(() => {
      emitted = true;
    });

    component.onSearchInput('test');
    jasmine.clock().tick(100);
    component.clearSearch();
    jasmine.clock().tick(300);

    setTimeout(() => {
      expect(emitted).toBe(false);
      jasmine.clock().uninstall();
      done();
    }, 100);
  });

  it('should respect disabled state', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    expect(component.disabled()).toBe(true);
  });

  it('should render label when provided', () => {
    fixture.componentRef.setInput('label', 'Search Challenges');
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const label = compiled.querySelector('mat-label');
    expect(label).toBeTruthy();
  });
});
