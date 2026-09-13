#!/usr/bin/env -S npx tsx
/**
 * Put one skill's findings into the root analysis.json.
 *
 *   npx tsx scripts/analysis/write-section.ts --section source --file out.json
 *   … --section api --stdin < out.json
 *
 * A skill writes its own section and no other. This exists so that four writers can
 * share one file without any of them having to read, merge and rewrite the other three.
 */
import { readFileSync } from 'node:fs';
import { writeSection } from './analysis-file.ts';
import { SECTIONS, SECTION_OWNER, type Section } from './analysis-types.ts';

function main(): void {
  const argv = process.argv.slice(2);
  const arg = (flag: string) => {
    const i = argv.indexOf(flag);
    return i >= 0 ? argv[i + 1] : undefined;
  };
  const section = arg('--section') as Section | undefined;
  const file = arg('--file');

  if (!section) {
    console.error('usage: write-section.ts --section <section> (--file <json> | --stdin)');
    console.error(`sections: ${SECTIONS.join(', ')}`);
    process.exit(2);
  }
  if (!SECTIONS.includes(section)) {
    console.error(`unknown section "${section}". Known: ${SECTIONS.join(', ')}`);
    process.exit(2);
  }

  const raw = file ? readFileSync(file, 'utf8') : readFileSync(0, 'utf8');
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch (error) {
    console.error(`the payload is not JSON: ${error instanceof Error ? error.message : error}`);
    process.exit(1);
  }

  const path = writeSection(section, value);
  console.error(`${path}  ${section} (owner: ${SECTION_OWNER[section]})`);
}

main();
