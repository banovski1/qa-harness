// JavaScript scaffold: @playwright/test without TypeScript.

import { makeScaffold } from './scaffold.js';

export const javascript = makeScaffold({
  id: 'javascript',
  displayName: 'JavaScript',
  extension: '.js',
  emptyDirs: ['src/data/factories', 'src/data/testData', 'src/api/clients', 'tests/e2e'],
  layoutNotes: [
    '- `src/components/` — reusable component library',
    '- `src/pages/` — page objects, composed of components',
    '- `tests/e2e/` — specs',
  ].join('\n'),
  gettingStarted: 'npm install\nnpx playwright install chromium\nnpm test',
  files: (context) => [
    { path: 'package.json', contents: packageJson(context.config.projectName), kind: 'protected' },
    { path: 'jsconfig.json', contents: JSCONFIG, kind: 'protected' },
    { path: 'playwright.config.js', contents: playwrightConfig(context.config.baseUrl), kind: 'protected' },
    { path: 'src/components/base/BaseComponent.js', contents: BASE_COMPONENT, kind: 'generated' },
    { path: 'src/pages/base/BasePage.js', contents: BASE_PAGE, kind: 'generated' },
  ],
});

function packageJson(projectName: string): string {
  return `${JSON.stringify({
    name: projectName,
    version: '1.0.0',
    private: true,
    type: 'module',
    scripts: { test: 'playwright test', report: 'playwright show-report' },
    devDependencies: { '@playwright/test': '^1.49.0', dotenv: '^16.4.7' },
  }, null, 2)}\n`;
}

const JSCONFIG = `${JSON.stringify({
  compilerOptions: { checkJs: true, target: 'ES2022', module: 'ESNext', moduleResolution: 'bundler' },
  include: ['src/**/*.js', 'tests/**/*.js'],
}, null, 2)}\n`;

function playwrightConfig(baseUrl: string): string {
  return `import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: process.env.BASE_URL ?? '${baseUrl}',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
`;
}

const BASE_COMPONENT = `/**
 * Everything a UI component shares: a locator and a readable description.
 * A component never receives the Page, only its own Locator, so it can be
 * re-scoped inside another component without changing its code.
 */
export class BaseComponent {
  /**
   * @param {import('@playwright/test').Locator} locator
   * @param {string} description
   */
  constructor(locator, description) {
    this.locator = locator;
    this.description = description;
  }

  async waitForVisible(timeout) {
    await this.locator.waitFor({ state: 'visible', timeout });
  }

  async isVisible() {
    return this.locator.isVisible();
  }

  async isEnabled() {
    return this.locator.isEnabled();
  }

  async text() {
    return (await this.locator.innerText()).trim();
  }

  async scrollIntoView() {
    await this.locator.scrollIntoViewIfNeeded();
  }
}
`;

const BASE_PAGE = `/**
 * Common page-object behaviour: navigation and readiness. Element access belongs
 * in the subclass, so this stays small and stable.
 */
export class BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   * @param {string} path
   */
  constructor(page, path) {
    this.page = page;
    this.path = path;
  }

  async goto() {
    await this.page.goto(this.path);
    await this.waitUntilReady();
  }

  /**
   * 'load' rather than 'networkidle' on purpose: apps with polling or open
   * sockets never reach network idle and the wait would hang until timeout.
   */
  async waitUntilReady() {
    await this.page.waitForLoadState('load');
  }

  get url() {
    return this.page.url();
  }
}
`;
