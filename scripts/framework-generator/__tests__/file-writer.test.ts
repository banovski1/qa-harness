import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { FileWriter, assertOutputEmpty } from '../file-writer.ts';

const scratch = () => mkdtempSync(join(tmpdir(), 'fw-'));

test('a missing output directory is empty enough to generate into', () => {
  assert.doesNotThrow(() => assertOutputEmpty(join(scratch(), 'generated-framework')));
});

test('a directory holding only run output is still empty enough', () => {
  const dir = scratch();
  for (const ignorable of ['node_modules', 'test-results', 'playwright-report', '.auth']) {
    mkdirSync(join(dir, ignorable), { recursive: true });
  }
  assert.doesNotThrow(() => assertOutputEmpty(dir));
});

test('an existing framework is a hard stop that names itself', () => {
  const dir = scratch();
  mkdirSync(join(dir, 'src'), { recursive: true });
  writeFileSync(join(dir, 'src', 'LoginPage.ts'), 'export class LoginPage {}');
  assert.throws(() => assertOutputEmpty(dir), /already a generated framework/i);
  // And it says how to get past it, because a refusal with no exit is a bug report.
  assert.throws(() => assertOutputEmpty(dir), /remove the directory/i);
});

test('every file is simply created — there is no preserve branch left', () => {
  const dir = scratch();
  const writer = new FileWriter(dir);
  writer.write({ path: 'src/a.ts', contents: 'one' });
  assert.equal(readFileSync(join(dir, 'src/a.ts'), 'utf8'), 'one');
  assert.equal(writer.written, 1);
  assert.deepEqual(writer.planned, [{ path: 'src/a.ts', action: 'create' }]);
});

test('a dry run plans every file and writes none', () => {
  const dir = scratch();
  const writer = new FileWriter(dir, { dryRun: true });
  writer.write({ path: 'src/a.ts', contents: 'one' });
  assert.equal(existsSync(join(dir, 'src/a.ts')), false);
  assert.equal(writer.written, 1);
  assert.match(writer.summary(), /1 written/);
});
