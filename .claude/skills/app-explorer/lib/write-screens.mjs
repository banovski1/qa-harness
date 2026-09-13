// Raw crawl output -> the `screens` section of analysis/<app>/analysis.json.
//
// The crawl records, per element, a ranked ladder of locator candidates and a bounding
// box. That is the evidence uniqueness is decided from, and once it has been decided
// none of it is read again — it was fifteen megabytes for one app, none of it reviewable.
// What survives is what a decision downstream depends on: how to name the control,
// whether the name resolves to one element, and where the name came from.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, basename } from 'node:path';

const SEMANTIC = new Set(['testId', 'role', 'label', 'placeholder', 'proximity', 'scoped']);

/**
 * How many elements this control's *semantic* handle matches.
 *
 * A positional CSS path always resolves to one element, so the crawl's `unique` flag
 * says nothing about whether a test can address the control by name. `-1` records the
 * honest answer where no semantic candidate exists at all.
 */
function semanticMatches(el) {
  const semantic = (el.candidates || []).filter((c) => SEMANTIC.has(c.strategy));
  if (!semantic.length) return el.fragile ? -1 : 1;
  return Math.min(...semantic.map((c) => c.matchCount));
}

function distil(screen) {
  const visible = (screen.elements || []).filter((el) => el.visible);
  return {
    path: screen.path,
    url: screen.url,
    title: screen.title,
    headings: (screen.headings || []).map((h) => ({ level: h.level, text: h.text, y: h.y ?? -1 })),
    tables: screen.tables || [],
    hiddenControls: (screen.elements || []).length - visible.length,
    controls: visible.map((el) => ({
      role: el.role ?? null,
      name: el.name || '',
      nameSource: el.nameSource ?? (el.name ? 'accessible' : null),
      label: el.label ?? null,
      placeholder: el.placeholder ?? null,
      field: (el.data && el.data['data-name']) || el.nameAttr || el.testId || null,
      region: el.region || 'body',
      visible: true,
      disabled: !!el.disabled,
      href: el.href ?? null,
      matches: semanticMatches(el),
      y: el.box ? el.box.y : -1,
    })),
    links: screen.links || [],
  };
}

const SECTIONS = ['app', 'source', 'conventions', 'api', 'map', 'components', 'screens', 'testability', 'stats'];

// Ordered first, then anything this file does not know about — a writer that dropped an
// unrecognised key would silently delete another skill's section the moment the contract
// grew. Section order is fixed so a re-run diffs only its own work.
function reorder(current) {
  const ordered = {};
  for (const key of SECTIONS) if (key in current) ordered[key] = current[key];
  for (const key of Object.keys(current)) if (!(key in ordered)) ordered[key] = current[key];
  return ordered;
}


export async function writeScreensSection({ outDir, screensDir }) {
  const files = existsSync(screensDir)
    ? (await readdir(screensDir)).filter((f) => f.endsWith('.json')).sort()
    : [];
  const screens = [];
  for (const file of files) {
    screens.push(distil(JSON.parse(await readFile(join(screensDir, file), 'utf8'))));
  }

  const path = join(outDir, 'analysis.json');
  const current = existsSync(path) ? JSON.parse(await readFile(path, 'utf8')) : {};
  current.screens = screens;
  // Fixed key order, so a re-run of one skill diffs only its own section.
  await writeFile(path, JSON.stringify(reorder(current), null, 2) + '\n');
  return { screens: screens.length, controls: screens.reduce((n, s) => n + s.controls.length, 0) };
}

export { distil, semanticMatches };
