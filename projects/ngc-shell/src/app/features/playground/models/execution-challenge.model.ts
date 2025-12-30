/**
 * Execution Challenge Models
 *
 * Type definitions for the playground execution system.
 * Separates metadata (Challenge) from execution configuration (ExecutionChallenge).
 */

/** Raw challenge metadata from challenges.json */
export interface Challenge {
  id: number;
  slug: string;
  title: string;
  categoryId: string;
  difficulty: string;
  description: string;
  tags: string[];
  requirementList: string[];
  workspace: {
    componentPath: string;
    componentName: string;
  };
  [key: string]: any;
}

/** Execution-ready challenge configuration */
export interface ExecutionChallenge {
  id: string;
  title: string;
  files: Record<string, string>;
  defaultFile: string;
  readOnlyFiles: string[];
  editorConfig: {
    theme: 'light' | 'dark';
    language: string;
  };
  validationConfig?: {
    requiredFiles: string[];
    testCommand?: string;
  };
}

/** StackBlitz project configuration */
export interface StackBlitzProject {
  title: string;
  description: string;
  template: 'angular-cli';
  files: Record<string, string>;
  settings?: {
    compile?: {
      trigger: 'auto' | 'save' | 'keystroke';
      action: 'refresh' | 'hmr';
      clearConsole: boolean;
    };
  };
}
