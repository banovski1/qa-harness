/**
 * How much a recorded locator is worth.
 *
 * A recording emits whatever Playwright chose at the moment the human clicked, which
 * ranges from `getByRole('button', { name: 'Save' })` to `nth(3)` on a bare CSS class.
 * The ingest needs one number to decide whether a step is evidence of a control or
 * evidence of a gap, and the merge needs the same number to decide whether to resolve
 * the step against `screens` or record it unresolved.
 *
 * One ladder, read the same way everywhere. Rungs 1-6 are stable; 7 and 8 are not, and
 * the reason says which kind of unstable — because "positional" is a re-record and "raw
 * CSS" is a re-crawl, and they are not the same request.
 */

export interface Rung {
  /** 1 (best) to 8 (worst). */
  rung: number;
  /** Stable enough to build a test on. */
  stable: boolean;
  /** Why, in the words a report prints. */
  reason: string;
}

const LADDER: { rung: number; reason: string; test: RegExp }[] = [
  { rung: 1, reason: 'test id', test: /^\s*getByTestId\(/ },
  { rung: 2, reason: 'role with an accessible name', test: /^\s*getByRole\([^)]*\bname\s*:/ },
  { rung: 3, reason: 'label', test: /^\s*getByLabel\(/ },
  { rung: 4, reason: 'placeholder', test: /^\s*getByPlaceholder\(/ },
  { rung: 5, reason: 'alt text', test: /^\s*getByAltText\(/ },
  { rung: 6, reason: 'title attribute', test: /^\s*getByTitle\(/ },
];

/** A locator that names a position rather than a thing. */
const POSITIONAL = /\.(nth|first|last)\(|:nth-(child|of-type)\(|\[\d+\]/;

/**
 * Classify one locator expression as a recording emitted it.
 *
 * Positional is checked before everything else: `getByRole('row').nth(3)` is a perfect
 * role locator wrapped around an index, and the index is the part that breaks.
 */
export function classify(locator: string | null | undefined): Rung {
  if (!locator || !locator.trim()) {
    return { rung: 8, stable: false, reason: 'no locator was recorded' };
  }
  if (POSITIONAL.test(locator)) {
    return { rung: 7, stable: false, reason: 'positional — depends on how many rows happened to be on screen' };
  }
  for (const step of LADDER) {
    if (step.test.test(locator)) return { rung: step.rung, stable: true, reason: step.reason };
  }
  if (/^\s*getByRole\(/.test(locator)) {
    return { rung: 7, stable: false, reason: 'role with no accessible name — matches every control of that role' };
  }
  if (/^\s*getByText\(/.test(locator)) {
    return { rung: 7, stable: false, reason: 'text only — breaks on any copy change' };
  }
  return { rung: 8, stable: false, reason: 'raw CSS or XPath — describes the markup, not the control' };
}

/** The name a stable locator carries, for matching a recorded step to a known control. */
export function nameIn(locator: string | null | undefined): string | null {
  if (!locator) return null;
  const named = locator.match(/\bname\s*:\s*(['"`])(.*?)\1/);
  if (named) return named[2];
  const single = locator.match(/^\s*getBy(?:Label|Placeholder|AltText|Title|TestId|Text)\(\s*(['"`])(.*?)\1/);
  return single ? single[2] : null;
}
