/**
 * Files no writer may touch. There is no escape hatch here: a `// allow:` on a
 * line cannot make a generator-owned file writable, because the next
 * generator run would silently discard the edit.
 */
import { existsSync, readFileSync } from 'node:fs';

const FORBIDDEN = [
  {
    match: (p) => p.endsWith('.generated.ts'),
    fix: 'Generated file — npm run generate --prefix scripts/framework-generator overwrites it. Put the change in the protected subclass without the .generated suffix, or fix the analysis (the skills, then compile-model.ts) and regenerate.',
  },
  {
    match: (p) => /(^|\/)src\/components\//.test(p),
    fix: 'The component library is generator-owned (scripts/framework-generator/emit/runtime/components/). Edit the runtime source there, not the output.',
  },
  {
    match: (p) =>
      /(^|\/)src\/utils\/unique-name\.ts$/.test(p) ||
      /(^|\/)src\/config\/constants\.ts$/.test(p),
    fix: 'Generator-owned runtime helper (scripts/framework-generator/emit/runtime/) — regenerated every run. Change it there, or put app-specific helpers in a new file such as src/utils/auth.ts.',
  },
  {
    match: (p) => /(^|\/)src\/pages\/BasePage\.ts$/.test(p),
    fix: 'BasePage is generator-owned. Add the behaviour to the specific page object instead.',
  },
  {
    match: (p) => /(^|\/)tests\/auth\.setup\.ts$/.test(p),
    fix: 'Generated from the AUTH_* settings. Change .env at the repository root and regenerate.',
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
