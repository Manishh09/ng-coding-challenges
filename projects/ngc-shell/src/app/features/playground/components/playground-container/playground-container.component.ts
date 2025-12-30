import { Component, ChangeDetectionStrategy, inject, computed, signal, effect } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, of } from 'rxjs';
import { MonacoEditorComponent } from '../monaco-editor/monaco-editor.component';
import { StackblitzHostComponent } from '../stackblitz-host/stackblitz-host.component';
import { PlaygroundService } from '../../services/playground.service';
import { ChallengeLoaderService } from '../../services/challenge-loader.service';
import { Challenge } from '../../models/execution-challenge.model';

/**
 * Playground Container Component
 *
 * Smart orchestrator component that connects Monaco Editor, StackBlitz Host,
 * and PlaygroundService into a cohesive playground experience.
 *
 * **Responsibilities:**
 * - Subscribe to PlaygroundService state
 * - Transform state for child components
 * - Handle events from child components
 * - Prevent circular updates
 *
 * **Data Flow:**
 * ```
 * State:  Service → Container → Components
 * Events: Components → Container → Service
 * ```
 *
 * **Architecture:**
 * - Smart Component (has logic)
 * - Presentational Children (dumb components)
 * - Single Source of Truth (PlaygroundService)
 */
@Component({
  selector: 'ngc-playground-container',
  standalone: true,
  imports: [MonacoEditorComponent, StackblitzHostComponent],
  templateUrl: './playground-container.component.html',
  styleUrls: ['./playground-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaygroundContainerComponent {
  // ============================================================================
  // DEPENDENCIES
  // ============================================================================

  private route = inject(ActivatedRoute);
  private playgroundService = inject(PlaygroundService);
  private challengeLoader = inject(ChallengeLoaderService);

  // ============================================================================
  // CHALLENGE LOADING FROM URL
  // ============================================================================

  /**
   * Loads challenge from URL query parameters.
   * Expects: ?category=rxjs-api&challenge=fetch-products
   */
  private challengeData$ = toSignal(
    this.route.queryParams.pipe(
      switchMap(params => {
        const category = params['category'];
        const challengeSlug = params['challenge'];

        if (category && challengeSlug) {
          console.log('[Playground] Loading challenge:', category, challengeSlug);
          return this.challengeLoader.loadChallengeWithFiles(category, challengeSlug);
        }

        // No params - show empty state
        return of(null);
      })
    )
  );

  constructor() {
    /**
     * Effect: Load challenge into service when data arrives from URL.
     * Runs whenever query params change.
     */
    effect(() => {
      const data = this.challengeData$();

      if (data) {
        console.log('[Playground] Challenge loaded, updating service...');
        this.playgroundService.loadChallengeWithFiles(data.challenge, data.files);
      }
    });
  }

  // ============================================================================
  // STATE FROM SERVICE (Read-Only)
  // ============================================================================

  /** Current challenge metadata */
  challenge = this.playgroundService.currentChallenge;

  /** Current execution model */
  executionModel = this.playgroundService.executionModel;

  /** Active file path being edited */
  activeFilePath = this.playgroundService.activeFilePath;

  /** All files in the challenge */
  fileMap = this.playgroundService.fileMap;

  /** Is challenge loaded */
  isChallengeLoaded = this.playgroundService.isChallengeLoaded;

  /** Editable files list */
  editableFiles = this.playgroundService.editableFiles;

  /** Is current file read-only */
  isCurrentFileReadOnly = this.playgroundService.isCurrentFileReadOnly;

  // ============================================================================
  // LOCAL UI STATE
  // ============================================================================

  /** Selected panel (for responsive layout) */
  selectedPanel = signal<'editor' | 'preview'>('editor');

  // ============================================================================
  // COMPUTED SIGNALS (View-Specific Transformations)
  // ============================================================================

  /**
   * Current file content for Monaco Editor.
   * Computed from active file path and file map.
   */
  currentFileContent = computed(() => {
    const path = this.activeFilePath();
    const files = this.fileMap();
    return files[path] || '';
  });

  /**
   * Current file language for syntax highlighting.
   * Detected from file extension.
   */
  currentFileLanguage = computed(() => {
    const path = this.activeFilePath();
    return this.detectLanguage(path);
  });

  /**
   * Files formatted for StackBlitz (already in correct format).
   * Passed directly from service state.
   */
  stackblitzFiles = computed(() => {
    return this.fileMap();
  });

  /**
   * Challenge ID for StackBlitz.
   * Used to trigger VM recreation on challenge change.
   */
  challengeId = computed(() => {
    const model = this.executionModel();
    return model?.id || '';
  });

  /**
   * StackBlitz options.
   * Includes open file from active file path.
   */
  stackblitzOptions = computed(() => ({
    openFile: this.activeFilePath(),
    theme: 'dark' as const,
    view: 'default' as const,
    hideNavigation: false,
    hideDevTools: false,
    devToolsHeight: 50,
    terminalHeight: 50,
    showSidebar: true,
  }));

  // ============================================================================
  // CHANGE SOURCE TRACKING (Prevents Circular Updates)
  // ============================================================================

  private changeSource: 'editor' | 'service' | null = null;

  // ============================================================================
  // EVENT HANDLERS (Events Flow Up to Service)
  // ============================================================================

  /**
   * Handles code changes from Monaco Editor.
   * Already debounced by Monaco component (300ms).
   *
   * **Flow:** Monaco → Container → Service → StackBlitz
   *
   * @param newContent - New code content
   */
  onEditorChange(newContent: string): void {
    // Mark change source to prevent circular update
    this.changeSource = 'editor';

    const path = this.activeFilePath();
    this.playgroundService.updateFileContent(path, newContent);

    // Reset after microtask to allow service update to propagate
    queueMicrotask(() => {
      this.changeSource = null;
    });
  }

  /**
   * Handles file selection from file tree or tabs.
   *
   * **Flow:** FileTree → Container → Service → Monaco
   *
   * @param path - File path to activate
   */
  onFileSelect(path: string): void {
    this.playgroundService.setActiveFile(path);
  }

  /**
   * Handles challenge selection from challenge list.
   * Triggers full VM recreation in StackBlitz.
   *
   * **Flow:** ChallengeList → Container → Service → Monaco + StackBlitz
   *
   * @param challenge - Challenge to load
   */
  onChallengeSelect(challenge: Challenge): void {
    this.playgroundService.loadChallenge(challenge);
  }

  /**
   * Handles reset button click.
   * Restores all files to original state.
   */
  onReset(): void {
    this.playgroundService.resetChallenge();
  }

  /**
   * Toggles between editor and preview panels (for mobile).
   */
  togglePanel(panel: 'editor' | 'preview'): void {
    this.selectedPanel.set(panel);
  }

  // ============================================================================
  // UTILITIES
  // ============================================================================

  /**
   * Detects language from file path extension.
   *
   * @param filePath - File path
   * @returns Language identifier for Monaco
   */
  private detectLanguage(filePath: string): string {
    const ext = filePath.split('.').pop()?.toLowerCase();
    const languageMap: Record<string, string> = {
      ts: 'typescript',
      js: 'javascript',
      html: 'html',
      css: 'css',
      scss: 'scss',
      json: 'json',
      md: 'markdown',
    };
    return languageMap[ext || ''] || 'typescript';
  }
}
