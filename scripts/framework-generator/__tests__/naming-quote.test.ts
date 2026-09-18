import { test } from 'node:test';
import assert from 'node:assert/strict';
import { q } from '../emit/naming.ts';

/**
 * `q` produces source code. A value it cannot quote is not a cosmetic problem: the
 * generator runs once, so the file it lands in is unparseable for good.
 */
const evaluates = (value: string): string => {
  // Parse the emitted literal the way tsc will, and get the value back out.
  return new Function(`return ${q(value)};`)() as string;
};

test('a label carrying newlines survives as a valid literal', () => {
  // Read off a rendered tooltip: three lines of markup with tabs between them.
  const label = '<div>Max. no. of files: 5</div>\n\t\t\t<div>max. size: 50MB</div>';
  assert.doesNotThrow(() => evaluates(label));
  assert.equal(evaluates(label), label);
  assert.ok(!q(label).includes('\n'), 'the emitted literal spans one line');
});

test('quotes and backslashes still round-trip', () => {
  for (const value of ["it's", 'a\\b', `"double"`, "mixed '\\ ends"]) {
    assert.equal(evaluates(value), value, value);
  }
});

test('a carriage return and the unicode line separators are escaped too', () => {
  const LS = String.fromCharCode(0x2028);
  const PS = String.fromCharCode(0x2029);
  const value = `a\rb${LS}c${PS}d`;
  assert.equal(evaluates(value), value);
  for (const terminator of ['\r', '\n', LS, PS]) {
    assert.ok(!q(value).includes(terminator), 'no raw line terminator reaches the output');
  }
});
