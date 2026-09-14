#!/usr/bin/env node
// Probes the usual specification locations from inside the authenticated page,
// so a spec behind a session cookie is still reachable. Writes
// api.spec.discovery whether or not one answers: "nothing answered" is a
// finding the API report states, not an omission.
import { execFile } from 'node:child_process';
import { readFile, writeFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { promisify } from 'node:util';
import { loadProfile, ROOT } from '../../../../scripts/config/profile.mjs';

const run = promisify(execFile);

const CANDIDATES = [
  '/swagger.json', '/openapi.json', '/api-docs', '/api-docs.json',
  '/api/openapi.json', '/api/v1/openapi.json', '/api/swagger.json',
  '/v3/api-docs', '/swagger/v1/swagger.json', '/openapi.yaml',
];

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const at = args.indexOf('--' + name);
  return at === -1 ? fallback : args[at + 1];
};

const profile = loadProfile();
const outDir = ROOT;
const session = flag('session', profile.session || 'app-explorer');
const candidates = [...CANDIDATES, ...(profile.specCandidates || [])];

const script = `async page => {
  const base = ${JSON.stringify(profile.baseUrl)};
  const candidates = ${JSON.stringify(candidates)};
  return page.evaluate(async input => {
    const origin = new URL(input.base).origin;
    const results = [];
    for (const path of input.candidates) {
      const url = origin + path;
      try {
        const response = await fetch(url, { credentials: 'include' });
        if (!response.ok) { results.push({ url, status: response.status }); continue; }
        const text = await response.text();
        let document = null;
        try { document = JSON.parse(text); } catch (e) { document = null; }
        if (!document || (!document.paths && !document.swagger && !document.openapi)) {
          results.push({ url, status: response.status, note: 'answered, but not a specification' });
          continue;
        }
        results.push({
          url,
          status: response.status,
          found: true,
          title: (document.info && document.info.title) || null,
          version: document.openapi || document.swagger || null,
          paths: Object.entries(document.paths || {}).map(([p, methods]) => ({
            path: p,
            methods: Object.keys(methods).map(m => m.toUpperCase()),
          })),
        });
        break;
      } catch (e) {
        results.push({ url, error: String(e.message).slice(0, 120) });
      }
    }
    return { probes: results };
  }, { base, candidates });
}`;

const scriptFile = join(outDir, '.probe.js');
await writeFile(scriptFile, script, 'utf8');
const { stdout } = await run('playwright-cli', ['-s=' + session, '--raw', 'run-code', '--filename=' + scriptFile], {
  maxBuffer: 64 * 1024 * 1024,
});
await rm(scriptFile, { force: true });

const start = stdout.indexOf('{');
const payload = start === -1 ? { probes: [] } : JSON.parse(stdout.slice(start, stdout.lastIndexOf('}') + 1));
const hit = (payload.probes || []).find((probe) => probe.found);
const discovery = hit
  ? { ...hit, probedAt: new Date().toISOString(), probes: payload.probes }
  : { found: false, probedAt: new Date().toISOString(), probes: payload.probes };

// Into the one artifact, under the section that owns the specification. A probe that
// found nothing is still evidence, and it belongs beside the claim it qualifies.
{
  const path = join(outDir, 'analysis.json');
  const analysis = existsSync(path) ? JSON.parse(await readFile(path, 'utf8')) : {};
  analysis.api = analysis.api ?? {};
  analysis.api.spec = { ...(analysis.api.spec ?? {}), discovery };
  await writeFile(path, JSON.stringify(analysis, null, 2) + '\n');
}
console.log('[probe-openapi]', hit ? 'specification found at ' + hit.url : 'no specification answered');
