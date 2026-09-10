// One entry per backend framework. Every entry exposes the same `routes(root)` interface, so
// api-docs.ts and routes.ts never branch on which framework they are looking at.
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
import {findFiles, readJson, readText, rel, tryImport, unique} from './util.js';
import type {CstElement, CstNode as JavaCstNode} from 'java-parser';
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
  // The two brace-and-colon spellings put the name on opposite sides of the colon: Spring writes
  // a regex constraint after it (`{id:[0-9]+}` names `id`), Django a converter before it
  // (`<int:id>` also names `id`), so the brace form cannot share the other's `.pop()`.
  return unique([
    ...String(routePath).matchAll(/\{([^}/]+)\}|:([A-Za-z_][\w]*)|<(?:[^:>]+:)?([^>]+)>/g),
  ].map((m) => (m[1] !== undefined ? m[1].split(':')[0].trim() : (m[2] ?? m[3]).split(/[<:]/).pop()!)));
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

// --- Spring (Java AST) ------------------------------------------------------------------
// Spring joins a class-level @RequestMapping base onto each method's own path — the same shape
// nestRoutes reads for Nest — which a line-at-a-time regex cannot do, and it spells one mapping
// six ways (`value =`, `path =`, bare, an array, a `method =` beside any of them). java-parser
// gives the structure, and leaves comments out of the CST so a commented-out @GetMapping cannot
// be read as a live one. Everything below walks the annotation *structure* rather than
// harvesting string literals: a returned view name is a string literal too.
//
// Java only: java-parser cannot read Kotlin, so a Kotlin Spring app falls to Tier C — which says
// the app has to run — rather than being half-read. `springRoutes` counts and names the Kotlin
// files it had to skip, because Tier C's own text cannot say why it was reached.

type JavaNode = JavaCstNode | undefined;

// A Map, not an object: `annotationName` returns whatever the source wrote, and a plain object
// would answer `constructor` or `toString` truthily through its prototype.
const SPRING_VERB_FOR = new Map([
  ['GetMapping', 'GET'], ['PostMapping', 'POST'], ['PutMapping', 'PUT'],
  ['PatchMapping', 'PATCH'], ['DeleteMapping', 'DELETE'], ['RequestMapping', 'ANY'],
]);

const REQUEST_METHODS = new Set(['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS', 'TRACE']);
const VIEW_RETURN_TYPES = new Set(['String', 'ModelAndView']);

// A Maven module buries its packages nine directories deep before the file
// (`src/main/java/com/acme/app/web/rest/FooController.java`), and a multi-module repo adds more.
const JAVA_MAX_DEPTH = 18;

// Parsing every Java file in a large repo costs minutes, and only a file that mentions a mapping
// annotation can declare an endpoint. Over-matching is free: the parser then finds nothing.
const SPRING_MAPPING_HINT = /@(?:Request|Get|Post|Put|Patch|Delete)Mapping\b/;

// A mock controller in a unit test declares mappings the deployed app never serves, and a
// fabricated URL in the endpoint reference is exactly what that reference exists to prevent.
// Kotlin is walked only to be counted and warned about — java-parser cannot read it.
const TEST_SOURCE_ROOT = /(^|\/)src\/(test|it)\/(java|kotlin)\//;

function isSpringSource(relative: string) {
  return /\.(java|kt)$/.test(relative) && !TEST_SOURCE_ROOT.test(relative);
}

interface SpringApplicationYaml {
  server?: {servlet?: {'context-path'?: string}; 'context-path'?: string};
}

// A Chevrotain CST node holds `children`; a token holds `image` and no children. The parameter
// admits the wide node type too, so the narrowed type stays assignable to it.
function isCstNode(element: CstElement | JavaCstNode): element is JavaCstNode {
  return (element as JavaCstNode).children !== undefined;
}

function cstNodes(node: JavaNode, key: string): JavaCstNode[] {
  const nodes: JavaCstNode[] = [];
  for (const element of node?.children[key] ?? []) if (isCstNode(element)) nodes.push(element);
  return nodes;
}

function cstImages(node: JavaNode, key: string): string[] {
  const images: string[] = [];
  for (const element of node?.children[key] ?? []) if (!isCstNode(element)) images.push(element.image);
  return images;
}

/** One child per step down a chain of grammar rules, which is the shape most Java rules have. */
function cstStep(node: JavaNode, ...keys: string[]): JavaNode {
  let current = node;
  for (const key of keys) current = cstNodes(current, key)[0];
  return current;
}

/** Every node carrying this rule name below the given one, itself included. */
function cstFind(node: JavaNode, name: string): JavaCstNode[] {
  const found: JavaCstNode[] = [];
  const visit = (current: JavaCstNode) => {
    if (current.name === name) found.push(current);
    for (const key of Object.keys(current.children)) for (const child of cstNodes(current, key)) visit(child);
  };
  if (node) visit(node);
  return found;
}

/** A fully qualified `@org.springframework.web.bind.annotation.GetMapping` ends in the simple name. */
function annotationName(annotation: JavaCstNode): string {
  return cstImages(cstStep(annotation, 'typeName'), 'Identifier').at(-1) ?? '';
}

function annotationAttribute(annotation: JavaCstNode, names: string[]): JavaNode {
  for (const pair of cstNodes(cstStep(annotation, 'elementValuePairList'), 'elementValuePair')) {
    if (names.includes(cstImages(pair, 'Identifier')[0] ?? '')) return cstNodes(pair, 'elementValue')[0];
  }
  return undefined;
}

/**
 * One element value is one path, or nothing. A `+` between its parts is a refusal either way:
 * `"/a" + CONST` needs the classpath, and `"/a" + "/b"` is a single path whose two literals would
 * otherwise read exactly like the array form and emit two endpoints the app does not serve.
 */
function elementValuePath(value: JavaCstNode): string | null {
  const composed = cstFind(value, 'binaryExpression').some((node) => cstImages(node, 'BinaryOperator').length > 0);
  if (composed || cstFind(value, 'fqnOrRefType').length > 0) return null;
  const literals = cstFind(value, 'literal').flatMap((node) => cstImages(node, 'StringLiteral'));
  return literals.length === 1 ? literals[0].slice(1, -1) : null;
}

/**
 * The paths one mapping annotation declares. `[]` means it declares none — a bare `@GetMapping`,
 * one carrying only `produces`, or an empty `{}` — and inherits the class base. `null` means it
 * declares one that cannot be resolved here, and half a path is worse than no path, so the caller
 * drops the mapping. The array form is the only spelling that yields more than one path.
 */
function mappingPaths(annotation: JavaCstNode): string[] | null {
  const value = cstNodes(annotation, 'elementValue')[0] ?? annotationAttribute(annotation, ['value', 'path']);
  if (!value) return [];
  const initializer = cstStep(value, 'elementValueArrayInitializer');
  const elements = initializer ? cstNodes(cstStep(initializer, 'elementValueList'), 'elementValue') : [value];
  const paths: string[] = [];
  for (const element of elements) {
    const resolved = elementValuePath(element);
    if (resolved === null) return null;
    paths.push(resolved);
  }
  return paths;
}

/** `method = RequestMethod.POST`, `method = { GET, POST }` and the static-import spelling alike. */
function mappingMethods(annotation: JavaCstNode): string[] {
  const declared = cstFind(annotationAttribute(annotation, ['method']), 'fqnOrRefTypePartCommon')
    .flatMap((part) => cstImages(part, 'Identifier'))
    .filter((image) => REQUEST_METHODS.has(image));
  // A @RequestMapping naming no verb answers every one of them, which the report spells ANY.
  return declared.length > 0 ? unique(declared) : [SPRING_VERB_FOR.get(annotationName(annotation)) ?? 'ANY'];
}

/**
 * Spring's own rule, never this app's: a mapped method is an endpoint unless it demonstrably
 * returns a view. @ResponseBody — which @RestController implies — settles it either way, so a
 * @Controller whose methods write JSON to the response is API, and only a String/ModelAndView
 * return with no @ResponseBody anywhere is a page.
 */
function springKind(returnType: string, annotationNames: string[]): 'api' | 'page' {
  if (annotationNames.includes('ResponseBody') || annotationNames.includes('RestController')) return 'api';
  return VIEW_RETURN_TYPES.has(returnType) ? 'page' : 'api';
}

/** `{id:[0-9]+}` constrains `id` the way a Symfony route's `requirements:` block does. */
function springRequirements(routePath: string): Record<string, string> | null {
  const entries = [...routePath.matchAll(/\{([A-Za-z_]\w*)\s*:\s*([^}]+)\}/g)].map((m) => [m[1], m[2].trim()]);
  return entries.length > 0 ? Object.fromEntries(entries) : null;
}

function classMethods(normalClass: JavaNode): JavaCstNode[] {
  return cstNodes(cstStep(normalClass, 'classBody'), 'classBodyDeclaration')
    .flatMap((declaration) => cstNodes(declaration, 'classMemberDeclaration'))
    .flatMap((member) => cstNodes(member, 'methodDeclaration'));
}

/**
 * The declared return type only, and only when it is a plain class type: `void` and a primitive
 * read as ''. `String[]` still reaches `unannClassType`, so the array dims are checked as a direct
 * child of `unannReferenceType` — deep would also catch the `String[]` inside `List<String[]>`,
 * whose return type really is `List`.
 */
function methodFacts(method: JavaCstNode) {
  const header = cstStep(method, 'methodHeader');
  const reference = cstStep(header, 'result', 'unannType', 'unannReferenceType');
  const returned = cstStep(reference, 'unannClassOrInterfaceType', 'unannClassType');
  return {
    name: cstImages(cstStep(header, 'methodDeclarator'), 'Identifier')[0] ?? null,
    returnType: cstNodes(reference, 'dims').length > 0 ? '' : cstImages(returned, 'Identifier').at(-1) ?? '',
    annotations: cstNodes(method, 'methodModifier').flatMap((modifier) => cstNodes(modifier, 'annotation')),
  };
}

function joinSpringPath(segments: string[]) {
  const joined = `/${segments.filter(Boolean).join('/')}`.replace(/\/+/g, '/');
  return joined.length > 1 ? joined.replace(/\/$/, '') : joined;
}

/**
 * One Java file's endpoints. The unit is the class, not the file: an inner class carries its own
 * @RequestMapping base and does not inherit the enclosing one's.
 */
function springFileRoutes(root: string, file: string, cst: JavaCstNode, contextPath: string): BackendRoute[] {
  const routes: BackendRoute[] = [];
  for (const declaration of cstFind(cst, 'classDeclaration')) {
    const classAnnotations = cstNodes(declaration, 'classModifier').flatMap((modifier) => cstNodes(modifier, 'annotation'));
    const classNames = classAnnotations.map(annotationName);
    const classMapping = classAnnotations.find((annotation) => annotationName(annotation) === 'RequestMapping');
    const bases = classMapping ? mappingPaths(classMapping) : [];
    // An unresolvable base would mis-root every method beneath it, so the class is dropped whole.
    if (bases === null) continue;
    const normalClass = cstStep(declaration, 'normalClassDeclaration');
    const controller = cstImages(cstStep(normalClass, 'typeIdentifier'), 'Identifier')[0] ?? null;
    for (const method of classMethods(normalClass)) {
      const {name, returnType, annotations} = methodFacts(method);
      const kind = springKind(returnType, [...classNames, ...annotations.map(annotationName)]);
      for (const annotation of annotations) {
        if (!SPRING_VERB_FOR.has(annotationName(annotation))) continue;
        const suffixes = mappingPaths(annotation);
        if (suffixes === null) continue;
        const methods = mappingMethods(annotation);
        for (const base of bases.length > 0 ? bases : ['']) {
          for (const suffix of suffixes.length > 0 ? suffixes : ['']) {
            const routePath = joinSpringPath([contextPath, base, suffix]);
            routes.push({
              path: routePath, methods, source: rel(root, file), name, controller,
              purpose: `${controller ?? ''}.${name ?? ''}`,
              requirements: springRequirements(routePath), kind,
            });
          }
        }
      }
    }
  }
  return routes;
}

/**
 * `server.servlet.context-path` prefixes every mapped path. Only the backend root's own
 * `application.properties`/`.yml` is read: in a multi-module repo a sub-module's property file
 * describes that module, not the application the aggregator builds, and borrowing its context
 * path would mis-root every endpoint in the repo.
 */
function springContextPath(root: string): string {
  const isAppConfig = (file: string) => /^(?:src\/main\/resources\/)?application\.(properties|ya?ml)$/.test(rel(root, file));
  for (const file of findFiles(root, isAppConfig, {maxDepth: 3})) {
    const text = readText(file);
    if (!text) continue;
    if (file.endsWith('.properties')) {
      const declared = text.match(/^[ \t]*server\.(?:servlet\.)?(?:context-path|contextPath)[ \t]*[=:][ \t]*(\S+)/m)?.[1];
      if (declared) return normaliseContextPath(declared);
      continue;
    }
    let doc: SpringApplicationYaml | null = null;
    try {
      doc = yaml.load(text) as SpringApplicationYaml | null;
    } catch {
      continue;
    }
    const declared = doc?.server?.servlet?.['context-path'] ?? doc?.server?.['context-path'];
    if (declared) return normaliseContextPath(String(declared));
  }
  return '';
}

// A `${...}` placeholder is resolved at boot from the environment, so it is not a path.
function normaliseContextPath(value: string) {
  const trimmed = value.trim();
  return trimmed === '' || trimmed.includes('${') ? '' : rooted(trimmed).replace(/\/+$/, '');
}

const WEB_XML_PATH = /(^|\/)WEB-INF\/web\.xml$/;

const SPRING_METHOD = '@RequestMapping / @GetMapping annotations (Java AST)';

/**
 * A pre-Boot Spring MVC app can run one servlet per controller instead of a single front
 * controller, each given its own URL prefix by a `<servlet-mapping>` in web.xml — a prefix this
 * Java-AST reader never sees, because it lives in XML, not in an annotation. Composing it would
 * need `<servlet>`/`<servlet-mapping>` parsing plus a controller-to-context mapping — a second
 * mechanism outside what `@RequestMapping` reading does — so this only counts the mappings that
 * exist, which is enough to tell a reader that every path below is relative, not complete.
 */
function springServletMappingCount(root: string): number {
  let count = 0;
  for (const file of findFiles(root, (file) => WEB_XML_PATH.test(rel(root, file)), {maxDepth: JAVA_MAX_DEPTH})) {
    const text = readText(file);
    if (text) count += (text.match(/<servlet-mapping\b/g) ?? []).length;
  }
  return count;
}

/** The common case — a normal Spring Boot app with no servlet-mapping XML — must read unchanged. */
function springMethod(root: string): string {
  const servletMappings = springServletMappingCount(root);
  if (servletMappings === 0) return SPRING_METHOD;
  const noun = servletMappings === 1 ? 'entry' : 'entries';
  // Backticked: this string is written straight into a markdown report header, and a bare
  // `<servlet-mapping>` there reads to a markdown renderer as an (unknown, hidden) HTML tag.
  return `${SPRING_METHOD}; ${servletMappings} \`<servlet-mapping>\` ${noun} in web.xml were not composed `
    + 'onto these paths — treat each path as relative to its own servlet, not a complete URL';
}

async function springRoutes(root: string): Promise<BackendRoute[]> {
  const parser = (await tryImport('java-parser')) as typeof import('java-parser') | null;
  // Every branch below that finds nothing says so: an empty result otherwise reads as "this app
  // has no endpoints", which is a different claim from "this could not be read".
  if (!parser) {
    console.warn('spring: java-parser could not be loaded — reinstall scripts/repo-analyzer; no endpoints will be reported');
    return [];
  }
  const contextPath = springContextPath(root);
  const routes: BackendRoute[] = [];
  let unparsed = 0;
  let kotlin = 0;
  for (const file of findFiles(root, (file) => isSpringSource(rel(root, file)), {maxDepth: JAVA_MAX_DEPTH})) {
    const source = readText(file);
    if (!source || !SPRING_MAPPING_HINT.test(source)) continue;
    if (file.endsWith('.kt')) {
      kotlin++;
      continue;
    }
    let cst: JavaCstNode | null = null;
    try {
      cst = parser.parse(source);
    } catch {
      unparsed++;
    }
    if (cst) routes.push(...springFileRoutes(root, file, cst, contextPath));
  }
  if (unparsed > 0) console.warn(`spring: ${unparsed} candidate Java file(s) failed to parse and were skipped`);
  if (kotlin > 0) console.warn(`spring: ${kotlin} Kotlin file(s) declare request mappings this Java parser cannot read; those endpoints are missing from the report`);
  return routes;
}

// --- pattern-scanned backends -----------------------------------------------------------
// PHP, Python and Ruby have no parser available here, so these read one declaration
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
    method: springMethod, routes: springRoutes,
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

export {keyName, jsonRouteManifestRoutes, springMethod};
