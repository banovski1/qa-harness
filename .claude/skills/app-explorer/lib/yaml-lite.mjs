// A deliberately small YAML reader (kept for OpenAPI documents): nested maps, lists of
// scalars, and lists of inline maps. Anything richer belongs in the profile's
// documentation, not in this parser.
const scalar = raw => {
  const value = raw.trim();
  if (!value) return '';
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value === 'null' || value === '~') return null;
  if (/^-?\d+(\.\d+)?$/.test(value)) return Number(value);
  return value;
};

const inlineMap = raw => {
  const out = {};
  const body = raw.trim().slice(1, -1);
  let depth = 0, current = '';
  const parts = [];
  for (const ch of body) {
    if (ch === '{' || ch === '[') depth++;
    if (ch === '}' || ch === ']') depth--;
    if (ch === ',' && depth === 0) { parts.push(current); current = ''; continue; }
    current += ch;
  }
  if (current.trim()) parts.push(current);
  for (const part of parts) {
    const at = part.indexOf(':');
    if (at === -1) continue;
    out[part.slice(0, at).trim()] = scalar(part.slice(at + 1));
  }
  return out;
};

const valueOf = raw => (raw.trim().startsWith('{') ? inlineMap(raw) : scalar(raw));

export function parseYaml(text) {
  const lines = text.split('\n')
    .map(line => line.replace(/\s+#.*$/, ''))
    .filter(line => line.trim() && !line.trim().startsWith('#'));

  const parse = (start, indent) => {
    const isList = lines[start] && lines[start].search(/\S/) === indent && lines[start].trim().startsWith('- ');
    const node = isList ? [] : {};
    let i = start;
    while (i < lines.length) {
      const line = lines[i];
      const depth = line.search(/\S/);
      if (depth < indent) break;
      if (depth > indent) { i++; continue; }
      const body = line.trim();
      if (body.startsWith('- ')) {
        node.push(valueOf(body.slice(2)));
        i++;
        continue;
      }
      const at = body.indexOf(':');
      const key = body.slice(0, at).trim();
      const rest = body.slice(at + 1).trim();
      if (rest) {
        node[key] = valueOf(rest);
        i++;
      } else {
        const childIndent = (() => {
          for (let j = i + 1; j < lines.length; j++) {
            const d = lines[j].search(/\S/);
            if (d > indent) return d;
            if (d <= indent) return null;
          }
          return null;
        })();
        if (childIndent === null) { node[key] = null; i++; continue; }
        const [child, next] = parse(i + 1, childIndent);
        node[key] = child;
        i = next;
      }
    }
    return [node, i];
  };

  return parse(0, lines.length ? lines[0].search(/\S/) : 0)[0];
}
