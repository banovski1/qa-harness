// Why a component failed, in the words a human or an agent can act on.
//
// Playwright's own failure is "Timeout 30000ms exceeded waiting for locator('#x')",
// which is true of six different problems and useful for none of them. Every one of
// those six has evidence that distinguishes it, and all of that evidence is available
// at the moment of failure. This module gathers it.
import type { Locator, Page } from '@playwright/test';

export type FailureMode =
  | 'NOT_FOUND'
  | 'AMBIGUOUS'
  | 'HIDDEN'
  | 'DISABLED'
  | 'COVERED'
  | 'DETACHED'
  | 'TIMED_OUT';

export interface Diagnosis {
  mode: FailureMode;
  component: string;
  /** The English name the page object used: "Submit Request". */
  label: string;
  screen: string;
  action: string;
  matchCount: number;
  waitedMs: number;
  waitedFor: string | null;
  /** What the wait saw instead, where a wait was involved. */
  observed: string | null;
  candidates: string[];
  actualUrl: string;
  expectedUrl: string | null;
  modelPath: string;
  advice: string;
}

const ADVICE: Record<FailureMode, string> = {
  NOT_FOUND:
    'the app moved or you are on the wrong screen. Compare the URL below with the ' +
    'expected one; if the screen is right, the analysis is stale — re-crawl it.',
  AMBIGUOUS:
    'scope the accessor inside its component, or the test data collided — a value ' +
    'from an earlier run is still present. uniqueName() exists to prevent this.',
  HIDDEN:
    'the element exists but nothing revealed it. A step is missing: open the menu, ' +
    'expand the panel, or switch the tab first.',
  DISABLED:
    'a precondition is unmet. Any validation message on the form is printed above.',
  COVERED:
    'something is in front of it — usually a toast, a modal backdrop, or a sticky bar. ' +
    'Wait for that element to go, not for a duration.',
  DETACHED:
    'the element was replaced mid-action: the app re-rendered while the test was acting. ' +
    'This is a race, not a bad locator. Wait for the state that follows the re-render.',
  TIMED_OUT:
    'the condition never became true. What was waited for, and what was seen instead, ' +
    'are printed above — the fix is upstream of this line.',
};

export class ComponentError extends Error {
  constructor(readonly diagnosis: Diagnosis, cause?: unknown) {
    super(render(diagnosis));
    this.name = 'ComponentError';
    if (cause instanceof Error) this.cause = cause;
  }
}

function render(d: Diagnosis): string {
  const lines = [
    `${d.screen} › ${d.label} (${d.component}) › ${d.action}`,
    `  ${d.mode}: ${summary(d)}`,
    `  waited:    ${d.waitedMs}ms${d.waitedFor ? ` for ${d.waitedFor}` : ' — failed on resolution, not on timing'}`,
  ];
  if (d.observed) lines.push(`  observed:  ${d.observed}`);
  if (d.candidates.length) lines.push(`  matches:   ${d.candidates.slice(0, 5).join(' | ')}`);
  lines.push(`  url:       ${d.actualUrl}${d.expectedUrl && d.expectedUrl !== d.actualUrl ? `   (expected ${d.expectedUrl})` : ''}`);
  lines.push(`  model:     ${d.modelPath}`);
  lines.push(`  likely:    ${d.advice}`);
  return lines.join('\n');
}

function summary(d: Diagnosis): string {
  switch (d.mode) {
    case 'NOT_FOUND': return 'locator matched no elements';
    case 'AMBIGUOUS': return `locator matched ${d.matchCount} elements, expected 1`;
    case 'HIDDEN': return 'element exists but is not visible';
    case 'DISABLED': return 'element is visible but disabled';
    case 'COVERED': return 'element is visible but another element receives the click';
    case 'DETACHED': return 'element was removed from the DOM mid-action';
    case 'TIMED_OUT': return 'a wait condition never became true';
  }
}

/** Classify a failure from the live page. Runs only once something has already gone wrong. */
export async function classify(
  locator: Locator,
  page: Page,
  context: {
    component: string; label: string; screen: string; action: string;
    expectedUrl: string | null; modelPath: string;
    waitedMs: number; waitedFor: string | null; observed: string | null;
  },
  cause?: unknown,
): Promise<Diagnosis> {
  const message = cause instanceof Error ? cause.message : '';
  let matchCount = -1;
  let candidates: string[] = [];
  let mode: FailureMode = 'TIMED_OUT';

  try {
    matchCount = await locator.count();
    if (matchCount === 0) mode = 'NOT_FOUND';
    else if (matchCount > 1) {
      mode = 'AMBIGUOUS';
      candidates = await locator.evaluateAll(els =>
        els.slice(0, 5).map(el => (el.textContent ?? '').trim().slice(0, 60) || (el as HTMLElement).tagName));
    } else if (/not attached|detached|element is not attached/i.test(message)) mode = 'DETACHED';
    else if (/intercepts pointer events|subtree intercepts/i.test(message)) mode = 'COVERED';
    else if (!(await locator.first().isVisible())) mode = 'HIDDEN';
    else if (!(await locator.first().isEnabled())) mode = 'DISABLED';
  } catch {
    // A page that closed or navigated mid-classification: keep the default.
  }

  if (mode === 'COVERED') {
    const blocker = message.match(/<[^>]+>/)?.[0];
    if (blocker) candidates = [`intercepted by ${blocker}`];
  }
  if (mode === 'DISABLED') {
    try {
      const errors = await page.locator('.error, [role="alert"], .invalid-feedback').allTextContents();
      candidates = errors.map(e => e.trim()).filter(Boolean).slice(0, 5);
    } catch { /* best effort */ }
  }

  const d: Diagnosis = {
    mode, matchCount, candidates,
    component: context.component, label: context.label, screen: context.screen, action: context.action,
    waitedMs: context.waitedMs, waitedFor: context.waitedFor, observed: context.observed,
    actualUrl: page.url(), expectedUrl: context.expectedUrl, modelPath: context.modelPath,
    advice: ADVICE[mode],
  };
  return d;
}
