import { Injectable, signal, computed } from '@angular/core';
import { Challenge, ExecutionChallenge } from '../models/execution-challenge.model';
import { deriveExecutionModel } from '../utils/derive-execution-model';

/**
 * Playground Service
 *
 * Single source of truth for playground state.
 * Manages challenge loading, file editing, and execution state using Angular Signals.
 *
 * **Responsibilities:**
 * - Load and transform challenges into execution models
 * - Manage file map (virtual file system)
 * - Track active file being edited
 * - Provide validation state
 *
 * **Design Principles:**
 * - No business logic (pure state management)
 * - All state is immutable (signals with updates)
 * - Read-only public API (asReadonly signals)
 * - Methods are the only way to mutate state
 */
@Injectable({
  providedIn: 'root'
})
export class PlaygroundService {
  // ============================================================================
  // PRIVATE STATE SIGNALS
  // ============================================================================

  /** Current challenge metadata */
  private _currentChallenge = signal<Challenge | null>(null);

  /** Current execution model with files */
  private _executionModel = signal<ExecutionChallenge | null>(null);

  /** Active file path being edited */
  private _activeFilePath = signal<string>('');

  /** Virtual file system (path -> content) */
  private _fileMap = signal<Record<string, string>>({});

  /** Running state (for future validation/execution) */
  private _isRunning = signal<boolean>(false);

  /** Validation result (for future validation) */
  private _validationResult = signal<{
    passed: boolean;
    errors: string[];
  } | null>(null);

  // ============================================================================
  // PUBLIC READ-ONLY SIGNALS
  // ============================================================================

  /** Current challenge (read-only) */
  readonly currentChallenge = this._currentChallenge.asReadonly();

  /** Current execution model (read-only) */
  readonly executionModel = this._executionModel.asReadonly();

  /** Active file path (read-only) */
  readonly activeFilePath = this._activeFilePath.asReadonly();

  /** File map (read-only) */
  readonly fileMap = this._fileMap.asReadonly();

  /** Running state (read-only) */
  readonly isRunning = this._isRunning.asReadonly();

  /** Validation result (read-only) */
  readonly validationResult = this._validationResult.asReadonly();

  // ============================================================================
  // COMPUTED SIGNALS
  // ============================================================================

  /** List of editable files (excludes read-only files) */
  readonly editableFiles = computed(() => {
    const model = this._executionModel();
    const files = this._fileMap();

    if (!model) return [];

    return Object.keys(files).filter(
      path => !model.readOnlyFiles.includes(path)
    );
  });

  /** Current file content */
  readonly currentFileContent = computed(() => {
    const path = this._activeFilePath();
    const files = this._fileMap();
    return files[path] || '';
  });

  /** Is current file read-only */
  readonly isCurrentFileReadOnly = computed(() => {
    const path = this._activeFilePath();
    const model = this._executionModel();
    return model?.readOnlyFiles.includes(path) ?? false;
  });

  /** Challenge loaded state */
  readonly isChallengeLoaded = computed(() => {
    return this._currentChallenge() !== null;
  });

  // ============================================================================
  // PUBLIC METHODS (State Mutations)
  // ============================================================================

  /**
   * Loads a challenge and transforms it into execution model.
   *
   * **Side Effects:**
   * - Updates currentChallenge
   * - Generates execution model
   * - Populates file map
   * - Sets active file to default
   *
   * @param challenge - Raw challenge metadata
   */
  loadChallenge(challenge: Challenge): void {
    // Transform challenge to execution model
    const executionModel = deriveExecutionModel(challenge);

    // Update all related state
    this._currentChallenge.set(challenge);
    this._executionModel.set(executionModel);
    this._fileMap.set({ ...executionModel.files });
    this._activeFilePath.set(executionModel.defaultFile);

    // Reset validation state
    this._validationResult.set(null);
    this._isRunning.set(false);
  }

  /**
   * Loads a challenge with pre-generated files.
   * Used by ChallengeLoaderService to avoid double file generation.
   *
   * @param challenge - Raw challenge metadata
   * @param files - Pre-generated file system
   */
  loadChallengeWithFiles(challenge: Challenge, files: Record<string, string>): void {
    // Create execution model without re-generating files
    const componentPath = challenge.workspace.componentPath.replace('./', 'src/app/');
    const defaultFile = `${componentPath}.ts`;

    const executionModel: ExecutionChallenge = {
      id: `${challenge.categoryId}-${challenge.slug}`,
      title: challenge.title,
      files,
      defaultFile,
      readOnlyFiles: [
        'angular.json',
        'package.json',
        'tsconfig.json',
        'src/main.ts',
        'src/index.html',
      ],
      editorConfig: {
        theme: 'dark',
        language: 'typescript',
      },
      validationConfig: {
        requiredFiles: [defaultFile],
      },
    };

    // Update all related state
    this._currentChallenge.set(challenge);
    this._executionModel.set(executionModel);
    this._fileMap.set({ ...files });
    this._activeFilePath.set(defaultFile);

    // Reset validation state
    this._validationResult.set(null);
    this._isRunning.set(false);
  }

  /**
   * Updates a single file's content in the file map.
   *
   * **Triggers:**
   * - Monaco Editor content change
   * - Incremental StackBlitz update
   *
   * @param path - File path to update
   * @param content - New file content
   */
  updateFileContent(path: string, content: string): void {
    this._fileMap.update(files => ({
      ...files,
      [path]: content
    }));
  }

  /**
   * Changes the active file being edited.
   *
   * **Triggers:**
   * - Monaco Editor content update
   * - StackBlitz openFile option update
   *
   * @param path - File path to activate
   */
  setActiveFile(path: string): void {
    const files = this._fileMap();

    // Only set if file exists
    if (path in files) {
      this._activeFilePath.set(path);
    }
  }

  /**
   * Resets challenge to original state.
   * Restores all files to initial content from execution model.
   */
  resetChallenge(): void {
    const model = this._executionModel();

    if (model) {
      this._fileMap.set({ ...model.files });
      this._validationResult.set(null);
    }
  }

  /**
   * Clears all playground state.
   * Used when navigating away from playground.
   */
  clearPlayground(): void {
    this._currentChallenge.set(null);
    this._executionModel.set(null);
    this._fileMap.set({});
    this._activeFilePath.set('');
    this._validationResult.set(null);
    this._isRunning.set(false);
  }

  // ============================================================================
  // FUTURE: VALIDATION & EXECUTION
  // ============================================================================

  /**
   * Validates the current solution (placeholder for future implementation).
   *
   * Future: Run tests, check requirements, provide feedback
   */
  async validateSolution(): Promise<void> {
    this._isRunning.set(true);

    // TODO: Implement validation logic
    // - Run unit tests
    // - Check requirements
    // - Provide feedback

    this._validationResult.set({
      passed: false,
      errors: ['Validation not yet implemented']
    });

    this._isRunning.set(false);
  }
}
