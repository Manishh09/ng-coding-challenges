import { Challenge, ExecutionChallenge } from '../models/execution-challenge.model';

/**
 * Angular 19 Base Template
 *
 * Minimal production-ready base structure for StackBlitz.
 * Uses standalone APIs and latest Angular 19 patterns.
 */
const BASE_TEMPLATE: Record<string, string> = {
  'src/main.ts': `import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));`,

  'src/app/app.component.ts': `import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: \`<router-outlet />\`,
  styles: []
})
export class AppComponent {}`,

  'src/app/app.config.ts': `import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient()
  ]
};`,

  'src/app/app.routes.ts': `import { Routes } from '@angular/router';

export const routes: Routes = [];`,

  'src/index.html': `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Angular Challenge</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
  <app-root></app-root>
</body>
</html>`,

  'src/styles.scss': `/* Global Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  line-height: 1.6;
  color: #333;
}`,

  'angular.json': JSON.stringify({
    "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
    "version": 1,
    "newProjectRoot": "projects",
    "projects": {
      "demo": {
        "projectType": "application",
        "root": "",
        "sourceRoot": "src",
        "architect": {
          "build": {
            "builder": "@angular-devkit/build-angular:browser",
            "options": {
              "outputPath": "dist/demo",
              "index": "src/index.html",
              "main": "src/main.ts",
              "polyfills": ["zone.js"],
              "tsConfig": "tsconfig.app.json",
              "inlineStyleLanguage": "scss",
              "assets": [],
              "styles": ["src/styles.scss"],
              "scripts": []
            }
          }
        }
      }
    }
  }, null, 2),

  'package.json': JSON.stringify({
    "name": "angular-challenge",
    "version": "0.0.0",
    "scripts": {
      "ng": "ng",
      "start": "ng serve",
      "build": "ng build"
    },
    "private": true,
    "dependencies": {
      "@angular/animations": "^19.0.0",
      "@angular/common": "^19.0.0",
      "@angular/compiler": "^19.0.0",
      "@angular/core": "^19.0.0",
      "@angular/forms": "^19.0.0",
      "@angular/platform-browser": "^19.0.0",
      "@angular/platform-browser-dynamic": "^19.0.0",
      "@angular/router": "^19.0.0",
      "rxjs": "~7.8.0",
      "tslib": "^2.3.0",
      "zone.js": "~0.15.0"
    },
    "devDependencies": {
      "@angular-devkit/build-angular": "^19.0.0",
      "@angular/cli": "^19.0.0",
      "@angular/compiler-cli": "^19.0.0",
      "typescript": "~5.6.0"
    }
  }, null, 2),

  'tsconfig.json': JSON.stringify({
    "compileOnSave": false,
    "compilerOptions": {
      "outDir": "./dist/out-tsc",
      "strict": true,
      "noImplicitOverride": true,
      "noPropertyAccessFromIndexSignature": true,
      "noImplicitReturns": true,
      "noFallthroughCasesInSwitch": true,
      "skipLibCheck": true,
      "isolatedModules": true,
      "esModuleInterop": true,
      "sourceMap": true,
      "declaration": false,
      "experimentalDecorators": true,
      "moduleResolution": "bundler",
      "importHelpers": true,
      "target": "ES2022",
      "module": "ES2022",
      "lib": ["ES2022", "dom"]
    }
  }, null, 2),

  'tsconfig.app.json': JSON.stringify({
    "extends": "./tsconfig.json",
    "compilerOptions": {
      "outDir": "./out-tsc/app",
      "types": []
    },
    "files": ["src/main.ts"],
    "include": ["src/**/*.d.ts"]
  }, null, 2),
};

/**
 * Derives an execution-ready challenge from raw challenge metadata.
 *
 * Transforms challenge metadata into a StackBlitz-compatible file structure
 * with proper Angular 19 setup.
 *
 * @param challenge - Raw challenge metadata
 * @returns Execution-ready challenge configuration
 */
export function deriveExecutionModel(challenge: Challenge): ExecutionChallenge {
  const componentPath = challenge.workspace.componentPath;
  const componentName = challenge.workspace.componentName;
  const categoryPath = challenge.categoryId;

  // Build challenge-specific files
  const challengeFiles = buildChallengeFiles(challenge, componentPath, componentName);

  // Merge base template with challenge files
  const files = {
    ...BASE_TEMPLATE,
    ...challengeFiles,
  };

  // Update app.routes.ts to include challenge route
  files['src/app/app.routes.ts'] = generateAppRoutes(componentPath);

  // Update app.config.ts if Signals detected
  if (detectSignalsUsage(challenge)) {
    files['src/app/app.config.ts'] = generateAppConfig(true);
  }

  return {
    id: `${challenge.categoryId}-${challenge.slug}`,
    title: challenge.title,
    files,
    defaultFile: deriveDefaultFile(componentPath, componentName),
    readOnlyFiles: [
      'angular.json',
      'package.json',
      'tsconfig.json',
      'tsconfig.app.json',
      'src/main.ts',
      'src/index.html',
    ],
    editorConfig: {
      theme: 'dark',
      language: 'typescript',
    },
    validationConfig: {
      requiredFiles: [
        deriveDefaultFile(componentPath, componentName),
      ],
    },
  };
}

/**
 * Builds challenge-specific component files
 */
function buildChallengeFiles(
  challenge: Challenge,
  componentPath: string,
  componentName: string
): Record<string, string> {
  const files: Record<string, string> = {};

  // Generate component TypeScript
  const componentTs = generateComponentTs(challenge, componentName);
  files[`${componentPath}.ts`] = componentTs;

  // Generate component HTML
  files[`${componentPath}.html`] = `<div class="challenge-container">
  <h1>${challenge.title}</h1>
  <p>Implement your solution here...</p>
</div>`;

  // Generate component SCSS
  files[`${componentPath}.scss`] = `.challenge-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;

  h1 {
    margin-bottom: 1rem;
    color: #333;
  }
}`;

  return files;
}

/**
 * Generates component TypeScript based on challenge requirements
 */
function generateComponentTs(challenge: Challenge, componentName: string): string {
  const imports = deriveImports(challenge);
  const hasReactiveForms = challenge.tags.includes('Reactive Forms') ||
                          challenge.tags.includes('FormGroup') ||
                          challenge.tags.includes('FormArray');

  let template = `import { Component } from '@angular/core';
${imports}

@Component({
  selector: 'app-${toKebabCase(componentName)}',
  standalone: true,
  imports: [],
  templateUrl: './${toKebabCase(componentName)}.html',
  styleUrls: ['./${toKebabCase(componentName)}.scss']
})
export class ${componentName} {`;

  if (hasReactiveForms) {
    template += `
  // TODO: Inject FormBuilder
  // TODO: Create FormGroup
`;
  }

  template += `
  constructor() {
    // TODO: Initialize component
  }
}`;

  return template;
}

/**
 * Derives necessary imports based on challenge tags
 */
function deriveImports(challenge: Challenge): string {
  const imports: string[] = [];

  if (challenge.tags.includes('HttpClient') || challenge.tags.includes('API')) {
    imports.push("import { HttpClient } from '@angular/common/http';");
  }

  if (challenge.tags.includes('Reactive Forms') || challenge.tags.includes('FormGroup')) {
    imports.push("import { ReactiveFormsModule } from '@angular/forms';");
  }

  if (challenge.tags.includes('Signals')) {
    imports.push("import { signal, computed } from '@angular/core';");
  }

  return imports.join('\n');
}

/**
 * Generates app.routes.ts with challenge route
 */
function generateAppRoutes(componentPath: string): string {
  return `import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('${componentPath}').then(m => m[Object.keys(m)[0]])
  }
];`;
}

/**
 * Generates app.config.ts with optional zoneless mode
 */
function generateAppConfig(useSignals: boolean): string {
  const zoneProvider = useSignals
    ? 'provideExperimentalZonelessChangeDetection()'
    : 'provideZoneChangeDetection({ eventCoalescing: true })';

  return `import { ApplicationConfig, ${useSignals ? 'provideExperimentalZonelessChangeDetection' : 'provideZoneChangeDetection'} } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    ${zoneProvider},
    provideRouter(routes),
    provideHttpClient()
  ]
};`;
}

/**
 * Detects if challenge uses Angular Signals
 */
function detectSignalsUsage(challenge: Challenge): boolean {
  return challenge.tags.includes('Signals');
}

/**
 * Derives the default file to open in editor
 */
function deriveDefaultFile(componentPath: string, componentName: string): string {
  return `${componentPath}.ts`;
}

/**
 * Converts PascalCase to kebab-case
 */
function toKebabCase(str: string): string {
  return str
    .replace(/Component$/, '')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase();
}
