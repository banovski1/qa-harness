import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const COMPONENTS = join(dirname(fileURLToPath(import.meta.url)), '../emit/runtime/components');

test('fields.ts is gone — ten classes in one file is not a component library', () => {
  assert.equal(existsSync(join(COMPONENTS, 'fields.ts')), false);
});

test('every component file declares exactly one exported class, named for the file', () => {
  for (const entry of readdirSync(COMPONENTS)) {
    if (!entry.endsWith('.ts') || entry === 'index.ts') continue;
    const source = readFileSync(join(COMPONENTS, entry), 'utf8');
    const classes = [...source.matchAll(/^export (?:abstract )?class (\w+)/gm)].map(m => m[1]);
    assert.equal(classes.length, 1, `${entry} exports ${classes.length} classes: ${classes.join(', ')}`);
    assert.equal(classes[0], entry.replace('.ts', ''), `${entry} should export ${entry.replace('.ts', '')}`);
  }
});

test('index.ts re-exports every component, so a page imports from one place', () => {
  const index = readFileSync(join(COMPONENTS, 'index.ts'), 'utf8');
  for (const name of ['TextField', 'Select', 'Checkbox', 'RadioButton', 'Button', 'Link', 'Tab', 'MenuItem', 'Toast', 'RecordTable']) {
    assert.match(index, new RegExp(`\\b${name}\\b`), `${name} is not re-exported`);
  }
});
