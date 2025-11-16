import { ChangeDetectionStrategy, Component, input, signal, inject, DestroyRef, OnInit, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgOptimizedImage } from "@angular/common";
import { GlobalSearchComponent } from '../global-search/global-search.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/**
 * Header component with responsive design
 * Includes logo, navigation, theme toggle and mobile menu
 *
 * Features:
 * - Dynamic mobile menu state management
 * - Accessible ARIA attributes
 * - Optimized images with priority loading
 * - Theme toggle integration
 */
@Component({
  selector: 'ng-coding-challenges-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
    ThemeToggleComponent,
    MatTooltipModule,
    NgOptimizedImage
],
  standalone: true
})
export class HeaderComponent implements OnInit {
  /** Application name for accessibility and branding */
  appName = input<string>('');

  /** Control visibility of mobile menu button */
  showMobileMenu = input<boolean>(false);

  /** Logo image URL */
  logoUrl = input<string>('');

  /** Github  logo */
  githubLogoUrl = input<string>('');

  /** Mobile menu open state */
  readonly mobileMenuOpen = signal(false);

  /** Check if viewport is mobile */
  readonly isMobile = signal(false);

  private readonly dialog = inject(MatDialog);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    // Detect mobile viewport
    this.breakpointObserver
      .observe([Breakpoints.HandsetPortrait, '(max-width: 767px)'])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        this.isMobile.set(result.matches);
      });
  }

  /**
   * Toggle mobile menu state
   */
  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(value => !value);
  }

  /**
   * Close mobile menu
   */
  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  /**
   * Open global search modal
   */
  openGlobalSearch(): void {
    // Prevent opening multiple dialogs
    if (this.dialog.openDialogs.length > 0) {
      return;
    }

    this.dialog.open(GlobalSearchComponent, {
      width: '90vw',
      maxWidth: '700px',
      maxHeight: '85vh',
      panelClass: 'global-search-dialog',
      data: { isMobile: this.isMobile() },
      autoFocus: 'input',
      restoreFocus: true,
      hasBackdrop: true,
      disableClose: false
    });
  }

  /**
   * Handle keyboard shortcut for opening search
   */
  @HostListener('document:keydown', ['$event'])
  handleKeyboardShortcut(event: KeyboardEvent): void {
    // Press "/" to open search modal (like GitHub, GitLab)
    if (event.key === '/' && !this.isInputFocused()) {
      event.preventDefault();
      this.openGlobalSearch();
    }
  }

  /**
   * Check if an input field is currently focused
   */
  private isInputFocused(): boolean {
    const activeElement = document.activeElement;
    return (
      activeElement instanceof HTMLInputElement ||
      activeElement instanceof HTMLTextAreaElement ||
      activeElement?.getAttribute('contenteditable') === 'true'
    );
  }
}
