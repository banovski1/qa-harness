/**
 * How well the analysis knows each screen — and therefore whether a test can be
 * written against it now, or a human has to record the flow first.
 *
 * The score answers one question and no other: *is there enough here to address the
 * controls a test would touch?* It is not a quality judgement about the app, and a low
 * score is not a defect — it is a request for a recording.
 */
import type { AnalysisScreen, AnalysisTestability, ScreenTestability } from './analysis-types.ts';

/** Above this, write the test. Below it, ask for a recording first. */
export const CONFIDENT = 0.7;
/** Below this, the screen is a stub: a URL and little else. */
export const UNKNOWN = 0.3;

/**
 * A screen with three addressable controls out of four is in better shape than one with
 * thirty out of forty, because the second has ten things a test may reach for and miss.
 * So the ratio carries the weight, and the extras adjust it.
 */
export function scoreScreen(screen: AnalysisScreen, recorded: boolean): ScreenTestability {
  const controls = screen.controls ?? [];
  const addressable = controls.filter(c => c.name && c.matches === 1).length;
  const unaddressable = controls.length - addressable;
  const missing: string[] = [];

  if (!controls.length) missing.push('no control was ever seen on this screen');
  if (unaddressable > 0) missing.push(`${unaddressable} control(s) cannot be addressed by name`);
  if (!screen.headings?.length) missing.push('no heading to assert the screen by');

  const ratio = controls.length ? addressable / controls.length : 0;
  // A recording is direct evidence of the flow, which nothing derived from a crawl can
  // replace: it says what a click leads to, not merely what is on the page.
  let confidence = controls.length ? ratio : 0;
  if (recorded) confidence = Math.min(1, confidence + 0.3);
  if (!screen.tables?.length && controls.length && ratio >= 0.9) confidence = Math.min(1, confidence + 0.05);

  return {
    confidence: Math.round(confidence * 100) / 100,
    addressable,
    unaddressable,
    hasTable: (screen.tables?.length ?? 0) > 0,
    crawled: true,
    recorded,
    missing,
  };
}

/** Declared but never reached: a URL and nothing behind it. */
export const UNCRAWLED: ScreenTestability = {
  confidence: 0,
  addressable: 0,
  unaddressable: 0,
  hasTable: false,
  crawled: false,
  recorded: false,
  missing: ['the crawl never reached this route — only its URL is known'],
};

/**
 * Score every screen in place, and return the roll-up.
 *
 * The score lives on the screen because that is where it is read: an agent asking "can
 * I write a test for /leave/applyLeave?" should not have to look the same path up in a
 * second table to find out.
 */
export function scoreScreens(
  screens: AnalysisScreen[],
  recordings: AnalysisTestability['recordings'],
): AnalysisTestability {
  const recorded = new Set(recordings.flatMap(r => r.screens));
  const summary = { write: 0, recordFirst: 0, unknown: 0, total: screens.length };
  for (const screen of screens) {
    screen.testability = screen.crawled === false
      ? { ...UNCRAWLED }
      : scoreScreen(screen, recorded.has(screen.path));
    const verdict = verdictFor(screen.testability.confidence);
    if (verdict === 'write') summary.write += 1;
    else if (verdict === 'record-first') summary.recordFirst += 1;
    else summary.unknown += 1;
  }
  return { summary, recordings };
}

/** The verdict a test-writing agent acts on. */
export function verdictFor(confidence: number): 'write' | 'record-first' | 'unknown' {
  if (confidence >= CONFIDENT) return 'write';
  if (confidence >= UNKNOWN) return 'record-first';
  return 'unknown';
}
