/**
 * Files no writer may touch. There is no escape hatch here: a `// allow:` on a
 * line cannot make a generator-owned file writable, because the next
 * `generate.ts` run would silently discard the edit.
 */
import { existsSync, readFileSync } from 'node:fs';

const FORBIDDEN = [
  {
    match: (p) => p.endsWith('.generated.ts'),
    fix: 'Generated file — the next generate.mjs run overwrites it. Put the change in the protected subclass without the .generated suffix, or fix the analysis and re-run the repo analyzer.',
  },
  {
    match: (p) => /(^|\/)src\/components\//.test(p),
    fix: 'The component library is generator-owned (languages/typescript-runtime.mjs). Edit the generator template, not the output.',
  },
  {
    match: (p) =>
      /(^|\/)src\/utils\/(env|waitHelpers|testData|network|schema-assert)\.ts$/.test(p) ||
      /(^|\/)src\/api\/clients\/ApiClient\.ts$/.test(p) ||
      /(^|\/)src\/config\/constants\.ts$/.test(p),
    fix: 'Generator-owned runtime helper (languages/typescript-runtime.mjs) — regenerated every run. Change the template there, or put app-specific helpers in a new file such as src/utils/auth.ts.',
  },
  {
    match: (p) => /(^|\/)src\/pages\/base\/BasePage\.ts$/.test(p),
    fix: 'BasePage is generator-owned. Add the behaviour to the specific page object instead.',
  },
  {
    match: (p) => /(^|\/)src\/fixtures\/(page-fixtures|auth-fixtures|global-setup)\.ts$/.test(p),
    fix: 'Generator-owned fixture wiring. Register new page objects in src/fixtures/extra-fixtures.ts and re-export from src/fixtures/index.ts.',
  },
];

const AUTO_GENERATED = /AUTO-GENERATED/;

export function pathRules(ctx) {
  const out = [];
  for (const entry of FORBIDDEN) {
    if (entry.match(ctx.path)) {
      out.push({ rule: 'protected-path', line: 0, found: ctx.path, fix: entry.fix });
    }
  }
  if (out.length) return out;

  if (ctx.absolute && existsSync(ctx.absolute) && ctx.path.endsWith('.spec.ts')) {
    const head = readFileSync(ctx.absolute, 'utf8').slice(0, 400);
    if (AUTO_GENERATED.test(head)) {
      out.push({
        rule: 'protected-path',
        line: 0,
        found: `${ctx.path} carries the AUTO-GENERATED header`,
        fix: 'This is a generated smoke spec. Write the scenario to its own file under tests/e2e/<module>/<scenario>.spec.ts.',
      });
    }
  }
  return out;
}
