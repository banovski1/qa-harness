// Indent-aware string builder for emitting source files.
//
// The mapper's emitters pass an `indent` string down through every helper; that
// works for two levels of YAML but becomes noise for nested class bodies. This
// keeps the same accumulate-into-a-string idiom while owning the indent level,
// so an emitter only says "open a block" / "close a block".

export class CodeWriter {
  constructor(indentUnit = '  ') {
    this.indentUnit = indentUnit;
    this.level = 0;
    this.parts = [];
  }

  /** Append one line at the current indent level. An empty argument emits a blank line. */
  line(text = '') {
    this.parts.push(text === '' ? '' : this.indentUnit.repeat(this.level) + text);
    return this;
  }

  /** Append several lines at the current indent level. */
  lines(list) {
    for (const l of list) this.line(l);
    return this;
  }

  /** Append a blank line unless the buffer is empty or already ends with one. */
  blank() {
    if (this.parts.length && this.parts[this.parts.length - 1] !== '') this.parts.push('');
    return this;
  }

  indent() {
    this.level += 1;
    return this;
  }

  dedent() {
    this.level = Math.max(0, this.level - 1);
    return this;
  }

  /** Emit `open`, run `body` one level deeper, then emit `close`. */
  block(open, body, close = '}') {
    this.line(open).indent();
    body(this);
    this.dedent().line(close);
    return this;
  }

  /** The finished file: trailing blank lines collapsed, exactly one newline at EOF. */
  toString() {
    const out = this.parts.join('\n').replace(/\n+$/, '');
    return `${out}\n`;
  }
}

/** Escape a value for a double-quoted string literal in C-family languages. */
export function quote(value) {
  return `'${String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n')}'`;
}

/** Escape a value for a double-quoted string literal (Java, C#, JSON). */
export function dquote(value) {
  return `"${String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n')}"`;
}
