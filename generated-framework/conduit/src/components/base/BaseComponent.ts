// Every generated component inherits this. Two jobs: address one element, and explain
// itself when that fails.
//
// Nothing here waits for a duration. Every wait is a named condition, and the name is
// what gets reported — so "the table was still loading" is distinguishable from "the
// locator was wrong", which is the misdiagnosis that puts waitForTimeout into a suite.
import { test, expect, type Locator, type Page } from '@playwright/test';
import { classify, ComponentError } from './diagnostics.ts';

export interface ComponentContext {
  /** The screen class that owns this component, for the failure report. */
  screen?: string;
  /** The URL the owning screen expects, so NOT_FOUND can say "you are elsewhere". */
  expectedUrl?: string | null;
  modelPath?: string;
}

export abstract class BaseComponent {
  readonly page: Page;
  readonly root: Locator;
  /** The English identity the page object used. This is what appears in failures. */
  readonly label: string;
  readonly context: ComponentContext;

  constructor(pageOrRoot: Page | Locator, label: string, context: ComponentContext = {}) {
    this.page = 'page' in pageOrRoot ? (pageOrRoot as Locator).page() : (pageOrRoot as Page);
    this.root = 'page' in pageOrRoot ? (pageOrRoot as Locator) : (pageOrRoot as Page).locator('body');
    this.label = label;
    this.context = context;
  }

  /** The element this component addresses. Subclasses define it; nothing else may. */
  abstract locator(): Locator;

  get componentName(): string {
    return this.constructor.name;
  }

  /**
   * Run one interaction, and on failure replace Playwright's message with the
   * classified one. The classification costs nothing on the happy path: it runs only
   * after something has already thrown.
   */
  protected async act<T>(action: string, fn: (target: Locator) => Promise<T>): Promise<T> {
    const started = Date.now();
    return test.step(`${this.componentName} "${this.label}" › ${action}`, async () => {
      try {
        return await fn(this.locator());
      } catch (cause) {
        const diagnosis = await classify(this.locator(), this.page, {
          component: this.componentName,
          label: this.label,
          screen: this.context.screen ?? 'unknown screen',
          action,
          expectedUrl: this.context.expectedUrl ?? null,
          modelPath: this.context.modelPath ?? 'analysis/<app>/app-model.json',
          waitedMs: Date.now() - started,
          waitedFor: null,
          observed: null,
        }, cause);
        throw new ComponentError(diagnosis, cause);
      }
    });
  }

  /**
   * Wait for a named condition, reporting what was seen instead when it never holds.
   * `describe` is the sentence that appears in the failure, so write it as one.
   */
  protected async waitFor(
    describe: string,
    condition: () => Promise<boolean>,
    observe: () => Promise<string> = async () => 'unknown',
    timeout = 10_000,
  ): Promise<void> {
    const started = Date.now();
    const seen: string[] = [];
    while (Date.now() - started < timeout) {
      if (await condition()) return;
      const now = await observe().catch(() => 'unreadable');
      if (seen[seen.length - 1] !== now) seen.push(now);
      await this.page.waitForTimeout(100); // allow:playwright polling a named condition, not a fixed delay
    }
    const diagnosis = await classify(this.locator(), this.page, {
      component: this.componentName,
      label: this.label,
      screen: this.context.screen ?? 'unknown screen',
      action: `wait for ${describe}`,
      expectedUrl: this.context.expectedUrl ?? null,
      modelPath: this.context.modelPath ?? 'analysis/<app>/app-model.json',
      waitedMs: Date.now() - started,
      waitedFor: describe,
      observed: seen.join(' → ') || 'nothing observed',
    });
    throw new ComponentError(diagnosis);
  }

  async isVisible(): Promise<boolean> {
    return this.locator().isVisible();
  }

  async isEnabled(): Promise<boolean> {
    return this.locator().isEnabled();
  }

  async text(): Promise<string> {
    return (await this.locator().innerText()).trim();
  }

  async expectVisible(): Promise<void> {
    await this.act('expect visible', async target => {
      await expect(target).toBeVisible();
    });
  }

  /** Scope to one of several identical components, where nothing semantic separates them. */
  nth(index: number): Locator {
    return this.locator().nth(index);
  }
}
