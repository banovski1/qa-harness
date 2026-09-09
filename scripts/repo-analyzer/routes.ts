#!/usr/bin/env node
// Skill B — every page the app defines, taken from whichever routing convention it actually uses.
//
//   npm run routes --prefix scripts/repo-analyzer -- [--app <app-clone>] [--dry-run]

import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {astField, astNode, astNodes, astString} from './ast.js';
import {detect} from './detect.js';
import {babelParse, keyName, walkAst} from './parsers.js';
import {paramsOf} from './registry-backend.js';
import {header, outPath, reportWritten, table, writeReport} from './report.js';
import {findFiles, parseArgs, readText, rel, resolveAppPath} from './util.js';
import type {AstNode, DetectionResult, FileBasedRouterConfig, RouteCollection, RouteRecord, RouterConfigTraversal} from './types.js';

// Page routes are normalised to `{param}` whichever convention declared them, so Skill C can
// mark a placeholder without knowing which router produced the route. API endpoints keep their
// framework's own spelling — those are matched against a spec, where the native form is correct.
function normalisePath(routePath: string) {
  // `<int:pk>` first: rewriting `:pk` ahead of it would leave the converter behind as `{int{pk}}`.
  return String(routePath)
    .replace(/<(?:[^:>]+:)?([^>]+)>/g, '{$1}')
    .replace(/:([A-Za-z_]\w*)\??/g, '{$1}');
}

// --- strategy 1: a file-based router ----------------------------------------------------

function fileRouteFor(relPath: string, config: Partial<FileBasedRouterConfig>) {
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

function fileBasedRoutes(detection: DetectionResult): RouteRecord[] {
  const config = detection.frontend.fileBasedRouter!;
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

// What a route names to render, when the registry row does not say. This is the historic list, so a
// framework with no `routerConfig:` row reads its config exactly as it did before children existed.
const DEFAULT_COMPONENT_KEYS = ['component', 'element', 'loadChildren', 'lazy'];

// Route modules import each other, so a `loadChildren` graph can be circular as well as deep. The
// branch-scoped visited set below stops the cycle; these two caps stop a pathological fan-out from
// turning the analyzer into something that never finishes, which is worse than one that finds less.
const DEFAULT_ROUTE_DEPTH = 8;
const MAX_ROUTE_FILE_VISITS = 5000;
const MAX_CONSTANT_HOPS = 12;

interface ConstantScope {
  /** `Class.FIELD`, `Enum.MEMBER` and bare `const` names, mapped to the expression declared for them */
  fields: Map<string, AstNode>;
  /** imported local name -> the absolute file it came from */
  imports: Map<string, string>;
}

/**
 * Mechanism 1 — the constant resolver.
 *
 * A real route table spells its paths as `path: AppRoutes.MY_OVERVIEW`: static fields on a class,
 * sometimes delegating a hop further (`AppRoutes.ADD = Global.ADD`) or composed out of sibling
 * fields in a template literal. A reference is chased through the imports of the file it *appears
 * in*, because the same identifier means different things in two modules, and anything that does
 * not bottom out in a string literal returns null — a wrong URL in a generated page object reads
 * as real and fails confusingly, so an unresolved path costs the route rather than inventing one.
 */
function createConstantResolver(detection: DetectionResult, {constantModules = false} = {}) {
  // Promises, not values: a module read from three route files is parsed once.
  const scopes = new Map<string, Promise<ConstantScope | null>>();

  function scopeOf(file: string) {
    const cached = scopes.get(file);
    if (cached) return cached;
    const pending = buildScope(file);
    scopes.set(file, pending);
    return pending;
  }

  async function buildScope(file: string): Promise<ConstantScope | null> {
    const source = readText(file);
    const ast = source ? await babelParse(source) : null;
    if (!ast) return null;
    const scope: ConstantScope = {fields: new Map(), imports: new Map()};
    const dir = path.dirname(file);
    // Top-level declarations only, not a whole-file walk: a `const` inside some function body is
    // not what a route table's identifier refers to, and collecting it could resolve a path to the
    // wrong string — which is the one failure mode worse than resolving nothing.
    for (const statement of astNodes(ast, 'program', 'body')) {
      const node = astNode(statement, 'declaration') ?? statement;
      if (statement.type === 'ImportDeclaration') {
        const specifier = astString(statement, 'source', 'value');
        const target = specifier ? resolveImportFile(dir, specifier, detection) : null;
        if (!target) continue;
        for (const bound of astNodes(statement, 'specifiers')) {
          const local = astString(bound, 'local', 'name');
          if (local) scope.imports.set(local, target);
        }
      } else if (node.type === 'ClassDeclaration') {
        const owner = astString(node, 'id', 'name');
        if (!owner) continue;
        for (const member of astNodes(node, 'body', 'body')) {
          const name = keyName(member);
          const value = astNode(member, 'value');
          if (astField(member, 'static') === true && name && value) scope.fields.set(`${owner}.${name}`, value);
        }
      } else if (node.type === 'TSEnumDeclaration') {
        const owner = astString(node, 'id', 'name');
        // Later Babel versions moved the member list under a `TSEnumBody` node; read either shape.
        const members = [...astNodes(node, 'members'), ...astNodes(node, 'body', 'members')];
        for (const member of members) {
          const name = keyName(member) ?? astString(member, 'id', 'name');
          const value = astNode(member, 'initializer');
          if (owner && name && value) scope.fields.set(`${owner}.${name}`, value);
        }
      } else if (node.type === 'VariableDeclaration') {
        for (const declarator of astNodes(node, 'declarations')) {
          const name = astString(declarator, 'id', 'name');
          const init = astNode(declarator, 'init');
          if (name && init) scope.fields.set(name, init);
        }
      }
    }
    return scope;
  }

  async function resolve(expr: AstNode | null | undefined, fromFile: string, hops = 0, seen = new Set<string>()): Promise<string | null> {
    if (!expr || hops > MAX_CONSTANT_HOPS) return null;
    if (expr.type === 'StringLiteral') return astString(expr, 'value') ?? null;
    if (expr.type === 'TemplateLiteral') {
      const quasis = astNodes(expr, 'quasis');
      const expressions = astNodes(expr, 'expressions');
      let joined = '';
      for (let i = 0; i < quasis.length; i++) {
        joined += astString(quasis[i], 'value', 'cooked') ?? astString(quasis[i], 'value', 'raw') ?? '';
        if (i >= expressions.length) continue;
        // A fresh `seen` per hole: `${A.X}/${A.X}` is two reads of one constant, not a cycle.
        const filled = await resolve(expressions[i], fromFile, hops + 1, new Set(seen));
        if (filled === null) return null;
        joined += filled;
      }
      return joined;
    }
    if (!constantModules) return null;
    if (expr.type === 'TSAsExpression' || expr.type === 'TSNonNullExpression') {
      return resolve(astNode(expr, 'expression'), fromFile, hops + 1, seen);
    }
    if (expr.type === 'Identifier') return lookup(astString(expr, 'name'), null, fromFile, hops, seen);
    if (expr.type === 'MemberExpression') {
      const owner = astString(expr, 'object', 'name');
      const field = astString(expr, 'property', 'name');
      if (!owner || !field) return null;
      return lookup(`${owner}.${field}`, owner, fromFile, hops, seen);
    }
    return null;
  }

  async function lookup(key: string | undefined, owner: string | null, fromFile: string, hops: number, seen: Set<string>): Promise<string | null> {
    if (!key || hops > MAX_CONSTANT_HOPS) return null;
    // A constant declared in terms of itself, directly or around a ring of modules, ends here.
    const marker = `${fromFile}|${key}`;
    if (seen.has(marker)) return null;
    seen.add(marker);
    const scope = await scopeOf(fromFile);
    if (!scope) return null;
    const declared = scope.fields.get(key);
    if (declared) return resolve(declared, fromFile, hops + 1, seen);
    const target = scope.imports.get(owner ?? key);
    return target ? lookup(key, owner, target, hops + 1, seen) : null;
  }

  async function importsOf(file: string) {
    return (await scopeOf(file))?.imports ?? new Map<string, string>();
  }

  return {resolve, importsOf};
}

interface RouteWalk {
  detection: DetectionResult;
  lib: string;
  config: RouterConfigTraversal;
  constants: ReturnType<typeof createConstantResolver>;
  asts: Map<string, Promise<AstNode | null>>;
  routes: RouteRecord[];
  visits: number;
}

function astOf(walk: RouteWalk, file: string) {
  const cached = walk.asts.get(file);
  if (cached) return cached;
  const source = readText(file);
  const pending = source ? babelParse(source) : Promise.resolve(null);
  walk.asts.set(file, pending);
  return pending;
}

// Parent and child paths compose, and `path: ''` — a layout route — is legal and common, so the
// join has to drop the empty segment rather than leave `//` behind. Same shape as nestRoutes().
function joinRoutePath(parent: string, child: string) {
  return `/${[parent, child].filter(Boolean).join('/')}`.replace(/\/+/g, '/');
}

// `loadChildren: () => import('app/pages/x/x.routes').then(m => m.xRoutes)` — the specifier is the
// only half of that expression static analysis can follow, and the named export does not matter
// because the child file is read whole.
function lazyImportTarget(walk: RouteWalk, value: AstNode, file: string): string | null {
  let specifier: string | null = null;
  walkAst(value, (node) => {
    if (specifier !== null || node.type !== 'CallExpression') return;
    if (astString(node, 'callee', 'type') !== 'Import') return;
    specifier = astString(node, 'arguments', 0, 'value') ?? null;
  });
  return specifier ? resolveImportFile(path.dirname(file), specifier, walk.detection) : null;
}

function claimSubtree(object: AstNode, claimed: Set<AstNode>) {
  walkAst(object, (node) => {
    if (node.type === 'ObjectExpression') claimed.add(node);
  });
}

/**
 * Mechanism 2 — the lazy-child traversal.
 *
 * One route file, its inline `children:` arrays, and every file its `loadChildren` reaches, with
 * the parent's path joined onto each child's. `branch` holds the files on the path from the root to
 * here, so a module ring cannot recurse forever while a child file loaded under three different
 * parents is still read three times — which it must be, because those are three different URLs.
 * Returns how many routes the file contributed, which is what tells the caller whether a grouping
 * node was covered by its own children.
 */
async function walkRouteFile(walk: RouteWalk, file: string, prefix: string, depth: number, branch: Set<string>): Promise<number> {
  if (depth > (walk.config.maxDepth ?? DEFAULT_ROUTE_DEPTH) || walk.visits >= MAX_ROUTE_FILE_VISITS) return 0;
  walk.visits += 1;
  const ast = await astOf(walk, file);
  if (!ast) return 0;
  const objects: AstNode[] = [];
  walkAst(ast, (node) => {
    if (node.type === 'ObjectExpression' && astNodes(node, 'properties').some((p) => keyName(p) === 'path')) objects.push(node);
  });
  // The walk is pre-order, so a parent is seen before its own `children:` entries and claims them.
  // Whatever is still unclaimed is a route array's top level, wherever in the file it was declared.
  const claimed = new Set<AstNode>();
  let emitted = 0;
  for (const object of objects) {
    if (claimed.has(object)) continue;
    emitted += await walkRouteObject(walk, object, file, prefix, depth, branch, claimed);
  }
  if (emitted === 0 && (walk.config.reexportCalls?.length ?? 0) > 0) {
    emitted += await followReexports(walk, ast, file, prefix, depth, branch);
  }
  return emitted;
}

async function walkRouteObject(
  walk: RouteWalk, object: AstNode, file: string, prefix: string,
  depth: number, branch: Set<string>, claimed: Set<AstNode>,
): Promise<number> {
  claimed.add(object);
  const properties = astNodes(object, 'properties');
  const routePath = await walk.constants.resolve(astNode(properties.find((p) => keyName(p) === 'path'), 'value'), file);
  // An unresolved path takes its whole subtree with it: a child joined onto a missing prefix would
  // name a URL the app does not serve, which is exactly the guess this analyzer must not make.
  if (routePath === null) {
    claimSubtree(object, claimed);
    return 0;
  }
  const full = joinRoutePath(prefix, routePath);

  const children = (walk.config.childrenKeys ?? [])
    .flatMap((key) => astNodes(properties.find((p) => keyName(p) === key), 'value', 'elements'))
    .filter((child) => child.type === 'ObjectExpression');
  let emitted = 0;
  for (const child of children) {
    emitted += await walkRouteObject(walk, child, file, full, depth + 1, branch, claimed);
  }
  const lazy = (walk.config.lazyKeys ?? []).map((key) => astNode(properties.find((p) => keyName(p) === key), 'value'));
  for (const value of lazy) {
    const target = value ? lazyImportTarget(walk, value, file) : null;
    if (!target || branch.has(target)) continue;
    emitted += await walkRouteFile(walk, target, full, depth + 1, new Set(branch).add(target));
  }

  const componentKeys = walk.config.componentKeys ?? DEFAULT_COMPONENT_KEYS;
  const componentProp = properties.find((p) => componentKeys.includes(keyName(p)!));
  const component = componentDescription(astNode(componentProp, 'value'));
  const grouping = children.length > 0 || lazy.some((value) => value !== undefined);
  // A pure grouping node is a URL prefix, not a page: navigating to it lands on whichever child
  // declares `path: ''`, and that child is emitted in its own right. So it is kept only when it
  // renders something itself, or when nothing beneath it resolved and dropping it would lose the
  // one path we do know.
  if (component === null && grouping && emitted > 0) return emitted;
  const nameProp = properties.find((p) => keyName(p) === 'name' && astNode(p, 'value')?.type === 'StringLiteral');
  walk.routes.push({
    path: normalisePath(full),
    name: astString(nameProp, 'value', 'value') ?? null,
    component,
    params: paramsOf(full),
    source: `${rel(walk.detection.appPath, file)} (${walk.lib} config)`,
  });
  return emitted + 1;
}

// A lazy target that declares no routes of its own is asked one more question: which imported
// identifier does it hand to a router-registration call? That is the NgModule shape — the module
// only wires `RouterModule.forChild(submissionsRoutes)` onto an array declared next door.
async function followReexports(walk: RouteWalk, ast: AstNode, file: string, prefix: string, depth: number, branch: Set<string>): Promise<number> {
  const registered = new Set<string>();
  walkAst(ast, (node) => {
    if (node.type !== 'CallExpression' || astNode(node, 'callee')?.type !== 'MemberExpression') return;
    const method = astString(node, 'callee', 'property', 'name');
    if (!method || !walk.config.reexportCalls!.includes(method)) return;
    const argument = astString(node, 'arguments', 0, 'name');
    if (argument) registered.add(argument);
  });
  const imports = await walk.constants.importsOf(file);
  let emitted = 0;
  for (const name of registered) {
    const target = imports.get(name);
    if (!target || branch.has(target)) continue;
    emitted += await walkRouteFile(walk, target, prefix, depth + 1, new Set(branch).add(target));
  }
  return emitted;
}

// A lazily-loaded child whose own path is `''` names the same URL as the parent that loaded it, and
// two parents can load one shared child file. Keep one row per URL, preferring the row that names a
// component, because that is the one telling the generator what the page renders.
function dedupeByPath(routes: RouteRecord[]): RouteRecord[] {
  const byPath = new Map<string, RouteRecord>();
  for (const route of routes) {
    const kept = byPath.get(route.path);
    if (!kept || (!kept.component && route.component)) byPath.set(route.path, route);
  }
  return [...byPath.values()];
}

async function routerConfigRoutes(detection: DetectionResult): Promise<RouteRecord[]> {
  const lib = detection.frontend.routerLib!;
  const config = detection.frontend.entry.routerConfig ?? {};
  const candidates = findFiles(detection.frontend.sourceRoot,
    (file) => /\.(m?[jt]sx?)$/.test(file) && (readText(file) ?? '').includes(lib), {maxDepth: 8});
  for (const file of candidates) {
    const walk: RouteWalk = {
      detection, lib, config, asts: new Map(), routes: [], visits: 0,
      constants: createConstantResolver(detection, {constantModules: config.constantModules === true}),
    };
    await walkRouteFile(walk, file, '', 0, new Set([file]));
    if (walk.routes.length > 0) return dedupeByPath(walk.routes);
  }
  return [];
}

function componentDescription(value: AstNode | null | undefined): string | null {
  if (!value) return null;
  if (value.type === 'Identifier') return astString(value, 'name') ?? null;
  if (value.type === 'JSXElement') return astString(value, 'openingElement', 'name', 'name') ?? null;
  if (value.type === 'StringLiteral') return astString(value, 'value') ?? null;
  // `component: () => import('./Foo.vue')` — the specifier is the useful half.
  let found: string | null = null;
  walkAst(value, (node) => {
    const text = astString(node, 'value');
    if (!found && node.type === 'StringLiteral' && text?.includes('/')) found = text;
  });
  return found;
}

// --- strategy 3: a server-routed app ----------------------------------------------------

/**
 * Some server-rendered apps hand a component *name* to the frontend rather than a file. Build a
 * name -> file map by reading every object literal that maps a quoted name to an imported symbol,
 * which is the shape of a component registry regardless of the framework that consumes it.
 */
async function componentIndex(detection: DetectionResult): Promise<Map<string, string>> {
  const index = new Map<string, string>();
  const files = findFiles(detection.frontend.sourceRoot,
    (file, base) => /^index\.[jt]s$/.test(base) || /^main\.[jt]s$/.test(base), {maxDepth: 6});
  for (const file of files) {
    const source = readText(file);
    const ast = source ? await babelParse(source) : null;
    if (!ast) continue;
    const imports = new Map<string, string>();
    walkAst(ast, (node) => {
      if (node.type !== 'ImportDeclaration') return;
      const source = astString(node, 'source', 'value');
      if (source === undefined) return;
      for (const specifier of astNodes(node, 'specifiers')) {
        const name = astString(specifier, 'local', 'name');
        if (name !== undefined) imports.set(name, source);
      }
    });
    walkAst(ast, (node) => {
      if (node.type !== 'ObjectProperty' || astNode(node, 'key')?.type !== 'StringLiteral') return;
      if (astNode(node, 'value')?.type !== 'Identifier') return;
      const name = astString(node, 'value', 'name');
      const key = astString(node, 'key', 'value');
      if (name === undefined || key === undefined) return;
      const target = imports.get(name);
      if (!target) return;
      index.set(key, resolveImport(path.dirname(file), target, detection));
    });
  }
  return index;
}

const IMPORT_EXTENSIONS = ['', '.vue', '.svelte', '.tsx', '.jsx', '.ts', '.js', '/index.vue', '/index.ts', '/index.js'];

/** The absolute file an import specifier names, or null when nothing on disk answers to it. */
function resolveImportFile(fromDir: string, specifier: string, detection: DetectionResult): string | null {
  const bases = specifier.startsWith('.')
    ? [path.resolve(fromDir, specifier)]
    : [path.join(detection.frontend.sourceRoot, specifier.replace(/^[@~]\//, ''))];
  for (const base of bases) {
    for (const ext of IMPORT_EXTENSIONS) {
      if (fs.existsSync(base + ext) && fs.statSync(base + ext).isFile()) return base + ext;
    }
  }
  return null;
}

function resolveImport(fromDir: string, specifier: string, detection: DetectionResult) {
  const file = resolveImportFile(fromDir, specifier, detection);
  return file ? rel(detection.appPath, file) : specifier;
}

async function serverRoutes(detection: DetectionResult, apiPrefix: string): Promise<RouteRecord[]> {
  const backend = detection.backend!;
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

export async function collectRoutes(detection: DetectionResult, {apiPrefix = '/api'} = {}): Promise<RouteCollection> {
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

function render(detection: DetectionResult, result: RouteCollection, apiPrefix: string) {
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

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
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

export {fileRouteFor, joinRoutePath, normalisePath, render as renderRoutes};
