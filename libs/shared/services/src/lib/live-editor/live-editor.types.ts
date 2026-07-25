/**
 * Live Editor — provider-agnostic contract.
 *
 * This layer decouples the application from any specific in-browser coding
 * platform (StackBlitz today; a self-hosted WebContainer IDE tomorrow).
 * Consumers depend only on {@link LiveEditorProvider} via the
 * {@link LIVE_EDITOR_PROVIDER} token — never on a concrete vendor SDK — so the
 * engine can be swapped without touching challenge pages.
 *
 * The editor boots a fully self-contained project defined by inline files; it
 * does NOT clone any external Git repository.
 */

/**
 * Project template that tells the engine how to compile and run the files.
 * `angular-cli` boots instantly (no install); `node` runs the real CLI via
 * WebContainers.
 */
export type LiveEditorTemplate =
  | 'angular-cli'
  | 'typescript'
  | 'javascript'
  | 'node';

/** Project files, keyed by path, with contents as strings. */
export type LiveEditorFiles = Record<string, string>;

/**
 * A self-contained project to open in the live editor.
 */
export interface LiveEditorProject {
  /** Human-readable project title (shown in the editor). */
  title: string;
  /** Short project description. */
  description?: string;
  /** Compile/run template. */
  template: LiveEditorTemplate;
  /** All project files, keyed by path. */
  files: LiveEditorFiles;
  /** npm dependencies (for template engines that resolve them). */
  dependencies?: Record<string, string>;
  /** File(s) to open initially (path, comma list, or array). */
  openFile?: string | string[];
}

/** Options controlling how a project is opened. */
export interface LiveEditorOpenOptions {
  /** Open in a new browser tab. Defaults to `true`. */
  newWindow?: boolean;
}

/**
 * A live-coding engine that can open a project.
 *
 * Implementations are bound through {@link LIVE_EDITOR_PROVIDER}. The default
 * binding is {@link StackblitzLiveEditorProvider}; apps may override the token
 * to switch engines without changing any consumer.
 */
export interface LiveEditorProvider {
  /** Stable identifier for the engine (e.g. `'stackblitz'`). */
  readonly name: string;

  /**
   * Open the given project in the live editor (new tab by default).
   */
  open(project: LiveEditorProject, options?: LiveEditorOpenOptions): void;
}
