import type { ExtractedElement, LocatorRecord, RouteRecord } from '../repo-analyzer/types.js';

export type LocatorSpec = LocatorRecord;
export type LocatorTemplates = Record<string, string>;
export interface LocatorInput {
  strategy?: string; args?: unknown[]; name?: unknown; unstable?: unknown;
  unstableReason?: string | null; within?: LocatorInput | null; nth?: number | null;
}
export interface NavigationEntry extends Partial<Omit<ExtractedElement, 'locator' | 'columns'>> {
  locator?: unknown;
  columns?: (string | { name: string })[];
}
export interface PagesConfig { folderSegment: 'auto' | number; mergeDuplicates: boolean }
export interface ApiFilter { tags?: string[]; operationIds?: string[] }
export interface ApiConfig {
  enabled: boolean; pathPrefix?: string; include?: ApiFilter; exclude?: ApiFilter;
  generateAssertionSpecs?: boolean; generateFactories?: boolean;
}
export interface LoginFlow {
  loginUrl: string; usernameLocator: LocatorSpec; passwordLocator: LocatorSpec;
  submitLocator: LocatorSpec; successSignal: LocatorSpec | null;
}
export interface GeneratorConfig {
  language: string; projectName: string; outputDir: string; baseUrl: string;
  analysisDir: string; loginConfig: string | null; login: LoginFlow | null;
  pages: PagesConfig; navigation: NavigationEntry[]; waits: { spinnerSelector: string };
  tests: { generateSmokeSpecs: boolean }; locatorTemplates: LocatorTemplates;
  apiMapDir: string; api: ApiConfig;
  mapDir?: string;
}
export type ApplicationConfig = Pick<GeneratorConfig, 'analysisDir' | 'pages'> & Partial<Pick<GeneratorConfig, 'navigation' | 'locatorTemplates' | 'api'>>;
export interface ElementModel {
  rawName: string; component: string; locator: LocatorSpec; label: string;
  unstable: boolean; unstableReason: string | null; rung: number | null;
  table: { columns: string[]; rowCount: number } | null; signature: string;
}
export interface StateModel { rawName: string; triggerLabel: string; elements: ElementModel[] }
export interface PageModel {
  slug: string; url: string; group: string; className: string; fileBase: string;
  component: string | null;
  elements: ElementModel[]; states: StateModel[]; aliases: string[];
}
export interface ApplicationStats {
  files: number; elementsRead: number; skippedNoLocator: number; unstable: number;
  tables: number; rungs: Record<string, number>; routes: number; routesWithoutComponent: number;
  apiRoutesSkipped: number; folderSegment?: number; folderSegmentDetected?: boolean;
  pages?: number; sharedChrome?: number; sharedStates?: number;
}
export interface ApplicationModel { pages: PageModel[]; sharedChrome: ElementModel[]; sharedStates: StateModel[]; stats: ApplicationStats }
export interface SchemaProperty { name: string; type: string; required?: boolean; nullable?: boolean }
export type RequestSpecSchema = { kind: 'object'; properties: SchemaProperty[] }
  | { kind: 'array'; items: RequestSpecSchema | null }
  | { kind: 'primitive'; type: string };
export interface Operation {
  operationId: string; resource: string; method: string; path: string;
  pathParams: { name: string; type: string }[];
  queryParams: { name: string; type: string; required: boolean }[];
  requestBody: { contentType: string; schema: RequestSpecSchema | null } | null;
  responses: { status: number; contentType: string | null; schema: RequestSpecSchema | null }[];
  droppedFields: string[];
}
export interface ResourceModel { resource: string; className: string; source: string; sourceRef: string | null; operations: (Operation & { safeId: string })[] }
export interface ApiModel { resources: ResourceModel[]; stats: { files: number; resources: number; operations: number; droppedFields: number } }
export interface GeneratedFile { path: string; contents: string; kind: 'generated' | 'protected' }
export interface ScaffoldDefinition {
  id: string; displayName: string; extension: string; emptyDirs: string[];
  layoutNotes: string; gettingStarted: string;
  files(context: GenerationContext): GeneratedFile[];
}
export interface GenerationContext { config: GeneratorConfig; model: ApplicationModel; apiModel: ApiModel; adapter: LanguageAdapter }
export interface LanguageAdapter {
  id: string; extension: string;
  emptyDirs(context: GenerationContext): string[];
  staticFiles(context: GenerationContext): GeneratedFile[];
  renderPage(page: PageModel, context: GenerationContext): GeneratedFile[] | null;
  renderTest(page: PageModel, context: GenerationContext): GeneratedFile | null;
  renderApiClient?(resource: ResourceModel, context: GenerationContext): GeneratedFile[] | null;
  renderApiTest?(resource: ResourceModel, context: GenerationContext): GeneratedFile[] | null;
  locatorStats?(model: ApplicationModel, config: GeneratorConfig): { total: number; derived: number; byFactory: [string, number][] };
}
export interface LocatorRoot {
  getByRole(role: string, options?: { name: string; exact: boolean }): LocatorRoot;
  getByLabel(text: string): LocatorRoot;
  getByPlaceholder(text: string): LocatorRoot;
  getByText(text: string, options?: { exact: boolean }): LocatorRoot;
  getByAltText(text: string): LocatorRoot;
  getByTitle(text: string): LocatorRoot;
  getByTestId(text: string): LocatorRoot;
  locator(selector: string): LocatorRoot;
  nth(index: number): LocatorRoot;
}
export interface LocatorSignals {
  testId?: string | null; role?: string | null; name?: string | null; labelFor?: boolean;
  label?: string | null; templateId?: string | null; placeholder?: string | null;
  idAttr?: string | null; nameAttr?: string | null; text?: string | null; cssPath?: string | null;
}
export type AnalysisRoute = Partial<RouteRecord> & Pick<RouteRecord, 'path'>;

// External JSON/YAML is unknown until a reader checks the fields it consumes.
export function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}
export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export function record(value: unknown): Record<string, unknown> {
  if (!isRecord(value)) throw new Error(`Expected an object, got ${JSON.stringify(value)}`);
  return value;
}
export function list(value: unknown): unknown[] {
  if (value == null) return [];
  if (!Array.isArray(value)) throw new Error(`Expected a list, got ${JSON.stringify(value)}`);
  return value;
}
