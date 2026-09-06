import type {AstNode} from './types.js';

export function astField(value: unknown, ...path: (string | number)[]): unknown {
  for (const key of path) {
    if (!value || typeof value !== 'object') return undefined;
    value = (value as Record<string | number, unknown>)[key];
  }
  return value;
}

export function astNode(value: unknown, ...path: (string | number)[]): AstNode | undefined {
  const node = astField(value, ...path);
  if (!node || typeof node !== 'object' || Array.isArray(node)) return undefined;
  const type = astField(node, 'type');
  if (type !== undefined && typeof type !== 'string' && typeof type !== 'number') return undefined;
  return node as AstNode;
}

export function astNodes(value: unknown, ...path: (string | number)[]): AstNode[] {
  const nodes: unknown = astField(value, ...path);
  return Array.isArray(nodes)
    ? (nodes as unknown[]).map((node) => astNode(node)).filter((node): node is AstNode => node !== undefined)
    : [];
}

export function astString(value: unknown, ...path: (string | number)[]): string | undefined {
  const text = astField(value, ...path);
  return typeof text === 'string' ? text : undefined;
}
