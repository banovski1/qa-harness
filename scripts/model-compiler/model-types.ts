// The contract between the analysis skills and the framework generator. Anything the
// generator needs to know lives here; anything it does not, does not reach it.

/** How a screen names one of its controls. English, never a selector. */
export interface Identity {
  /** The visible or accessible label: "Submit Request". */
  label?: string;
  /** The app's own field identifier, where the label is absent or translated. */
  field?: string;
  /** The heading a region sits under, used to disambiguate a repeated label. */
  within?: string;
  /** ARIA role, where two controls share a label but not a role. */
  role?: string;
}

export type ComponentKind = 'region' | 'field' | 'collection';

export interface LocatorSpec {
  strategy: 'role' | 'label' | 'placeholder' | 'testId' | 'text' | 'css' | 'scoped';
  args: string[];
}

export interface ComponentDef {
  kind: ComponentKind;
  /** Region components only: the private root. The one place a selector may appear. */
  root?: LocatorSpec;
  /** Region components only: controls discovered on every instance of the region. */
  controls?: Record<string, LocatorSpec>;
  /** Field components: the selector shape used when an identity gives `field`. */
  fieldTemplate?: string;
  /** Collection components: the app's table shape. */
  table?: {
    row: string;
    cell: string;
    headerCell?: string;
    rowKeyAttribute?: string;
  };
  /** How many screens this component was observed on. 1 means screen-local. */
  seenOn: number;
  description: string;
}

export interface ComponentUse extends Identity {
  component: string;
  /** The property name on the generated page object. */
  as: string;
  /** Collections only: the columns observed, and the one that identifies a row. */
  columns?: string[];
  keyColumn?: string | null;
}

export interface ScreenAction {
  name: string;
  via: string;
  leadsTo: string;
}

export interface Screen {
  name: string;
  path: string;
  url: string;
  title: string;
  aliases: string[];
  identity: { urlPattern: string; heading: string | null };
  source: { component: string | null; route: string | null };
  crawled: boolean;
  uses: ComponentUse[];
  actions: ScreenAction[];
  /** Elements the crawl saw but could not name semantically. Never silently dropped. */
  unverified: number;
}

export interface ApiAuth {
  kind: string;
  loginEndpoint?: unknown;
  storageStatePath?: string;
  [k: string]: unknown;
}

export interface AppModel {
  app: {
    name: string;
    baseUrl: string;
    repoPath: string;
    repoCommit: string;
    stack: string;
    generatedAt: string;
  };
  components: Record<string, ComponentDef>;
  screens: Screen[];
  api: { endpoints: unknown[]; auth: ApiAuth | null };
  stats: Record<string, number>;
}
