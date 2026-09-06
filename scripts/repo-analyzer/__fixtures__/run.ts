#!/usr/bin/env node
// The analyzer's test suite, kept at its documented path. The assertions themselves live in
// `../__tests__/` and the expectations in `./cases.mjs`; this is a thin wrapper so there is one
// implementation rather than two that can disagree.
//
//   node scripts/repo-analyzer/__fixtures__/run.mjs
//   cd scripts/repo-analyzer && npm test        # the same thing

import {spawnSync} from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const tests = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '__tests__');
const tsxCli = fileURLToPath(import.meta.resolve('tsx/cli'));
const run = spawnSync(process.execPath, [tsxCli, '--test', path.join(tests, '*.test.ts')], {stdio: 'inherit'});
process.exit(run.status ?? 1);
