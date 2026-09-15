// Renders the project scaffolding: package.json, tsconfig, playwright.config, constants,
// env/gitignore, and the auth setup spec when the app logs in through the UI.
import { q, header } from './naming.ts';
import { authFacts } from './auth.ts';
import type { AppModel } from '../../model-compiler/model-types.ts';

/**
 * The session, obtained once per run.
 *
 * Which shape this takes is decided by the strategy `verify-auth.ts` proved, never by
 * what the source suggested. The generator used to transcribe the UI steps
 * unconditionally — including for apps whose API login was proven and sitting unused
 * in the same analysis — and the resulting project could not authenticate an API call
 * at all.
 */
function renderAuthSetup(model: AppModel, ui: any): string {
  const facts = authFacts(model);
  // A cookie is the only credential a browser storage state can carry. A bearer token
  // is not, so for a header credential the UI login remains the honest browser path.
  const viaApi = facts !== null && facts.strategy !== 'browser' && facts.via === 'cookie';

  if (viaApi) {
    return [
      header(model),
      `// Logs in once per run through the API and saves the session, so no spec pays`,
      `// for a login. These are the steps verify-auth.ts proved against the running`,
      `// application, not a transcription of the login screen.`,
      `import { test as setup } from '@playwright/test';`,
      `import { authenticate } from '../src/support/authenticate.ts';`,
      `import { STORAGE_STATE } from '../src/config/constants.ts';`,
      '',
      `setup('authenticate', async ({ request }) => {`,
      `  await authenticate(request);`,
      `  await request.storageState({ path: STORAGE_STATE });`,
      `});`,
      '',
    ].join('\n');
  }

  // The UI path: either the browser rung won, or the credential is not a cookie.
  return [
    header(model),
    `// Logs in once per run through the application's own UI and saves the session.`,
    `// Credentials come from the root .env and are required, never defaulted — an`,
    `// empty username produces a login failure thirty seconds later that names nothing.`,
    `import { test as setup, expect } from '@playwright/test';`,
    `import { requiredEnv } from '../src/utils/env.ts';`,
    `import { STORAGE_STATE } from '../src/config/constants.ts';`,
    '',
    `setup('authenticate', async ({ page }) => {`,
    `  await page.goto(${q(ui.loginUrl ?? model.app.baseUrl)});`,
    ...(ui.steps ?? []).map((s: any) => {
      const value = typeof s.value === 'string' && s.value.startsWith('env:')
        ? `requiredEnv(${q(s.value.slice(4))})` : q(s.value ?? '');
      if (s.action === 'fill') return `  await page.locator(${q(s.selector)}).fill(${value});`;
      if (s.action === 'select') return `  await page.locator(${q(s.selector)}).selectOption(${value});`;
      return `  await page.locator(${q(s.selector)}).click();`;
    }),
    ui.readyWhen ? `  await expect(page.locator(${q(ui.readyWhen)}).first()).toBeVisible({ timeout: 30_000 });` : '',
    `  await page.context().storageState({ path: STORAGE_STATE });`,
    `});`,
    '',
  ].filter(Boolean).join('\n');
}

export function staticProject(model: AppModel): { path: string; contents: string }[] {
  const auth: any = model.api.auth ?? {};
  const ui = auth.uiLogin;
  const hasResources = Object.keys((model.api as any).resources ?? {}).length > 0;
  return [
    {
      path: 'package.json',
      contents: JSON.stringify({
        name: `${model.app.name}-tests`, private: true, type: 'module',
        scripts: {
          test: 'playwright test', 'test:headed': 'playwright test --headed',
          'test:ui': 'playwright test --ui', report: 'playwright show-report',
          typecheck: 'tsc --noEmit',
          ...(hasResources
            ? { 'gate:api': 'API_GATE=1 playwright test --project=api-gate' }
            : {}),
        },
        devDependencies: {
          '@playwright/test': '^1.56.0', '@types/node': '^22.20.1', typescript: '^5.9.2',
          pino: '^9.5.0', 'pino-pretty': '^13.0.0',
        },
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
        include: ['src', 'tests', 'gates', 'playwright.config.ts'],
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
        `  projects: [`,
        ...(ui ? [
          `    { name: 'setup', testMatch: /auth\\.setup\\.ts/ },`,
          `    {`,
          `      name: 'chromium',`,
          `      use: { ...devices['Desktop Chrome'], storageState: '.auth/user.json' },`,
          `      dependencies: ['setup'],`,
          `    },`,
        ] : [
          `    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },`,
        ]),
        ...(hasResources ? [
          `    // The API round-trip gate writes to the target application, so it is not`,
          `    // part of an ordinary run. \`npm run gate:api\` sets the flag that adds it.`,
          `    ...(process.env.API_GATE ? [{ name: 'api-gate', testDir: './gates' }] : []),`,
        ] : []),
        `  ],`,
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
        `/** Where the setup project saves the session every other project reuses. */`,
        `export const STORAGE_STATE = ${q('.auth/user.json')};`,
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
      contents: renderAuthSetup(model, ui),
    }] : []),
  ];
}
