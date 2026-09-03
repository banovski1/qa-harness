#!/usr/bin/env node
// The registry's test suite. Each fixture is a minimal app for one registry row; the assertions
// below are what proves detection generalises without cloning a real app per framework.
//
//   node scripts/repo-analyzer/__fixtures__/run.mjs

import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {collectComponents} from '../components.mjs';
import {detect} from '../detect.mjs';
import {collectRoutes} from '../routes.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));

const CASES = [
  {
    app: 'vue-spa', frontend: 'vue', backend: null,
    routeStrategy: /vue-router config/,
    routes: ['/login', '/orders/{orderId}'],
    components: ['LoginForm'],
    props: {LoginForm: ['redirectTo', 'compact']},
    testIds: ['username', 'submit'],
  },
  {
    app: 'react-router', frontend: 'react', backend: null,
    routeStrategy: /react-router config/,
    routes: ['/', '/users/{userId}'],
    components: ['UserCard', 'routes'],
    props: {UserCard: ['name', 'role', '...rest']},
    testIds: ['user-card', 'user-name'],
  },
  {
    app: 'next-app', frontend: 'next', backend: null,
    routeStrategy: /file-based router/,
    routes: ['/', '/blog/{slug}'],
    components: ['page'],
    testIds: ['home'],
  },
  {
    app: 'sveltekit', frontend: 'sveltekit', backend: null,
    routeStrategy: /file-based router/,
    routes: ['/', '/items/{id}'],
    props: {'+page': ['title']},
    testIds: ['page-title', 'item'],
  },
  {app: 'nest-api', frontend: 'unknown', backend: 'nest', endpoints: ['/api/users/:id', '/api/users']},
  {app: 'express-api', frontend: 'unknown', backend: 'express', endpoints: ['/api/widgets', '/api/widgets/:widgetId']},
  {app: 'django-api', frontend: 'unknown', backend: 'django', endpoints: ['/api/orders/', '/api/orders/<int:order_id>/']},
  {app: 'flask-api', frontend: 'unknown', backend: 'fastapi', endpoints: ['/api/health', '/api/items']},
  {app: 'unknown-app', frontend: 'unknown', backend: null, routeStrategy: null, routes: []},
];

const failures = [];
function check(label, condition, detail) {
  if (!condition) failures.push(`${label}: ${detail}`);
}

for (const testCase of CASES) {
  const appPath = path.join(HERE, testCase.app);
  const detection = detect(appPath);
  check(testCase.app, detection.frontend.framework === testCase.frontend,
    `frontend ${detection.frontend.framework} !== ${testCase.frontend}`);
  check(testCase.app, (detection.backend?.framework ?? null) === testCase.backend,
    `backend ${detection.backend?.framework ?? null} !== ${testCase.backend}`);

  const {strategy, routes} = await collectRoutes(detection);
  if (testCase.routeStrategy === null) {
    check(testCase.app, strategy === null, `expected no route strategy, got ${strategy}`);
  } else if (testCase.routeStrategy) {
    check(testCase.app, testCase.routeStrategy.test(strategy ?? ''), `route strategy ${strategy}`);
  }
  for (const expected of testCase.routes ?? []) {
    check(testCase.app, routes.some((r) => r.path === expected), `missing route ${expected} (got ${routes.map((r) => r.path).join(', ')})`);
  }

  if (testCase.endpoints) {
    const all = await detection.backend.entry.routes(detection.backend.root);
    for (const expected of testCase.endpoints) {
      check(testCase.app, all.some((r) => r.path === expected), `missing endpoint ${expected} (got ${all.map((r) => r.path).join(', ')})`);
    }
  }

  if (testCase.components || testCase.testIds || testCase.props) {
    const {components} = await collectComponents(detection);
    for (const name of testCase.components ?? []) {
      check(testCase.app, components.some((c) => c.name === name), `missing component ${name} (got ${components.map((c) => c.name).join(', ')})`);
    }
    for (const [name, props] of Object.entries(testCase.props ?? {})) {
      const found = components.find((c) => c.name === name)?.props ?? [];
      check(testCase.app, props.every((p) => found.includes(p)), `${name} props ${found.join(', ')} !== ${props.join(', ')}`);
    }
    const values = components.flatMap((c) => c.testIds.map((t) => t.value));
    for (const value of testCase.testIds ?? []) {
      check(testCase.app, values.includes(value), `missing test-id ${value} (got ${values.join(', ')})`);
    }
  }
}

if (failures.length > 0) {
  for (const failure of failures) process.stderr.write(`FAIL ${failure}\n`);
  process.exit(1);
}
process.stdout.write(`${CASES.length} fixture app(s) OK\n`);
