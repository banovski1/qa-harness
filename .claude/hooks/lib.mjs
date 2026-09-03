/**
 * Shared helpers for the write-guard rules.
 *
 * A rule is `(ctx) => Violation[]`, where a Violation is
 * `{ rule, line, found, fix }`. Rules never print and never exit; the entry
 * point owns the report and the exit code.
 */

const ALLOW_RE = /\/\/\s*allow:([a-z-]+)\b/;

/** True when the line carries the documented escape hatch for this rule. */
export function isAllowed(line, rule) {
  const match = ALLOW_RE.exec(line);
  return !!match && (match[1] === rule || match[1] === 'all');
}

/**
 * Walk the inspected text line by line, skipping lines that opt out of `rule`.
 * `line` in the yielded record is 1-based and relative to the inspected text —
 * for an Edit that is the replacement string, not the file, which is the best
 * anchor available before the write lands.
 */
export function* lines(ctx, rule) {
  const all = ctx.text.split(/\r?\n/);
  for (let i = 0; i < all.length; i += 1) {
    if (isAllowed(all[i], rule)) continue;
    yield { no: i + 1, text: all[i] };
  }
}

/** Collect one violation per matching line. */
export function scan(ctx, rule, pattern, fix, describe = (m, line) => trim(line)) {
  const out = [];
  for (const { no, text } of lines(ctx, rule)) {
    const re = new RegExp(pattern.source, pattern.flags.replace('g', ''));
    const match = re.exec(stripComment(text));
    if (match) out.push({ rule, line: no, found: describe(match, text), fix });
  }
  return out;
}

/**
 * Drop a trailing line comment so a rule pattern cannot fire on prose that
 * merely mentions the banned construct. Naive about `//` inside a string, which
 * is acceptable here: the alternative is a TS parser in a hook.
 */
export function stripComment(line) {
  const at = line.indexOf('//');
  if (at < 0) return line;
  const before = line.slice(0, at);
  const quotes = (before.match(/['"`]/g) ?? []).length;
  return quotes % 2 === 0 ? before : line;
}

/** The offending line, short enough to read in a hook report. */
export function trim(line) {
  const text = line.trim();
  return text.length > 110 ? `${text.slice(0, 107)}...` : text;
}

/** Comment-free view of the whole text, for whole-file counting rules. */
export function codeLines(text) {
  const out = [];
  let inBlock = false;
  for (const raw of text.split(/\r?\n/)) {
    let line = raw;
    if (inBlock) {
      const end = line.indexOf('*/');
      if (end < 0) continue;
      line = line.slice(end + 2);
      inBlock = false;
    }
    const open = line.indexOf('/*');
    if (open >= 0 && line.indexOf('*/', open) < 0) {
      line = line.slice(0, open);
      inBlock = true;
    }
    const code = stripComment(line).trim();
    if (code) out.push(code);
  }
  return out;
}

export const isSpec = (p) => /(^|\/)tests\//.test(p);
export const isPageObject = (p) => /(^|\/)src\/pages\//.test(p);
export const isGenerated = (p) => p.endsWith('.generated.ts');
