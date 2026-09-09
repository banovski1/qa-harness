// Each analyzer against every fixture app, one test per app so a failure names the framework that
// broke. The expectations live in `__fixtures__/cases.ts`; this file is only the harness.
//
//   npm test --prefix scripts/repo-analyzer

import assert from 'node:assert/strict';
import path from 'node:path';
import test from 'node:test';
import {fileURLToPath} from 'node:url';
import {mergeByPath, tierA, tierB} from '../api-docs.js';
import {buildLabelDictionary, collectComponents} from '../components.js';
import {KIND_TEMPLATES} from '../elements.js';
import {detect} from '../detect.js';
import {joinUrl} from '../live-urls.js';
import {collectRoutes} from '../routes.js';
import {rel} from '../util.js';
import {CASES} from '../__fixtures__/cases.js';

const FIXTURES = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '__fixtures__');

for (const testCase of CASES) {
  test(testCase.app, async (t) => {
    const appPath = path.join(FIXTURES, testCase.app);
    const detection = detect(appPath);

    await t.test('detects the framework', () => {
      assert.equal(detection.frontend.framework, testCase.frontend);
      assert.equal(detection.backend?.framework ?? null, testCase.backend);
      assert.ok(detection.evidence.length > 0, 'detection must always say why');
      if (testCase.frontendRoot) {
        assert.equal(rel(appPath, detection.frontend.root), testCase.frontendRoot);
      }
    });

    const {strategy, routes} = await collectRoutes(detection);

    await t.test('extracts routes', () => {
      if (testCase.routeStrategy === null) {
        assert.equal(strategy, null);
      } else if (testCase.routeStrategy) {
        assert.match(strategy ?? '', testCase.routeStrategy);
      }
      const found = routes.map((route) => route.path);
      for (const expected of testCase.routes ?? []) {
        assert.ok(found.includes(expected), `missing route ${expected} (got ${found.join(', ')})`);
      }
      // The one place an absence is asserted: a path only a broken traversal could reach.
      for (const unwanted of testCase.routesAbsent ?? []) {
        assert.ok(!found.includes(unwanted), `route ${unwanted} should not exist (got ${found.join(', ')})`);
      }
      for (const [routePath, component] of Object.entries(testCase.renders ?? {})) {
        assert.equal(routes.find((route) => route.path === routePath)?.component, component);
      }
      // A declared parameter must survive into the route row, or Skill C loses the placeholder.
      for (const route of routes) {
        const declared = [...route.path.matchAll(/\{([^}*?]+)[*?]?\}/g)].map((m) => m[1]);
        assert.deepEqual(route.params, declared, `params of ${route.path}`);
      }
    });

    if (testCase.components || testCase.testIds || testCase.props || testCase.elements) {
      await t.test('parses components', async () => {
        // The full template table, so a rung-4 expectation tests the extractor rather than
        // whatever `locatorTemplates:` happens to hold in the generator config right now.
        const {components, errors} = await collectComponents(detection, {templateFor: KIND_TEMPLATES});
        assert.deepEqual(errors, [], 'a parser that throws degrades quietly into this list');
        const names = components.map((component) => component.name);
        for (const name of testCase.components ?? []) {
          assert.ok(names.includes(name), `missing component ${name} (got ${names.join(', ')})`);
        }
        for (const [name, props] of Object.entries(testCase.props ?? {})) {
          const found = components.find((component) => component.name === name)?.props ?? [];
          for (const prop of props) assert.ok(found.includes(prop), `${name} is missing prop ${prop} (got ${found.join(', ')})`);
        }
        const values = components.flatMap((component) => component.testIds.map((hit) => hit.value));
        for (const value of testCase.testIds ?? []) {
          assert.ok(values.includes(value), `missing test-id ${value} (got ${values.join(', ')})`);
        }
        // Presence alone would miss a value found *twice* — e.g. a structural-directive host
        // duplicating its attributes onto the element it wraps — so a count pins that too.
        for (const [value, count] of Object.entries(testCase.testIdCounts ?? {})) {
          assert.equal(values.filter((v) => v === value).length, count, `${value} test-id hit count`);
        }

        const extracted = components.flatMap((component) => component.elements ?? []);
        for (const expected of testCase.elements ?? []) {
          const found = extracted.find((element) => element.name === expected.name);
          assert.ok(found, `missing element ${expected.name} (got ${extracted.map((e) => e.name).join(', ')})`);
          assert.equal(found.component, expected.component, `${expected.name} kind`);
          assert.equal(found.rung, expected.rung, `${expected.name} landed on the wrong ladder rung`);
          if (expected.locator) {
            assert.equal(found.locator.strategy, expected.locator.strategy, `${expected.name} strategy`);
            assert.deepEqual(found.locator.args, expected.locator.args, `${expected.name} args`);
            if (expected.locator.name) assert.equal(found.locator.name, expected.locator.name, `${expected.name} locator name`);
          }
        }

        // The join, not either half of it: extracted elements only reach a spec through here, and
        // a route whose component stayed a class name leaves the dictionary silently empty.
        const dictionary = buildLabelDictionary(components, routes);
        for (const [routePath, names] of Object.entries(testCase.labelDictionary ?? {})) {
          const carried = (dictionary[routePath]?.elements ?? []).map((element) => element.name);
          for (const name of names) {
            assert.ok(carried.includes(name), `label dictionary ${routePath} is missing ${name} (got ${carried.join(', ') || 'nothing'})`);
          }
        }
      });
    }

    if (testCase.endpoints) {
      await t.test('the backend registry row returns its routes', async () => {
        const all = await detection.backend!.entry.routes(detection.backend!.root);
        const found = all.map((route) => route.path);
        for (const expected of testCase.endpoints!) {
          assert.ok(found.includes(expected), `missing endpoint ${expected} (got ${found.join(', ')})`);
        }
        // A mapping only a silent parser regression could produce — a commented-out annotation
        // read as live, or an unresolvable class-level base composed onto its methods anyway.
        for (const absent of testCase.endpointsAbsent ?? []) {
          assert.ok(!found.includes(absent), `endpoint ${absent} should not have been extracted (got ${found.join(', ')})`);
        }
        // The classification itself, not just its side effects: a typo in the return-type chain
        // makes everything read `api`, and Tier B's prefix clause can mask that for a page route.
        for (const [routePath, kind] of Object.entries(testCase.endpointKinds ?? {})) {
          assert.equal(all.find((route) => route.path === routePath)?.kind, kind, `${routePath} kind`);
        }
        // A verb read from a `method =` attribute, not defaulted to ANY because the attribute
        // wasn't the first one written.
        for (const [routePath, methods] of Object.entries(testCase.endpointMethods ?? {})) {
          assert.deepEqual(all.find((route) => route.path === routePath)?.methods, methods, `${routePath} methods`);
        }
      });
    }

    if (testCase.tier) {
      await t.test(`api-docs resolves to tier ${testCase.tier}`, async () => {
        const result = tierA(appPath) ?? (await tierB(detection, '/api'));
        assert.equal(result?.tier ?? 'C', testCase.tier);
        const found = mergeByPath(result?.endpoints ?? []).map((endpoint) => endpoint.path);
        for (const expected of testCase.apiPaths ?? []) {
          assert.ok(found.includes(expected), `missing endpoint ${expected} (got ${found.join(', ')})`);
        }
        // Tier A is authoritative and stops the ladder: nothing from Tier B may leak in beside it.
        for (const absent of testCase.apiPathsAbsent ?? []) {
          assert.ok(!found.includes(absent), `${absent} should not have been reached`);
        }
      });
    }

    await t.test('live URLs keep dynamic segments as placeholders', () => {
      for (const route of routes) {
        const url = joinUrl('https://app.test', '', route.path);
        assert.ok(url.startsWith('https://app.test/'));
        for (const param of route.params) {
          assert.ok(url.includes(`{${param}}`), `${url} lost the ${param} placeholder`);
        }
      }
    });
  });
}
