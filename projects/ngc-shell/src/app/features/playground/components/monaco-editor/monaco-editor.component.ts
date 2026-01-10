import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  effect,
  viewChild,
  ElementRef,
  DestroyRef,
  inject,
  afterNextRender,
  Injector,
} from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import * as monaco from 'monaco-editor';

// Configure Monaco Editor workers
(self as any).MonacoEnvironment = {
  getWorkerUrl: function (moduleId: string, label: string) {
    if (label === 'json') {
      return './assets/monaco/vs/language/json/json.worker.js';
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return './assets/monaco/vs/language/css/css.worker.js';
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return './assets/monaco/vs/language/html/html.worker.js';
    }
    if (label === 'typescript' || label === 'javascript') {
      return './assets/monaco/vs/language/typescript/ts.worker.js';
    }
    return './assets/monaco/vs/editor/editor.worker.js';
  }
};

/**
 * Monaco Editor Wrapper Component
 *
 * Reusable Angular 19 wrapper for Monaco Editor with Signal-based API.
 *
 * **Features:**
 * - OnPush change detection for optimal performance
 * - Debounced code changes (300ms) to prevent excessive updates
 * - Clean lifecycle management with DestroyRef
 * - Bidirectional sync with automatic loop prevention
 * - Reactive to input changes (code, language, readOnly)
 *
 * **Usage:**
 * ```html
 * <ngc-monaco-editor
 *   [code]="code()"
 *   [language]="'typescript'"
 *   [readOnly]="false"
 *   (codeChange)="onCodeChange($event)"
 * />
 * ```
 */
@Component({
  selector: 'ngc-monaco-editor',
  standalone: true,
  template: `<div #editorContainer class="monaco-editor-container"></div>`,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }

    .monaco-editor-container {
      width: 100%;
      height: 100%;
      min-height: 300px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonacoEditorComponent {
  // ============================================================================
  // INPUTS
  // ============================================================================

  /** Code content to display */
  code = input<string>('');

  /** Language for syntax highlighting */
  language = input<string>('typescript');

  /** Read-only mode */
  readOnly = input<boolean>(false);

  // ============================================================================
  // OUTPUTS
  // ============================================================================

  /** Debounced code change events (300ms) */
  private codeChangeSubject = new Subject<string>();
  codeChange = outputFromObservable(
    this.codeChangeSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    )
  );

  // ============================================================================
  // VIEW REFERENCES
  // ============================================================================

  editorContainer = viewChild.required<ElementRef<HTMLDivElement>>('editorContainer');

  // ============================================================================
  // DEPENDENCIES
  // ============================================================================

  private destroyRef = inject(DestroyRef);
  private injector = inject(Injector);

  // ============================================================================
  // STATE
  // ============================================================================

  /** Monaco editor instance */
  private editor: monaco.editor.IStandaloneCodeEditor | null = null;

  /** Flag to prevent circular updates */
  private isUpdatingFromModel = false;

  // ============================================================================
  // LIFECYCLE
  // ============================================================================

  constructor() {
    // Initialize editor after DOM is ready
    afterNextRender(() => {
      this.initializeEditor();
    });

    /**
     * Effect: Handle code changes from parent
     * Updates editor only if value differs from current
     */
    effect(() => {
      const newCode = this.code();
      if (this.editor && !this.isUpdatingFromModel) {
        const currentValue = this.editor.getValue();
        if (currentValue !== newCode) {
          this.editor.setValue(newCode);
        }
      }
    }, { injector: this.injector });

    /**
     * Effect: Handle language changes
     * Updates Monaco language mode
     */
    effect(() => {
      const newLanguage = this.language();
      if (this.editor) {
        const model = this.editor.getModel();
        if (model) {
          monaco.editor.setModelLanguage(model, newLanguage);
        }
      }
    }, { injector: this.injector });

    /**
     * Effect: Handle readOnly changes
     * Updates editor options
     */
    effect(() => {
      const isReadOnly = this.readOnly();
      if (this.editor) {
        this.editor.updateOptions({ readOnly: isReadOnly });
      }
    }, { injector: this.injector });

    // Cleanup on destroy
    this.destroyRef.onDestroy(() => {
      this.disposeEditor();
    });
  }

  // ============================================================================
  // EDITOR OPERATIONS
  // ============================================================================

  /**
   * Initializes Monaco Editor with configuration.
   */
  private initializeEditor(): void {
    const container = this.editorContainer().nativeElement;

    this.editor = monaco.editor.create(container, {
      value: this.code(),
      language: this.language(),
      readOnly: this.readOnly(),
      theme: 'vs-dark',
      automaticLayout: true,
      minimap: { enabled: false },
      fontSize: 14,
      lineNumbers: 'on',
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      folding: true,
      bracketPairColorization: { enabled: true },
      tabSize: 2,
      insertSpaces: true,
    });

    /**
     * Listen to content changes and emit to parent.
     * Sets flag to prevent circular updates.
     */
    this.editor.onDidChangeModelContent(() => {
      if (this.editor && !this.readOnly()) {
        this.isUpdatingFromModel = true;
        const value = this.editor.getValue();
        this.codeChangeSubject.next(value);

        // Reset flag after a tick to allow updates from parent
        setTimeout(() => {
          this.isUpdatingFromModel = false;
        });
      }
    });
  }

  /**
   * Disposes editor and cleans up resources.
   */
  private disposeEditor(): void {
    if (this.editor) {
      this.editor.dispose();
      this.editor = null;
    }
    this.codeChangeSubject.complete();
  }

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  /**
   * Gets current editor value.
   */
  public getValue(): string {
    return this.editor?.getValue() ?? '';
  }

  /**
   * Focuses the editor.
   */
  public focus(): void {
    this.editor?.focus();
  }

  /**
   * Formats the document.
   */
  public async formatDocument(): Promise<void> {
    if (this.editor) {
      await this.editor.getAction('editor.action.formatDocument')?.run();
    }
  }
}
