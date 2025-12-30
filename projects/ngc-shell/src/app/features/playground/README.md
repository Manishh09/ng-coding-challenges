# Playground Feature

Complete code playground system for Angular coding challenges with Monaco Editor and StackBlitz integration.

## Architecture

```
PlaygroundContainerComponent (Orchestrator)
├── MonacoEditorComponent (Code Editor)
├── StackblitzHostComponent (Live Preview)
└── PlaygroundService (State Management)
```

## Quick Start

### 1. Navigate to Playground

```
http://localhost:4200/playground
```

### 2. Load a Challenge Programmatically

```typescript
import { PlaygroundService } from '@app/features/playground';
import { inject } from '@angular/core';

export class MyChallengeComponent {
  private playgroundService = inject(PlaygroundService);

  loadChallenge() {
    const challenge = {
      id: 12,
      slug: 'reactive-login-form',
      title: 'Challenge 12: Reactive Login Form',
      categoryId: 'angular-forms',
      difficulty: 'Beginner',
      tags: ['Reactive Forms', 'FormGroup', 'Validators'],
      requirementList: ['Create login form...'],
      workspace: {
        componentPath: 'src/app/challenges/login-form/login-form.component',
        componentName: 'LoginFormComponent'
      }
    };

    this.playgroundService.loadChallenge(challenge);
  }
}
```

## Data Flow

### User Types in Monaco Editor
```
Monaco → (300ms debounce) → Container.onEditorChange() 
  → Service.updateFileContent() → StackBlitz VM.applyFsDiff()
```

### User Switches File
```
FileTree → Container.onFileSelect() 
  → Service.setActiveFile() → Monaco updates content
```

### User Switches Challenge
```
ChallengeList → Container.onChallengeSelect() 
  → Service.loadChallenge() → Full VM recreation + Monaco update
```

## Key Features

✅ **No Circular Updates**: Change source tracking + value comparison  
✅ **No Full Reloads**: Incremental file updates via `VM.applyFsDiff()`  
✅ **Debounced Updates**: 300ms debounce on editor changes  
✅ **Clean Lifecycle**: Proper initialization and cleanup  
✅ **Signal-Based**: Reactive state management with Angular Signals  
✅ **Type-Safe**: Full TypeScript support  

## Components

### MonacoEditorComponent

Reusable Monaco Editor wrapper with Signal-based API.

```typescript
<ngc-monaco-editor
  [code]="code()"
  [language]="'typescript'"
  [readOnly]="false"
  (codeChange)="onCodeChange($event)"
/>
```

### StackblitzHostComponent

Embedded StackBlitz VM host with incremental file updates.

```typescript
<ngc-stackblitz-host
  [challengeId]="challenge().id"
  [files]="challenge().files"
  [options]="{ openFile: 'src/app/app.component.ts' }"
/>
```

### PlaygroundContainerComponent

Smart orchestrator connecting all pieces together.

```typescript
<ngc-playground-container />
```

## Service API

### PlaygroundService

```typescript
// Read-only signals
currentChallenge: Signal<Challenge | null>
fileMap: Signal<Record<string, string>>
activeFilePath: Signal<string>
isChallengeLoaded: Signal<boolean>

// Methods
loadChallenge(challenge: Challenge): void
updateFileContent(path: string, content: string): void
setActiveFile(path: string): void
resetChallenge(): void
clearPlayground(): void
```

## Utilities

### deriveExecutionModel()

Transforms raw challenge metadata into execution-ready configuration.

```typescript
import { deriveExecutionModel } from '@app/features/playground';

const executionModel = deriveExecutionModel(challenge);
// Returns: ExecutionChallenge with files, defaultFile, readOnlyFiles, etc.
```

## Performance

| Operation | Monaco Update | StackBlitz Update | VM Recreation |
|-----------|--------------|-------------------|---------------|
| Type in editor | ❌ No | ✅ Incremental | ❌ No |
| Switch file | ✅ New content | ❌ No | ❌ No |
| Switch challenge | ✅ New content | ✅ Full files | ✅ Yes |
| Reset challenge | ✅ Original | ✅ Incremental | ❌ No |

## Dependencies

- `monaco-editor`: ^0.55.1
- `@stackblitz/sdk`: ^1.11.0

## File Structure

```
features/playground/
├── components/
│   ├── monaco-editor/
│   │   └── monaco-editor.component.ts
│   ├── stackblitz-host/
│   │   └── stackblitz-host.component.ts
│   └── playground-container/
│       ├── playground-container.component.ts
│       ├── playground-container.component.html
│       └── playground-container.component.scss
├── services/
│   └── playground.service.ts
├── models/
│   └── execution-challenge.model.ts
├── utils/
│   └── derive-execution-model.ts
└── index.ts
```

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (Monaco may have minor quirks)

## Troubleshooting

### Monaco Editor Not Loading

Ensure Monaco assets are properly configured in `angular.json`:

```json
{
  "assets": [
    {
      "glob": "**/*",
      "input": "node_modules/monaco-editor",
      "output": "/assets/monaco-editor/"
    }
  ]
}
```

### StackBlitz Not Embedding

Check browser console for CORS errors. StackBlitz SDK requires proper origin configuration.

## Future Enhancements

- [ ] Validation system with test runner
- [ ] Solution comparison
- [ ] Hints system
- [ ] Progress tracking
- [ ] Code snippets library
