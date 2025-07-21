import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';

/**
 * Configuration options for notifications
 */
export interface NotificationConfig extends MatSnackBarConfig {
  /** Icon to display in the notification */
  icon?: string;
  /** Custom CSS classes */
  customClass?: string;
  /** Whether to show close button */
  showCloseButton?: boolean;
}

/**
 * Predefined notification types with default configurations
 */
export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info'
}

/**
 * Service for displaying user notifications using Material Design snackbars
 * Provides consistent styling and behavior across the application
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private snackBar = inject(MatSnackBar);

  /**
   * Default configuration for all notifications
   */
  private readonly defaultConfig: NotificationConfig = {
    duration: 5000,
    horizontalPosition: 'center',
    verticalPosition: 'top',
    showCloseButton: true
  };

  /**
   * Type-specific configurations
   */
  private readonly typeConfigs: Record<NotificationType, Partial<NotificationConfig>> = {
    [NotificationType.SUCCESS]: {
      panelClass: ['notification-success'],
      icon: 'check_circle',
      duration: 4000
    },
    [NotificationType.ERROR]: {
      panelClass: ['notification-error'],
      icon: 'error',
      duration: 8000
    },
    [NotificationType.WARNING]: {
      panelClass: ['notification-warning'],
      icon: 'warning',
      duration: 6000
    },
    [NotificationType.INFO]: {
      panelClass: ['notification-info'],
      icon: 'info',
      duration: 5000
    }
  };

  /**
   * Display a success notification
   * @param message - The message to display
   * @param config - Optional configuration overrides
   * @returns MatSnackBarRef for further control
   */
  success(message: string, config?: Partial<NotificationConfig>): MatSnackBarRef<SimpleSnackBar> {
    return this.show(message, NotificationType.SUCCESS, config);
  }

  /**
   * Display an error notification
   * @param message - The message to display
   * @param config - Optional configuration overrides
   * @returns MatSnackBarRef for further control
   */
  error(message: string, config?: Partial<NotificationConfig>): MatSnackBarRef<SimpleSnackBar> {
    return this.show(message, NotificationType.ERROR, config);
  }

  /**
   * Display a warning notification
   * @param message - The message to display
   * @param config - Optional configuration overrides
   * @returns MatSnackBarRef for further control
   */
  warning(message: string, config?: Partial<NotificationConfig>): MatSnackBarRef<SimpleSnackBar> {
    return this.show(message, NotificationType.WARNING, config);
  }

  /**
   * Display an info notification
   * @param message - The message to display
   * @param config - Optional configuration overrides
   * @returns MatSnackBarRef for further control
   */
  info(message: string, config?: Partial<NotificationConfig>): MatSnackBarRef<SimpleSnackBar> {
    return this.show(message, NotificationType.INFO, config);
  }

  /**
   * Display a custom notification
   * @param message - The message to display
   * @param config - Full configuration options
   * @returns MatSnackBarRef for further control
   */
  custom(message: string, config: NotificationConfig): MatSnackBarRef<SimpleSnackBar> {
    const finalConfig = this.mergeConfigs(this.defaultConfig, config);
    return this.openSnackBar(message, finalConfig);
  }

  /**
   * Display a notification with action button
   * @param message - The message to display
   * @param action - The action button text
   * @param type - The notification type
   * @param config - Optional configuration overrides
   * @returns MatSnackBarRef for further control
   */
  withAction(
    message: string, 
    action: string, 
    type: NotificationType = NotificationType.INFO,
    config?: Partial<NotificationConfig>
  ): MatSnackBarRef<SimpleSnackBar> {
    const finalConfig = this.mergeConfigs(
      this.defaultConfig,
      this.typeConfigs[type],
      config || {},
      { duration: 0 } // Don't auto-dismiss when there's an action
    );
    
    return this.snackBar.open(message, action, finalConfig);
  }

  /**
   * Display a loading notification
   * @param message - The loading message
   * @param config - Optional configuration overrides
   * @returns MatSnackBarRef for further control
   */
  loading(message: string = 'Loading...', config?: Partial<NotificationConfig>): MatSnackBarRef<SimpleSnackBar> {
    const loadingConfig = this.mergeConfigs(
      this.defaultConfig,
      {
        panelClass: ['notification-loading'],
        icon: 'hourglass_empty',
        duration: 0, // Don't auto-dismiss loading messages
        showCloseButton: false
      },
      config || {}
    );
    
    return this.openSnackBar(message, loadingConfig);
  }

  /**
   * Dismiss all currently open notifications
   */
  dismissAll(): void {
    this.snackBar.dismiss();
  }

  /**
   * Core method to display notifications
   * @param message - The message to display
   * @param type - The notification type
   * @param config - Optional configuration overrides
   * @returns MatSnackBarRef for further control
   */
  private show(
    message: string, 
    type: NotificationType, 
    config?: Partial<NotificationConfig>
  ): MatSnackBarRef<SimpleSnackBar> {
    const finalConfig = this.mergeConfigs(
      this.defaultConfig,
      this.typeConfigs[type],
      config || {}
    );
    
    return this.openSnackBar(message, finalConfig);
  }

  /**
   * Opens the Material snackbar with the final configuration
   * @param message - The message to display
   * @param config - Final merged configuration
   * @returns MatSnackBarRef for further control
   */
  private openSnackBar(message: string, config: NotificationConfig): MatSnackBarRef<SimpleSnackBar> {
    const action = config.showCloseButton ? 'Close' : undefined;
    
    // Format message with icon if provided
    const displayMessage = config.icon ? `${config.icon} ${message}` : message;
    
    return this.snackBar.open(displayMessage, action, config);
  }

  /**
   * Merges multiple configuration objects
   * @param configs - Configuration objects to merge
   * @returns Merged configuration
   */
  private mergeConfigs(...configs: Partial<NotificationConfig>[]): NotificationConfig {
    return configs.reduce((merged, config) => {
      return {
        ...merged,
        ...config,
        panelClass: [
          ...(merged.panelClass || []),
          ...(config.panelClass || [])
        ]
      };
    }, {} as NotificationConfig);
  }
}
