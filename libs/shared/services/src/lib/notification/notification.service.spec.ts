import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService, NotificationType } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open', 'dismiss']);

    TestBed.configureTestingModule({
      providers: [
        { provide: MatSnackBar, useValue: snackBarSpy }
      ]
    });

    service = TestBed.inject(NotificationService);
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('success', () => {
    it('should display success notification with correct styling', () => {
      const message = 'Operation successful';
      const mockSnackBarRef = jasmine.createSpyObj('MatSnackBarRef', ['dismiss']);
      snackBar.open.and.returnValue(mockSnackBarRef);

      service.success(message);

      expect(snackBar.open).toHaveBeenCalledWith(
        'check_circle Operation successful',
        'Close',
        jasmine.objectContaining({
          panelClass: ['notification-success'],
          duration: 4000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        })
      );
    });

    it('should allow config overrides', () => {
      const message = 'Success message';
      const mockSnackBarRef = jasmine.createSpyObj('MatSnackBarRef', ['dismiss']);
      snackBar.open.and.returnValue(mockSnackBarRef);

      service.success(message, { duration: 2000 });

      expect(snackBar.open).toHaveBeenCalledWith(
        'check_circle Success message',
        'Close',
        jasmine.objectContaining({
          duration: 2000
        })
      );
    });
  });

  describe('error', () => {
    it('should display error notification with correct styling', () => {
      const message = 'Operation failed';
      const mockSnackBarRef = jasmine.createSpyObj('MatSnackBarRef', ['dismiss']);
      snackBar.open.and.returnValue(mockSnackBarRef);

      service.error(message);

      expect(snackBar.open).toHaveBeenCalledWith(
        'error Operation failed',
        'Close',
        jasmine.objectContaining({
          panelClass: ['notification-error'],
          duration: 8000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        })
      );
    });
  });

  describe('warning', () => {
    it('should display warning notification with correct styling', () => {
      const message = 'Warning message';
      const mockSnackBarRef = jasmine.createSpyObj('MatSnackBarRef', ['dismiss']);
      snackBar.open.and.returnValue(mockSnackBarRef);

      service.warning(message);

      expect(snackBar.open).toHaveBeenCalledWith(
        'warning Warning message',
        'Close',
        jasmine.objectContaining({
          panelClass: ['notification-warning'],
          duration: 6000
        })
      );
    });
  });

  describe('info', () => {
    it('should display info notification with correct styling', () => {
      const message = 'Info message';
      const mockSnackBarRef = jasmine.createSpyObj('MatSnackBarRef', ['dismiss']);
      snackBar.open.and.returnValue(mockSnackBarRef);

      service.info(message);

      expect(snackBar.open).toHaveBeenCalledWith(
        'info Info message',
        'Close',
        jasmine.objectContaining({
          panelClass: ['notification-info'],
          duration: 5000
        })
      );
    });
  });

  describe('withAction', () => {
    it('should display notification with action button', () => {
      const message = 'Action required';
      const action = 'Retry';
      const mockSnackBarRef = jasmine.createSpyObj('MatSnackBarRef', ['dismiss']);
      snackBar.open.and.returnValue(mockSnackBarRef);

      service.withAction(message, action, NotificationType.ERROR);

      expect(snackBar.open).toHaveBeenCalledWith(
        message,
        action,
        jasmine.objectContaining({
          panelClass: ['notification-error'],
          duration: 0
        })
      );
    });
  });

  describe('loading', () => {
    it('should display loading notification', () => {
      const mockSnackBarRef = jasmine.createSpyObj('MatSnackBarRef', ['dismiss']);
      snackBar.open.and.returnValue(mockSnackBarRef);

      service.loading('Processing...');

      expect(snackBar.open).toHaveBeenCalledWith(
        'hourglass_empty Processing...',
        undefined,
        jasmine.objectContaining({
          panelClass: ['notification-loading'],
          duration: 0,
          showCloseButton: false
        })
      );
    });

    it('should use default loading message when none provided', () => {
      const mockSnackBarRef = jasmine.createSpyObj('MatSnackBarRef', ['dismiss']);
      snackBar.open.and.returnValue(mockSnackBarRef);

      service.loading();

      expect(snackBar.open).toHaveBeenCalledWith(
        'hourglass_empty Loading...',
        undefined,
        jasmine.objectContaining({
          panelClass: ['notification-loading']
        })
      );
    });
  });

  describe('custom', () => {
    it('should display custom notification with provided config', () => {
      const message = 'Custom message';
      const config = {
        duration: 3000,
        panelClass: ['custom-class'],
        icon: 'custom_icon',
        showCloseButton: false
      };
      const mockSnackBarRef = jasmine.createSpyObj('MatSnackBarRef', ['dismiss']);
      snackBar.open.and.returnValue(mockSnackBarRef);

      service.custom(message, config);

      expect(snackBar.open).toHaveBeenCalledWith(
        'custom_icon Custom message',
        undefined,
        jasmine.objectContaining({
          duration: 3000,
          panelClass: ['custom-class'],
          showCloseButton: false
        })
      );
    });
  });

  describe('dismissAll', () => {
    it('should dismiss all notifications', () => {
      service.dismissAll();

      expect(snackBar.dismiss).toHaveBeenCalled();
    });
  });

  describe('configuration merging', () => {
    it('should merge panel classes from multiple configs', () => {
      const message = 'Test message';
      const config = {
        panelClass: ['additional-class']
      };
      const mockSnackBarRef = jasmine.createSpyObj('MatSnackBarRef', ['dismiss']);
      snackBar.open.and.returnValue(mockSnackBarRef);

      service.success(message, config);

      expect(snackBar.open).toHaveBeenCalledWith(
        'check_circle Test message',
        'Close',
        jasmine.objectContaining({
          panelClass: ['notification-success', 'additional-class']
        })
      );
    });
  });
});
