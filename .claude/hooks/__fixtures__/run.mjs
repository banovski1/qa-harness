#!/usr/bin/env node
/**
 * Fixture runner for the write guard: `node .claude/hooks/__fixtures__/run.mjs`.
 * Each case declares the rule ids it must trigger; the runner fails if the guard
 * reports fewer, more surprising, or no rules at all where none were expected.
 */
import { spawnSync } from 'node:child_process';
import { CASES } from './cases.mjs';

const root = process.cwd();
let failures = 0;

for (const testCase of CASES) {
  const payload = JSON.stringify({
    cwd: root,
    tool_name: testCase.tool ?? 'Write',
    tool_input: { file_path: `${root}/${testCase.path}`, content: testCase.content },
  });
  const run = spawnSync('node', ['.claude/hooks/guard-write.mjs'], { input: payload, encoding: 'utf8' });
  const reported = [...new Set([...run.stderr.matchAll(/\[([a-z-]+)\]/g)].map((m) => m[1]))].sort();
  const expected = [...testCase.expect].sort();
  const ok =
    reported.length === expected.length && reported.every((r, i) => r === expected[i]) &&
    run.status === (expected.length ? 2 : 0);

  if (!ok) {
    failures += 1;
    console.error(`FAIL ${testCase.name}`);
    console.error(`  expected [${expected.join(', ')}] exit ${expected.length ? 2 : 0}`);
    console.error(`  got      [${reported.join(', ')}] exit ${run.status}`);
    if (run.stderr) console.error(run.stderr.replace(/^/gm, '    '));
  } else {
    console.log(`ok   ${testCase.name}`);
  }
}

console.log(`\n${CASES.length - failures}/${CASES.length} fixtures passed`);
process.exit(failures ? 1 : 0);
