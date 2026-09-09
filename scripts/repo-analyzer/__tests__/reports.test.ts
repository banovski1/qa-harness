// The reports themselves. Everything else in this suite asserts the data an analyzer returns;
// this file asserts the markdown it actually writes, because that file is the deliverable and a
// refactor can preserve every return value while quietly changing what lands in `analysis/`.
//
// Snapshots live in `__tests__/snapshots/`. To accept an intentional format change:
//
//   UPDATE_SNAPSHOTS=1 npm test --prefix scripts/repo-analyzer
//
// which rewrites them, so the change shows up as a reviewable diff rather than a hand edit.

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import {fileURLToPath} from 'node:url';
import {mergeByPath, renderApiDocs, tierA, tierB} from '../api-docs.js';
import {collectComponents, renderComponents} from '../components.js';
import {KIND_TEMPLATES} from '../elements.js';
import {detect} from '../detect.js';
import {joinUrl, renderLiveUrls} from '../live-urls.js';
import {collectRoutes, renderRoutes} from '../routes.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES = path.join(HERE, '..', '__fixtures__');
const SNAPSHOTS = path.join(HERE, 'snapshots');
const UPDATE = process.env.UPDATE_SNAPSHOTS === '1';

const BASE_URL = 'https://app.test';

// vue-spa: a client router. symfony-app: server routing through a controller bridge.
// next-app: a file-based router. unknown-app: the "nothing matched" report, which is the one most
// likely to decay into an empty file without anyone noticing. angular-app: the class-instance AST,
// an inline template and a templateUrl one, and a nested-JSON label catalogue.
const APPS = ['vue-spa', 'symfony-app', 'next-app', 'unknown-app', 'angular-app'];

/** Drop the two lines that legitimately change on every run, and the machine-specific app path. */
function stableise(body: string) {
  return body
    .replace(/^- \*\*Generated\*\*: .*$/gm, '- **Generated**: <timestamp>')
    .replace(/ @ `[^`]*`/g, ' @ `<sha>`')
    .replace(new RegExp(FIXTURES.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '<fixtures>')
    .replace(/<fixtures>[^\s`]*/g, (match) => match.replace(/\\/g, '/'));
}

function compare(name: string, body: string) {
  const file = path.join(SNAPSHOTS, `${name}.md`);
  const actual = stableise(body);
  if (UPDATE || !fs.existsSync(file)) {
    fs.mkdirSync(SNAPSHOTS, {recursive: true});
    fs.writeFileSync(file, actual, 'utf8');
    return;
  }
  assert.equal(actual, fs.readFileSync(file, 'utf8'), `${name}.md changed — re-run with UPDATE_SNAPSHOTS=1 to accept`);
}

for (const app of APPS) {
  test(`${app} reports`, async (t) => {
    const appPath = path.join(FIXTURES, app);
    const detection = detect(appPath);
    const routes = await collectRoutes(detection);

    await t.test('frontend-components.md', async () => {
      // Pinned for the same reason as in analyzers.test.ts: a snapshot must not change because
      // a config file outside this suite changed.
      compare(`${app}.frontend-components`, renderComponents(detection, await collectComponents(detection, {templateFor: KIND_TEMPLATES})));
    });

    await t.test('pages-and-routes.md', () => {
      compare(`${app}.pages-and-routes`, renderRoutes(detection, routes, '/api'));
    });

    await t.test('api-documentation.md', async () => {
      const result = tierA(appPath) ?? (await tierB(detection, '/api'));
      compare(`${app}.api-documentation`, renderApiDocs(detection, result, '/api', null));
    });

    await t.test('live-urls.md', () => {
      const rows = routes.routes
        .map((route) => ({...route, url: joinUrl(BASE_URL, '', route.path)}))
        .sort((a, b) => a.url.localeCompare(b.url));
      const source = {app: detection.appPath, strategy: routes.strategy, from: 'analysis/pages-and-routes.json'};
      compare(`${app}.live-urls`, renderLiveUrls(source, BASE_URL, '', rows));
    });
  });
}

test('a snapshot never records an empty report', () => {
  for (const file of fs.readdirSync(SNAPSHOTS)) {
    const body = fs.readFileSync(path.join(SNAPSHOTS, file), 'utf8');
    assert.ok(body.trim().length > 200, `${file} is too short to be a real report`);
    assert.match(body, /^# /m, `${file} has no title`);
  }
});
