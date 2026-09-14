/**
 * Files no writer may touch.
 *
 * This list used to be five entries long, and every one of them existed for the same
 * reason: a second generator run would silently discard the edit. The generator runs
 * once now — the framework it writes is maintained by hand and by agents afterwards —
 * so protecting those files protects them from their own owner.
 *
 * What remains guards against a *writer*, not a generator.
 */
import { existsSync, readFileSync } from 'node:fs';

const AUTO_GENERATED = /AUTO-GENERATED/;

export function pathRules(ctx) {
  const out = [];
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
