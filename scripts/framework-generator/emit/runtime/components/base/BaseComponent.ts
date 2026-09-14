// Every generated component inherits this. Two jobs: address one element, and explain
// itself when that fails.
//
// Nothing here waits for a duration. Every wait is a named condition, and the name is
// what gets reported — so "the table was still loading" is distinguishable from "the
// locator was wrong", which is the misdiagnosis that puts waitForTimeout into a suite.
import { test, expect, type Locator, type Page } from '@playwright/test';
import type { Logger } from 'pino';
import { classify, ComponentError } from './diagnostics.ts';
import { componentLogger, redact, type ComponentLog } from '../../support/logger.ts';

export interface ComponentContext {
  /** The screen class that owns this component, for the failure report. */
  screen?: string;
  /** The URL the owning screen expects, so NOT_FOUND can say "you are elsewhere". */
  expectedUrl?: string | null;
  modelPath?: string;
  /** Test seam: a pino instance to bind instead of the module's own streams. */
  logger?: Logger;
}

export abstract class BaseComponent {
  readonly page: Page;
  readonly root: Locator;
  /** The English identity the page object used. This is what appears in failures. */
  readonly label: string;
  readonly context: ComponentContext;
  /**
   * Assigned in the constructor body, not as a field initializer: a field initializer
   * referencing `this.context` runs before the constructor body's own assignments, so
   * it would see `this.context` as still-undefined and throw on every construction.
   */
  protected readonly log: Logger;

  constructor(pageOrRoot: Page | Locator, label: string, context: ComponentContext = {}) {
    this.page = 'page' in pageOrRoot ? (pageOrRoot as Locator).page() : (pageOrRoot as Page);
    this.root = 'page' in pageOrRoot ? (pageOrRoot as Locator) : (pageOrRoot as Page).locator('body');
    this.label = label;
    this.context = context;
    this.log = componentLogger({
      component: this.constructor.name,
      screen: this.context.screen ?? 'unknown screen',
      modelPath: this.context.modelPath ?? 'analysis.json',
    }, this.context.logger);
  }

  /** The element this component addresses. Subclasses define it; nothing else may. */
  abstract locator(): Locator;

  get componentName(): string {
    return this.constructor.name;
  }

  /**
   * What this component would tell a log about how it addresses its element. The base
   * class knows nothing about strategy — only `Addressed` (label/field identities) does
   * — so this returns nothing, and `act()` logs whatever it has.
   */
  protected describe(): { strategy?: string; selector?: string; via?: ComponentLog['via'] } {
    return {};
  }

  /**
   * Run one interaction, and log it either way. On failure, `classify()` still replaces
   * Playwright's message with the classified one — that cost is paid only after
   * something has already thrown. On success the record is what makes the strategy
   * visible before it ever needs to be a diagnosis: `arg` is redacted on the handle,
   * never on the value, so a password field never appears even once.
   *
   * Split from `runAndLog` so the wrapping — `test.step`, for the trace — is one line
   * and the logic it wraps is testable without a Playwright test runner: `test.step()`
   * throws when called outside one, and the runner's own instrumentation is not part of
   * what this file is responsible for getting right.
   */
  protected async act<T>(action: string, fn: (target: Locator) => Promise<T>, arg?: unknown): Promise<T> {
    return test.step(`${this.componentName} "${this.label}" › ${action}`, () => this.runAndLog(action, fn, arg));
  }

  protected async runAndLog<T>(action: string, fn: (target: Locator) => Promise<T>, arg?: unknown): Promise<T> {
    const started = Date.now();
    const described = this.describe();
    try {
      const result = await fn(this.locator());
      this.log.info({
        ...described,
        as: this.label,
        handle: this.label,
        action,
        arg: redact(this.label, arg),
        outcome: 'ok',
        ms: Date.now() - started,
      } satisfies Partial<ComponentLog>, `${this.componentName} "${this.label}" › ${action} ok`);
      return result;
    } catch (cause) {
      const diagnosis = await classify(this.locator(), this.page, {
        component: this.componentName,
        label: this.label,
        screen: this.context.screen ?? 'unknown screen',
        action,
        expectedUrl: this.context.expectedUrl ?? null,
        modelPath: this.context.modelPath ?? 'analysis.json',
        waitedMs: Date.now() - started,
        waitedFor: null,
        observed: null,
      }, cause);
      this.log.error({
        ...described,
        as: this.label,
        handle: this.label,
        action,
        arg: redact(this.label, arg),
        outcome: diagnosis.mode,
        ms: Date.now() - started,
      } satisfies Partial<ComponentLog>, `${this.componentName} "${this.label}" › ${action} ${diagnosis.mode}`);
      throw new ComponentError(diagnosis, cause);
    }
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
      modelPath: this.context.modelPath ?? 'analysis.json',
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
