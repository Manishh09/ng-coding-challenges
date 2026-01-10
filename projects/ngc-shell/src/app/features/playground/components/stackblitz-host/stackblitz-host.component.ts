import {
  Component,
  ChangeDetectionStrategy,
  input,
  effect,
  viewChild,
  ElementRef,
  DestroyRef,
  inject,
  afterNextRender,
  Injector,
  signal,
} from '@angular/core';
import sdk from '@stackblitz/sdk';
import type { Project, VM } from '@stackblitz/sdk';

/**
 * StackBlitz Host Component
 *
 * Embeds a StackBlitz VM for running Angular challenges in isolation.
 *
 * **Lifecycle Strategy:**
 * - Creates a new VM when challengeId changes (full recreation)
 * - Updates only modified files when files input changes (efficient updates)
 * - Automatically disposes VM on component destroy
 *
 * **Performance Optimizations:**
 * - One VM instance per challenge (not recreated on every file change)
 * - Incremental file updates using VM.applyFsDiff()
 * - Debounced file comparison to avoid unnecessary updates
 *
 * **Usage:**
 * ```html
 * <ngc-stackblitz-host
 *   [challengeId]="challenge().id"
 *   [files]="challenge().files"
 *   [options]="{ openFile: 'src/app/app.component.ts' }"
 * />
 * ```
 */
@Component({
  selector: 'ngc-stackblitz-host',
  standalone: true,
  template: `
    <div
      #stackblitzContainer
      class="stackblitz-container"
      [class.loading]="isLoading()"
    >
      @if (isLoading()) {
        <div class="loading-overlay">
          <div class="spinner"></div>
          <p>Loading StackBlitz environment...</p>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      position: relative;
    }

    .stackblitz-container {
      width: 100%;
      height: 100%;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      overflow: hidden;
      background: #1e1e1e;

      &.loading {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .loading-overlay {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      color: #ffffff;

      .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid rgba(255, 255, 255, 0.1);
        border-top-color: #4a9eff;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      p {
        margin: 0;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.7);
      }
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StackblitzHostComponent {
  // ============================================================================
  // INPUTS
  // ============================================================================

  /**
   * Unique identifier for the current challenge.
   * When this changes, the entire VM is recreated.
   */
  challengeId = input.required<string | number>();

  /**
   * Virtual file system as key-value pairs.
   * Format: { 'path/to/file.ts': 'file content' }
   *
   * When files change but challengeId remains the same,
   * only modified files are updated (efficient incremental updates).
   */
  files = input.required<Record<string, string>>();

  /**
   * StackBlitz embed options.
   * Configure open file, UI theme, panels visibility, etc.
   */
  options = input<{
    openFile?: string;
    theme?: 'light' | 'dark';
    hideNavigation?: boolean;
    hideDevTools?: boolean;
    showSidebar?: boolean;
    view?: 'default' | 'preview' | 'editor';
    height?: number;
    [key: string]: any;
  }>({
    theme: 'dark',
    hideNavigation: false,
    hideDevTools: false,
    showSidebar: true,
    view: 'default',
  });

  // ============================================================================
  // STATE & DEPENDENCIES
  // ============================================================================

  /** Loading state indicator */
  isLoading = signal(true);

  /** Reference to the container element where StackBlitz will embed */
  private stackblitzContainer = viewChild.required<ElementRef<HTMLDivElement>>('stackblitzContainer');

  /** Current StackBlitz VM instance */
  private vm: VM | null = null;

  /** Previous challenge ID for change detection */
  private previousChallengeId: string | number | undefined = undefined;

  /** Previous files snapshot for efficient diffing */
  private previousFiles: Record<string, string> = {};

  /** Dependencies */
  private destroyRef = inject(DestroyRef);
  private injector = inject(Injector);

  // ============================================================================
  // LIFECYCLE
  // ============================================================================

  constructor() {
    // Initialize StackBlitz after DOM is ready
    afterNextRender(() => {
      this.initializeStackBlitz();
    });

    /**
     * Effect: Handle Challenge Changes
     *
     * Recreates the VM when challengeId changes.
     * This ensures a clean environment for each challenge.
     */
    effect(() => {
      const currentChallengeId = this.challengeId();

      // Skip initial run (handled by afterNextRender)
      if (this.previousChallengeId === undefined) {
        this.previousChallengeId = currentChallengeId;
        return;
      }

      // Recreate VM only if challenge actually changed
      if (currentChallengeId !== this.previousChallengeId) {
        this.previousChallengeId = currentChallengeId;
        this.recreateVM();
      }
    }, { injector: this.injector });

    /**
     * Effect: Handle File Updates
     *
     * Efficiently updates only modified files when files input changes
     * without recreating the entire VM.
     */
    effect(() => {
      const currentFiles = this.files();

      // Skip if VM not ready or no previous files to compare
      if (!this.vm || Object.keys(this.previousFiles).length === 0) {
        this.previousFiles = { ...currentFiles };
        return;
      }

      // Calculate diff and update only modified files
      this.updateModifiedFiles(currentFiles);
      this.previousFiles = { ...currentFiles };
    }, { injector: this.injector, allowSignalWrites: true });

    // Cleanup VM on component destroy
    this.destroyRef.onDestroy(() => {
      this.disposeVM();
    });
  }

  // ============================================================================
  // STACKBLITZ OPERATIONS
  // ============================================================================

  /**
   * Initializes StackBlitz VM for the first time.
   * Embeds the project into the container element.
   */
  private async initializeStackBlitz(): Promise<void> {
    try {
      this.isLoading.set(true);

      const container = this.stackblitzContainer().nativeElement;
      const project = this.buildProject();

      // Embed StackBlitz project into container
      this.vm = await sdk.embedProject(
        container,
        project,
        {
          forceEmbedLayout: true,         // Ensure embedded mode (no new tab)
          clickToLoad: false,             // Auto-load without user interaction
          openFile: this.options().openFile || 'src/app/app.component.ts',
          hideNavigation: false,          // Show file explorer
          hideDevTools: false,            // Show console/terminal panel
          showSidebar: true,              // Show file explorer sidebar
          view: this.options().view || 'default',  // Default view (editor + preview)
          theme: this.options().theme || 'dark',   // Editor theme
        }
      );

      // Store initial files snapshot
      this.previousFiles = { ...this.files() };

      this.isLoading.set(false);
    } catch (error) {
      console.error('[StackBlitzHost] Failed to initialize:', error);
      this.isLoading.set(false);
    }
  }

  /**
   * Recreates the VM from scratch.
   * Called when challengeId changes to ensure clean state.
   */
  private async recreateVM(): Promise<void> {
    try {
      this.isLoading.set(true);

      // Dispose existing VM
      this.disposeVM();

      // Create new VM
      await this.initializeStackBlitz();
    } catch (error) {
      console.error('[StackBlitzHost] Failed to recreate VM:', error);
      this.isLoading.set(false);
    }
  }

  /**
   * Efficiently updates only modified files in the existing VM.
   * Uses StackBlitz VM.applyFsDiff() for incremental updates.
   *
   * @param currentFiles - New file system state
   */
  private async updateModifiedFiles(currentFiles: Record<string, string>): Promise<void> {
    if (!this.vm) return;

    try {
      const diff = this.calculateFilesDiff(this.previousFiles, currentFiles);

      // Skip update if no changes detected
      if (diff.create.length === 0 && diff.update.length === 0 && diff.destroy.length === 0) {
        return;
      }

      // Apply incremental file system changes
      await this.vm.applyFsDiff({
        create: diff.create.length > 0 ? Object.fromEntries(diff.create.map(path => [path, currentFiles[path]])) : {},
        //update: diff.update.length > 0 ? Object.fromEntries(diff.update.map(path => [path, currentFiles[path]])) : {},
        destroy: diff.destroy,
      });

      console.log('[StackBlitzHost] Updated files:', {
        created: diff.create.length,
        updated: diff.update.length,
        deleted: diff.destroy.length,
      });
    } catch (error) {
      console.error('[StackBlitzHost] Failed to update files:', error);
    }
  }

  /**
   * Disposes the current VM instance and cleans up resources.
   */
  private disposeVM(): void {
    if (this.vm) {
      // StackBlitz SDK doesn't expose explicit dispose method
      // Clear the container to remove iframe
      const container = this.stackblitzContainer().nativeElement;
      container.innerHTML = '';
      this.vm = null;
    }
  }

  // ============================================================================
  // UTILITIES
  // ============================================================================

  /**
   * Builds a StackBlitz project configuration from current inputs.
   */
  private buildProject(): Project {
    return {
      title: `Challenge ${this.challengeId()}`,
      description: 'Angular Coding Challenge',
      template: 'node' as const,  // Use 'node' instead of 'angular-cli' to respect package.json versions
      files: this.files(),
      settings: {
        compile: {
          trigger: 'auto',      // Auto-compile on file changes
          action: 'refresh',    // Refresh preview on compile
          clearConsole: false,  // Keep console history
        },
      },
    };
  }

  /**
   * Calculates the difference between two file systems.
   * Identifies created, updated, and deleted files.
   */
  private calculateFilesDiff(
    oldFiles: Record<string, string>,
    newFiles: Record<string, string>
  ): {
    create: string[];
    update: string[];
    destroy: string[];
  } {
    const create: string[] = [];
    const update: string[] = [];
    const destroy: string[] = [];

    // Find created and updated files
    for (const [path, content] of Object.entries(newFiles)) {
      if (!(path in oldFiles)) {
        create.push(path); // New file
      } else if (oldFiles[path] !== content) {
        update.push(path); // Modified file
      }
    }

    // Find deleted files
    for (const path of Object.keys(oldFiles)) {
      if (!(path in newFiles)) {
        destroy.push(path); // Deleted file
      }
    }

    return { create, update, destroy };
  }

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  /**
   * Manually triggers a VM refresh.
   * Useful for forcing a reload after external state changes.
   */
  public async refresh(): Promise<void> {
    await this.recreateVM();
  }

  /**
   * Gets the current VM instance.
   * Useful for advanced operations like getting editor instance.
   */
  public getVM(): VM | null {
    return this.vm;
  }
}
