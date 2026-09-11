export interface ProjectConfig {
  appPath: string;
  appName: string;
  baseUrl: string;
}

export interface CliArgs {
  _?: string[];
  app?: string;
  apiPrefix?: string;
  backendRoot?: string;
  baseUrl?: string;
  crossCheck?: string;
  dryRun?: boolean;
  frontendRoot?: string;
  json?: boolean;
  out?: string;
  pathPrefix?: string;
  routes?: string;
  flags?: Set<string>;
}

export interface FileBasedRouterConfig {
  dirs: string[];
  extensions: string[];
  flat?: boolean;
  pageFile?: string;
}

/**
 * How deeply a client router's config may be read. Everything here is a *field*, not a framework
 * name: an app whose route table is one flat array of literals needs none of it, and one whose
 * paths are class constants split across 247 lazily-loaded files needs all of it.
 */
export interface RouterConfigTraversal {
  /** properties holding an inline array of child routes, whose paths compose onto the parent's */
  childrenKeys?: string[];
  /** properties holding a dynamic `import()` of a file that declares child routes */
  lazyKeys?: string[];
  /** properties naming what the route renders; the historic list is used when this is absent */
  componentKeys?: string[];
  /** call-property names a module uses to register a route array declared in a sibling file */
  reexportCalls?: string[];
  /** resolve `Class.FIELD` / `Enum.MEMBER` paths through the imports of the file they appear in */
  constantModules?: boolean;
  /**
   * resolve a route's component identifier to the file whose class declaration it names, keeping
   * the identifier in `componentName`. Set it where a route names its component by symbol rather
   * than by path, since the label dictionary joins routes to elements on the *file*.
   */
  componentClassIndex?: boolean;
  /** how far the child graph is followed, counting both nesting levels and file hops */
  maxDepth?: number;
}

export interface DetectedFrontend {
  framework: string;
  label: string;
  version: string | null;
  root: string;
  sourceRoot: string;
  manifestPath: string | null;
  fileBasedRouter: FileBasedRouterConfig | null;
  routerLib: string | null;
  entry: FrontendRegistryEntry;
}

export interface DetectedBackend {
  framework: string;
  label: string;
  version: string | null;
  root: string;
  manifestPath: string;
  method: string;
  entry: BackendRegistryEntry;
}

export interface DetectionResult {
  appPath: string;
  frontend: DetectedFrontend;
  backend: DetectedBackend | null;
  monorepo: string[];
  evidence: string[];
}

export interface RouteRecord {
  path: string;
  component: string | null;
  params: string[];
  source: string;
  name?: string | null;
  componentName?: string | null;
  requirements?: Record<string, unknown> | null;
}

export interface LocatorRecord {
  strategy: string;
  args: string[];
  name: string | null;
  template?: string | null;
  unstable: boolean;
  unstableReason: string | null;
  within?: LocatorRecord | null;
  nth?: number | null;
}

export interface ExtractedElement {
  name: string;
  component: string;
  label: string | null;
  rung: number;
  locator: LocatorRecord;
  comment?: string;
  columns?: {name: string}[];
  rowCount?: number | null;
}

export interface TestIdRecord {
  attr: string;
  value: string;
}

export interface ComponentRecord {
  name: string;
  file: string;
  kind: string;
  framework: string;
  props: string[];
  testIds: TestIdRecord[];
  elements: ExtractedElement[];
  skippedElements: number;
}

export interface ApiEndpoint {
  path: string;
  methods: string[];
  purpose: string | null | undefined;
  params: string[];
  source: string;
}

export interface RoutesReport {
  app: string;
  strategy: string | null;
  routes: RouteRecord[];
}

export interface ComponentsReport {
  app: string;
  framework: string;
  components: ComponentRecord[];
}

export interface ApiDocumentationReport {
  app: string;
  tier: 'A' | 'B' | 'C';
  how: string | null;
  endpoints: ApiEndpoint[];
}

export interface LiveUrlRecord {
  url: string;
  params: string[];
  component: string | null;
}

export interface LiveUrlsReport {
  app: string;
  baseUrl: string;
  pathPrefix: string;
  urls: LiveUrlRecord[];
}

export interface LabelDictionaryRoute {
  component: string;
  elements: ExtractedElement[];
}

export interface LabelDictionaryReport {
  app: string;
  framework: string;
  catalogue: string | null;
  routes: Record<string, LabelDictionaryRoute>;
}

// Parser packages expose incompatible AST dialects. Keep their dynamic fields at this boundary.
export type AstNode = Record<string, unknown> & {type?: string | number};
export type AstVisitor = (node: AstNode) => void;
export type CatalogueEntries = Record<string, string>;
export type TemplateMap = Record<string, string>;

export interface ComponentIndex {
  resolve(tag: string, alias?: string): string | null;
}

export interface ParserContext {
  catalogue?: CatalogueEntries;
  templateFor?: TemplateMap;
  inheritedLabel?: string | null;
  componentIndex?: ComponentIndex;
  depth?: number;
}

export interface ParsedComponent {
  name: string;
  props: string[];
  testIds: TestIdRecord[];
  elements?: ExtractedElement[];
  skippedElements?: number;
  error: string | null;
}

export interface FrontendRegistryEntry {
  id: string;
  label: string;
  deps: string[];
  beats?: string[];
  extensions: string[];
  parse(file: string, source: string, context?: ParserContext): Promise<ParsedComponent>;
  filePredicate?: (file: string, detection: DetectionResult) => boolean;
  fileBasedRouter: FileBasedRouterConfig | null;
  routerLib: string | null;
  routerConfig?: RouterConfigTraversal | null;
  naive?: boolean;
}

export interface BackendRoute {
  path: string;
  methods: string[];
  source: string;
  name: string | null;
  purpose?: string | null;
  controller: string | null;
  requirements: Record<string, unknown> | null;
  kind?: string;
}

export interface BackendRegistryEntry {
  id: string;
  label: string;
  deps: string[];
  extensions?: string[];
  markers?: string[];
  filePredicate?: (file: string) => boolean;
  // A plain string for a framework whose extraction method never varies by app. A function lets
  // an entry name a limitation only visible once the app's own root is known — Spring's, e.g.,
  // notes web.xml servlet mappings the Java-AST reader cannot compose (registry-backend.ts).
  method: string | ((root: string) => string);
  routes(root: string): BackendRoute[] | Promise<BackendRoute[]>;
  componentFor?: (root: string, controller: string | null) => string | null;
}

export interface Catalogue {
  id: string | null;
  label: string;
  entries: CatalogueEntries;
  size: number;
}

export interface ComponentCollection {
  components: ComponentRecord[];
  errors: {file: string; error: string}[];
  naive: boolean;
  catalogue: Catalogue;
  templateFor: TemplateMap;
}

export type RouteCollection = Pick<RoutesReport, 'strategy' | 'routes'>;

export interface ApiResult {
  tier: 'A' | 'B';
  how: string;
  endpoints: ApiEndpoint[];
  specFile?: string;
  servers: unknown[];
}

export interface ApiComparison {
  specFile: string;
  specCount: number;
  foundCount: number;
  missing: string[];
  extra: string[];
}
