import { Injectable, VERSION } from '@angular/core';
import { Challenge, ChallengeDetails } from '@ng-coding-challenges/shared/models';
import {
  LiveEditorFiles,
  LiveEditorProject,
  LiveEditorTemplate
} from './live-editor.types';

/**
 * The generated project tracks the platform's own Angular major version, so
 * upgrading this workspace (e.g. to Angular 20) automatically upgrades what the
 * live editor emits — no hardcoded drift.
 */
const NG_MAJOR = VERSION.major; // e.g. "19", "20"
const NG_VERSION = `^${NG_MAJOR}.0.0`;

/**
 * TypeScript must match the Angular major (Angular 20 requires TS >= 5.8, etc.).
 * Extend this map when adopting a new major; the fallback keeps installs working.
 */
const TYPESCRIPT_BY_MAJOR: Record<string, string> = {
  '19': '~5.7.2',
  '20': '~5.8.2',
  '21': '~5.9.2'
};
const TYPESCRIPT_VERSION = TYPESCRIPT_BY_MAJOR[NG_MAJOR] ?? '>=5.7.0';

/**
 * Repo root used to build "view on GitHub" links for the full requirement /
 * solution documents. Matches the base used by the challenge details page.
 */
const BASE_REPOSITORY =
  'https://github.com/Manishh09/ng-coding-challenges/blob/develop';

/**
 * Raw content root for the same repo/branch. Used to fetch the verbatim
 * requirement markdown so it can be embedded directly in the project.
 * `raw.githubusercontent.com` serves permissive CORS headers, so browser
 * `fetch` works from any origin.
 */
const RAW_REPOSITORY =
  'https://raw.githubusercontent.com/Manishh09/ng-coding-challenges/develop';

/**
 * Runtime dependencies for the generated Angular project.
 * For WebContainers (`template: 'node'`) these live in `package.json`.
 * Challenges can add to / override these via `challenge.starter.dependencies`.
 */
const BASE_DEPENDENCIES: Record<string, string> = {
  '@angular/animations': NG_VERSION,
  '@angular/common': NG_VERSION,
  '@angular/compiler': NG_VERSION,
  '@angular/core': NG_VERSION,
  '@angular/forms': NG_VERSION,
  '@angular/platform-browser': NG_VERSION,
  '@angular/platform-browser-dynamic': NG_VERSION,
  '@angular/router': NG_VERSION,
  rxjs: '~7.8.0',
  tslib: '^2.3.0',
  'zone.js': '~0.15.0'
};

/** Dev dependencies needed to run the real Angular CLI in WebContainers. */
const BASE_DEV_DEPENDENCIES: Record<string, string> = {
  '@angular-devkit/build-angular': NG_VERSION,
  '@angular/cli': NG_VERSION,
  '@angular/compiler-cli': NG_VERSION,
  typescript: TYPESCRIPT_VERSION
};

/**
 * Resolves a runnable {@link LiveEditorProject} for a challenge.
 *
 * The live editor is fully self-contained — it never clones a Git repo. This
 * service generates a complete, real Angular CLI project (the full folder
 * structure: `angular.json`, `tsconfig*`, `src/app/…`) that runs on StackBlitz
 * **WebContainers** (`template: 'node'`), then layers each challenge's own
 * starter files on top (see {@link Challenge.starter}), so a challenge only needs
 * to declare the files that make it unique.
 */
@Injectable({ providedIn: 'root' })
export class ChallengeStarterService {
  /** Cache of fetched doc content, keyed by repo-relative path. */
  private readonly docCache = new Map<string, string>();
  /** In-flight fetches, keyed by path, to de-duplicate concurrent loads. */
  private readonly inflight = new Map<string, Promise<void>>();

  /**
   * Warm the cache for a challenge so its verbatim requirement can be embedded
   * at launch without an async gap (which would risk popup blocking).
   * Safe to call repeatedly — fetches are cached and de-duplicated.
   * Call this when the challenge page loads.
   */
  prefetch(challenge: Challenge): void {
    const path = this.requirementPath(challenge);
    if (path) {
      void this.loadDoc(path);
    }
  }

  /**
   * Build the editor project for a challenge: a full Angular scaffold merged
   * with the challenge's starter files (which take precedence).
   */
  getProject(challenge: Challenge): LiveEditorProject {
    // Ensure the verbatim doc is fetched for next time, even on a cache miss.
    this.prefetch(challenge);

    const starter = challenge.starter ?? {};
    const template: LiveEditorTemplate =
      (starter.template as LiveEditorTemplate) ?? 'node';

    const dependencies: Record<string, string> = {
      ...BASE_DEPENDENCIES,
      ...(starter.dependencies ?? {})
    };

    const files: LiveEditorFiles = {
      ...this.baseProjectFiles(challenge, dependencies),
      ...this.docFiles(challenge),
      // Challenge-specific files override the base scaffold.
      ...(starter.files ?? {})
    };

    return {
      title: challenge.title,
      description: challenge.description,
      template,
      files,
      // WebContainers reads deps from package.json and ignores this field;
      // only EngineBlock templates need it.
      dependencies: template === 'node' ? undefined : dependencies,
      // Land on the brief and the entry component, side by side.
      openFile: starter.openFile ?? ['REQUIREMENT.md', 'src/app/app.component.ts']
    };
  }

  /**
   * A complete, real Angular CLI project (WebContainers-ready).
   * Every config and source file a developer expects is present.
   */
  private baseProjectFiles(
    challenge: Challenge,
    dependencies: Record<string, string>
  ): LiveEditorFiles {
    const title = JSON.stringify(challenge.title ?? 'Angular Challenge');
    const description = JSON.stringify(challenge.description ?? '');

    const packageJson = {
      name: 'angular-challenge',
      version: '0.0.0',
      private: true,
      scripts: {
        ng: 'ng',
        start: 'ng serve',
        build: 'ng build',
        watch: 'ng build --watch --configuration development'
      },
      dependencies,
      devDependencies: BASE_DEV_DEPENDENCIES
    };

    const angularJson = {
      $schema: './node_modules/@angular/cli/lib/config/schema.json',
      version: 1,
      newProjectRoot: 'projects',
      projects: {
        app: {
          projectType: 'application',
          root: '',
          sourceRoot: 'src',
          prefix: 'app',
          architect: {
            build: {
              builder: '@angular-devkit/build-angular:application',
              options: {
                outputPath: 'dist/app',
                index: 'src/index.html',
                browser: 'src/main.ts',
                polyfills: ['zone.js'],
                tsConfig: 'tsconfig.app.json',
                assets: [],
                styles: ['src/styles.css'],
                scripts: []
              },
              configurations: {
                production: { outputHashing: 'all' },
                development: {
                  optimization: false,
                  extractLicenses: false,
                  sourceMap: true
                }
              },
              defaultConfiguration: 'development'
            },
            serve: {
              builder: '@angular-devkit/build-angular:dev-server',
              configurations: {
                production: { buildTarget: 'app:build:production' },
                development: { buildTarget: 'app:build:development' }
              },
              defaultConfiguration: 'development'
            }
          }
        }
      }
    };

    const tsConfig = {
      compileOnSave: false,
      compilerOptions: {
        outDir: './dist/out-tsc',
        strict: true,
        noImplicitOverride: true,
        noPropertyAccessFromIndexSignature: true,
        noImplicitReturns: true,
        noFallthroughCasesInSwitch: true,
        skipLibCheck: true,
        esModuleInterop: true,
        sourceMap: true,
        declaration: false,
        experimentalDecorators: true,
        moduleResolution: 'bundler',
        importHelpers: true,
        target: 'ES2022',
        module: 'ES2022',
        lib: ['ES2022', 'dom']
      },
      angularCompilerOptions: {
        enableI18nLegacyMessageIdFormat: false,
        strictInjectionParameters: true,
        strictInputAccessModifiers: true,
        strictTemplates: true
      }
    };

    const tsConfigApp = {
      extends: './tsconfig.json',
      compilerOptions: { outDir: './out-tsc/app', types: [] },
      files: ['src/main.ts'],
      include: ['src/**/*.d.ts']
    };

    const mainTs =
      `import { bootstrapApplication } from '@angular/platform-browser';\n` +
      `import { appConfig } from './app/app.config';\n` +
      `import { AppComponent } from './app/app.component';\n` +
      `\n` +
      `bootstrapApplication(AppComponent, appConfig).catch((err) =>\n` +
      `  console.error(err)\n` +
      `);\n`;

    const appConfigTs =
      `import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';\n` +
      `import { provideRouter } from '@angular/router';\n` +
      `import { provideHttpClient } from '@angular/common/http';\n` +
      `import { routes } from './app.routes';\n` +
      `\n` +
      `export const appConfig: ApplicationConfig = {\n` +
      `  providers: [\n` +
      `    provideZoneChangeDetection({ eventCoalescing: true }),\n` +
      `    provideRouter(routes),\n` +
      `    provideHttpClient()\n` +
      `  ]\n` +
      `};\n`;

    const appRoutesTs =
      `import { Routes } from '@angular/router';\n` +
      `\n` +
      `export const routes: Routes = [];\n`;

    const appComponentTs =
      `import { Component } from '@angular/core';\n` +
      `import { RouterOutlet } from '@angular/router';\n` +
      `\n` +
      `@Component({\n` +
      `  selector: 'app-root',\n` +
      `  standalone: true,\n` +
      `  imports: [RouterOutlet],\n` +
      `  templateUrl: './app.component.html',\n` +
      `  styleUrl: './app.component.css'\n` +
      `})\n` +
      `export class AppComponent {\n` +
      `  title = ${title};\n` +
      `  description = ${description};\n` +
      `}\n`;

    const appComponentHtml =
      `<main class="ng-quest">\n` +
      `  <h1>{{ title }}</h1>\n` +
      `  <p class="desc">{{ description }}</p>\n` +
      `  <p class="hint">\n` +
      `    Read <strong>REQUIREMENT.md</strong> for the full brief, then build your\n` +
      `    solution here in <code>src/app/</code>.\n` +
      `  </p>\n` +
      `\n` +
      `  <router-outlet />\n` +
      `</main>\n`;

    const appComponentCss =
      `.ng-quest {\n` +
      `  font-family: system-ui, sans-serif;\n` +
      `  max-width: 720px;\n` +
      `  margin: 3rem auto;\n` +
      `  padding: 0 1rem;\n` +
      `  line-height: 1.6;\n` +
      `}\n` +
      `h1 { color: #8b5cf6; margin-bottom: 0.5rem; }\n` +
      `.desc { color: #444; }\n` +
      `.hint {\n` +
      `  margin-top: 2rem;\n` +
      `  padding: 1rem 1.25rem;\n` +
      `  background: #f5f3ff;\n` +
      `  border-radius: 8px;\n` +
      `  color: #5b21b6;\n` +
      `}\n` +
      `code { background: #ede9fe; padding: 0.1rem 0.35rem; border-radius: 4px; }\n`;

    const indexHtml =
      `<!doctype html>\n` +
      `<html lang="en">\n` +
      `<head>\n` +
      `  <meta charset="utf-8" />\n` +
      `  <title>Angular Challenge</title>\n` +
      `  <base href="/" />\n` +
      `  <meta name="viewport" content="width=device-width, initial-scale=1" />\n` +
      `</head>\n` +
      `<body>\n` +
      `  <app-root></app-root>\n` +
      `</body>\n` +
      `</html>\n`;

    const stylesCss =
      `:root { color-scheme: light dark; }\n` +
      `* { box-sizing: border-box; }\n` +
      `body { margin: 0; }\n`;

    return {
      'package.json': this.toJson(packageJson),
      'angular.json': this.toJson(angularJson),
      'tsconfig.json': this.toJson(tsConfig),
      'tsconfig.app.json': this.toJson(tsConfigApp),
      'src/main.ts': mainTs,
      'src/index.html': indexHtml,
      'src/styles.css': stylesCss,
      'src/app/app.component.ts': appComponentTs,
      'src/app/app.component.html': appComponentHtml,
      'src/app/app.component.css': appComponentCss,
      'src/app/app.config.ts': appConfigTs,
      'src/app/app.routes.ts': appRoutesTs
    };
  }

  /**
   * The documentation files bundled into the project: a complete REQUIREMENT.md
   * and — when a solution path is available — a SOLUTION_GUIDE.md that links to
   * the full walkthrough.
   */
  private docFiles(challenge: Challenge): LiveEditorFiles {
    const files: LiveEditorFiles = {
      'REQUIREMENT.md': this.requirementDoc(challenge)
    };

    const solution = this.solutionGuideDoc(challenge);
    if (solution) {
      files['SOLUTION_GUIDE.md'] = solution;
    }

    return files;
  }

  /**
   * The requirement document to bundle.
   *
   * Prefers the **verbatim** authored markdown (fetched from the repo and cached
   * via {@link prefetch}); falls back to a complete reconstruction from the
   * challenge's structured fields when the verbatim doc isn't cached yet.
   */
  private requirementDoc(challenge: Challenge): string {
    const path = this.requirementPath(challenge);
    const verbatim = path ? this.docCache.get(path) : undefined;
    if (verbatim) {
      return this.decorateVerbatim(verbatim, challenge);
    }
    return this.reconstructedRequirementDoc(challenge);
  }

  /**
   * Wrap the authored requirement markdown with a short, self-contained footer
   * (how to run, where the solution lives) without altering the original text.
   */
  private decorateVerbatim(markdown: string, challenge: Challenge): string {
    const footer: string[] = ['', '---', ''];
    if (challenge.solutionGuide) {
      footer.push('💡 Solution walkthrough: see `SOLUTION_GUIDE.md`.', '');
    }
    footer.push(
      'Build your solution in `src/app/`, then run `npm start`. This project runs',
      'entirely in your browser — nothing here is connected to an external',
      'repository.'
    );
    return markdown.replace(/\s+$/, '') + '\n' + footer.join('\n') + '\n';
  }

  /**
   * Compose a complete requirement document from the challenge's structured
   * fields (the same content shown on the details page), plus a link to the
   * verbatim requirement doc on GitHub. Used as a fallback when the authored
   * markdown hasn't been fetched.
   */
  private reconstructedRequirementDoc(challenge: Challenge): string {
    // Extended fields live on ChallengeDetails; read them defensively so the
    // base Challenge shape (used in fallbacks) still produces a valid doc.
    const d = challenge as Partial<ChallengeDetails> & Challenge;

    const lines: string[] = [`# ${d.title ?? 'Angular Challenge'}`, ''];

    const intro = d.longDescription || d.description;
    if (intro) {
      lines.push(intro, '');
    }

    this.pushList(lines, '## 📋 Requirements', d.requirementList, true);
    this.pushList(lines, '## 🎯 Learning Outcomes', d.learningOutcomes);
    this.pushList(lines, '## 🧩 Prerequisites', d.prerequisites);
    this.pushList(lines, '## 🛠️ Tech Stack', d.techStack ?? d.tags);

    // Meta block
    const meta: string[] = [];
    if (d.difficulty) meta.push(`- **Difficulty:** ${d.difficulty}`);
    if (d.estimatedTime) meta.push(`- **Estimated time:** ${d.estimatedTime}`);
    if (meta.length) {
      lines.push('## ℹ️ Details', '', ...meta, '');
    }

    // Reference links
    const refs: string[] = [];
    const requirementPath = d.requirementDoc ?? d.requirement;
    if (requirementPath) {
      refs.push(`- 📄 [Full requirement doc](${this.repoUrl(requirementPath)})`);
    }
    if (d.solutionGuide) {
      refs.push('- 💡 Solution walkthrough: see `SOLUTION_GUIDE.md`');
    }
    if (refs.length) {
      lines.push('## 🔗 References', '', ...refs, '');
    }

    lines.push(
      '---',
      '',
      'Build your solution in `src/app/`, then run `npm start`. This project runs',
      'entirely in your browser — nothing here is connected to an external',
      'repository.'
    );

    return lines.join('\n') + '\n';
  }

  /**
   * Compose the solution guide doc: a link to the full walkthrough (by path),
   * with a nudge to attempt the challenge first. Returns `null` when the
   * challenge has no solution path.
   */
  private solutionGuideDoc(challenge: Challenge): string | null {
    const solutionPath = challenge.solutionGuide;
    if (!solutionPath) {
      return null;
    }

    return (
      [
        `# Solution Guide — ${challenge.title ?? 'Angular Challenge'}`,
        '',
        'Give the challenge an honest attempt first — the learning is in the',
        'struggle. When you are ready, the full step-by-step solution guide is',
        'here:',
        '',
        `👉 [Open the solution guide](${this.repoUrl(solutionPath)})`,
        '',
        'Back to the brief: see `REQUIREMENT.md`.'
      ].join('\n') + '\n'
    );
  }

  /**
   * Append a markdown section for a list of items, if the list is non-empty.
   * @param ordered - render as a numbered list instead of bullets
   */
  private pushList(
    lines: string[],
    heading: string,
    items: string[] | undefined,
    ordered = false
  ): void {
    if (!items?.length) {
      return;
    }
    lines.push(heading, '');
    items.forEach((item, index) => {
      lines.push(ordered ? `${index + 1}. ${item}` : `- ${item}`);
    });
    lines.push('');
  }

  /** Build a "view on GitHub" URL for a repo-relative doc path. */
  private repoUrl(path: string): string {
    return `${BASE_REPOSITORY}/${path}`;
  }

  /** Build a raw-content URL for a repo-relative doc path. */
  private rawUrl(path: string): string {
    return `${RAW_REPOSITORY}/${path}`;
  }

  /** The repo-relative path to the challenge's requirement doc, if any. */
  private requirementPath(challenge: Challenge): string | undefined {
    const d = challenge as Partial<ChallengeDetails> & Challenge;
    return d.requirementDoc ?? d.requirement;
  }

  /**
   * Fetch a doc's content into the cache. Failures are swallowed (the caller
   * falls back to reconstructed content), and concurrent loads are de-duplicated.
   */
  private loadDoc(path: string): Promise<void> {
    if (this.docCache.has(path)) {
      return Promise.resolve();
    }
    const existing = this.inflight.get(path);
    if (existing) {
      return existing;
    }

    const request = fetch(this.rawUrl(path))
      .then((res) =>
        res.ok ? res.text() : Promise.reject(new Error(`HTTP ${res.status}`))
      )
      .then((text) => {
        this.docCache.set(path, text);
      })
      .catch(() => {
        // Leave uncached; the reconstructed doc will be used instead.
      })
      .finally(() => {
        this.inflight.delete(path);
      });

    this.inflight.set(path, request);
    return request;
  }

  private toJson(value: unknown): string {
    return JSON.stringify(value, null, 2) + '\n';
  }
}
