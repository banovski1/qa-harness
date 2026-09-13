import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseActions, routesIn, requestsIn, redact } from '../build-session-doc.ts';

const CODE = `
await page.goto('https://app.test/web/index.php/leave/applyLeave');
await page.getByRole('combobox', { name: 'Leave Type' }).click();
await page.getByLabel('From Date').fill('2026-01-01');
await page.getByRole('button', { name: 'Apply' }).click();
await page.goto('https://app.test/web/index.php/leave/viewMyLeaveList');
`;

test('the emitted code becomes an ordered list of steps', () => {
  const steps = parseActions(CODE);
  assert.deepEqual(steps.map(s => s.action), ['goto', 'click', 'fill', 'click', 'goto']);
  assert.equal(steps[1].rawLocator, "getByRole('combobox', { name: 'Leave Type' })");
  assert.equal(steps[2].value, '2026-01-01');
});

test('a chained locator survives intact', () => {
  // `getByRole(...).getByRole(...)` is one locator, not two, and splitting it would
  // produce a handle that addresses the wrong element.
  const steps = parseActions(
    `await page.getByRole('row', { name: 'Ada' }).getByRole('button', { name: 'Edit' }).click();`,
  );
  assert.equal(steps.length, 1);
  assert.equal(steps[0].rawLocator, "getByRole('row', { name: 'Ada' }).getByRole('button', { name: 'Edit' })");
});

test('selectOption is a select and dblclick is a click', () => {
  const steps = parseActions(`
await page.getByLabel('Status').selectOption('Active');
await page.getByRole('cell', { name: 'Ada' }).dblclick();
`);
  assert.deepEqual(steps.map(s => s.action), ['select', 'click']);
  assert.equal(steps[0].value, 'Active');
});

test('a route visited twice is one route', () => {
  const routes = routesIn(parseActions(`
await page.goto('https://app.test/a');
await page.goto('https://app.test/b');
await page.goto('https://app.test/a');
`), 'https://app.test/');
  assert.deepEqual(routes.map(r => r.path), ['/a', '/b']);
});

test('static assets and other origins are not API evidence', () => {
  const requests = requestsIn([
    { url: 'https://app.test/api/v2/leave', method: 'POST', status: 201, resourceType: 'xhr',
      postData: '{"toDate":"2026-01-02","fromDate":"2026-01-01"}' },
    { url: 'https://app.test/assets/app.css', method: 'GET', status: 200, resourceType: 'stylesheet' },
    { url: 'https://cdn.other.test/lib.js', method: 'GET', status: 200, resourceType: 'script' },
  ], 'https://app.test/');

  assert.equal(requests.length, 1);
  assert.equal(requests[0].path, '/api/v2/leave');
  // Keys, sorted — a shape is reusable, and the dates this human picked are theirs.
  assert.deepEqual(requests[0].requestShape, ['fromDate', 'toDate']);
});

test('the same endpoint called twice is recorded once', () => {
  const requests = requestsIn([
    { url: 'https://app.test/api/v2/leave', method: 'GET', status: 200, resourceType: 'xhr' },
    { url: 'https://app.test/api/v2/leave', method: 'GET', status: 200, resourceType: 'xhr' },
  ], 'https://app.test/');
  assert.equal(requests.length, 1);
});

test('credentials never reach the committed file', () => {
  const env = { APP_USERNAME: 'Admin', APP_PASSWORD: 'admin123' };
  const out = redact(`await page.getByLabel('Password').fill('admin123');`, env);
  assert.ok(!out.includes('admin123'));
  assert.ok(out.includes('«APP_PASSWORD»'));
});

test('a credential too short to redact safely is left alone rather than mangling the file', () => {
  const out = redact('a quick brown fox', { APP_USERNAME: 'a', APP_PASSWORD: '' });
  assert.equal(out, 'a quick brown fox');
});
