#!/usr/bin/env node
// The crawl driver. Owns the queue, the budget and the artifacts; the browser is
// only ever touched through `playwright-cli run-code`, one bounded batch at a
// time, so an interrupted run resumes instead of restarting.
import { execFile } from 'node:child_process';
import { mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { promisify } from 'node:util';
import { parseYaml } from './yaml-lite.mjs';
import { buildBundle } from './build-bundle.mjs';
import { renderReports } from './render-reports.mjs';

const run = promisify(execFile);

const DEFAULTS = {
  testIdAttribute: 'data-testid',
  settleTimeout: 8000,
  navTimeout: 30000,
  sampleMs: 150,
  maxSamples: 40,
  quietSamples: 3,
  batchSize: 6,
};

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const at = args.indexOf('--' + name);
  return at === -1 ? fallback : args[at + 1];
};
const has = (name) => args.includes('--' + name);

const profilePath = flag('profile');
if (!profilePath) {
  console.error('usage: explore.mjs --profile <app-analysis/<app>/app-profile.yaml> [--session <name>] [--resume] [--reports-only]');
  process.exit(2);
}

const profile = parseYaml(await readFile(profilePath, 'utf8'));
const outDir = dirname(profilePath);
const screensDir = join(outDir, 'screens');
const statePath = join(outDir, 'crawl-state.json');
const networkPath = join(outDir, 'network.json');
const session = flag('session', profile.session || 'app-explorer');
const budget = profile.budget || {};
const maxScreens = Number(flag('max-screens', budget.maxScreens || 60));
const settings = { ...DEFAULTS, ...(profile.settings || {}) };
const batchSize = Number(flag('batch-size', settings.batchSize));

const log = (...parts) => console.log('[explore]', ...parts);

// A route's identity is its path with record ids replaced by a slot, so a list of
// a thousand contacts contributes one detail screen rather than a thousand.
const ID_PATTERNS = [
  /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi,
  /\b[0-9a-f]{16,}\b/gi,
  /\b\d{3,}\b/g,
];

function templatize(url) {
  let out = url;
  for (const pattern of ID_PATTERNS) out = out.replace(pattern, '{id}');
  return out;
}

function routeId(url, baseUrl) {
  const relative = templatize(url).replace(baseUrl.replace(/\/$/, ''), '') || '/';
  const slug = relative.replace(/^[/#?]+/, '').replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return slug || 'root';
}

function sameApp(url, baseUrl) {
  try {
    return new URL(url).origin === new URL(baseUrl).origin;
  } catch {
    return false;
  }
}

function excluded(url, patterns) {
  return (patterns || []).some((pattern) => new RegExp(pattern).test(url));
}

async function loadState() {
  if (has('resume') && existsSync(statePath)) {
    return JSON.parse(await readFile(statePath, 'utf8'));
  }
  const seeds = [
    profile.baseUrl,
    ...(profile.seedRoutes || []).map((route) =>
      String(route).startsWith('http') ? route : profile.baseUrl.replace(/\/$/, '') + route),
  ];
  const pending = [];
  const seen = new Set();
  for (const url of seeds) {
    const id = routeId(url, profile.baseUrl);
    if (seen.has(id)) continue;
    seen.add(id);
    pending.push({ id, url, depth: 0 });
  }
  // `queued` records every id the crawl has ever taken an interest in. Without
  // it, a screen that is in flight — spliced out of `pending` but not yet
  // visited — gets enqueued a second time by whatever links to it.
  const queued = Object.fromEntries(pending.map((target) => [target.id, true]));
  return { pending, queued, visited: {}, failed: {}, authenticated: false, startedAt: new Date().toISOString() };
}

async function saveState(state) {
  await writeFile(statePath, JSON.stringify(state, null, 2));
}

async function runBatch(config) {
  const bundleFile = join(outDir, '.batch.js');
  await buildBundle({ config, outFile: bundleFile });
  let stdout;
  try {
    ({ stdout } = await run('playwright-cli', ['-s=' + session, '--raw', 'run-code', '--filename=' + bundleFile], {
      maxBuffer: 256 * 1024 * 1024,
    }));
  } catch (error) {
    throw new Error(`${error.message}\n${(error.stdout || '').slice(0, 800)}\n${(error.stderr || '').slice(0, 800)}`);
  }
  await rm(bundleFile, { force: true });
  const start = stdout.indexOf('{');
  if (start === -1) throw new Error('run-code returned no JSON:\n' + stdout.slice(0, 500));
  return JSON.parse(stdout.slice(start, stdout.lastIndexOf('}') + 1));
}

await mkdir(screensDir, { recursive: true });

if (has('reports-only')) {
  await renderReports({ outDir, profile });
  log('reports rendered from existing screens/');
  process.exit(0);
}

const state = await loadState();
const network = existsSync(networkPath) && has('resume')
  ? JSON.parse(await readFile(networkPath, 'utf8'))
  : [];

// Credentials are read from the environment at the last moment, so neither the
// profile nor any artifact ever carries one.
const authConfig = profile.auth
  ? {
    loginUrl: profile.auth.loginUrl || profile.baseUrl,
    steps: (profile.auth.steps || []).map((step) => ({
      ...step,
      value: typeof step.value === 'string' && step.value.startsWith('env:')
        ? (process.env[step.value.slice(4)] ?? '')
        : step.value,
    })),
    readyWhen: profile.auth.readyWhen || null,
  }
  : null;

let batches = 0;
let consecutiveFailures = 0;
while (state.pending.length && Object.keys(state.visited).length < maxScreens) {
  // A crawl that cannot reach the browser at all should stop and say so rather
  // than burn the whole queue producing identical failures.
  if (consecutiveFailures >= 3) {
    log('three batches failed in a row — stopping. See crawl-state.json for the reason.');
    break;
  }
  const targets = state.pending.splice(0, batchSize);
  const config = {
    targets: targets.map((t) => ({ id: t.id, url: t.url })),
    auth: state.authenticated ? null : authConfig,
    testIdAttribute: settings.testIdAttribute,
    contentSelector: settings.contentSelector || null,
    settleTimeout: settings.settleTimeout,
    navTimeout: settings.navTimeout,
    sampleMs: settings.sampleMs,
    maxSamples: settings.maxSamples,
    quietSamples: settings.quietSamples,
  };
  log(`batch ${++batches}: ${targets.map((t) => t.id).join(', ')}`);
  let batch;
  try {
    batch = await runBatch(config);
  } catch (error) {
    for (const target of targets) {
      state.failed[target.id] = { url: target.url, error: String(error.message).slice(0, 400) };
    }
    await saveState(state);
    consecutiveFailures++;
    log('batch failed:', error.message);
    continue;
  }
  consecutiveFailures = 0;
  if (batch.authenticated === false) {
    await saveState(state);
    throw new Error('authentication failed: ' + (batch.error || JSON.stringify(batch.results).slice(0, 300)));
  }
  state.authenticated = true;

  for (const entry of batch.network || []) network.push(entry);

  for (const result of batch.results) {
    if (!result.ok) {
      state.failed[result.target] = { url: result.url, error: result.error, settled: result.settled };
      continue;
    }
    const depth = (targets.find((t) => t.id === result.target) || {}).depth || 0;
    state.visited[result.target] = {
      url: result.url,
      title: result.screen.title,
      settled: result.settled,
      stats: result.screen.stats,
      depth,
    };
    await writeFile(join(screensDir, result.target + '.json'), JSON.stringify(result.screen, null, 2));

    if (depth >= Number(budget.maxDepth ?? 3)) continue;
    for (const link of result.screen.links) {
      const absolute = link.resolved;
      if (!absolute || !sameApp(absolute, profile.baseUrl)) continue;
      if (excluded(absolute, profile.exclude)) continue;
      const id = routeId(absolute, profile.baseUrl);
      if (state.queued[id]) continue;
      if (Object.keys(state.queued).length >= maxScreens) break;
      state.queued[id] = true;
      state.pending.push({ id, url: absolute, depth: depth + 1 });
    }
  }
  await saveState(state);
  await writeFile(networkPath, JSON.stringify(network, null, 2));
}

state.finishedAt = new Date().toISOString();
await saveState(state);
await writeFile(networkPath, JSON.stringify(network, null, 2));
log(`crawled ${Object.keys(state.visited).length} screens, ${Object.keys(state.failed).length} failed`);

await renderReports({ outDir, profile });
log('reports written to', outDir);
