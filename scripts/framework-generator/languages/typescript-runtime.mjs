// The static half of the TypeScript output: the component library, base page,
// fixtures and utilities. None of it depends on the application map — it is the
// same for every app, which is exactly why it lives here as plain source text
// rather than being assembled by an emitter.
//
// Design rules these files follow, so that generated page objects stay thin:
//   * BaseComponent owns everything every component shares (visibility, waiting,
//     scrolling) and nothing else.
//   * Each subclass adds only the verbs its role actually supports — a
//     TextComponent has no click(), an ImageComponent has no fill().
//   * A component never reaches for `page`; it only knows its own Locator. That
//     is what makes it composable inside another component's scope.

import { quote } from '../code-writer.mjs';

/** @returns {{path: string, contents: string, kind: 'generated'|'protected'}[]} */
export function runtimeFiles(context) {
  return [
    file('src/components/base/BaseComponent.ts', BASE_COMPONENT),
    file('src/components/ButtonComponent.ts', BUTTON),
    file('src/components/LinkComponent.ts', LINK),
    file('src/components/InputComponent.ts', INPUT),
    file('src/components/CheckboxComponent.ts', CHECKBOX),
    file('src/components/RadioComponent.ts', RADIO),
    file('src/components/DropdownComponent.ts', DROPDOWN),
    file('src/components/OptionComponent.ts', OPTION),
    file('src/components/TabComponent.ts', TAB),
    file('src/components/MenuItemComponent.ts', MENU_ITEM),
    file('src/components/TextComponent.ts', TEXT),
    file('src/components/ImageComponent.ts', IMAGE),
    file('src/components/tables/TableComponent.ts', TABLE),
    file('src/components/GenericComponent.ts', GENERIC),
    file('src/components/index.ts', COMPONENT_INDEX),
    file('src/pages/base/BasePage.ts', BASE_PAGE),
    file('src/utils/env.ts', ENV),
    file('src/utils/waitHelpers.ts', waitHelpers(context.config.waits.spinnerSelector)),
    file('src/utils/testData.ts', TEST_DATA),
    file('src/utils/network.ts', NETWORK),
    file('src/api/clients/ApiClient.ts', API_CLIENT),
    file('src/config/constants.ts', CONSTANTS),
  ];
}

function file(path, contents) {
  return { path, contents, kind: 'generated' };
}

// ---- components --------------------------------------------------------------

const BASE_COMPONENT = `import type { Locator } from '@playwright/test';

/**
 * Everything a UI component shares: a Playwright Locator and a human-readable
 * description used in error messages and traces.
 *
 * A component never receives the Page. It only knows its own Locator, so any
 * component can be re-scoped inside another one without changing its code.
 */
export abstract class BaseComponent {
  constructor(
    readonly locator: Locator,
    readonly description: string,
  ) {}

  /** Wait until the component is attached and visible. */
  async waitForVisible(timeout?: number): Promise<void> {
    await this.locator.waitFor({ state: 'visible', timeout });
  }

  async waitForHidden(timeout?: number): Promise<void> {
    await this.locator.waitFor({ state: 'hidden', timeout });
  }

  async isVisible(): Promise<boolean> {
    return this.locator.isVisible();
  }

  async isEnabled(): Promise<boolean> {
    return this.locator.isEnabled();
  }

  async count(): Promise<number> {
    return this.locator.count();
  }

  async scrollIntoView(): Promise<void> {
    await this.locator.scrollIntoViewIfNeeded();
  }

  /** Trimmed inner text, or an empty string when the element has none. */
  async text(): Promise<string> {
    return (await this.locator.innerText()).trim();
  }

  /** Re-scope this component to the nth match, for intentionally repeated widgets. */
  nth(index: number): this {
    const Ctor = this.constructor as new (locator: Locator, description: string) => this;
    return new Ctor(this.locator.nth(index), \`\${this.description}[\${index}]\`);
  }
}
`;

const BUTTON = `import { BaseComponent } from './base/BaseComponent';

export class ButtonComponent extends BaseComponent {
  async click(): Promise<void> {
    await this.locator.click();
  }

  async doubleClick(): Promise<void> {
    await this.locator.dblclick();
  }

  /** The button's accessible label, which is often an icon-only empty string. */
  async label(): Promise<string> {
    return (await this.locator.innerText()).trim();
  }
}
`;

const LINK = `import { BaseComponent } from './base/BaseComponent';

export class LinkComponent extends BaseComponent {
  async click(): Promise<void> {
    await this.locator.click();
  }

  /** The raw href attribute, or null when the link is JS-driven. */
  async href(): Promise<string | null> {
    return this.locator.getAttribute('href');
  }
}
`;

const INPUT = `import { BaseComponent } from './base/BaseComponent';

export class InputComponent extends BaseComponent {
  /** Replace the field's contents. */
  async fill(value: string): Promise<void> {
    await this.locator.fill(value);
  }

  /** Type character by character, for fields with keystroke-driven autocomplete. */
  async type(value: string, delay = 50): Promise<void> {
    await this.locator.pressSequentially(value, { delay });
  }

  async clear(): Promise<void> {
    await this.locator.fill('');
  }

  async value(): Promise<string> {
    return this.locator.inputValue();
  }

  async press(key: string): Promise<void> {
    await this.locator.press(key);
  }
}
`;

const CHECKBOX = `import { BaseComponent } from './base/BaseComponent';

export class CheckboxComponent extends BaseComponent {
  async check(): Promise<void> {
    await this.locator.check();
  }

  async uncheck(): Promise<void> {
    await this.locator.uncheck();
  }

  /** Set the box to an explicit state rather than flipping it. */
  async setChecked(checked: boolean): Promise<void> {
    await this.locator.setChecked(checked);
  }

  async isChecked(): Promise<boolean> {
    return this.locator.isChecked();
  }
}
`;

const RADIO = `import { BaseComponent } from './base/BaseComponent';

export class RadioComponent extends BaseComponent {
  async select(): Promise<void> {
    await this.locator.check();
  }

  async isSelected(): Promise<boolean> {
    return this.locator.isChecked();
  }
}
`;

const DROPDOWN = `import { BaseComponent } from './base/BaseComponent';
import { OptionComponent } from './OptionComponent';

/**
 * A dropdown trigger. Application dropdowns are usually not a native <select>,
 * so the options only exist in the DOM once the trigger is open — open() first,
 * then read or pick an option.
 */
export class DropdownComponent extends BaseComponent {
  async open(): Promise<void> {
    await this.locator.click();
  }

  /** The currently displayed value. */
  async selectedText(): Promise<string> {
    return (await this.locator.innerText()).trim();
  }

  /** Open the dropdown and click the option with this exact label. */
  async selectByLabel(label: string): Promise<void> {
    await this.open();
    await this.option(label).click();
  }

  option(label: string): OptionComponent {
    const page = this.locator.page();
    return new OptionComponent(page.getByRole('option', { name: label, exact: true }), label);
  }

  /** Open the dropdown and return every visible option label. */
  async optionLabels(): Promise<string[]> {
    await this.open();
    const page = this.locator.page();
    return page.getByRole('option').allInnerTexts();
  }
}
`;

const OPTION = `import { BaseComponent } from './base/BaseComponent';

/**
 * A single option inside an opened dropdown or listbox. It only exists while
 * its dropdown is open, so tests must open the trigger before touching it.
 */
export class OptionComponent extends BaseComponent {
  async click(): Promise<void> {
    await this.locator.click();
  }

  async isSelected(): Promise<boolean> {
    return (await this.locator.getAttribute('aria-selected')) === 'true';
  }
}
`;

const TAB = `import { BaseComponent } from './base/BaseComponent';

export class TabComponent extends BaseComponent {
  async select(): Promise<void> {
    await this.locator.click();
  }

  async isSelected(): Promise<boolean> {
    return (await this.locator.getAttribute('aria-selected')) === 'true';
  }
}
`;

const MENU_ITEM = `import { BaseComponent } from './base/BaseComponent';

/** An entry inside an opened menu. Open the menu's trigger before using it. */
export class MenuItemComponent extends BaseComponent {
  async click(): Promise<void> {
    await this.locator.click();
  }
}
`;

const TEXT = `import { BaseComponent } from './base/BaseComponent';

/** Read-only text: headings, labels, static copy. Deliberately has no click(). */
export class TextComponent extends BaseComponent {
  async contains(fragment: string): Promise<boolean> {
    return (await this.text()).includes(fragment);
  }
}
`;

const IMAGE = `import { BaseComponent } from './base/BaseComponent';

export class ImageComponent extends BaseComponent {
  async src(): Promise<string | null> {
    return this.locator.getAttribute('src');
  }

  async alt(): Promise<string | null> {
    return this.locator.getAttribute('alt');
  }
}
`;

const TABLE = `import type { Locator } from '@playwright/test';
import { BaseComponent } from '../base/BaseComponent';

/**
 * A data table addressed by column name.
 *
 * The column list comes from the application map, so cell('Username') works
 * without the test knowing the column order. Row and column indexes are
 * zero-based and exclude the header row.
 */
export class TableComponent extends BaseComponent {
  constructor(
    locator: Locator,
    readonly columns: readonly string[],
    description: string,
  ) {
    super(locator, description);
  }

  /** Header labels as rendered right now, which may differ from the mapped list. */
  async headers(): Promise<string[]> {
    const texts = await this.locator.getByRole('columnheader').allInnerTexts();
    return texts.map((t) => t.trim());
  }

  rows(): Locator {
    return this.locator.getByRole('row').filter({ hasNot: this.locator.getByRole('columnheader') });
  }

  async rowCount(): Promise<number> {
    return this.rows().count();
  }

  row(index: number): Locator {
    return this.rows().nth(index);
  }

  /** The cell at (row, column), where column is a mapped column name or an index. */
  cell(rowIndex: number, column: string | number): Locator {
    return this.row(rowIndex).getByRole('cell').nth(this.columnIndex(column));
  }

  async cellText(rowIndex: number, column: string | number): Promise<string> {
    return (await this.cell(rowIndex, column).innerText()).trim();
  }

  /** The first row containing this exact cell text — the usual way to find a record. */
  rowByCellText(text: string): Locator {
    return this.rows().filter({ has: this.locator.page().getByRole('cell', { name: text, exact: true }) }).first();
  }

  /** Every value in one column, top to bottom. */
  async columnValues(column: string | number): Promise<string[]> {
    const index = this.columnIndex(column);
    const count = await this.rowCount();
    const values: string[] = [];
    for (let i = 0; i < count; i += 1) {
      values.push((await this.row(i).getByRole('cell').nth(index).innerText()).trim());
    }
    return values;
  }

  private columnIndex(column: string | number): number {
    if (typeof column === 'number') return column;
    const index = this.columns.indexOf(column);
    if (index === -1) {
      throw new Error(
        \`Unknown column '\${column}' in \${this.description}. Known columns: \${this.columns.join(', ') || '(none mapped)'}\`,
      );
    }
    return index;
  }
}
`;

const GENERIC = `import { BaseComponent } from './base/BaseComponent';

/**
 * Fallback for a mapped component type this framework has no dedicated class
 * for yet (alerts, modals, progress bars). It exposes only what is safe for any
 * element; add a proper class when you need richer behaviour.
 */
export class GenericComponent extends BaseComponent {
  async click(): Promise<void> {
    await this.locator.click();
  }
}
`;

const COMPONENT_INDEX = `export { BaseComponent } from './base/BaseComponent';
export { GenericComponent } from './GenericComponent';
export { ButtonComponent } from './ButtonComponent';
export { CheckboxComponent } from './CheckboxComponent';
export { DropdownComponent } from './DropdownComponent';
export { ImageComponent } from './ImageComponent';
export { InputComponent } from './InputComponent';
export { LinkComponent } from './LinkComponent';
export { MenuItemComponent } from './MenuItemComponent';
export { OptionComponent } from './OptionComponent';
export { RadioComponent } from './RadioComponent';
export { TabComponent } from './TabComponent';
export { TextComponent } from './TextComponent';
export { TableComponent } from './tables/TableComponent';
`;

// ---- pages -------------------------------------------------------------------

const BASE_PAGE = `import type { Page } from '@playwright/test';

/**
 * Common page-object behaviour: navigation and readiness. Element access lives
 * in the generated subclass, so this file stays small and stable.
 */
export abstract class BasePage {
  protected constructor(
    readonly page: Page,
    readonly path: string,
  ) {}

  /** Navigate to this page's own path, relative to the configured baseURL. */
  async goto(): Promise<void> {
    await this.page.goto(this.path, { waitUntil: 'domcontentloaded' });
    await this.waitUntilReady();
  }

  /**
   * Wait for the document, not for the network.
   *
   * 'networkidle' never arrives in an app that polls or holds a socket open, and
   * even 'load' waits on every last font and tracking pixel — on a slow single-
   * page app that is routinely longer than the navigation timeout, so the test
   * fails before the page it is looking at has even been examined. The elements
   * a test actually touches are auto-waited by their own locators, which is the
   * check that matters.
   */
  async waitUntilReady(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  async title(): Promise<string> {
    return this.page.title();
  }

  get url(): string {
    return this.page.url();
  }
}
`;

// ---- utils -------------------------------------------------------------------

const ENV = `/**
 * Environment access in one place, so no test reads process.env directly and a
 * missing variable fails with a message that says what to set.
 */
export function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(\`Missing required environment variable \${name}. Copy .env.example to .env and fill it in.\`);
  }
  return value;
}

export function optionalEnv(name: string, fallback: string): string {
  return process.env[name] ?? fallback;
}
`;

/**
 * The spinner selector is the one thing here that depends on the app under test,
 * so it comes from `waits.spinnerSelector` in the generator config rather than
 * being guessed. The default is role-based and therefore app-agnostic; add your
 * app's own class to the config if it has no accessible busy state.
 */
function waitHelpers(spinnerSelector) {
  return `import { expect, type Locator, type Page } from '@playwright/test';

/**
 * Wait for the app's loading indicator to disappear, if one is present at all.
 *
 * A cleared spinner is not evidence that anything succeeded — it is a UI
 * decoration that a redesign can remove. Use this to settle an intermediate
 * screen, never in place of asserting the response or the result the user sees.
 */
export async function waitForSpinnerToClear(page: Page, timeout = 15_000): Promise<void> {
  const spinner = page.locator(${quote(spinnerSelector)});
  if ((await spinner.count()) === 0) return;
  await expect(spinner.first()).toBeHidden({ timeout }); // allow:positional-locator
}

/** Poll until the locator resolves to exactly one element. */
export async function waitForUnique(locator: Locator, timeout = 10_000): Promise<void> {
  await expect
    .poll(async () => locator.count(), {
      message: 'locator did not resolve to exactly one element',
      timeout,
    })
    .toBe(1);
}
`;
}

const CONSTANTS =`export const TIMEOUTS = {
  action: 15_000,
  navigation: 30_000,
  assertion: 10_000,
} as const;
`;

// ---- test data ---------------------------------------------------------------

const TEST_DATA = `import { randomUUID } from 'node:crypto';

/**
 * Unique values for anything a test creates.
 *
 * Tests that share a record cannot run in parallel: one edits what another is
 * asserting on, and the failure surfaces as a flake rather than as the
 * collision it is. A timestamp is not enough — two workers can start inside the
 * same millisecond — so these are UUID-backed.
 */
export function uniqueSuffix(): string {
  return randomUUID().replace(/-/g, '').slice(0, 10);
}

export function uniqueUsername(prefix = 'qa'): string {
  return \`\${prefix}.\${uniqueSuffix()}\`;
}

export function uniqueEmail(prefix = 'qa', domain = 'example.com'): string {
  return \`\${prefix}.\${uniqueSuffix()}@\${domain}\`;
}

export function uniqueName(prefix: string): string {
  return \`\${prefix} \${uniqueSuffix()}\`;
}
`;

// ---- network ----------------------------------------------------------------

const NETWORK = `import type { Page, Response } from '@playwright/test';

export interface ResponseCriteria {
  urlIncludes: string;
  method?: string;
  status?: number;
}

/**
 * Register a response wait *before* the action that triggers it.
 *
 * The listener has to exist before the request is sent, or a fast response
 * lands before anything is watching and the wait hangs until it times out. So
 * this deliberately returns an un-awaited promise:
 *
 *   const saved = expectResponse(page, { urlIncludes: '/users', method: 'POST', status: 200 });
 *   await page.saveButton.click();
 *   await saved;
 *
 * Asserting the response rather than a spinner also means the test knows the
 * difference between "the operation succeeded" and "the loading state ended".
 */
export function expectResponse(page: Page, criteria: ResponseCriteria): Promise<Response> {
  return page.waitForResponse(
    (response) =>
      response.url().includes(criteria.urlIncludes) &&
      (criteria.method === undefined || response.request().method() === criteria.method) &&
      (criteria.status === undefined || response.status() === criteria.status),
  );
}

/** The same wait, resolved to the parsed JSON body. */
export async function expectJson<T>(page: Page, criteria: ResponseCriteria): Promise<T> {
  const response = await expectResponse(page, criteria);
  return (await response.json()) as T;
}
`;

// ---- api --------------------------------------------------------------------

const API_CLIENT = `import type { APIRequestContext, APIResponse } from '@playwright/test';

/**
 * A thin wrapper over Playwright's request context, for the work that does not
 * need a browser.
 *
 * Validation rules, authorization, pagination, response codes and boundary
 * values are cheaper, faster and steadier to check here than through a form —
 * and setup/teardown through the API keeps a browser test focused on the
 * journey it is actually about instead of on arranging its own fixtures.
 */
export class ApiClient {
  constructor(private readonly request: APIRequestContext) {}

  async get(path: string): Promise<APIResponse> {
    return this.request.get(path);
  }

  async post(path: string, data: unknown): Promise<APIResponse> {
    return this.request.post(path, { data });
  }

  async put(path: string, data: unknown): Promise<APIResponse> {
    return this.request.put(path, { data });
  }

  async delete(path: string): Promise<APIResponse> {
    return this.request.delete(path);
  }

  /** GET the path and fail loudly if it did not succeed, so callers can trust the body. */
  async json<T>(path: string): Promise<T> {
    const response = await this.get(path);
    if (!response.ok()) {
      throw new Error(\`GET \${path} failed with \${response.status()} \${response.statusText()}\`);
    }
    return (await response.json()) as T;
  }
}
`;
