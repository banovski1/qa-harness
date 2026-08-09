// Parses Playwright's `Locator.ariaSnapshot()` output into a real tree instead of
// scanning it line-by-line. The snapshot's indentation encodes parent/child structure
// (e.g. table -> rowgroup -> row -> cell), which is needed to assemble structural
// components like tables and to scope locators when a bare accessible name isn't unique.

// One line: <indent>- role "name" [attr1] [attr2=val]: trailing text
const LINE_RE = new RegExp(
  '^(?<indent>\\s*)-\\s+(?<role>[a-zA-Z]+)' +
  '(?:\\s+"(?<name>(?:[^"\\\\]|\\\\.)*)")?' +
  '(?<attrs>(?:\\s+\\[[^\\]]*\\])*)' +
  '\\s*(?::\\s*(?<text>.*))?$'
);

/** @typedef {{role:string, name:string|null, attrs:Map<string,string|true>, text:string|null, children:AriaNode[], parent:AriaNode|null}} AriaNode */

/** Parse ariaSnapshot() text into a tree of AriaNode, rooted at a synthetic 'root' node. */
export function parseAriaTree(snapshotText) {
  const root = { role: 'root', name: null, attrs: new Map(), text: null, children: [], parent: null };
  const stack = [{ indent: -1, node: root }];

  for (const rawLine of snapshotText.split('\n')) {
    if (!rawLine.trim()) continue;
    const m = LINE_RE.exec(rawLine);
    if (!m) continue;
    const { indent, role, name, attrs, text } = m.groups;
    const indentLen = indent.length;

    while (stack.length > 1 && stack[stack.length - 1].indent >= indentLen) stack.pop();
    const parent = stack[stack.length - 1].node;

    const node = {
      role,
      name: name != null ? unescape(name) : null,
      attrs: parseAttrs(attrs),
      text: text ? text.trim() : null,
      children: [],
      parent,
    };
    parent.children.push(node);
    stack.push({ indent: indentLen, node });
  }
  return root;
}

function parseAttrs(raw) {
  const map = new Map();
  if (!raw) return map;
  for (const m of raw.matchAll(/\[([^\]=]+)(?:=([^\]]*))?\]/g)) {
    map.set(m[1].trim(), m[2] !== undefined ? m[2].trim() : true);
  }
  return map;
}

function unescape(s) {
  return s.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
}

/** Depth-first walk, calling visit(node, ancestors[]) for every node except the synthetic root. */
export function walk(root, visit, ancestors = []) {
  for (const child of root.children) {
    visit(child, ancestors);
    walk(child, visit, [...ancestors, child]);
  }
}

/** Nearest ancestor (closest first) that has an accessible name — used for fallback naming/scoping. */
export function nearestNamedAncestor(ancestors) {
  for (let i = ancestors.length - 1; i >= 0; i--) {
    if (ancestors[i].name) return ancestors[i];
  }
  return null;
}
