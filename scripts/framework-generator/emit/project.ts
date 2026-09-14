// Renders the project scaffolding: package.json, tsconfig, playwright.config, constants,
// env/gitignore, and the auth setup spec when the app logs in through the UI.
import { q, header } from './naming.ts';
import type { AppModel } from '../../model-compiler/model-types.ts';

export function staticProject(model: AppModel): { path: string; contents: string }[] {
  const auth: any = model.api.auth ?? {};
  const ui = auth.uiLogin;
  return [
    {
      path: 'package.json',
      contents: JSON.stringify({
        name: `${model.app.name}-tests`, private: true, type: 'module',
        scripts: {
          test: 'playwright test', 'test:headed': 'playwright test --headed',
          'test:ui': 'playwright test --ui', report: 'playwright show-report',
          typecheck: 'tsc --noEmit',
        },
        devDependencies: { '@playwright/test': '^1.56.0', '@types/node': '^22.20.1', typescript: '^5.9.2' },
      }, null, 2) + '\n',
    },
    {
      path: 'tsconfig.json',
      contents: JSON.stringify({
        compilerOptions: {
          target: 'ES2022', module: 'ESNext', moduleResolution: 'bundler',
          allowImportingTsExtensions: true, strict: true, noEmit: true,
          skipLibCheck: true, types: ['node'],
        },
        include: ['src', 'tests', 'playwright.config.ts'],
      }, null, 2) + '\n',
    },
    {
      path: 'playwright.config.ts',
      contents: [
        header(model),
        `import { defineConfig, devices } from '@playwright/test';`,
        '',
        `export default defineConfig({`,
        `  testDir: './tests',`,
        `  fullyParallel: true,`,
        `  retries: process.env.CI ? 1 : 0,`,
        `  reporter: [['list'], ['html', { open: 'never' }]],`,
        `  use: {`,
        `    baseURL: process.env.BASE_URL ?? ${q(model.app.baseUrl)},`,
        `    trace: 'retain-on-failure',`,
        `    screenshot: 'only-on-failure',`,
        `    // Shorter than the test timeout on purpose: a component must fail while there`,
        `    // is still budget left to diagnose why, or every failure reads as TIMED_OUT.`,
        `    actionTimeout: 15_000,`,
        `    navigationTimeout: 30_000,`,
        `  },`,
        // The session belongs to the chromium project, not to `use`: a setting there
        // would apply to the setup project too, which runs before the file exists.
        ui ? `  projects: [\n    { name: 'setup', testMatch: /auth\\.setup\\.ts/ },\n    { name: 'chromium', use: { ...devices['Desktop Chrome'], storageState: '.auth/user.json' }, dependencies: ['setup'] },\n  ],`
           : `  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],`,
        `});`,
        '',
      ].filter(Boolean).join('\n'),
    },
    {
      path: 'src/config/constants.ts',
      contents: [
        header(model),
        `export const APP_NAME = ${q(model.app.name)};`,
        `export const BASE_URL = ${q(model.app.baseUrl)};`,
        `/** Every diagnostic names this file, so a failure can be traced to its analysis. */`,
        `export const MODEL_PATH = ${q('analysis.json')};`,
        `export const ANALYSED_COMMIT = ${q(model.app.repoCommit)};`,
        '',
      ].join('\n'),
    },
    {
      path: '.env.example',
      contents: `APP_USERNAME=\nAPP_PASSWORD=\nBASE_URL=${model.app.baseUrl}\n`,
    },
    {
      path: '.gitignore',
      contents: `node_modules/\ntest-results/\nplaywright-report/\n.auth/\n.env\n`,
    },
    ...(ui ? [{
      path: 'tests/auth.setup.ts',
      contents: [
        header(model),
        `// Logs in once per run and saves the session, so no spec pays for a login.`,
        `// The steps come from the root .env; credentials never do.`,
        `import { test as setup, expect } from '@playwright/test';`,
        '',
        `setup('authenticate', async ({ page }) => {`,
        `  await page.goto(${q(ui.loginUrl ?? model.app.baseUrl)});`,
        ...(ui.steps ?? []).map((s: any) => {
          const value = typeof s.value === 'string' && s.value.startsWith('env:')
            ? `process.env.${s.value.slice(4)} ?? ''` : q(s.value ?? '');
          if (s.action === 'fill') return `  await page.locator(${q(s.selector)}).fill(${value});`;
          if (s.action === 'select') return `  await page.locator(${q(s.selector)}).selectOption(${value});`;
          return `  await page.locator(${q(s.selector)}).click();`;
        }),
        ui.readyWhen ? `  await expect(page.locator(${q(ui.readyWhen)}).first()).toBeVisible({ timeout: 30_000 });` : '',
        `  await page.context().storageState({ path: '.auth/user.json' });`,
        `});`,
        '',
      ].filter(Boolean).join('\n'),
    }] : []),
  ];
}
