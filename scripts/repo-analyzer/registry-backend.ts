// One entry per backend framework. Every entry exposes the same `routes(root)` interface, so
// api-docs.mjs and routes.mjs never branch on which framework they are looking at.
//
//   id/label   stable slug + human name
//   deps       manifest dependencies that identify it (package.json, composer.json, …)
//   markers    relative paths that must exist, for frameworks a dependency name cannot pin down
//   method     how routes are read — reported in the output so a reader can judge the result
//   routes     async (root) -> Route[]  where Route is
//              { path, methods, name, purpose, source, kind: 'api' | 'page', component }
//   componentBridge  regex pulling the frontend component name out of a server controller

import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import {astNode, astNodes, astString} from './ast.js';
import {babelParse, keyName, walkAst} from './parsers.js';
import {findFiles, readJson, readText, rel, unique} from './util.js';
import type {BackendRegistryEntry, BackendRoute} from './types.js';

interface SymfonyRouteEntry {
  path?: string;
  methods?: unknown[];
  defaults?: {_api?: string};
  controller?: string;
  requirements?: Record<string, unknown>;
}

interface JsonRouteEntry {
  route?: string;
  path?: string;
  method?: string;
  methods?: string[];
  name?: string;
  actionClassName?: string;
  action?: string;
  params?: Record<string, string>;
}

const HTTP_METHODS = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options'];

/** `/api/v2/pim/employees/{empNumber}` -> ['empNumber']; also handles :id and <int:id>. */
/** A route path is an absolute path; a framework config is not obliged to write it as one. */
function rooted(path: string) {
  const value = String(path).trim();
  return value.startsWith('/') ? value : `/${value}`;
}

export function paramsOf(routePath: string): string[] {
  return unique([
    ...String(routePath).matchAll(/\{([^}/]+)\}|:([A-Za-z_][\w]*)|<(?:[^:>]+:)?([^>]+)>/g),
  ].map((m) => (m[1] ?? m[2] ?? m[3]).split(/[<:]/).pop()!));
}

// --- Symfony ---------------------------------------------------------------------------

function symfonyYamlRoutes(root: string): BackendRoute[] {
  const files = findFiles(root, (file) => /(^|\/)config\/(routes[^/]*\.ya?ml|routes\/[^/]+\.ya?ml)$/.test(rel(root, file)), {maxDepth: 6});
  const routes = [];
  for (const file of files) {
    let doc;
    try {
      doc = yaml.load(readText(file) ?? '') as Record<string, SymfonyRouteEntry> | null;
    } catch {
      continue;
    }
    if (!doc || typeof doc !== 'object') continue;
    for (const [name, entry] of Object.entries(doc)) {
      if (!entry || typeof entry !== 'object' || typeof entry.path !== 'string') continue;
      routes.push({
        name,
        path: rooted(entry.path),
        methods: (entry.methods ?? ['GET']).map((m) => String(m).toUpperCase()),
        purpose: entry.defaults?._api ?? entry.controller ?? null,
        controller: typeof entry.controller === 'string' ? entry.controller : null,
        requirements: entry.requirements ?? null,
        source: rel(root, file),
      });
    }
  }
  return routes;
}

function symfonyAttributeRoutes(root: string): BackendRoute[] {
  const controllers = findFiles(root, (file) => file.endsWith('Controller.php'), {maxDepth: 8});
  const routes = [];
  for (const file of controllers) {
    const source = readText(file);
    if (!source || !source.includes('#[Route')) continue;
    for (const match of source.matchAll(/#\[Route\(\s*(?:path:\s*)?['"]([^'"]+)['"]([^\]]*)\]/g)) {
      const methods = [...(match[2] ?? '').matchAll(/['"](GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)['"]/g)].map((m) => m[1]);
      routes.push({
        name: null,
        path: rooted(match[1]),
        methods: methods.length > 0 ? methods : ['GET'],
        purpose: path.basename(file, '.php'),
        controller: path.basename(file, '.php'),
        requirements: null,
        source: rel(root, file),
      });
    }
  }
  return routes;
}

/** Follow a Symfony controller reference back to the Vue component name it renders. */
function symfonyComponentFor(root: string, controllerRef: string | null) {
  if (!controllerRef) return null;
  const className = String(controllerRef).split('::')[0].split('\\').pop();
  if (!className || !className.endsWith('Controller')) return null;
  const file = findFiles(root, (f) => path.basename(f) === `${className}.php`, {maxDepth: 8})[0];
  const source = file ? readText(file) : null;
  return source?.match(/new Component\(\s*['"]([^'"]+)['"]/)?.[1] ?? null;
}

// --- JavaScript backends ---------------------------------------------------------------

async function expressRoutes(root: string): Promise<BackendRoute[]> {
  const files = findFiles(root, (file) => /\.(m?js|ts)$/.test(file) && !/\.d\.ts$/.test(file), {maxDepth: 6});
  const routes: BackendRoute[] = [];
  for (const file of files) {
    const source = readText(file);
    if (!source || !/\.(get|post|put|patch|delete|use)\s*\(/.test(source)) continue;
    const ast = await babelParse(source);
    if (!ast) continue;
    walkAst(ast, (node) => {
      if (node.type !== 'CallExpression' || astNode(node, 'callee')?.type !== 'MemberExpression') return;
      const method = astString(node, 'callee', 'property', 'name');
      if (!method || !HTTP_METHODS.includes(method)) return;
      const arg = astNode(node, 'arguments', 0);
      const routePath = astString(arg, 'value');
      if (arg?.type !== 'StringLiteral' || !routePath?.startsWith('/')) return;
      routes.push({
        name: null, path: routePath, methods: [method.toUpperCase()],
        purpose: astString(node, 'callee', 'object', 'name') ?? null, controller: null, requirements: null,
        source: rel(root, file),
      });
    });
  }
  return routes;
}

async function nestRoutes(root: string): Promise<BackendRoute[]> {
  const files = findFiles(root, (file) => file.endsWith('.controller.ts') || file.endsWith('.controller.js'), {maxDepth: 8});
  const routes: BackendRoute[] = [];
  for (const file of files) {
    const source = readText(file);
    const ast = source ? await babelParse(source) : null;
    if (!ast) continue;
    walkAst(ast, (node) => {
      if (node.type !== 'ClassDeclaration') return;
      const controllerDecorator = astNodes(node, 'decorators')
        .find((d) => astString(d, 'expression', 'callee', 'name') === 'Controller');
      const base = astString(controllerDecorator, 'expression', 'arguments', 0, 'value') ?? '';
      for (const member of astNodes(node, 'body', 'body')) {
        for (const decorator of astNodes(member, 'decorators')) {
          const method = astString(decorator, 'expression', 'callee', 'name') ?? astString(decorator, 'expression', 'name');
          if (!method || !HTTP_METHODS.includes(method.toLowerCase())) continue;
          const suffix = astString(decorator, 'expression', 'arguments', 0, 'value') ?? '';
          routes.push({
            name: astString(member, 'key', 'name') ?? null,
            path: `/${[base, suffix].filter(Boolean).join('/')}`.replace(/\/+/g, '/'),
            methods: [method.toUpperCase()],
            purpose: `${astString(node, 'id', 'name') ?? ''}.${astString(member, 'key', 'name') ?? ''}`,
            controller: astString(node, 'id', 'name') ?? null, requirements: null,
            source: rel(root, file),
          });
        }
      }
    });
  }
  return routes;
}

// --- pattern-scanned backends -----------------------------------------------------------
// PHP, Python, Ruby and Java have no parser available here, so these read one declaration
// line at a time rather than a whole file, and the report names the method used.

function scanRoutes(root: string, {filePredicate, pattern, build, maxDepth = 8}: {
  filePredicate: (file: string) => boolean;
  pattern: RegExp;
  build: (match: RegExpMatchArray, file: string) => (Pick<BackendRoute, 'path' | 'methods' | 'purpose'> | null);
  maxDepth?: number;
}): BackendRoute[] {
  const routes = [];
  for (const file of findFiles(root, filePredicate, {maxDepth})) {
    const source = readText(file);
    if (!source) continue;
    for (const match of source.matchAll(pattern)) {
      const route = build(match, file);
      if (route) routes.push({name: null, requirements: null, controller: null, ...route, source: rel(root, file)});
    }
  }
  return routes;
}

const laravelRoutes = (root: string) => scanRoutes(root, {
  filePredicate: (file) => /(^|\/)routes\/[^/]+\.php$/.test(rel(root, file)),
  pattern: /Route::(get|post|put|patch|delete|any|match)\s*\(\s*['"]([^'"]+)['"]\s*,\s*([^)]*)/g,
  build: (m) => ({path: m[2].startsWith('/') ? m[2] : `/${m[2]}`, methods: [m[1].toUpperCase()], purpose: m[3].trim().slice(0, 80) || null}),
});

const djangoRoutes = (root: string) => scanRoutes(root, {
  filePredicate: (file) => path.basename(file) === 'urls.py',
  pattern: /\b(?:path|re_path|url)\s*\(\s*r?['"]([^'"]*)['"]\s*,\s*([^,)]+)/g,
  build: (m) => ({path: m[1].startsWith('/') ? m[1] : `/${m[1]}`, methods: ['GET'], purpose: m[2].trim()}),
});

const pyDecoratorRoutes = (root: string) => scanRoutes(root, {
  filePredicate: (file) => file.endsWith('.py'),
  pattern: /@\w+\.(get|post|put|patch|delete|route)\s*\(\s*['"]([^'"]+)['"]([^)]*)\)/g,
  build: (m) => {
    const declared = [...(m[3] ?? '').matchAll(/['"](GET|POST|PUT|PATCH|DELETE)['"]/g)].map((x) => x[1]);
    const methods = m[1] === 'route' ? (declared.length > 0 ? declared : ['GET']) : [m[1].toUpperCase()];
    return {path: m[2], methods};
  },
});

const railsRoutes = (root: string) => scanRoutes(root, {
  filePredicate: (file) => rel(root, file) === 'config/routes.rb',
  pattern: /^\s*(get|post|put|patch|delete)\s+['"]([^'"]+)['"](?:\s*,\s*to:\s*['"]([^'"]+)['"])?/gm,
  build: (m) => ({path: m[2].startsWith('/') ? m[2] : `/${m[2]}`, methods: [m[1].toUpperCase()], purpose: m[3] ?? null}),
});

const springRoutes = (root: string) => scanRoutes(root, {
  filePredicate: (file) => file.endsWith('.java') || file.endsWith('.kt'),
  pattern: /@(Get|Post|Put|Patch|Delete|Request)Mapping\s*\(\s*(?:value\s*=\s*)?['"]([^'"]+)['"]/g,
  build: (m) => ({path: m[2].startsWith('/') ? m[2] : `/${m[2]}`, methods: [m[1] === 'Request' ? 'ANY' : m[1].toUpperCase()]}),
});

function isJsonRouteManifest(file: string) {
  if (path.basename(file) !== 'routes.json') return false;
  const doc = readJson(file);
  return Array.isArray(doc) && doc.some((entry) => {
    const routePath = entry?.route ?? entry?.path;
    const method = entry?.method ?? entry?.methods;
    return typeof routePath === 'string' && (typeof method === 'string' || Array.isArray(method));
  });
}

function jsonRouteManifestRoutes(root: string): BackendRoute[] {
  const routes = [];
  for (const file of findFiles(root, isJsonRouteManifest, {maxDepth: 8})) {
    for (const entry of readJson<JsonRouteEntry[]>(file) ?? []) {
      const routePath = entry?.route ?? entry?.path;
      const methods = entry?.methods ?? entry?.method ?? ['GET'];
      if (typeof routePath !== 'string') continue;
      routes.push({
        name: entry.name ?? null,
        path: rooted(routePath),
        methods: (Array.isArray(methods) ? methods : [methods]).map((m) => String(m).toUpperCase()),
        purpose: entry.actionClassName ?? entry.params?.action ?? entry.action ?? entry.params?.controller ?? null,
        controller: entry.params?.controller ?? null,
        requirements: entry.params ?? null,
        kind: 'api',
        source: rel(root, file),
      });
    }
  }
  return routes;
}

export const BACKEND_REGISTRY: BackendRegistryEntry[] = [
  {
    id: 'json-routes', label: 'JSON route manifest', deps: [], filePredicate: isJsonRouteManifest,
    method: 'routes.json manifest', routes: async (root) => jsonRouteManifestRoutes(root),
  },
  {
    id: 'symfony', label: 'Symfony', deps: ['symfony/framework-bundle', 'symfony/http-kernel', 'symfony/routing'],
    method: 'config/routes*.yaml + #[Route] attributes',
    routes: async (root) => [...symfonyYamlRoutes(root), ...symfonyAttributeRoutes(root)],
    componentFor: symfonyComponentFor,
  },
  {
    id: 'laravel', label: 'Laravel', deps: ['laravel/framework'],
    method: 'routes/*.php declarations', routes: async (root) => laravelRoutes(root),
  },
  {
    id: 'nest', label: 'NestJS', deps: ['@nestjs/core'],
    method: '@Controller / @Get decorators (AST)', routes: nestRoutes,
  },
  {
    id: 'express', label: 'Express / Fastify / Koa', deps: ['express', 'fastify', 'koa', '@hapi/hapi'],
    method: 'app.get(...) call sites (AST)', routes: expressRoutes,
  },
  {
    id: 'django', label: 'Django', deps: ['django', 'Django'], markers: ['manage.py'],
    method: 'urls.py urlpatterns', routes: async (root) => djangoRoutes(root),
  },
  {
    id: 'fastapi', label: 'FastAPI / Flask', deps: ['fastapi', 'flask', 'Flask'],
    method: '@app.get / @app.route decorators', routes: async (root) => pyDecoratorRoutes(root),
  },
  {
    id: 'rails', label: 'Ruby on Rails', deps: ['rails'], markers: ['config/routes.rb'],
    method: 'config/routes.rb', routes: async (root) => railsRoutes(root),
  },
  {
    id: 'spring', label: 'Spring', deps: ['spring-boot', 'spring-boot-starter-web', 'org.springframework.boot'],
    method: '@RequestMapping / @GetMapping annotations', routes: async (root) => springRoutes(root),
  },
];

export function matchBackend(deps: Record<string, string>, root: string): BackendRegistryEntry | null {
  return BACKEND_REGISTRY.find((entry) => {
    const byDep = entry.deps.some((dep) => dep in deps);
    const byMarker = (entry.markers ?? []).some((marker) => fs.existsSync(path.join(root, marker)));
    const byFile = entry.filePredicate ? findFiles(root, entry.filePredicate, {maxDepth: 8}).length > 0 : false;
    return byDep || byMarker || byFile;
  }) ?? null;
}

export {keyName, jsonRouteManifestRoutes};
