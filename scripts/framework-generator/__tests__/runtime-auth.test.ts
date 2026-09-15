/**
 * The emitted runtime's CSRF reader.
 *
 * This exists because the first version of it shipped without the alias loop and every
 * generated test failed at login: OrangeHRM asks for a field called `_token` and
 * publishes it as a `:token` prop, so searching for the field name verbatim finds
 * nothing. The round-trip gate caught it — before any human wrote a spec — and this
 * test is what stops it coming back.
 *
 * `scripts/api-auth/http.ts` solves the same problem for the pipeline side. The two
 * implementations are deliberately separate (one runs on fetch, one on Playwright's
 * request context), so the cases below are kept in step by hand.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { csrfFrom } from '../emit/runtime/support/authenticate.ts';

test('a Vue prop carrying an entity-encoded, JSON-quoted token — the OrangeHRM shape', () => {
  const html = `<div id="app"><orangehrm-login :token="&quot;abc123DEF&quot;"></orangehrm-login></div>`;
  assert.equal(csrfFrom(html, '_token'), 'abc123DEF');
});

test('a plain hidden input, in either attribute order', () => {
  assert.equal(csrfFrom(`<input type="hidden" name="_token" value="tok-1">`, '_token'), 'tok-1');
  assert.equal(csrfFrom(`<input value="tok-2" name="_token" type="hidden">`, '_token'), 'tok-2');
});

test('a meta tag, which is where most frameworks put it', () => {
  assert.equal(csrfFrom(`<meta name="csrf-token" content="meta-tok">`, '_token'), 'meta-tok');
});

test('a key inside an inlined JSON blob', () => {
  assert.equal(csrfFrom(`<script>window.__DATA__ = {"_token": "json-tok"};</script>`, '_token'), 'json-tok');
});

test('a page with no token at all is reported as having none', () => {
  assert.equal(csrfFrom('<html><body>Signed out</body></html>', '_token'), null);
});

test('an empty value does not count as a token', () => {
  assert.equal(csrfFrom(`<input name="_token" value="">`, '_token'), null);
});
