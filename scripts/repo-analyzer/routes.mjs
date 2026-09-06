#!/usr/bin/env node
// Skill B — every page the app defines, taken from whichever routing convention it actually uses.
//
//   node scripts/repo-analyzer/routes.mjs [--app <app-clone>] [--dry-run]

import fs from 'node:fs';
import path from 'node:path';
import {detect} from './detect.mjs';
import {babelParse, keyName, walkAst} from './parsers.mjs';
import {paramsOf} from './registry-backend.mjs';
import {header, outPath, reportWritten, table, writeReport} from './report.mjs';
import {findFiles, parseArgs, readText, rel, resolveAppPath} from './util.mjs';

// Page routes are normalised to `{param}` whichever convention declared them, so Skill C can
// mark a placeholder without knowing which router produced the route. API endpoints keep their
// framework's own spelling — those are matched against a spec, where the native form is correct.
function normalisePath(routePath) {
  // `<int:pk>` first: rewriting `:pk` ahead of it would leave the converter behind as `{int{pk}}`.
  return String(routePath)
    .replace(/<(?:[^:>]+:)?([^>]+)>/g, '{$1}')
    .replace(/:([A-Za-z_]\w*)\??/g, '{$1}');
}

// --- strategy 1: a file-based router ----------------------------------------------------

function fileRouteFor(relPath, config) {
  let route = relPath.replace(/\.[^.]+$/, '');
  if (config.flat) route = route.replace(/\./g, '/');           // Remix flat routes
  if (config.pageFile) route = route.replace(new RegExp(`(^|/)\\${config.pageFile}$`), '');
  route = route.replace(/(^|\/)index$/, '');
  route = route
    .replace(/\[\.\.\.([^\]]+)\]/g, '{$1*}')                    // Next/Nuxt catch-all
    .replace(/\[\[([^\]]+)\]\]/g, '{$1?}')
    .replace(/\[([^\]]+)\]/g, '{$1}')
    .replace(/\$$/, '{rest*}')
    .replace(/\$([A-Za-z_]\w*)/g, '{$1}');                      // Remix params
  route = route.replace(/\((?:[^)]+)\)\//g, '');                // route groups: (marketing)/about
  return `/${route}`.replace(/\/+/g, '/').replace(/(.)\/$/, '$1');
}

function fileBasedRoutes(detection) {
  const config = detection.frontend.fileBasedRouter;
  const routes = [];
  for (const dir of config.dirs) {
    const base = path.join(detection.frontend.root, dir);
    if (!fs.existsSync(base)) continue;
    for (const file of findFiles(base, (f) => config.extensions.some((ext) => f.endsWith(ext)))) {
      const relPath = rel(base, file);
      if (/(^|\/)(_|\+layout|\+server)/.test(relPath)) continue;
      if (config.pageFile && !path.basename(file).startsWith(config.pageFile)) continue;
      const routePath = fileRouteFor(relPath, config);
      routes.push({
        path: routePath,
        component: rel(detection.appPath, file),
        params: paramsOf(routePath),
        source: `${rel(detection.appPath, base)}/ (file-based router)`,
      });
    }
  }
  return routes;
}

// --- strategy 2: a central router config ------------------------------------------------

async function routerConfigRoutes(detection) {
  const lib = detection.frontend.routerLib;
  const candidates = findFiles(detection.frontend.sourceRoot,
    (file) => /\.(m?[jt]sx?)$/.test(file) && (readText(file) ?? '').includes(lib), {maxDepth: 8});
  const routes = [];
  for (const file of candidates) {
    const ast = await babelParse(readText(file) ?? '');
    if (!ast) continue;
    walkAst(ast, (node) => {
      if (node.type !== 'ObjectExpression') return;
      const pathProp = node.properties.find((p) => keyName(p) === 'path' && p.value?.type === 'StringLiteral');
      if (!pathProp) return;
      const routePath = pathProp.value.value;
      const componentProp = node.properties.find((p) => ['component', 'element', 'loadChildren', 'lazy'].includes(keyName(p)));
      const nameProp = node.properties.find((p) => keyName(p) === 'name' && p.value?.type === 'StringLiteral');
      routes.push({
        path: normalisePath(routePath.startsWith('/') ? routePath : `/${routePath}`),
        name: nameProp?.value?.value ?? null,
        component: componentDescription(componentProp?.value),
        params: paramsOf(routePath),
        source: `${rel(detection.appPath, file)} (${lib} config)`,
      });
    });
    if (routes.length > 0) break;
  }
  return routes;
}

function componentDescription(value) {
  if (!value) return null;
  if (value.type === 'Identifier') return value.name;
  if (value.type === 'JSXElement') return value.openingElement?.name?.name ?? null;
  if (value.type === 'StringLiteral') return value.value;
  // `component: () => import('./Foo.vue')` — the specifier is the useful half.
  let found = null;
  walkAst(value, (node) => {
    if (!found && node.type === 'StringLiteral' && node.value.includes('/')) found = node.value;
  });
  return found;
}

// --- strategy 3: a server-routed app ----------------------------------------------------

/**
 * Some server-rendered apps hand a component *name* to the frontend rather than a file. Build a
 * name -> file map by reading every object literal that maps a quoted name to an imported symbol,
 * which is the shape of a component registry regardless of the framework that consumes it.
 */
async function componentIndex(detection) {
  const index = new Map();
  const files = findFiles(detection.frontend.sourceRoot,
    (file) => /(^|\/)index\.[jt]s$/.test(file) || /main\.[jt]s$/.test(file), {maxDepth: 6});
  for (const file of files) {
    const source = readText(file);
    const ast = source ? await babelParse(source) : null;
    if (!ast) continue;
    const imports = new Map();
    walkAst(ast, (node) => {
      if (node.type !== 'ImportDeclaration') return;
      for (const specifier of node.specifiers) imports.set(specifier.local.name, node.source.value);
    });
    walkAst(ast, (node) => {
      if (node.type !== 'ObjectProperty' || node.key?.type !== 'StringLiteral') return;
      if (node.value?.type !== 'Identifier') return;
      const target = imports.get(node.value.name);
      if (!target) return;
      index.set(node.key.value, resolveImport(path.dirname(file), target, detection));
    });
  }
  return index;
}

const IMPORT_EXTENSIONS = ['', '.vue', '.svelte', '.tsx', '.jsx', '.ts', '.js', '/index.vue', '/index.ts', '/index.js'];

function resolveImport(fromDir, specifier, detection) {
  const bases = specifier.startsWith('.')
    ? [path.resolve(fromDir, specifier)]
    : [path.join(detection.frontend.sourceRoot, specifier.replace(/^[@~]\//, ''))];
  for (const base of bases) {
    for (const ext of IMPORT_EXTENSIONS) {
      if (fs.existsSync(base + ext) && fs.statSync(base + ext).isFile()) return rel(detection.appPath, base + ext);
    }
  }
  return specifier;
}

async function serverRoutes(detection, apiPrefix) {
  const backend = detection.backend;
  const all = await backend.entry.routes(backend.root);
  const index = await componentIndex(detection);
  const routes = [];
  for (const route of all) {
    if (route.kind === 'api') continue;
    if (route.path.startsWith(apiPrefix)) continue;
    const componentName = backend.entry.componentFor?.(backend.root, route.controller) ?? null;
    routes.push({
      path: normalisePath(route.path),
      name: route.name,
      component: componentName ? (index.get(componentName) ?? componentName) : null,
      componentName,
      params: paramsOf(route.path),
      requirements: route.requirements,
      source: `${route.source} (${backend.label})`,
    });
  }
  return routes;
}

// --- driver -----------------------------------------------------------------------------

export async function collectRoutes(detection, {apiPrefix = '/api'} = {}) {
  if (detection.frontend.fileBasedRouter) {
    const routes = fileBasedRoutes(detection);
    if (routes.length > 0) return {strategy: `${detection.frontend.label} file-based router`, routes};
  }
  if (detection.frontend.routerLib) {
    const routes = await routerConfigRoutes(detection);
    if (routes.length > 0) return {strategy: `${detection.frontend.routerLib} config`, routes};
  }
  if (detection.backend) {
    const routes = await serverRoutes(detection, apiPrefix);
    if (routes.length > 0) return {strategy: `${detection.backend.label} server routing`, routes};
  }
  return {strategy: null, routes: []};
}

function render(detection, result, apiPrefix) {
  const sorted = [...result.routes].sort((a, b) => a.path.localeCompare(b.path));
  const unresolved = sorted.filter((route) => !route.component);
  const body = [
    header('Pages and routes', detection, [
      `**Route source**: ${result.strategy ?? 'none — no routing convention was statically resolvable'}`,
      `**Routes found**: ${sorted.length}`,
      `**API prefix excluded**: \`${apiPrefix}\` (see \`analysis/api-documentation.md\`)`,
    ]),
    table(['Route', 'Renders', 'Params', 'Source'], sorted.map((route) => [
      `\`${route.path}\``,
      route.component ? `\`${route.component}\`` : null,
      route.params.length > 0 ? route.params.map((p) => `\`{${p}}\``).join(', ') : null,
      route.source,
    ])),
    '',
    '## Not statically resolvable',
    '',
    result.strategy === null
      ? 'No routing convention matched this app. Routes registered at runtime cannot be recovered from source; record the flows you need with the `playwright-codegen` skill instead.'
      : `${unresolved.length} route(s) above resolve to no component file — either the route is a redirect or download endpoint, or the component is chosen at runtime. They are listed with an empty **Renders** cell rather than guessed at.`,
    '',
  ].join('\n');
  return body;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = parseArgs();
  const detection = detect(resolveAppPath(args.app), {frontendRoot: args.frontendRoot, backendRoot: args.backendRoot});
  const apiPrefix = args.apiPrefix ? String(args.apiPrefix) : '/api';
  const result = await collectRoutes(detection, {apiPrefix});
  const out = outPath(args, 'pages-and-routes.md');
  const written = writeReport({
    outFile: out,
    body: render(detection, result, apiPrefix),
    data: {app: detection.appPath, strategy: result.strategy, routes: result.routes},
    dryRun: Boolean(args.dryRun),
  });
  reportWritten(written, [`${result.routes.length} route(s) via ${result.strategy ?? 'no strategy'}`]);
}

export {fileRouteFor, normalisePath, render as renderRoutes};
