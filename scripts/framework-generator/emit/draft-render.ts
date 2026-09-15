// What the generator intends to write, as a document a human reads before saying yes.
//
// Pure: a model in, markdown out, no I/O and no clock. The lock file hashes this
// string, so an accidental timestamp in here would expire every approval instantly.
import type { AppModel, ComponentDef, Screen } from '../../model-compiler/model-types.ts';
import { moduleOf } from './naming.ts';
import { plannedPaths } from './plan.ts';

const score = (s: Screen): number => s.testability?.confidence ?? 0;

/**
 * How the framework will log in, and what the round-trip gate will cover.
 *
 * Both belong in the draft because both are things the reader is approving. The gate
 * writes to a real application, and the resources it cannot reach are a known gap
 * rather than a surprise to be met later.
 */
function authSection(model: AppModel): string[] {
  const resources = Object.keys((model.api.resources ?? {}) as Record<string, unknown>);
  if (!resources.length) return [];

  const verification = (model.api as any).authVerification;
  const lines = ['## Authentication', ''];

  if (verification?.verdict === 'verified') {
    lines.push(
      `Proven by \`verify-auth.ts\` as **${verification.strategy ?? 'session'}**: ${verification.reason}`,
      '',
      'The generated framework replays these steps. It does not transcribe the login screen.',
      '',
    );
    const attempts = verification.attempts ?? [];
    if (attempts.length > 1) {
      lines.push('Strategies tried, in order:', '');
      for (const attempt of attempts) {
        lines.push(`- \`${attempt.strategy}\` — ${attempt.outcome}: ${attempt.reason}`);
      }
      lines.push('');
    }
  } else {
    lines.push(
      `**No proven login** (\`${verification?.verdict ?? 'missing'}\`). Generation will refuse:`,
      'an API layer cannot be built on a login nobody has executed.',
      '',
      'Run `npm run verify-auth -- --write` first.',
      '',
    );
  }

  // Deliberately duplicated logic-free: gate.ts owns the rule, this reports the counts.
  const all = (model.api.resources ?? {}) as Record<string, any>;
  const creatable = Object.entries(all).filter(([, r]) => r.establishes && r.ops?.create);
  const covered = creatable.filter(([, r]) => !r.requires?.length);
  const skipped = creatable.filter(([, r]) => r.requires?.length);

  lines.push(
    '### The API round-trip gate',
    '',
    `\`npm run gate:api\` creates, reads back, deletes and confirms the removal of ` +
    `**${covered.length}** resource(s).`,
    '',
  );
  if (skipped.length) {
    lines.push(
      `**${skipped.length}** are skipped: creating one needs another record first, and ` +
      'which field carries that id is not recorded anywhere — only guessable from its ' +
      'name. The gate does not guess.',
      '',
      ...skipped.map(([name, r]) => `- \`${name}\` needs an existing ${r.requires.join(' and ')}`),
      '',
    );
  }
  return lines;
}

function identityOf(use: { label?: string; field?: string; within?: string; via?: string }): string {
  const parts: string[] = [];
  if (use.label) parts.push(`label: "${use.label}"`);
  if (use.field) parts.push(`field: ${use.field}`);
  if (use.within) parts.push(`within: "${use.within}"`);
  const via = use.via ? ` [${use.via}]` : '';
  return `${parts.join(', ') || '—'}${via}`;
}

function componentSection(name: string, def: ComponentDef): string[] {
  const lines = [`### ${name}`, '', `- kind: \`${def.kind}\` · seen on ${def.seenOn} screen(s)`];
  if (def.kind === 'region') {
    lines.push(`- file: \`src/components/${name}.ts\``);
    lines.push(`- root selector (private to this class): \`${def.root?.args[0] ?? 'body'}\``);
    for (const [prop, spec] of Object.entries(def.controls ?? {})) {
      lines.push(`  - \`${prop}\` → ${spec.strategy}(${spec.args.map(a => `"${a}"`).join(', ')})`);
    }
  } else if (def.kind === 'collection') {
    lines.push(`- rows: \`${def.table?.row}\` · cells: \`${def.table?.cell}\``);
  } else {
    lines.push(`- addressed by identity; the library class is \`src/components/${name}.ts\``);
  }
  lines.push('');
  return lines;
}

function screenSection(screen: Screen, model: AppModel): string[] {
  const t = screen.testability;
  const lines = [
    `### ${screen.name}`,
    '',
    `\`src/pages/${moduleOf(screen.path)}/${screen.name}.ts\` · route \`${screen.path}\``,
    '',
  ];
  if (t) {
    lines.push(
      `- testability **${t.confidence.toFixed(2)}** — ` +
      `${t.addressable} addressable, ${t.unaddressable} not`,
    );
  }
  lines.push(`- heading: ${screen.identity.heading ? `"${screen.identity.heading}"` : 'none recorded'}`);
  if (!screen.crawled) {
    lines.push(
      `- **the crawl never reached this route.** It is declared in the app's source, so ` +
      `the page object will carry a URL and nothing else.`,
    );
  }
  if (screen.unverified) {
    lines.push(
      `- **${screen.unverified} element(s) cannot be addressed** — no label, role name ` +
      `or field identifier. Nothing on the page object will reach them.`,
    );
  }
  for (const reason of t?.missing ?? []) lines.push(`- missing: ${reason}`);

  if (screen.uses.length) {
    lines.push('', '| property | component | identity |', '| --- | --- | --- |');
    for (const use of screen.uses) {
      lines.push(`| \`${use.as}\` | ${use.component} | ${identityOf(use)} |`);
    }
  }
  if (screen.actions.length) {
    lines.push('', 'Actions the crawl or a recording proved:', '');
    for (const action of screen.actions) {
      lines.push(`- \`${action.name}()\` — clicks \`${action.via}\`, lands on ${action.leadsTo}`);
    }
  }
  lines.push('');
  return lines;
}

export function renderDraft(model: AppModel, _conventions: unknown): string {
  const screens = [...model.screens].sort((a, b) => score(b) - score(a) || a.name.localeCompare(b.name));
  const resources = Object.keys((model.api.resources ?? {}) as Record<string, unknown>);
  const strong = screens.filter(s => score(s) >= 0.7).length;
  const record = screens.filter(s => score(s) >= 0.3 && score(s) < 0.7).length;
  const weak = screens.length - strong - record;

  const lines: string[] = [
    `# ${model.app.name} — proposed test framework`,
    '',
    `Compiled from \`analysis.json\` at commit \`${model.app.repoCommit.slice(0, 10)}\`.`,
    '',
    `**This is a proposal. Nothing has been written.** Read it, then approve with:`,
    '',
    '```',
    'npm run draft -- --approve',
    '```',
    '',
    'The generator runs exactly once against an approved draft. After that the framework',
    'is yours: no command in this repository will rewrite it.',
    '',
    '## Summary',
    '',
    `| | |`,
    `| --- | --- |`,
    `| screens | ${screens.length} (${model.stats.crawled ?? 0} crawled, ${model.stats.declaredOnly ?? 0} declared only) |`,
    `| components | ${Object.keys(model.components).length} |`,
    `| API resources | ${resources.length} |`,
    `| ready to write tests against (≥ 0.7) | ${strong} |`,
    `| record the flow first (0.3–0.7) | ${record} |`,
    `| a URL and little else (< 0.3) | ${weak} |`,
    '',
    ...authSection(model),
    '## Files',
    '',
    '```',
    ...plannedPaths(model).map(p => `${p.path}${' '.repeat(Math.max(1, 52 - p.path.length))}${p.what}`),
    '```',
    '',
    '## Components',
    '',
  ];

  for (const [name, def] of Object.entries(model.components).sort(([a], [b]) => a.localeCompare(b))) {
    lines.push(...componentSection(name, def));
  }

  lines.push('## Screens', '', '_Strongest first: the pages worth writing tests against are at the top._', '');
  for (const screen of screens) lines.push(...screenSection(screen, model));

  const belowFloor = screens.filter(s => score(s) < 0.3);
  const unaddressable = screens.filter(s => s.unverified > 0);
  lines.push(
    '## Warnings',
    '',
    `**${belowFloor.length} screen(s) score below 0.3.** A page object will be emitted for each,`,
    'carrying a URL and whatever the source declared. That is not a defect in the app — it is',
    'a request for evidence. Record the flow, re-compile, and the next draft says more.',
    '',
    ...belowFloor.slice(0, 40).map(s => `- ${s.name} (\`${s.path}\`)`),
    belowFloor.length > 40 ? `- …and ${belowFloor.length - 40} more` : '',
    '',
    `**${unaddressable.length} screen(s) hold elements nothing can address.**`,
    '',
    ...unaddressable.slice(0, 40).map(s => `- ${s.name} — ${s.unverified} element(s)`),
    unaddressable.length > 40 ? `- …and ${unaddressable.length - 40} more` : '',
    '',
  );

  // Blank-line normalisation, not blank-line removal: `''` entries above are the
  // paragraph breaks the document needs. Stripping every one of them (as filtering
  // out `l !== ''` before joining would do) collapses headings straight into their
  // body text — still valid markdown, but unreadable. Joining first and then
  // collapsing runs of 3+ newlines down to one blank line keeps every intentional
  // break while still absorbing the doubled-up blanks a conditional section (an
  // empty `missing` list, a screen with no actions) can leave behind. The result is
  // still a pure function of `lines`, so determinism is unaffected.
  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}
