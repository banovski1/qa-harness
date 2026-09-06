export interface ProjectConfig {
  appPath: string;
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
export type AstNode = Record<string, any> & {type?: string | number};
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
  method: string;
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
