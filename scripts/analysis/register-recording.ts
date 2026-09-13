#!/usr/bin/env -S npx tsx
/**
 * Tell the analysis that a human recorded a flow.
 *
 * This closes the loop the confidence score opens. `test-preconditions` refuses a journey
 * whose screens score below 0.7 and asks for a recording; without this, the recording is
 * made, saved, and never counted — the score stays where it was and the agent asks again.
 *
 *   npx tsx scripts/analysis/register-recording.ts \
 *     --flow apply-leave \
 *     --file codegen-recordings/apply-leave-2026-09-13.md \
 *     --screens /leave/applyLeave,/leave/viewMyLeaveList
 *
 * Re-registering the same flow replaces its entry rather than adding a second one, so a
 * re-recording supersedes the recording it corrects.
 */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, readAnalysis, writeSection } from './analysis-file.ts';
import { scoreScreens, verdictFor } from './testability.ts';

function arg(flag: string): string | undefined {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

function main(): void {
  const flow = arg('--flow');
  const file = arg('--file');
  const screens = (arg('--screens') ?? '').split(',').map(s => s.trim()).filter(Boolean);

  if (!flow || !file || !screens.length) {
    console.error('usage: register-recording.ts --flow <slug> --file <path> --screens <path,path>');
    console.error('  --screens are the app paths the recording covers, as they appear in analysis.json');
    process.exit(2);
  }
  if (!existsSync(join(ROOT, file))) {
    console.error(`${file} does not exist. Register a recording only after it has been saved.`);
    process.exit(1);
  }

  const analysis = readAnalysis();
  const known = new Set(analysis.screens.map(s => s.path));
  const unknown = screens.filter(p => !known.has(p));
  if (unknown.length) {
    // A path that matches nothing raises no score and would look like it had.
    console.error(`these paths are not screens in analysis.json:\n  ${unknown.join('\n  ')}`);
    console.error('Use the `path` exactly as the screen carries it. Nothing was written.');
    process.exit(1);
  }

  const before = analysis.screens
    .filter(s => screens.includes(s.path))
    .map(s => [s.path, s.testability?.confidence ?? 0] as const);

  const recordings = [
    ...(analysis.testability?.recordings ?? []).filter(r => r.flow !== flow),
    { flow, path: file, recordedAt: new Date().toISOString(), screens },
  ].sort((a, b) => a.flow.localeCompare(b.flow));

  const testability = scoreScreens(analysis.screens, recordings);
  writeSection('screens', analysis.screens);
  writeSection('testability', testability);

  console.log(`registered ${flow} → ${file}`);
  for (const [path, was] of before) {
    const now = analysis.screens.find(s => s.path === path)!.testability!.confidence;
    console.log(`  ${path}  ${was} → ${now}  (${verdictFor(now)})`);
  }
}

main();
