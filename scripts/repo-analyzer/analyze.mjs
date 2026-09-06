#!/usr/bin/env node
// Run the repo analyzer stages in their required order from one command.

import {spawnSync} from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {parseArgs, REPO_ROOT} from './util.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const TSX_CLI = fileURLToPath(import.meta.resolve('tsx/cli'));

export function analyzerPlan(args) {
  const liveUrlArgs = [];
  if (args.pathPrefix) liveUrlArgs.push('--path-prefix', String(args.pathPrefix));

  return [
    {name: 'detect', args: [TSX_CLI, path.join(HERE, 'detect.mjs')]},
    {name: 'routes', args: [TSX_CLI, path.join(HERE, 'routes.mjs')]},
    {name: 'components', args: [TSX_CLI, path.join(HERE, 'components.mjs')]},
    {name: 'api-docs', args: [TSX_CLI, path.join(HERE, 'api-docs.mjs')]},
    {name: 'live-urls', args: [TSX_CLI, path.join(HERE, 'live-urls.mjs'), ...liveUrlArgs]},
  ];
}

function run() {
  const args = parseArgs();
  for (const step of analyzerPlan(args)) {
    process.stderr.write(`[repo-analyzer] ${step.name}\n`);
    const result = spawnSync(process.execPath, step.args, {cwd: REPO_ROOT, stdio: 'inherit'});
    if (result.status !== 0) return result.status ?? 1;
  }
  return 0;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  process.exit(run());
}
