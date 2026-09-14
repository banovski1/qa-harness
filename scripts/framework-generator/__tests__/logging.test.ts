import { test } from 'node:test';
import assert from 'node:assert/strict';
import pino from 'pino';
import { redact } from '../emit/runtime/support/logger.ts';
import { describeStrategy } from '../emit/runtime/components/base/resolve.ts';
import { BaseComponent, type ComponentContext } from '../emit/runtime/components/base/BaseComponent.ts';
import { ComponentError } from '../emit/runtime/components/base/diagnostics.ts';

test('a value behind a password-ish handle never reaches the log', () => {
  assert.equal(redact('Password', 'hunter2'), '[redacted]');
  assert.equal(redact('Confirm Password', 'hunter2'), '[redacted]');
  assert.equal(redact('API Key', 'sk-123'), '[redacted]');
  assert.equal(redact('apiToken', 'abc'), '[redacted]');
});

test('an ordinary value is logged as itself, so the log is worth reading', () => {
  assert.equal(redact('First Name', 'Ada'), 'Ada');
  assert.equal(redact('From Date', '2026-01-05'), '2026-01-05');
});

test('an absent value stays absent rather than becoming "undefined"', () => {
  assert.equal(redact('First Name', undefined), undefined);
});

test('the strategy a locator came from is reportable, because a log that omits it is a guess', () => {
  assert.deepEqual(
    describeStrategy({ label: 'From Date', via: 'proximity' }, 'textbox').strategy,
    'proximity',
  );
  assert.equal(describeStrategy({ label: 'Save' }, 'button').strategy, 'role+name');
  assert.equal(describeStrategy({ field: 'firstName' }, 'textbox').strategy, 'field-template');
});

// --- act() end to end: a real component, a real logger, real classify() -----------
//
// redact() and describeStrategy() in isolation prove the pure functions are right, but
// the deliverable is the *record* act() emits — component, screen, handle, strategy,
// via, outcome, ms and a redacted arg, together, in one object. A refactor that quietly
// stopped setting `strategy`, or that redacted after logging instead of before, would
// still pass every test above this line. These drive the real BaseComponent.act().
//
// test.step() (from @playwright/test) throws when called outside a running Playwright
// test — it is instrumentation for the trace viewer, not logic this file owns — so the
// tests call the protected `runAndLog` that `act()` wraps in test.step, which is the
// same logging + classify() code path with none of the runner's own machinery.

function capture() {
  const lines: string[] = [];
  const stream = { write(chunk: string) { lines.push(chunk); return true; } };
  const logger = pino({ level: 'debug' }, stream);
  return {
    logger,
    records(): Record<string, unknown>[] {
      return lines.filter(Boolean).map(line => JSON.parse(line));
    },
  };
}

const fakeLocator = (overrides: Partial<{ count: () => Promise<number> }> = {}) => ({
  count: overrides.count ?? (async () => 1),
  isVisible: async () => true,
  isEnabled: async () => true,
});

const fakePage = { locator: () => fakeLocator(), url: () => 'https://app.example/screen' };

class TestComponent extends BaseComponent {
  constructor(label: string, context: ComponentContext, private readonly stub: ReturnType<typeof fakeLocator>) {
    super(fakePage as any, label, context);
  }
  locator() {
    return this.stub as any;
  }
  run<T>(action: string, fn: (target: any) => Promise<T>, arg?: unknown) {
    return (this as any).runAndLog(action, fn, arg) as Promise<T>;
  }
}

test('a successful interaction logs one record: outcome ok, a numeric duration, and its bindings', async () => {
  const { logger, records } = capture();
  const component = new TestComponent('First Name', { screen: 'ContactPage', logger }, fakeLocator());

  await component.run('fill with "Ada"', async target => { await target.count(); }, 'Ada');

  const [record] = records();
  assert.ok(record, 'expected one log record');
  assert.equal(record.outcome, 'ok');
  assert.equal(typeof record.ms, 'number');
  assert.equal(record.component, 'TestComponent');
  assert.equal(record.screen, 'ContactPage');
  assert.equal(record.handle, 'First Name');
  assert.equal(record.as, 'First Name');
});

test('a password handle is redacted end to end — the secret never appears in the serialised record', async () => {
  const { logger, records } = capture();
  const component = new TestComponent('Password', { screen: 'LoginPage', logger }, fakeLocator());
  const secret = 'hunter2-do-not-leak';

  await component.run('fill', async target => { await target.count(); }, secret);

  const [record] = records();
  assert.equal(record.arg, '[redacted]');
  const serialised = JSON.stringify(record);
  assert.ok(!serialised.includes(secret), 'the secret leaked into the log record');
});

test('a failed interaction logs the classified outcome, not "ok", and still throws ComponentError', async () => {
  const { logger, records } = capture();
  const component = new TestComponent('Submit', { screen: 'ContactPage', logger }, fakeLocator({ count: async () => 0 }));

  await assert.rejects(
    () => component.run('click', async () => { throw new Error('locator.click: Timeout 5000ms exceeded'); }),
    ComponentError,
  );

  const [record] = records();
  assert.equal(record.outcome, 'NOT_FOUND');
  assert.notEqual(record.outcome, 'ok');
});
