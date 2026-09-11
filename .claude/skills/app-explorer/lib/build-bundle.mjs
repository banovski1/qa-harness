// Builds a self-contained run-code file. `playwright-cli run-code` accepts a
// single function expression with no imports, so the in-page fragments are
// inlined as source and revived in the page with `new Function`.
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));

export async function buildBundle({ config, outFile }) {
  const fragments = [];
  for (const name of ['rank-locators.js', 'extract-screen.js']) {
    fragments.push(await readFile(join(here, name), 'utf8'));
  }
  const template = await readFile(join(here, 'crawl-batch.js'), 'utf8');
  const source = template
    .replace('__CONFIG__', JSON.stringify(config))
    .replace('__EXTRACTOR_SRC__', JSON.stringify(fragments.join('\n')));
  await writeFile(outFile, source, 'utf8');
  return outFile;
}
