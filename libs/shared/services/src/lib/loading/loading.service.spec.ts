import { TestBed } from '@angular/core/testing';
import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should show and hide loading state', () => {
    expect(service.isLoading()).toBe(false);

    service.show();
    expect(service.isLoading()).toBe(true);

    service.hide();
    expect(service.isLoading()).toBe(false);
  });

  it('should track multiple operations', () => {
    const op1 = service.startOperation('fetch');
    expect(service.isLoading()).toBe(true);
    expect(service.activeOperationsCount()).toBe(1);

    const op2 = service.startOperation('save');
    expect(service.activeOperationsCount()).toBe(2);

    service.stopOperation(op1);
    expect(service.activeOperationsCount()).toBe(1);
    expect(service.isLoading()).toBe(true);

    service.stopOperation(op2);
    expect(service.activeOperationsCount()).toBe(0);
    expect(service.isLoading()).toBe(false);
  });

  it('should check if operation is active', () => {
    const op = service.startOperation('testOperation');
    expect(service.isOperationActive('testOperation')).toBe(true);

    service.stopOperation(op);
    expect(service.isOperationActive('testOperation')).toBe(false);
  });

  it('should clear all operations', () => {
    service.startOperation('op1');
    service.startOperation('op2');
    expect(service.activeOperationsCount()).toBe(2);

    service.clearAllOperations();
    expect(service.activeOperationsCount()).toBe(0);
    expect(service.isLoading()).toBe(false);
  });

  it('should wrap async function with loading state', async () => {
    const mockFn = jasmine.createSpy().and.returnValue(Promise.resolve('result'));

    expect(service.isLoading()).toBe(false);
    const promise = service.withLoading('test', mockFn);
    expect(service.isLoading()).toBe(true);

    const result = await promise;
    expect(result).toBe('result');
    expect(service.isLoading()).toBe(false);
  });
});
