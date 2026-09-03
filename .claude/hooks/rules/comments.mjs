/**
 * Comments are budgeted at one per thirty code lines. The budget is not a style
 * preference: narration drifts out of sync with the code it describes, and a
 * comment restating the next line is worse than nothing because it doubles the
 * surface a reader has to reconcile.
 */
import { codeLines, isAllowed, isGenerated, stripComment } from '../lib.mjs';

const RATIO = 1 / 30;
const MIN_CODE_LINES = 20;

const PROVENANCE = /\/\/\s*(UNVERIFIED|UNSTABLE|allow:|eslint-|@ts-|prettier-)/;
const NARRATION =
  /\/\/\s*(step\s*\d|(click|fill|type|select|check|navigate|goto|assert|verify|open|close|wait|log|create|delete|submit|now|then|next|first|finally)\b)/i;

function commentLineCount(text) {
  let count = 0;
  let inBlock = false;
  for (const raw of text.split(/\r?\n/)) {
    const trimmed = raw.trim();
    if (inBlock) {
      count += 1;
      if (trimmed.includes('*/')) inBlock = false;
      continue;
    }
    if (trimmed.startsWith('/*')) {
      count += 1;
      if (!trimmed.includes('*/')) inBlock = true;
      continue;
    }
    if (PROVENANCE.test(raw)) continue;
    if (trimmed.startsWith('//')) count += 1;
    else if (raw !== stripComment(raw)) count += 1;
  }
  return count;
}

export function commentRules(ctx) {
  if (isGenerated(ctx.path)) return [];
  const out = [];

  const whole = ctx.whole ?? ctx.text;
  const code = codeLines(whole).length;
  const comments = commentLineCount(whole);
  if (code >= MIN_CODE_LINES && comments > Math.max(1, Math.floor(code * RATIO))) {
    out.push({
      rule: 'comment-budget',
      line: 0,
      found: `${comments} comment lines for ${code} code lines (cap: ${Math.max(1, Math.floor(code * RATIO))})`,
      fix: 'Delete the comments that restate the code. Keep only what explains a non-obvious why, plus // UNVERIFIED provenance markers.',
    });
  }

  const rows = ctx.text.split(/\r?\n/);
  for (let i = 0; i < rows.length; i += 1) {
    if (isAllowed(rows[i], 'no-narration')) continue;
    if (PROVENANCE.test(rows[i])) continue;
    if (NARRATION.test(rows[i])) {
      out.push({
        rule: 'no-narration',
        line: i + 1,
        found: rows[i].trim(),
        fix: 'The code already says this. Delete the comment; if the step needs a name, name the page-object method after it.',
      });
    }
  }
  return out;
}
