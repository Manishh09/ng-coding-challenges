import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of, catchError, switchMap } from 'rxjs';
import { Challenge } from '../models/execution-challenge.model';

/**
 * Challenge Loader Service
 *
 * Loads challenge configurations from challenges.json and generates
 * complete file systems for the playground.
 *
 * **Responsibilities:**
 * - Fetch challenges.json (with caching)
 * - Find specific challenge by category + slug
 * - Generate Angular 19 base template
 * - Create challenge-specific component files
 * - Return complete virtual file system
 */
@Injectable({
  providedIn: 'root'
})
export class ChallengeLoaderService {
  private http = inject(HttpClient);
  private challengesCache: any = null;
  private rootPackageCache: any = null;

  /**
   * Loads challenge configuration and generates complete file system.
   *
   * @param categoryId - Challenge category (e.g., 'rxjs-api')
   * @param slug - Challenge slug (e.g., 'fetch-products')
   * @returns Observable with challenge metadata and files
   */
  loadChallengeWithFiles(
    categoryId: string,
    slug: string
  ): Observable<{ challenge: Challenge; files: Record<string, string> }> {
    // Fetch both challenges config and root package.json
    return this.getRootPackageJson().pipe(
      switchMap(rootPkg => {
        return this.getChallengesConfig().pipe(
          map(config => {
            const challenge = config.challenges[categoryId]?.[slug];

            if (!challenge) {
              throw new Error(`Challenge not found: ${categoryId}/${slug}`);
            }

            // Generate complete file system with root package versions
            const files = this.generateFileSystem(challenge, rootPkg);

            return { challenge, files };
          })
        );
      }),
      catchError(error => {
        console.error('[ChallengeLoader] Failed to load challenge:', error);
        throw error;
      })
    );
  }

  /**
   * Generates complete Angular 19 file system for challenge.
   */
  private generateFileSystem(challenge: Challenge, rootPkg?: any): Record<string, string> {
    const files: Record<string, string> = {};

    // Core files
    files['src/main.ts'] = this.getMainTs();
    files['src/index.html'] = this.getIndexHtml(challenge.title);
    files['src/styles.scss'] = this.getGlobalStyles();

    // App files
    files['src/app/app.component.ts'] = this.getAppComponentTs(challenge);
    files['src/app/app.component.html'] = this.getAppComponentHtml(challenge);
    files['src/app/app.component.scss'] = this.getAppComponentScss();
    files['src/app/app.config.ts'] = this.getAppConfig(challenge);

    // Challenge component
    const componentPath = challenge.workspace.componentPath.replace('./', 'src/app/');
    files[`${componentPath}.ts`] = this.getChallengeComponentTs(challenge);
    files[`${componentPath}.html`] = this.getChallengeComponentHtml(challenge);
    files[`${componentPath}.scss`] = this.getChallengeComponentScss();

    // Config files - pass root package for version extraction
    files['package.json'] = this.getPackageJson(rootPkg);
    files['tsconfig.json'] = this.getTsConfig();
    files['angular.json'] = this.getAngularJson();

    // Category-specific scaffolding
    switch (challenge.categoryId) {
      case 'angular-forms':
        files['src/app/models/form-data.model.ts'] = '// Add your form data models here\nexport interface FormData {\n  // Define your form structure\n}\n';
        files['src/app/validators/custom.validators.ts'] = '// Add your custom validators here\nimport { AbstractControl, ValidationErrors, ValidatorFn } from \'@angular/forms\';\n\nexport class CustomValidators {\n  // Example: static customValidator(): ValidatorFn { ... }\n}\n';
        break;

      case 'rxjs-api':
        files['src/app/services/data.service.ts'] = '// Add your HTTP services here\nimport { Injectable } from \'@angular/core\';\nimport { HttpClient } from \'@angular/common/http\';\n\n@Injectable({ providedIn: \'root\' })\nexport class DataService {\n  constructor(private http: HttpClient) {}\n}\n';
        files['src/app/models/data.model.ts'] = '// Add your data models here\nexport interface DataModel {\n  // Define your data structure\n}\n';
        break;

      case 'angular-core':
        files['src/app/services/app.service.ts'] = '// Add your services here\nimport { Injectable } from \'@angular/core\';\n\n@Injectable({ providedIn: \'root\' })\nexport class AppService {\n  // Service logic here\n}\n';
        files['src/app/components/shared.component.ts'] = '// Add reusable components here\nimport { Component } from \'@angular/core\';\n\n@Component({\n  selector: \'app-shared\',\n  standalone: true,\n  template: `<!-- Component template -->`\n})\nexport class SharedComponent {}\n';
        files['src/app/directives/custom.directive.ts'] = '// Add custom directives here\nimport { Directive } from \'@angular/core\';\n\n@Directive({\n  selector: \'[appCustom]\',\n  standalone: true\n})\nexport class CustomDirective {}\n';
        files['src/app/pipes/custom.pipe.ts'] = '// Add custom pipes here\nimport { Pipe, PipeTransform } from \'@angular/core\';\n\n@Pipe({\n  name: \'custom\',\n  standalone: true\n})\nexport class CustomPipe implements PipeTransform {\n  transform(value: unknown, ...args: unknown[]): unknown {\n    return value;\n  }\n}\n';
        break;

      case 'angular-routing':
        files['src/app/pages/home.page.ts'] = '// Add page components here\nimport { Component } from \'@angular/core\';\n\n@Component({\n  selector: \'app-home\',\n  standalone: true,\n  template: `<h1>Home Page</h1>`\n})\nexport class HomePage {}\n';
        files['src/app/guards/auth.guard.ts'] = '// Add route guards here\nimport { CanActivateFn } from \'@angular/router\';\n\nexport const authGuard: CanActivateFn = (route, state) => {\n  return true;\n};\n';
        files['src/app/resolvers/data.resolver.ts'] = '// Add route resolvers here\nimport { ResolveFn } from \'@angular/router\';\n\nexport const dataResolver: ResolveFn<any> = (route, state) => {\n  return null;\n};\n';
        break;

      case 'angular-signals':
        files['src/app/services/signal.service.ts'] = '// Add signal-based services here\nimport { Injectable, signal } from \'@angular/core\';\n\n@Injectable({ providedIn: \'root\' })\nexport class SignalService {\n  data = signal<any>(null);\n}\n';
        files['src/app/models/data.model.ts'] = '// Add your data models here\nexport interface DataModel {\n  // Define your data structure\n}\n';
        break;

      case 'community':
        files['src/app/services/app.service.ts'] = '// Add your services here\nimport { Injectable } from \'@angular/core\';\n\n@Injectable({ providedIn: \'root\' })\nexport class AppService {\n  // Service logic here\n}\n';
        files['src/app/models/data.model.ts'] = '// Add your data models here\nexport interface DataModel {\n  // Define your data structure\n}\n';
        files['src/app/components/shared.component.ts'] = '// Add reusable components here\nimport { Component } from \'@angular/core\';\n\n@Component({\n  selector: \'app-shared\',\n  standalone: true,\n  template: `<!-- Component template -->`\n})\nexport class SharedComponent {}\n';
        break;

      default:
        // Default scaffolding for unknown categories
        files['src/app/services/app.service.ts'] = '// Add your services here\nimport { Injectable } from \'@angular/core\';\n\n@Injectable({ providedIn: \'root\' })\nexport class AppService {\n  // Service logic here\n}\n';
        files['src/app/models/data.model.ts'] = '// Add your data models here\nexport interface DataModel {\n  // Define your data structure\n}\n';
        break;
    }

    return files;
  }

  /**
   * Fetches challenges.json with caching.
   */
  private getChallengesConfig(): Observable<any> {
    if (this.challengesCache) {
      return of(this.challengesCache);
    }

    return this.http.get<any>('/config/challenges.json').pipe(
      map(config => {
        this.challengesCache = config;
        return config;
      })
    );
  }

  /**
   * Fetches root package.json with caching to get current dependency versions.
   */
  private getRootPackageJson(): Observable<any> {
    if (this.rootPackageCache) {
      return of(this.rootPackageCache);
    }

    return this.http.get<any>('/package.json').pipe(
      map(pkg => {
        this.rootPackageCache = pkg;
        return pkg;
      }),
      catchError(error => {
        console.error('[ChallengeLoader] Failed to load package.json, using fallback versions:', error);
        // Fallback to default versions if package.json not accessible
        const fallback = {
          dependencies: {
            '@angular/animations': '^19.0.0',
            '@angular/common': '^19.0.0',
            '@angular/compiler': '^19.0.0',
            '@angular/core': '^19.0.0',
            '@angular/forms': '^19.0.0',
            '@angular/platform-browser': '^19.0.0',
            '@angular/platform-browser-dynamic': '^19.0.0',
            '@angular/router': '^19.0.0',
            'rxjs': '~7.8.0',
            'tslib': '^2.3.0',
            'zone.js': '~0.15.0'
          },
          devDependencies: {
            '@angular-devkit/build-angular': '^19.0.0',
            '@angular/cli': '^19.0.0',
            '@angular/compiler-cli': '^19.0.0',
            'typescript': '~5.6.0'
          }
        };
        this.rootPackageCache = fallback;
        return of(fallback);
      })
    );
  }

  // ============================================================================
  // TEMPLATE GENERATORS
  // ============================================================================

  private getMainTs(): string {
    return `import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));`;
  }

  private getIndexHtml(title: string): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${title}</title>
  <base href="/" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body>
  <app-root></app-root>
</body>
</html>`;
  }

  private getGlobalStyles(): string {
    return `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, sans-serif;
  line-height: 1.6;
  color: #333;
  background: #f5f5f5;
}`;
  }

  private getAppComponentTs(challenge: Challenge): string {
    const componentName = challenge.workspace.componentName;
    const selector = this.toKebabCase(componentName);

    return `import { Component } from '@angular/core';
import { ${componentName} } from '${challenge.workspace.componentPath}';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [${componentName}],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = '${challenge.title}';
}`;
  }

  private getAppComponentHtml(challenge: Challenge): string {
    const selector = this.toKebabCase(challenge.workspace.componentName);
    return `<div class="app-container">
  <header class="app-header">
    <h1>{{ title }}</h1>
    <span class="difficulty-badge ${challenge.difficulty.toLowerCase()}">${challenge.difficulty}</span>
  </header>

  <main class="app-main">
    <${selector}></${selector}>
  </main>
</div>`;
  }

  private getAppComponentScss(): string {
    return `.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  h1 {
    font-size: 1.75rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .difficulty-badge {
    display: inline-block;
    padding: 0.25rem 1rem;
    border-radius: 20px;
    font-size: 0.875rem;
    font-weight: 500;
    background: rgba(255, 255, 255, 0.2);

    &.beginner { background: rgba(76, 175, 80, 0.3); }
    &.intermediate { background: rgba(255, 152, 0, 0.3); }
    &.advanced { background: rgba(244, 67, 54, 0.3); }
  }
}

.app-main {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}`;
  }

  private getAppConfig(challenge: Challenge): string {
    const needsHttp = challenge.categoryId === 'rxjs-api' ||
                      challenge.tags?.includes('HttpClient') ||
                      challenge.tags?.includes('API');

    const httpImport = needsHttp
      ? "\nimport { provideHttpClient, withFetch } from '@angular/common/http';"
      : '';

    const httpProvider = needsHttp
      ? ',\n    provideHttpClient(withFetch())'
      : '';

    return `import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';${httpImport}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true })${httpProvider}
  ]
};`;
  }

  private getChallengeComponentTs(challenge: Challenge): string {
    const componentName = challenge.workspace.componentName;
    const selector = this.toKebabCase(componentName);

    // Determine required imports based on category and tags
    const imports: string[] = ['CommonModule'];
    let additionalImports = '';

    if (challenge.categoryId === 'angular-forms' || challenge.tags?.includes('Reactive Forms')) {
      imports.push('ReactiveFormsModule');
      additionalImports += "import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';\n";
    }

    if (challenge.tags?.includes('HttpClient') || challenge.tags?.includes('API')) {
      additionalImports += "import { HttpClient } from '@angular/common/http';\n";
    }

    return `import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
${additionalImports}
@Component({
  selector: 'app-${selector}',
  standalone: true,
  imports: [${imports.join(', ')}],
  templateUrl: './${selector}.component.html',
  styleUrls: ['./${selector}.component.scss']
})
export class ${componentName} {
  // TODO: Implement ${challenge.title}
  //
  // Requirements:
  ${challenge.requirementList?.map((req: string) => `// - ${req}`).join('\n  ') || '// Check challenge requirements'}

  constructor() {
    // Initialize your component here
  }
}`;
  }

  private getChallengeComponentHtml(challenge: Challenge): string {
    return `<div class="challenge-workspace">
  <div class="challenge-header">
    <h2>${challenge.title}</h2>
    <p class="description">${challenge.description}</p>
  </div>

  <div class="challenge-content">
    <!--
      TODO: Implement your solution here

      Requirements:
      ${challenge.requirementList?.map((req: string) => `- ${req}`).join('\n      ') || 'Check the challenge description'}
    -->

    <div class="placeholder">
      <p>Start implementing your solution here...</p>
      <p class="hint">💡 Check the TypeScript file for more details</p>
    </div>
  </div>
</div>`;
  }

  private getChallengeComponentScss(): string {
    return `.challenge-workspace {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.challenge-header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;

  h2 {
    color: #333;
    font-size: 1.5rem;
    margin-bottom: 0.75rem;
  }

  .description {
    color: #666;
    line-height: 1.6;
  }
}

.challenge-content {
  min-height: 400px;

  .placeholder {
    text-align: center;
    padding: 3rem;
    background: #f9f9f9;
    border-radius: 4px;
    border: 2px dashed #ddd;

    p {
      color: #999;
      margin-bottom: 0.5rem;

      &.hint {
        font-style: italic;
        font-size: 0.9rem;
      }
    }
  }
}`;
  }

  private getPackageJson(rootPkg?: any): string {
    // Extract versions from root package.json or use cached values
    const deps = rootPkg?.dependencies || {};
    const devDeps = rootPkg?.devDependencies || {};

    return JSON.stringify({
      name: 'angular-challenge',
      version: '19.0.0',
      scripts: {
        ng: 'ng',
        start: 'ng serve',
        build: 'ng build'
      },
      dependencies: {
        '@angular/animations': deps['@angular/animations'] || '^19.0.0',
        '@angular/common': deps['@angular/common'] || '^19.0.0',
        '@angular/compiler': deps['@angular/compiler'] || '^19.0.0',
        '@angular/core': deps['@angular/core'] || '^19.0.0',
        '@angular/forms': deps['@angular/forms'] || '^19.0.0',
        '@angular/platform-browser': deps['@angular/platform-browser'] || '^19.0.0',
        '@angular/platform-browser-dynamic': deps['@angular/platform-browser-dynamic'] || '^19.0.0',
        '@angular/router': deps['@angular/router'] || '^19.0.0',
        'rxjs': deps['rxjs'] || '~7.8.0',
        'tslib': deps['tslib'] || '^2.3.0',
        'zone.js': deps['zone.js'] || '~0.15.0'
      },
      devDependencies: {
        '@angular-devkit/build-angular': devDeps['@angular-devkit/build-angular'] || '^19.0.0',
        '@angular/cli': devDeps['@angular/cli'] || '^19.0.0',
        '@angular/compiler-cli': devDeps['@angular/compiler-cli'] || '^19.0.0',
        'typescript': devDeps['typescript'] || '~5.6.0'
      }
    }, null, 2);
  }

  private getTsConfig(): string {
    return JSON.stringify({
      compileOnSave: false,
      compilerOptions: {
        outDir: './dist/out-tsc',
        strict: true,
        skipLibCheck: true,
        esModuleInterop: true,
        sourceMap: true,
        declaration: false,
        moduleResolution: 'bundler',
        target: 'ES2022',
        module: 'ES2022',
        lib: ['ES2022', 'dom']
      }
    }, null, 2);
  }

  private getAngularJson(): string {
    return JSON.stringify({
      $schema: './node_modules/@angular/cli/lib/config/schema.json',
      version: 1,
      newProjectRoot: 'projects',
      projects: {
        challenge: {
          projectType: 'application',
          root: '',
          sourceRoot: 'src',
          architect: {
            build: {
              builder: '@angular-devkit/build-angular:browser',
              options: {
                outputPath: 'dist/challenge',
                index: 'src/index.html',
                browser: 'src/main.ts',
                polyfills: ['zone.js'],
                tsConfig: 'tsconfig.json',
                assets: [],
                styles: ['src/styles.scss'],
                scripts: []
              }
            }
          }
        }
      }
    }, null, 2);
  }

  private toKebabCase(str: string): string {
    return str
      .replace(/Component$/, '')
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .toLowerCase();
  }
}
