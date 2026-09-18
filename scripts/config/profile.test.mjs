import assert from 'node:assert/strict';
import test from 'node:test';

import * as profile from './profile.mjs';

test('credential references resolve from the loaded env rather than process.env', () => {
  assert.equal(typeof profile.resolveEnvValue, 'function');
  assert.equal(
    profile.resolveEnvValue('env:APP_USERNAME', {APP_USERNAME: 'Admin'}),
    'Admin',
  );
  assert.equal(profile.resolveEnvValue('literal', {APP_USERNAME: 'Admin'}), 'literal');
});
