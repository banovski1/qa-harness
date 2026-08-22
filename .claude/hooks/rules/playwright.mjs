/**
 * Determinism rules. Every one of these has the same shape underneath: wait for
 * evidence the application produced, never for a duration, a decoration, or a
 * retry to paper over the difference.
 */
import { codeLines, isSpec, lines, scan, stripComment } from '../lib.mjs';

const RULES = [
  {
    id: 'no-raw-timeout',
    pattern: /waitForTimeout\s*\(|\bsleep\s*\(|new Promise\([^)]*setTimeout/,
    fix: 'Wait for a condition, not a duration: await expect(locator).toBeVisible(), toBeEnabled(), or expect.poll for backend state.',
  },
  {
    id: 'web-first-assert',
    pattern: /expect\s*\(\s*await\b|expect\s*\([^)]*\.(isVisible|isEnabled|isChecked|isHidden|textContent|innerText|count)\s*\(\s*\)/,
    fix: 'Web-first assertions retry; a snapshot check does not. Use await expect(locator).toBeVisible() instead of expect(await locator.isVisible()).toBe(true).',
  },
  {
    id: 'network-before-action',
    pattern: /await\s+(page|this\.page)\s*\.\s*waitFor(Response|Request|Event|Popup|Download)\s*\(/,
    fix: 'Register the wait before the action, or the response can land before the listener does: const responsePromise = expectResponse(page, {...}); await button.click(); await responsePromise.',
  },
  {
    id: 'no-force',
    pattern: /force\s*:\s*true/,
    fix: 'force:true skips the actionability checks that would have told you what is wrong — an overlay, an animation, a disabled control, or the wrong locator. Fix the cause.',
  },
  {
    id: 'no-direct-env',
    pattern: /process\.env\b/,
    fix: 'Read configuration through requiredEnv/optionalEnv from src/utils/env.ts so a missing variable fails with a name instead of undefined.',
  },
  {
    id: 'no-hardcoded-credentials',
    pattern: /(password|passwd|secret|token)\s*[:=]\s*(['"])[^'"$]{3,}\2/i,
    fix: 'Credentials come from the environment via requiredEnv, never from a literal in the source.',
  },
];

const SPEC_RULES = [
  {
    id: 'no-local-retries',
    pattern: /test\.describe\.configure\s*\(\s*\{[^}]*retries|test\.setTimeout\s*\(/,
    fix: 'A per-spec retry or timeout bump hides flakiness instead of removing it. Fix the wait; retries stay a CI-wide setting.',
  },
  {
    id: 'no-new-page-object',
    pattern: /new\s+\w*Page\s*\(/,
    fix: 'Page objects arrive as destructured fixtures. Register a new one in src/fixtures/extra-fixtures.ts instead of constructing it here.',
  },
  {
    id: 'no-conditional-flow',
    pattern: /^\s*(if|try)\s*[({]/,
    fix: 'A branch in a test means the test does not know what the app should do. Assert the expected state instead.',
  },
];

const UNIQUE_HELPERS = /unique(Suffix|Username|Email|Id)|randomUUID/;
const SEEDS_DATA = /\.(createUser|create|add|fill|type)\s*\(\s*['"`]/;
const SPINNER = /(spinner|progressbar|aria-busy|loading|waitForSpinnerToClear)/i;

function testBodies(text) {
  const rows = text.split(/\r?\n/);
  const bodies = [];
  let current = null;
  for (let i = 0; i < rows.length; i += 1) {
    if (/^\s*test\s*(\.\w+)?\s*\(/.test(rows[i])) {
      current = { start: i + 1, lines: [] };
      bodies.push(current);
    } else if (current) {
      if (/^\}\s*\)\s*;?\s*$/.test(rows[i])) current = null;
      else current.lines.push(rows[i]);
    }
  }
  return bodies;
}

export function playwrightRules(ctx) {
  const out = [];
  for (const rule of RULES) out.push(...scan(ctx, rule.id, rule.pattern, rule.fix));
  if (!isSpec(ctx.path)) return out;

  for (const rule of SPEC_RULES) out.push(...scan(ctx, rule.id, rule.pattern, rule.fix));

  const whole = ctx.whole ?? ctx.text;
  if (SEEDS_DATA.test(ctx.text) && !UNIQUE_HELPERS.test(whole)) {
    out.push({
      rule: 'unique-test-data',
      line: 0,
      found: 'literal test data with no uniqueness helper imported',
      fix: 'Two tests sharing a record collide under parallel execution. Seed with uniqueUsername/uniqueEmail from src/utils/testData.ts.',
    });
  }
  if (/Date\.now\s*\(\s*\)/.test(ctx.text)) {
    out.push({
      rule: 'unique-test-data',
      line: 0,
      found: 'Date.now() used as a uniqueness suffix',
      fix: 'Two workers can start in the same millisecond. Use uniqueSuffix() from src/utils/testData.ts, which is UUID-backed.',
    });
  }

  for (const body of testBodies(whole)) {
    const text = body.lines.join('\n');
    const expects = (text.match(/\bexpect\s*\(/g) ?? []).length;
    if (expects > 8) {
      out.push({
        rule: 'assertion-focus',
        line: body.start,
        found: `${expects} assertions in one test`,
        fix: 'Every unrelated assertion is another way for this test to fail for a reason it was not written to catch. Assert the outcome the scenario is about and drop the rest.',
      });
    }
    const steps = codeLines(text).filter((l) => l.startsWith('await ')).length;
    if (steps > 12) {
      out.push({
        rule: 'journey-shape',
        line: body.start,
        found: `${steps} await steps inline`,
        fix: 'Move the multi-step flow into an action method on the protected page object so the spec reads as a journey.',
      });
    }
    const assertions = text.match(/expect\s*\([^)]*\)[^;]*/g) ?? [];
    if (assertions.length && assertions.every((a) => SPINNER.test(a))) {
      out.push({
        rule: 'assert-not-spinner',
        line: body.start,
        found: 'the only assertion is about a loading indicator',
        fix: 'A spinner is a UI decoration that can be redesigned away. Assert the response via expectResponse, and the user-visible result the app renders.',
      });
    }
  }

  for (const { no, text } of lines(ctx, 'poll-not-sleep')) {
    const code = stripComment(text);
    if (/^\s*(while|for)\s*\(/.test(code) && /request\.|fetch\(|apiClient/.test(whole)) {
      out.push({
        rule: 'poll-not-sleep',
        line: no,
        found: code.trim(),
        fix: 'Hand-rolled polling of backend state belongs in expect.poll(async () => ...).toBe(expected), which owns the timeout and the reporting.',
      });
    }
  }
  return out;
}
