// One parser per frontend framework, each returning the same shape:
//   { name, props: string[], testIds: [{ attr, value }], error }
// Every parser works on a real AST — a whole file is never matched with a regex, because a
// commented-out or string-literal `data-testid` would otherwise become a suggested locator.

import fs from 'node:fs';
import path from 'node:path';
import {astField, astNode, astNodes, astString} from './ast.js';
import {isTestIdAttr, TEST_ID_ATTRS, tryImport, unique} from './util.js';
import {collectAngularElements} from './elements-angular.js';
import {collectVueElements, headersFromScript} from './elements-vue.js';
import {dedupeNames, relabel} from './elements.js';
import type {ChildReference} from './elements.js';
import type {AstNode, AstVisitor, ExtractedElement, ParsedComponent, ParserContext, TestIdRecord} from './types.js';

// Re-exported from util.ts, which owns the vocabulary so the element extractor can read it
// without importing this module back.
export {TEST_ID_ATTRS, isTestIdAttr};

export function componentNameFromFile(file: string) {
  const base = path.basename(file, path.extname(file));
  return base === 'index' ? path.basename(path.dirname(file)) : base;
}

const BABEL_PLUGINS = ['jsx', 'typescript', 'decorators-legacy', 'classProperties', 'topLevelAwait'];

// `jsx` and a legacy angle-bracket type assertion (`<Type>expr`) both start with `<`, and `jsx`
// wins: Angular source that casts this way throws "Unterminated JSX contents" instead of parsing.
// Angular templates are never JSX, so this is the one set that drops the plugin. `babelParse`
// takes the whole plugin set rather than retrying without `jsx` on failure — deterministic and
// one parse per file — so every other caller keeps the default above untouched.
const BABEL_PLUGINS_NO_JSX = BABEL_PLUGINS.filter((plugin) => plugin !== 'jsx');

export async function babelParse(source: string, plugins: string[] = BABEL_PLUGINS): Promise<AstNode | null> {
  const babel = await tryImport('@babel/parser');
  if (!babel) return null;
  try {
    return astNode(babel.parse(source, {
      sourceType: 'unambiguous',
      errorRecovery: true,
      plugins: unique(plugins),
    })) ?? null;
  } catch {
    return null;
  }
}

/** Minimal AST walker: enough to reach every node without pulling in @babel/traverse's scope machinery. */
export function walkAst(node: unknown, visit: AstVisitor): void {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) {
    for (const child of node) walkAst(child, visit);
    return;
  }
  const record = node as AstNode;
  if (typeof record.type === 'string') visit(record);
  for (const key of Object.keys(record)) {
    if (key === 'loc' || key === 'leadingComments' || key === 'trailingComments') continue;
    walkAst(record[key], visit);
  }
}

/**
 * Template ASTs are not Babel ASTs: Vue tags its nodes with a numeric `type` and Angular hands
 * back class instances, so the visitor has to reach every object rather than only nodes carrying
 * a string `type`. Getting this wrong silently finds zero attributes, which reads like an app
 * that simply has no test ids — so the fixture suite asserts a positive hit per framework.
 */
export function walkAny(node: unknown, visit: AstVisitor, seen = new Set<object>()): void {
  if (!node || typeof node !== 'object' || seen.has(node)) return;
  seen.add(node);
  if (Array.isArray(node)) {
    for (const child of node) walkAny(child, visit, seen);
    return;
  }
  visit(node as AstNode);
  for (const value of Object.values(node)) {
    if (value && typeof value === 'object') walkAny(value, visit, seen);
  }
}

export function keyName(prop: AstNode | null | undefined): string | null {
  const key = astNode(prop, 'key');
  if (key?.type === 'Identifier') return astString(key, 'name') ?? null;
  if (key?.type === 'StringLiteral') return astString(key, 'value') ?? null;
  return null;
}

// --- template AST readers -------------------------------------------------------------

/** Vue and plain-HTML templates share the @vue/compiler-dom node shape. */
function collectVueTemplateTestIds(root: AstNode): TestIdRecord[] {
  const hits: TestIdRecord[] = [];
  walkAny(root, (node) => {
    for (const prop of astNodes(node, 'props')) {
      // type 6 is a static attribute; a bound `:data-testid` has no static value to trust.
      const name = astString(prop, 'name');
      const value = astString(prop, 'value', 'content');
      if (prop.type === 6 && name && isTestIdAttr(name) && value) {
        hits.push({attr: name.toLowerCase(), value});
      }
    }
  });
  return hits;
}

async function templateAst(source: string, file?: string): Promise<AstNode | null> {
  const dom = await tryImport('@vue/compiler-dom');
  if (!dom) return null;
  try {
    return astNode(dom.parse(stripTemplateDirectives(source), {filename: file})) ?? null;
  } catch {
    return null;
  }
}

function stripTemplateDirectives(source: string) {
  return String(source)
    .replace(/\{\{\{[^}]*?\}\}\}/g, '')
    .replace(/\{\{[#/^>!&]?[^{]*?\}\}/g, '');
}

function collectSvelteTestIds(root: AstNode | undefined): TestIdRecord[] {
  const hits: TestIdRecord[] = [];
  walkAny(root, (node) => {
    if (node.type !== 'Element' && node.type !== 'InlineComponent') return;
    for (const attr of astNodes(node, 'attributes')) {
      const name = astString(attr, 'name');
      if (attr.type !== 'Attribute' || !name || !isTestIdAttr(name)) continue;
      const value = astNodes(attr, 'value').find((v) => v.type === 'Text');
      const data = astString(value, 'data');
      if (data !== undefined) hits.push({attr: name.toLowerCase(), value: data});
    }
  });
  return hits;
}

function collectJsxTestIds(ast: AstNode): TestIdRecord[] {
  const hits: TestIdRecord[] = [];
  walkAst(ast, (node) => {
    if (node.type !== 'JSXAttribute') return;
    const nameNode = astNode(node, 'name');
    const name = nameNode?.type === 'JSXNamespacedName'
      ? `${astString(nameNode, 'namespace', 'name')}-${astString(nameNode, 'name', 'name')}`
      : astString(nameNode, 'name');
    if (!name || !isTestIdAttr(name)) return;
    const value = astNode(node, 'value');
    const text = astString(value, 'value');
    if (value?.type === 'StringLiteral' && text !== undefined) {
      hits.push({attr: String(name).toLowerCase(), value: text});
    }
  });
  return hits;
}

function collectAngularTestIds(nodes: unknown): TestIdRecord[] {
  const hits: TestIdRecord[] = [];
  walkAny(nodes, (node) => {
    for (const attr of astNodes(node, 'attributes')) {
      const name = astString(attr, 'name');
      const value = astString(attr, 'value');
      if (name && isTestIdAttr(name) && value) {
        hits.push({attr: name.toLowerCase(), value});
      }
    }
  });
  return hits;
}

// --- prop readers ---------------------------------------------------------------------

function vuePropsFromAst(ast: AstNode): string[] {
  const props: string[] = [];
  walkAst(ast, (node) => {
    if (node.type === 'CallExpression' && astString(node, 'callee', 'name') === 'defineProps') {
      const arg = astNode(node, 'arguments', 0);
      if (arg?.type === 'ObjectExpression') {
        props.push(...astNodes(arg, 'properties').map(keyName).filter((name): name is string => Boolean(name)));
      } else if (arg?.type === 'ArrayExpression') {
        props.push(...astNodes(arg, 'elements').map((e) => e.type === 'StringLiteral' ? astString(e, 'value') : undefined).filter((name): name is string => Boolean(name)));
      }
      const typeArg = astNode(node, 'typeParameters', 'params', 0);
      if (typeArg?.type === 'TSTypeLiteral') {
        props.push(...astNodes(typeArg, 'members').map(keyName).filter((name): name is string => Boolean(name)));
      }
      return;
    }
    if (node.type === 'ObjectProperty' && keyName(node) === 'props') {
      const value = astNode(node, 'value');
      if (value?.type === 'ObjectExpression') {
        props.push(...astNodes(value, 'properties').map(keyName).filter((name): name is string => Boolean(name)));
      } else if (value?.type === 'ArrayExpression') {
        props.push(...astNodes(value, 'elements').map((e) => e.type === 'StringLiteral' ? astString(e, 'value') : undefined).filter((name): name is string => Boolean(name)));
      }
    }
  });
  return unique(props);
}

function jsxPropsFromAst(ast: AstNode, componentName: string): string[] {
  const props: string[] = [];
  const wantedTypes = new Set(['Props', `${componentName}Props`]);
  walkAst(ast, (node) => {
    const isComponentFn = (node.type === 'FunctionDeclaration' && astString(node, 'id', 'name') === componentName)
      || (node.type === 'VariableDeclarator' && astString(node, 'id', 'name') === componentName);
    if (isComponentFn) {
      const fn = node.type === 'FunctionDeclaration' ? node : node.init;
      const param = astNode(fn, 'params', 0);
      if (param?.type === 'ObjectPattern') {
        props.push(...astNodes(param, 'properties').map((p) => p.type === 'RestElement' ? '...rest' : keyName(p)).filter((name): name is string => Boolean(name)));
      }
    }
    if ((node.type === 'TSInterfaceDeclaration' || node.type === 'TSTypeAliasDeclaration') && wantedTypes.has(astString(node, 'id', 'name') ?? '')) {
      const members = astField(node, 'body', 'body') ?? astField(node, 'typeAnnotation', 'members');
      props.push(...astNodes(members).map(keyName).filter((name): name is string => Boolean(name)));
    }
    if (node.type === 'AssignmentExpression' && astString(node, 'left', 'property', 'name') === 'propTypes'
        && astNode(node, 'right')?.type === 'ObjectExpression') {
      props.push(...astNodes(node, 'right', 'properties').map(keyName).filter((name): name is string => Boolean(name)));
    }
  });
  return unique(props);
}

function sveltePropsFromInstance(instance: AstNode | null | undefined): string[] {
  const props: string[] = [];
  walkAst(instance?.content, (node) => {
    // `export let x` is Svelte 4's prop declaration; a destructured `$props()` is Svelte 5's.
    if (node.type === 'ExportNamedDeclaration' && astNode(node, 'declaration')?.type === 'VariableDeclaration') {
      props.push(...astNodes(node, 'declaration', 'declarations').map((d) => astString(d, 'id', 'name')).filter((name): name is string => Boolean(name)));
    }
    if (node.type === 'VariableDeclarator' && astNode(node, 'init')?.type === 'CallExpression'
        && astString(node, 'init', 'callee', 'name') === '$props' && astNode(node, 'id')?.type === 'ObjectPattern') {
      props.push(...astNodes(node, 'id', 'properties').map((p) => p.type === 'RestElement' ? '...rest' : keyName(p)).filter((name): name is string => Boolean(name)));
    }
  });
  return unique(props);
}

// --- the parsers themselves -----------------------------------------------------------

export async function parseVue(file: string, source: string, ctx: ParserContext = {}): Promise<ParsedComponent> {
  const sfc = await tryImport('@vue/compiler-sfc');
  if (!sfc) return {name: componentNameFromFile(file), props: [], testIds: [], elements: [], skippedElements: 0, error: '@vue/compiler-sfc not installed'};
  let descriptor: AstNode | undefined;
  try {
    descriptor = astNode(sfc.parse(source, {filename: file}), 'descriptor');
  } catch (error) {
    return {name: componentNameFromFile(file), props: [], testIds: [], elements: [], skippedElements: 0, error: (error as Error).message};
  }
  const scriptSource = [astString(descriptor, 'script', 'content'), astString(descriptor, 'scriptSetup', 'content')].filter(Boolean).join('\n');
  const scriptAst = scriptSource ? await babelParse(scriptSource) : null;
  const catalogue = ctx.catalogue ?? {};

  let elements: ExtractedElement[] = [];
  let skipped = 0;
  const template = astNode(descriptor, 'template', 'ast');
  if (template) {
    const headers = headersFromScript(scriptAst, catalogue, walkAst);
    const collected = collectVueElements(template, {
      catalogue, headers, inheritedLabel: ctx.inheritedLabel ?? null,
      // Omitted rather than passed as undefined, so the default table still applies to a caller
      // that does not narrow it.
      ...(ctx.templateFor ? {templateFor: ctx.templateFor} : {}),
    });
    elements = collected.elements;
    skipped = collected.skipped;
    // One hop only: a wrapper's own buttons belong to the page that renders it, but following
    // the whole component graph would drag half the design system onto every screen.
    if ((ctx.depth ?? 0) === 0 && ctx.componentIndex) {
      elements = elements.concat(await inlineChildren(collected.childRefs, scriptAst, file, ctx));
    }
  }

  return {
    name: componentNameFromFile(file),
    props: scriptAst ? vuePropsFromAst(scriptAst) : [],
    testIds: template ? collectVueTemplateTestIds(template) : [],
    elements: dedupeNames(elements),
    // Controls the walk recognised but could not name. A number that climbs after an app
    // upgrade is the signal that a convention changed, not that the app lost its fields.
    skippedElements: skipped,
    error: null,
  };
}

/**
 * Resolve each child component tag to a file and take the elements it renders.
 *
 * Tags resolve two ways because Vue registers components two ways: `<submit-button />` is
 * global, matched on the kebab-cased filename, while `<delete-confirmation>` is a local alias
 * declared in `components: {}` and matched on the class it points at.
 */
async function inlineChildren(childRefs: ChildReference[], scriptAst: AstNode | null, file: string, ctx: ParserContext): Promise<ExtractedElement[]> {
  const aliases = componentAliases(scriptAst);
  const inlined = [];
  for (const ref of childRefs) {
    const target = ctx.componentIndex!.resolve(ref.tag, aliases[ref.tag]);
    // A component that renders the page that renders it would recurse forever.
    if (!target || target === file) continue;
    const childSource = fs.readFileSync(target, 'utf8');
    inlined.push(...await elementsOfChild(target, childSource, ref.label, ctx));
  }
  return inlined;
}

/**
 * Take a child component's elements, deciding what the call-site label refers to.
 *
 * A label on a component tag names whatever that component renders — but only when it renders
 * one thing. `<date-input :label="From Date" />` wraps a single field that carries no label of
 * its own, and `<submit-button :label="Apply" />` wraps one that carries the wrong one. But
 * `<file-upload-input :label="Client Logo" />` renders a radio group *and* a file field, and
 * there the label names the group; applying it would stamp "Client Logo" on whichever control
 * happened to be first in the markup. So the count decides, and an ambiguous label is dropped
 * rather than attached to a guess.
 */
async function elementsOfChild(target: string, source: string, label: string | null, ctx: ParserContext): Promise<ExtractedElement[]> {
  const childCtx = {...ctx, depth: (ctx.depth ?? 0) + 1};
  const plain = await parseVue(target, source, childCtx);
  const own = plain.elements ?? [];

  if (!label) return own;
  if (own.length === 1) return [relabel(own[0], label)];
  if (own.length > 1) return own;

  // Nothing was labelable on its own: the wrapper exists precisely to be named from outside.
  const labelled = await parseVue(target, source, {...childCtx, inheritedLabel: label});
  return (labelled.elements ?? []).length === 1 ? labelled.elements! : [];
}

/** `components: { 'delete-confirmation': DeleteConfirmationDialog }` → { 'delete-confirmation': 'DeleteConfirmationDialog' } */
function componentAliases(ast: AstNode | null): Record<string, string> {
  const aliases: Record<string, string> = {};
  if (!ast) return aliases;
  walkAst(ast, (node) => {
    if (node.type !== 'ObjectProperty' || keyName(node) !== 'components') return;
    if (astNode(node, 'value')?.type !== 'ObjectExpression') return;
    for (const prop of astNodes(node, 'value', 'properties')) {
      const tag = keyName(prop);
      const target = astNode(prop, 'value')?.type === 'Identifier' ? astString(prop, 'value', 'name') : null;
      if (tag && target) aliases[tag] = target;
    }
  });
  return aliases;
}

export async function parseJsx(file: string, source: string): Promise<ParsedComponent> {
  const name = componentNameFromFile(file);
  const ast = await babelParse(source);
  if (!ast) return {name, props: [], testIds: [], error: '@babel/parser could not parse this file'};
  return {name, props: jsxPropsFromAst(ast, name), testIds: collectJsxTestIds(ast), error: null};
}

export async function parseSvelte(file: string, source: string): Promise<ParsedComponent> {
  const compiler = await tryImport('svelte/compiler');
  if (!compiler?.parse) return {name: componentNameFromFile(file), props: [], testIds: [], error: 'svelte/compiler not installed'};
  try {
    const ast: unknown = compiler.parse(source, {filename: file});
    return {
      name: componentNameFromFile(file),
      props: sveltePropsFromInstance(astNode(ast, 'instance')),
      testIds: collectSvelteTestIds(astNode(ast, 'html')),
      error: null,
    };
  } catch (error) {
    return {name: componentNameFromFile(file), props: [], testIds: [], error: (error as Error).message};
  }
}

export async function parseAngular(file: string, source: string, ctx: ParserContext = {}): Promise<ParsedComponent> {
  const name = componentNameFromFile(file);
  const ast = await babelParse(source, BABEL_PLUGINS_NO_JSX);
  const props: string[] = [];
  const templates: {source?: string; url?: string}[] = [];
  if (ast) {
    walkAst(ast, (node) => {
      // @Input() decorates each bound property; the template is either inline or a sibling file.
      if ((node.type === 'ClassProperty' || node.type === 'PropertyDefinition')
          && astNodes(node, 'decorators').some((d) => (astString(d, 'expression', 'callee', 'name') ?? astString(d, 'expression', 'name')) === 'Input')) {
        const propName = keyName(node);
        if (propName) props.push(propName);
      }
      if (node.type !== 'ObjectProperty') return;
      const value = astNode(node, 'value');
      const text = astString(value, 'value');
      if (keyName(node) === 'template' && value?.type === 'StringLiteral' && text !== undefined) {
        templates.push({source: text});
      }
      if (keyName(node) === 'template' && value?.type === 'TemplateLiteral' && astNodes(value, 'quasis').length === 1) {
        templates.push({source: astString(value, 'quasis', 0, 'value', 'raw')});
      }
      if (keyName(node) === 'templateUrl' && value?.type === 'StringLiteral' && text !== undefined) {
        templates.push({url: text});
      }
    });
  }
  const compiler = await tryImport('@angular/compiler');
  const testIds = [];
  // A component can declare an inline `template:` and a `templateUrl:` both, so elements
  // accumulate across every template the file names and are deduped once at the end.
  let elements: ExtractedElement[] = [];
  let skippedElements = 0;
  for (const template of templates) {
    let html = template.source ?? null;
    if (!html && template.url) {
      const resolved = path.resolve(path.dirname(file), template.url);
      html = fs.existsSync(resolved) ? fs.readFileSync(resolved, 'utf8') : null;
    }
    if (!html) continue;
    // Only the parse is guarded. Reading the result inside the `try` would let a bug in either
    // reader fall through to the fallback below, pushing this template's test ids a second time
    // and dropping its elements with `error` still null — a plausible-looking report is a worse
    // failure here than a loud one.
    let nodes: unknown = null;
    if (compiler?.parseTemplate) {
      try {
        nodes = compiler.parseTemplate(html, file).nodes;
      } catch { /* fall through to the HTML reader below */ }
    }
    if (nodes) {
      testIds.push(...collectAngularTestIds(nodes));
      const collected = collectAngularElements(nodes, ctx);
      elements = elements.concat(collected.elements);
      skippedElements += collected.skipped;
      continue;
    }
    // Without @angular/compiler the template is read by @vue/compiler-dom, whose AST the
    // Angular walker cannot read at all — and a Vue element walk over Angular markup would
    // find none of the wrappers it has no vocabulary for. Test ids still resolve; elements
    // are reported as none, which is honest where a partial reading would not be.
    testIds.push(...(await parseHtmlTemplate(html)));
  }
  return {
    name,
    props: unique(props),
    testIds,
    elements: dedupeNames(elements),
    skippedElements,
    error: ast ? null : 'could not parse this file',
  };
}

/** Plain-HTML fallback: used for Angular templates when @angular/compiler is absent, and for .html components. */
export async function parseHtmlTemplate(source: string): Promise<TestIdRecord[]> {
  const ast = await templateAst(source);
  return ast ? collectVueTemplateTestIds(ast) : [];
}

export async function parseHtml(file: string, source: string): Promise<ParsedComponent> {
  return {name: componentNameFromFile(file), props: [], testIds: await parseHtmlTemplate(source), error: null};
}

export async function parseBackboneHandlebars(file: string, source: string, ctx: ParserContext = {}): Promise<ParsedComponent> {
  const name = componentNameFromFile(file);
  const templates: string[] = [];
  if (/\.(tpl|html|hbs)$/.test(file)) {
    templates.push(source);
  } else {
    const ast = await babelParse(source);
    if (ast) {
      walkAst(ast, (node) => {
        if (node.type !== 'ClassProperty' && node.type !== 'PropertyDefinition') return;
        const key = keyName(node);
        if (key !== 'templateContent' && key !== 'template') return;
        const value = astNode(node, 'value');
        const text = astString(value, 'value');
        if (value?.type === 'StringLiteral' && text !== undefined) templates.push(...templateSourcesFor(file, text));
        if (value?.type === 'TemplateLiteral' && astNodes(value, 'quasis').length === 1) {
          const raw = astString(value, 'quasis', 0, 'value', 'raw');
          if (raw !== undefined) templates.push(raw);
        }
      });
    }
  }

  const testIds = [];
  let elements: ExtractedElement[] = [];
  let skippedElements = 0;
  for (const template of templates) {
    const ast = await templateAst(template, file);
    if (!ast) continue;
    testIds.push(...collectVueTemplateTestIds(ast));
    const collected = collectVueElements(ast, {
      catalogue: ctx.catalogue ?? {},
      ...(ctx.templateFor ? {templateFor: ctx.templateFor} : {}),
    });
    elements = elements.concat(collected.elements);
    skippedElements += collected.skipped;
  }

  return {
    name,
    props: [],
    testIds: unique(testIds.map((hit) => `${hit.attr}:${hit.value}`)).map((key) => {
      const [attr, ...parts] = key.split(':');
      return {attr, value: parts.join(':')};
    }),
    elements: dedupeNames(elements),
    skippedElements,
    error: null,
  };
}

function templateSourcesFor(file: string, name: string): string[] {
  if (/[<>{}]/.test(name)) return [name];
  const root = findProjectRoot(file);
  const candidates = [
    path.join(root, 'client', 'res', 'templates', `${name}.tpl`),
    path.join(root, 'res', 'templates', `${name}.tpl`),
    path.join(root, 'templates', `${name}.tpl`),
  ];
  return candidates.filter((candidate) => fs.existsSync(candidate)).map((candidate) => fs.readFileSync(candidate, 'utf8'));
}

function findProjectRoot(file: string) {
  let dir = path.dirname(file);
  while (dir !== path.dirname(dir)) {
    if (fs.existsSync(path.join(dir, 'package.json')) || fs.existsSync(path.join(dir, 'composer.json'))) return dir;
    dir = path.dirname(dir);
  }
  return path.dirname(file);
}

/** No framework matched: the file is listed, never guessed at. */
export async function parseNaive(file: string): Promise<ParsedComponent> {
  return {name: componentNameFromFile(file), props: [], testIds: [], error: null};
}
