import { InjectionToken, inject } from '@angular/core';
import { LiveEditorProvider } from './live-editor.types';
import { StackblitzLiveEditorProvider } from './stackblitz-live-editor.provider';

/**
 * DI token for the active {@link LiveEditorProvider}.
 *
 * Defaults to {@link StackblitzLiveEditorProvider}. To switch the live-coding
 * engine (e.g. to a self-hosted WebContainer IDE), provide a different
 * implementation for this token at the app or route level:
 *
 * ```ts
 * providers: [
 *   { provide: LIVE_EDITOR_PROVIDER, useExisting: MyWebContainerProvider }
 * ]
 * ```
 *
 * Consumers inject the token — never a concrete provider — so the swap is a
 * one-line change with no edits to challenge pages.
 */
export const LIVE_EDITOR_PROVIDER = new InjectionToken<LiveEditorProvider>(
  'LIVE_EDITOR_PROVIDER',
  {
    providedIn: 'root',
    factory: () => inject(StackblitzLiveEditorProvider)
  }
);
