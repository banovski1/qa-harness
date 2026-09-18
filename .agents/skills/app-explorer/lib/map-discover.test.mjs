import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import test from 'node:test';

test('discovery waits for the post-login marker before reading navigation', async () => {
  const template = await readFile(new URL('./map-discover.js', import.meta.url), 'utf8');
  const config = {
    auth: {
      loginUrl: 'https://example.test/login',
      readyWhen: '.app-ready',
      steps: [{action: 'click', selector: 'button'}],
    },
    settleTimeout: 10,
    navTimeout: 10,
    sampleMs: 1,
    maxSamples: 1,
    quietSamples: 1,
  };
  const source = template
    .replace('__CONFIG__', JSON.stringify(config))
    .replace('__EXTRACTOR_SRC__', JSON.stringify('function __mapNav() { return {primary: {items: []}, secondary: {items: []}}; }'));
  const discover = (0, eval)(`(${source})`);

  let readyChecks = 0;
  let evaluations = 0;
  const page = {
    goto: async () => {},
    waitForLoadState: async () => {},
    locator: selector => ({
      first() { return this; },
      async waitFor() {
        if (selector === '.app-ready' && ++readyChecks === 1) throw new Error('not logged in yet');
      },
      async click() {},
    }),
    async evaluate() {
      evaluations++;
      if (evaluations === 3 && readyChecks < 2) throw new Error('Execution context was destroyed');
      return evaluations < 3 ? true : {primary: {items: []}, secondary: {items: []}};
    },
    url: () => 'https://example.test/dashboard',
  };

  const result = await discover(page);
  assert.equal(result.ok, true);
  assert.equal(readyChecks, 2);
});
