#!/usr/bin/env node
/**
 * Fixture runner for the write guard: `node .claude/hooks/__fixtures__/run.mjs`.
 * Each case declares the rule ids it must trigger; the runner fails if the guard
 * reports fewer, more surprising, or no rules at all where none were expected.
 *
 * A case may set `materialize: true` when the rule under test reads the file
 * from disk (the AUTO-GENERATED check does, via existsSync/readFileSync) rather
 * than from the tool payload. The runner writes `content` to `path` immediately
 * before invoking the guard and removes it immediately after, so no fixture
 * leaves a file behind in the tree it is testing.
 *
 * A case may instead (or additionally) set `materializePath` / `materializeContent`
 * when the rule under test reads a *different* file from disk than the one the
 * tool call targets — `unstable-getter` walks `src/pages` for `// UNSTABLE`
 * markers while the write under test is a spec that calls the getter.
 */
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, rmSync, rmdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { CASES } from './cases.mjs';

const root = process.cwd();
let failures = 0;

/** Ancestor directories of `dir`, nearest first, that do not yet exist on disk. */
function missingAncestors(dir) {
  const missing = [];
  let current = dir;
  while (!existsSync(current)) {
    missing.push(current);
    current = dirname(current);
  }
  return missing;
}

for (const testCase of CASES) {
  const absolute = `${root}/${testCase.path}`;
  const preexisting = existsSync(absolute);
  let createdDirs = [];
  if (testCase.materialize && !preexisting) {
    createdDirs = missingAncestors(dirname(absolute));
    mkdirSync(dirname(absolute), { recursive: true });
    writeFileSync(absolute, testCase.content ?? '');
  }

  const sidecarAbsolute = testCase.materializePath ? `${root}/${testCase.materializePath}` : null;
  const sidecarPreexisting = sidecarAbsolute ? existsSync(sidecarAbsolute) : false;
  let sidecarCreatedDirs = [];
  if (sidecarAbsolute && !sidecarPreexisting) {
    sidecarCreatedDirs = missingAncestors(dirname(sidecarAbsolute));
    mkdirSync(dirname(sidecarAbsolute), { recursive: true });
    writeFileSync(sidecarAbsolute, testCase.materializeContent ?? '');
  }

  const payload = JSON.stringify({
    cwd: root,
    tool_name: testCase.tool ?? 'Write',
    tool_input: { file_path: absolute, content: testCase.content },
  });
  const run = spawnSync('node', ['.claude/hooks/guard-write.mjs'], { input: payload, encoding: 'utf8' });

  if (testCase.materialize && !preexisting) {
    rmSync(absolute, { force: true });
    // Only remove directories this run actually created, deepest first, and only
    // while they are empty — a directory another fixture also wanted into stays.
    for (const dir of createdDirs) {
      if (existsSync(dir) && readdirSync(dir).length === 0) rmdirSync(dir);
    }
  }

  if (sidecarAbsolute && !sidecarPreexisting) {
    rmSync(sidecarAbsolute, { force: true });
    for (const dir of sidecarCreatedDirs) {
      if (existsSync(dir) && readdirSync(dir).length === 0) rmdirSync(dir);
    }
  }

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
