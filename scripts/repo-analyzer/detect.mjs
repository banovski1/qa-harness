#!/usr/bin/env node
// Framework detection for a local application repo. Every analyzer starts here, so nothing
// downstream ever branches on "which app is this" — it branches on a registry entry.
//
//   node scripts/repo-analyzer/detect.mjs [--app <app-clone>]

import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import {matchBackend} from './registry-backend.mjs';
import {UNKNOWN_FRONTEND, matchFrontend} from './registry-frontend.mjs';
import {parseArgs, readJson, readText, rel, resolveAppPath, walkFiles} from './util.mjs';

const MANIFESTS = new Set([
  'package.json', 'composer.json', 'requirements.txt', 'pyproject.toml', 'Pipfile',
  'Gemfile', 'go.mod', 'pom.xml', 'build.gradle', 'build.gradle.kts',
]);

/** Normalise every manifest format down to one flat `{ dependency: version }` map. */
function dependenciesOf(file) {
  const base = path.basename(file);
  const text = readText(file) ?? '';
  if (base === 'package.json' || base === 'composer.json') {
    const json = readJson(file) ?? {};
    return {...(json.dependencies ?? {}), ...(json.devDependencies ?? {}), ...(json['require'] ?? {}), ...(json['require-dev'] ?? {})};
  }
  if (base === 'requirements.txt' || base === 'Pipfile') {
    return Object.fromEntries([...text.matchAll(/^\s*([A-Za-z0-9_.-]+)\s*(?:[=<>~!]=?\s*([^\s#]+))?/gm)]
      .map((m) => [m[1].toLowerCase(), m[2] ?? '*']));
  }
  if (base === 'pyproject.toml') {
    return Object.fromEntries([...text.matchAll(/^\s*["']?([A-Za-z0-9_.-]+)["']?\s*[=~^><]/gm)]
      .map((m) => [m[1].toLowerCase(), '*']));
  }
  if (base === 'Gemfile') {
    return Object.fromEntries([...text.matchAll(/^\s*gem\s+['"]([^'"]+)['"]/gm)].map((m) => [m[1], '*']));
  }
  if (base === 'go.mod') {
    return Object.fromEntries([...text.matchAll(/^\s*([\w.\-/]+)\s+v[\d.]/gm)].map((m) => [m[1], '*']));
  }
  // pom.xml / build.gradle: artifact ids are enough to pin a JVM framework.
  return Object.fromEntries([...text.matchAll(/<artifactId>([^<]+)<\/artifactId>|['"]([\w.\-:]+):([\w.\-]+)/g)]
    .map((m) => [m[1] ?? m[3], '*']).filter(([k]) => k));
}

function findManifests(appPath) {
  const found = [];
  for (const file of walkFiles(appPath, {maxDepth: 4})) {
    if (!MANIFESTS.has(path.basename(file))) continue;
    found.push({file, deps: dependenciesOf(file)});
  }
  // Shallowest first: a root manifest describes the app, a nested one usually a sub-package.
  return found.sort((a, b) => a.file.split(path.sep).length - b.file.split(path.sep).length || a.file.localeCompare(b.file));
}

// Path segments that mark an auxiliary app rather than the product: an installer wizard or a
// docs site is a real match for the registry, just not the app under test.
const AUXILIARY_SEGMENTS = ['installer', 'example', 'examples', 'demo', 'docs', 'website', 'sandbox', 'playground', 'devtools', 'tools', 'e2e', 'test', 'tests'];

/**
 * Rank two candidate roots that both match a framework. Size decides it: the app under test has
 * far more components than an installer wizard bundled beside it. Auxiliary path segments only
 * break a near tie, so a genuinely large app inside `tools/` still wins.
 */
const BACKEND_EXTENSIONS = ['.php', '.py', '.rb', '.java', '.kt', '.go', '.js', '.ts'];

function scoreCandidate(appPath, root, entry) {
  const extensions = entry.extensions ?? BACKEND_EXTENSIONS;
  let files = 0;
  for (const file of walkFiles(sourceRootOf(root), {maxDepth: 8})) {
    if (extensions.some((ext) => file.endsWith(ext))) files += 1;
    if (files > 500) break;
  }
  const segments = rel(appPath, root).toLowerCase().split('/');
  const penalty = AUXILIARY_SEGMENTS.some((seg) => segments.includes(seg)) ? 0.1 : 1;
  return Math.round(files * penalty);
}

/** Which of the framework's own directories actually holds the sources. */
function sourceRootOf(root) {
  for (const candidate of ['src', 'app', 'lib', 'assets']) {
    if (fs.existsSync(path.join(root, candidate))) return path.join(root, candidate);
  }
  return root;
}

export function detect(appPath, overrides = {}) {
  const manifests = findManifests(appPath);
  const evidence = [];
  let frontend = null;
  let backend = null;
  const others = [];

  const frontCandidates = [];
  const backCandidates = [];
  for (const {file, deps} of manifests) {
    const root = path.dirname(file);
    const frontMatch = matchFrontend(deps);
    const backMatch = matchBackend(deps, root);
    if (frontMatch) {
      frontCandidates.push({entry: frontMatch, root, manifestPath: rel(appPath, file),
        version: deps[frontMatch.deps.find((d) => d in deps)] ?? null, score: scoreCandidate(appPath, root, frontMatch)});
    }
    if (backMatch) {
      backCandidates.push({entry: backMatch, root, manifestPath: rel(appPath, file),
        version: deps[backMatch.deps.find((d) => d in deps)] ?? null, score: scoreCandidate(appPath, root, backMatch)});
    }
  }
  frontCandidates.sort((a, b) => b.score - a.score);
  backCandidates.sort((a, b) => b.score - a.score || a.root.length - b.root.length);
  frontend = frontCandidates[0] ?? null;
  backend = backCandidates[0] ?? null;
  if (frontend) evidence.push(`${frontend.manifestPath}: ${frontend.entry.label} ${frontend.version ?? ''} (${frontend.score} source files)`.replace(/\s+/g, ' '));
  if (backend) evidence.push(`${backend.manifestPath}: ${backend.entry.label} (${backend.entry.method})`);
  for (const candidate of [...frontCandidates.slice(1), ...backCandidates.slice(1)]) {
    others.push(`${candidate.manifestPath}: ${candidate.entry.label} (not selected)`);
  }

  if (overrides.frontendRoot) {
    frontend = {...(frontend ?? {entry: UNKNOWN_FRONTEND, manifestPath: null, version: null}), root: path.resolve(appPath, overrides.frontendRoot)};
    evidence.push(`--frontend-root override: ${overrides.frontendRoot}`);
  }
  if (overrides.backendRoot && backend) {
    backend = {...backend, root: path.resolve(appPath, overrides.backendRoot)};
    evidence.push(`--backend-root override: ${overrides.backendRoot}`);
  }
  if (!frontend) {
    frontend = {entry: UNKNOWN_FRONTEND, root: sourceRootOf(appPath), manifestPath: null, version: null};
    evidence.push('no frontend framework matched — falling back to a naive component listing');
  }
  if (!backend) evidence.push('no backend framework matched — API extraction is limited to an existing spec file');

  const sourceRoot = sourceRootOf(frontend.root);
  return {
    appPath,
    frontend: {
      framework: frontend.entry.id,
      label: frontend.entry.label,
      version: frontend.version,
      root: frontend.root,
      sourceRoot,
      manifestPath: frontend.manifestPath,
      fileBasedRouter: frontend.entry.fileBasedRouter ?? null,
      routerLib: frontend.entry.routerLib ?? null,
      entry: frontend.entry,
    },
    backend: backend
      ? {framework: backend.entry.id, label: backend.entry.label, version: backend.version, root: backend.root,
         manifestPath: backend.manifestPath, method: backend.entry.method, entry: backend.entry}
      : null,
    monorepo: others,
    evidence,
  };
}

function summarise(result) {
  return {
    app: result.appPath,
    frontend: {framework: result.frontend.framework, version: result.frontend.version,
               root: rel(result.appPath, result.frontend.root) || '.',
               sourceRoot: rel(result.appPath, result.frontend.sourceRoot) || '.',
               fileBasedRouter: Boolean(result.frontend.fileBasedRouter), routerLib: result.frontend.routerLib},
    backend: result.backend
      ? {framework: result.backend.framework, version: result.backend.version,
         root: rel(result.appPath, result.backend.root) || '.', method: result.backend.method}
      : null,
    monorepo: result.monorepo,
    evidence: result.evidence,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = parseArgs();
  const result = detect(resolveAppPath(args.app), {frontendRoot: args.frontendRoot, backendRoot: args.backendRoot});
  const summary = summarise(result);
  process.stdout.write(args.json ? `${JSON.stringify(summary, null, 2)}\n` : `${yaml.dump(summary, {lineWidth: 120})}\n`);
}

export {summarise};
