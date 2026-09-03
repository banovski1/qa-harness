#!/usr/bin/env node
/**
 * PreToolUse guard for Write/Edit/MultiEdit inside generated-framework/.
 *
 * Exit 0 lets the write through; exit 2 rejects it and hands the report back to
 * the model, which is why every message names the fix and not just the offence.
 * Any internal failure exits 0 on purpose: a broken hook must not become a
 * broken repo.
 */
import { existsSync, readFileSync } from 'node:fs';
import { relative, resolve, sep } from 'node:path';
import { pathRules } from './rules/paths.mjs';
import { locatorRules } from './rules/locators.mjs';
import { commentRules } from './rules/comments.mjs';
import { playwrightRules } from './rules/playwright.mjs';

const SCOPE = 'generated-framework/';

function readStdin() {
  try {
    return readFileSync(0, 'utf8');
  } catch {
    return '';
  }
}

function toPosix(p) {
  return p.split(sep).join('/');
}

function contexts(payload, root) {
  const input = payload.tool_input ?? {};
  const absolute = input.file_path ? resolve(input.file_path) : null;
  if (!absolute) return [];
  const path = toPosix(relative(root, absolute));
  if (!path.startsWith(SCOPE)) return [];

  const whole = existsSync(absolute) ? readFileSync(absolute, 'utf8') : '';
  const base = { path, absolute, root, whole };

  switch (payload.tool_name) {
    case 'Write':
      return [{ ...base, text: input.content ?? '', whole: input.content ?? '' }];
    case 'Edit':
      return [{ ...base, text: input.new_string ?? '', whole: applyEdit(whole, input) }];
    case 'MultiEdit':
      return (input.edits ?? []).map((edit) => ({ ...base, text: edit.new_string ?? '' }));
    default:
      return [];
  }
}

/** Best-effort preview of the post-edit file, for the whole-file rules. */
function applyEdit(current, input) {
  if (!current || !input.old_string) return input.new_string ?? current;
  return input.replace_all
    ? current.split(input.old_string).join(input.new_string ?? '')
    : current.replace(input.old_string, input.new_string ?? '');
}

function report(path, violations) {
  const seen = new Set();
  const unique = violations.filter((v) => {
    const key = `${v.rule}:${v.line}:${v.found}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const out = [`BLOCKED: ${path}`, ''];
  for (const v of unique) {
    const where = v.line ? ` line ${v.line}:` : '';
    out.push(`  [${v.rule}]${where} ${v.found}`);
    out.push(`    ${v.fix}`);
    out.push('');
  }
  out.push('These rules are enforced by .claude/hooks/ and are not negotiable. Fix the code —');
  out.push('do not work around the hook. A rule that is genuinely wrong for one line takes a');
  out.push('trailing // allow:<rule-id> <reason>, which stays visible in review.');
  return out.join('\n');
}

function main() {
  const raw = readStdin();
  if (!raw.trim()) process.exit(0);

  let payload;
  try {
    payload = JSON.parse(raw);
  } catch {
    process.exit(0);
  }

  const root = resolve(payload.cwd ?? process.cwd());
  const all = [];
  let path = '';
  for (const ctx of contexts(payload, root)) {
    path = ctx.path;
    const blocked = pathRules(ctx);
    all.push(...blocked);
    if (blocked.length) continue;
    all.push(...commentRules(ctx), ...locatorRules(ctx), ...playwrightRules(ctx));
  }

  if (!all.length) process.exit(0);
  process.stderr.write(`${report(path, all)}\n`);
  process.exit(2);
}

try {
  main();
} catch (error) {
  process.stderr.write(`write-guard hook failed, allowing the write: ${error.message}\n`);
  process.exit(0);
}
