import { Injectable } from '@angular/core';
import sdk, { ProjectTemplate } from '@stackblitz/sdk';
import {
  LiveEditorOpenOptions,
  LiveEditorProject,
  LiveEditorProvider
} from './live-editor.types';

/**
 * StackBlitz implementation of {@link LiveEditorProvider}.
 *
 * Boots a self-contained StackBlitz project from inline files via
 * `sdk.openProject` — no GitHub repository is involved. This is the single
 * place in the app that knows about the StackBlitz SDK; swap the token binding
 * to change engines.
 */
@Injectable({ providedIn: 'root' })
export class StackblitzLiveEditorProvider implements LiveEditorProvider {
  readonly name = 'stackblitz';

  open(project: LiveEditorProject, options: LiveEditorOpenOptions = {}): void {
    sdk.openProject(
      {
        title: project.title,
        description: project.description,
        template: project.template as ProjectTemplate,
        files: project.files,
        dependencies: project.dependencies
      },
      {
        newWindow: options.newWindow ?? true,
        openFile: project.openFile
      }
    );
  }
}
