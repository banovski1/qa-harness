// What each endpoint is *for*, derived from the endpoint itself.
//
// A precondition is a sentence like "an employee exists" or "the employee has leave
// entitlement". Nothing in a spec says that in those words, but the shape of a REST
// surface says it clearly enough: a POST to a collection creates the thing the
// collection holds, a DELETE under an id removes it, and a required field named
// `<x>Id` means the thing cannot exist until an `<x>` does.
//
// Everything here is a derivation, never an assertion. A wrong edge is visible in
// api-resources.json and is meant to be corrected there, not hidden.

export interface EndpointRow {
  method: string;
  path: string;
  summary?: string | null;
  operationId?: string | null;
  tag?: string | null;
  request?: Record<string, unknown> | null;
  auth?: boolean;
  tier?: string;
  source?: string;
}

export type OperationKind = 'list' | 'get' | 'create' | 'update' | 'delete' | 'action';

export interface ResourceOp {
  kind: OperationKind;
  /** False when the source declares fields but never says which are mandatory. */
  requiredKnown: boolean;
  method: string;
  path: string;
  summary?: string | null;
  requiredFields: string[];
  optionalFields: string[];
  source?: string;
}

export interface Resource {
  /** PascalCase, singular: "Employee". */
  name: string;
  /** The collection path, with the app's prefix intact. */
  basePath: string;
  ops: Partial<Record<OperationKind, ResourceOp>> & { actions?: ResourceOp[] };
  /** Resources this one cannot exist without, from its required `<x>Id` fields. */
  requires: string[];
  /** The sentence this resource's create makes true. */
  establishes: string | null;
  /** Whether a test can undo what it created. */
  cleanup: 'delete' | 'none';
}

const IRREGULAR: Record<string, string> = {
  people: 'person', children: 'child', men: 'man', women: 'woman',
  data: 'datum', criteria: 'criterion',
};

/** Case-preserving: "leaveTypes" must not become "leavetype", or nothing matches it. */
export function singular(word: string): string {
  const lower = word.toLowerCase();
  if (IRREGULAR[lower]) return IRREGULAR[lower];
  if (/[^aeiou]ies$/i.test(word)) return word.slice(0, -3) + 'y';
  // "statuses", "boxes", "watches" drop the whole "es"; "employees" drops only the "s".
  if (/(s|x|z|ch|sh)es$/i.test(word)) return word.slice(0, -2);
  // "status", "address", "analysis" are already singular and end in s.
  if (/(us|ss|is)$/i.test(word)) return word;
  if (/[^s]s$/i.test(word)) return word.slice(0, -1);
  return word;
}

/** "a Employee" reads as a mistake wherever it appears, and it appears everywhere. */
export function article(word: string): 'a' | 'an' {
  // Sound, not spelling: "a User", "a European", but "an Hour".
  if (/^(uni|use|user|usa|eu|one)/i.test(word)) return 'a';
  if (/^(hour|honest|honou?r)/i.test(word)) return 'an';
  return /^[aeiou]/i.test(word) ? 'an' : 'a';
}

const pascal = (s: string) => s.replace(/[^A-Za-z0-9]+/g, ' ').trim().split(' ')
  .filter(Boolean).map(w => w[0].toUpperCase() + w.slice(1)).join('');

const isParam = (seg: string) => /^[{:]|^\[/.test(seg);

/** The collection this path addresses, and whether the path targets one record. */
/** Version and mount segments name nothing: "/api/v2/..." is not a resource called V2. */
const NOT_A_RESOURCE = /^(api|rest|v\d+|web|index\.php|graphql|json)$/i;

export function parsePath(path: string): { entity: string | null; collectionPath: string; targetsOne: boolean; trailing: string[] } {
  const segs = path.split('/').filter(Boolean);
  const firstParam = segs.findIndex(isParam);

  // The resource is the last literal segment BEFORE the first parameter. Anything after
  // the parameter belongs to that record: "/bookings/{id}/cancel" is an action on a
  // booking, not a resource called Cancel.
  const cut = firstParam === -1 ? segs.length : firstParam;
  const literals = segs.slice(0, cut).filter(s => !isParam(s));
  const entity = literals[literals.length - 1] ?? null;
  if (!entity || NOT_A_RESOURCE.test(entity)) {
    return { entity: null, collectionPath: path, targetsOne: false, trailing: [] };
  }
  return {
    entity,
    collectionPath: '/' + segs.slice(0, cut).join('/'),
    targetsOne: firstParam !== -1,
    trailing: firstParam === -1 ? [] : segs.slice(firstParam + 1),
  };
}

function kindOf(method: string, targetsOne: boolean, trailing: string[]): OperationKind {
  const m = method.toUpperCase();
  // A verb after the id ("/bookings/{id}/cancel") is an action, not CRUD.
  if (trailing.some(t => !isParam(t))) return 'action';
  if (m === 'GET') return targetsOne ? 'get' : 'list';
  if (m === 'POST') return 'create';
  if (m === 'PUT' || m === 'PATCH') return 'update';
  if (m === 'DELETE') return 'delete';
  return 'action';
}

function fieldsOf(request: Record<string, unknown> | null | undefined) {
  if (!request) return { required: [], optional: [] };
  const declared = Array.isArray((request as any).__required) ? (request as any).__required as string[] : null;
  const names = Object.keys(request).filter(k => !k.startsWith('__'));
  if (declared) return { required: declared.filter(n => names.includes(n)), optional: names.filter(n => !declared.includes(n)) };
  return { required: [], optional: names };
}

/** `employeeId` / `leaveTypeId` / `empNumber` name another resource. */
export function referencedEntity(field: string): string | null {
  const m = field.match(/^(.+?)(Id|_id|Ids|Number|Numbers)$/);
  if (!m) return null;
  const base = m[1];
  if (!base || base.length < 2) return null;
  return pascal(singular(base));
}

/**
 * Resolve a referenced name against the resources that actually exist.
 *
 * A payload says `empNumber` where the resource is `Employee`, so an exact match is not
 * enough — but a loose one invents edges. The rule: exact first, then the shortest
 * resource whose name starts with the reference, and only for references of three
 * characters or more.
 */
export function resolveReference(reference: string, names: string[]): string | null {
  const lower = reference.toLowerCase();
  const exact = names.find(n => n.toLowerCase() === lower);
  if (exact) return exact;
  if (reference.length < 3) return null;
  const prefixed = names.filter(n => n.toLowerCase().startsWith(lower));
  if (!prefixed.length) return null;
  return prefixed.sort((a, b) => a.length - b.length)[0];
}

export function deriveResources(endpoints: EndpointRow[]): Record<string, Resource> {
  const byEntity = new Map<string, Resource>();

  for (const ep of endpoints) {
    const { entity, collectionPath, targetsOne, trailing } = parsePath(ep.path);
    if (!entity || isParam(entity)) continue;              // "/api/v1/{entityType}" names nothing
    const name = pascal(singular(entity));
    if (!name || /^\d/.test(name)) continue;

    const kind = kindOf(ep.method, targetsOne, trailing);
    const { required, optional } = fieldsOf(ep.request);
    const op: ResourceOp = {
      kind, method: ep.method.toUpperCase(), path: ep.path,
      summary: ep.summary ?? null, requiredKnown: required.length > 0,
      requiredFields: required, optionalFields: optional, source: ep.source,
    };

    const resource = byEntity.get(name) ?? {
      name, basePath: collectionPath, ops: {}, requires: [], establishes: null, cleanup: 'none' as const,
    };
    if (kind === 'action') resource.ops.actions = [...(resource.ops.actions ?? []), op];
    else if (!resource.ops[kind]) resource.ops[kind] = op;
    if (kind === 'create' || kind === 'list') resource.basePath = collectionPath;
    byEntity.set(name, resource);
  }

  // Dependencies come from the create payload: you cannot create a leave request
  // without the leave type it points at.
  for (const resource of byEntity.values()) {
    const create = resource.ops.create;
    if (create) {
      const refs = new Set<string>();
      const names = [...byEntity.keys()];
      for (const f of [...create.requiredFields, ...create.optionalFields]) {
        const ref = referencedEntity(f);
        const resolved = ref ? resolveReference(ref, names) : null;
        if (resolved && resolved !== resource.name) refs.add(resolved);
      }
      resource.requires = [...refs].sort();
      // Only claim state was established when the record can be read back. An endpoint
      // you POST to but cannot list or fetch — a login, a search, a password reset — is
      // an action, and calling it does not leave a "a Login exists" behind.
      const readable = Boolean(resource.ops.list || resource.ops.get);
      resource.establishes = readable ? `${article(resource.name)} ${resource.name} exists` : null;
    }
    resource.cleanup = resource.ops.delete ? 'delete' : 'none';
  }
  return Object.fromEntries([...byEntity.entries()].sort(([a], [b]) => a.localeCompare(b)));
}

/** The one-line precondition label attached to each endpoint. */
export function tagEndpoints(endpoints: EndpointRow[], resources: Record<string, Resource>) {
  return endpoints.map(ep => {
    const { entity, targetsOne, trailing } = parsePath(ep.path);
    if (!entity || isParam(entity)) return { ...ep, precondition: null };
    const name = pascal(singular(entity));
    const kind = kindOf(ep.method, targetsOne, trailing);
    const resource = resources[name];
    const precondition =
      kind === 'create' ? (resource?.establishes ? `establishes: ${resource.establishes}` : `action: ${ep.summary ?? `posts to ${name}`}`)
      : kind === 'delete' ? `cleanup: removes ${article(name)} ${name}`
      : kind === 'update' ? `establishes: ${article(name)} ${name} in a chosen state`
      : kind === 'action' ? `transition: ${ep.summary ?? trailing.filter(t => !isParam(t)).join('/')} on ${name}`
      : null;                                               // reads establish nothing
    return {
      ...ep, precondition,
      requires: kind === 'create' ? resource?.requires ?? [] : [],
    };
  });
}
