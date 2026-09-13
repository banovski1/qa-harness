/**
 * `analysis/<app>/analysis.json` — everything the four skills learn about one
 * application, in one file.
 *
 * There were eleven files and five reports here, and reviewing a change meant reading
 * a diff spread across all of them. One file with one section per skill is reviewable
 * by eye and loadable in one read by an agent, which is the same property from two
 * directions.
 *
 * Each skill owns exactly one top-level section and never writes another's. Nothing
 * merges sections implicitly: `write-section.ts` replaces one key and leaves the rest
 * byte-identical, so a re-run of one skill produces a diff scoped to its own work.
 */

export interface AnalysisApp {
  name: string;
  baseUrl: string;
  repoPath: string;
  repoCommit: string | null;
  generatedAt: string;
}

/** app-dossier: what the source declares about itself. */
export interface AnalysisSource {
  stack: { frontend?: Record<string, unknown>; backend?: Record<string, unknown> };
  /** Every route the app declares, whether or not a crawl ever reached it. */
  routes: { path: string; name?: string; component?: string; source?: string }[];
  /** Domain objects the app persists — what a precondition creates. */
  entities: { name: string; fields?: string[]; source?: string }[];
  /** Test tooling already in the repo, so the generator does not duplicate it. */
  existingTests: { framework: string; path: string; count?: number }[];
  /** Where the app documents itself: AGENTS.md, CI, a spec-generating command. */
  docs: Record<string, unknown>;
  dependencies: Record<string, unknown>;
  notes?: string[];
}

/** app-components: how the app is built, and how a label reaches an input. */
export interface AnalysisComponents {
  regions: { name: string; selector: string; [k: string]: unknown }[];
  labelAssociation: Record<string, unknown>;
  designSystem?: Record<string, unknown>;
  notes?: string[];
}

/** app-api: the endpoints, and the login that has been proved to work. */
export interface AnalysisApi {
  apiPrefix: string | null;
  tiers: Record<string, number>;
  spec: Record<string, unknown>;
  auth: Record<string, unknown> | null;
  /** Written only by scripts/api-auth/verify-auth.ts. Absent means unproven. */
  authVerification?: Record<string, unknown>;
  endpoints: Record<string, unknown>[];
  notes?: string[];
}

/**
 * One control the crawl saw, distilled.
 *
 * The raw crawl carried a ranked candidate ladder and a bounding box for every element
 * on every screen — 15 MB for one app, none of it readable and most of it consumed by
 * one function. What survives is what a decision downstream depends on: how to name the
 * control, whether the name resolves to one element, and where the name came from.
 */
export interface AnalysisControl {
  role: string | null;
  name: string;
  /** `proximity` means the app renders the label but never associated it. */
  nameSource: 'accessible' | 'proximity' | null;
  label: string | null;
  placeholder: string | null;
  field: string | null;
  region: string;
  visible: boolean;
  disabled: boolean;
  href: string | null;
  /** How many elements the control's *semantic* handle matches. >1 is not addressable. */
  matches: number;
  /** Vertical position, the only evidence of which heading a control sits under. */
  y: number;
}

export interface AnalysisScreen {
  path: string;
  url: string;
  title: string;
  headings: { level: number; text: string; y: number }[];
  tables: { columns: string[]; rowCount: number }[];
  /** Counted, not listed: nothing downstream addresses a control the user cannot see. */
  hiddenControls?: number;
  controls: AnalysisControl[];
  links: { href: string; resolved: string; text: string }[];
}

/**
 * How much of a screen is known well enough to write a test against it without
 * asking a human to record the flow first.
 */
export interface AnalysisTestability {
  /** 0..1 per screen, and what is missing. */
  screens: Record<string, {
    confidence: number;
    addressable: number;
    unaddressable: number;
    hasTable: boolean;
    crawled: boolean;
    recorded: boolean;
    missing: string[];
  }>;
  /** Flows a human recorded with playwright-codegen, by name. */
  recordings: { flow: string; path: string; recordedAt: string; screens: string[] }[];
}

/**
 * The menu map: where everything is, walked through the app's own navigation.
 *
 * `app-map.yaml` is rendered from this and is the human view of it. The section is the
 * machine view, so the two artifacts never disagree and neither has to be parsed back
 * out of the other.
 */
export interface AnalysisMap {
  modules: {
    name: string;
    url?: string;
    screens: {
      name: string; url?: string; heading?: string;
      buttons?: string[]; fields?: string[];
      tables?: { kind: string; columns: string[]; rows: number }[];
      valueList?: { sample: string[]; total: number };
    }[];
    skipped?: string;
  }[];
  budget?: Record<string, unknown>;
}

export interface Analysis {
  app: AnalysisApp;
  source: AnalysisSource;
  components: AnalysisComponents;
  api: AnalysisApi;
  map: AnalysisMap;
  screens: AnalysisScreen[];
  testability: AnalysisTestability;
}

export const SECTIONS = ['app', 'source', 'components', 'api', 'map', 'screens', 'testability'] as const;
export type Section = typeof SECTIONS[number];

/** Which skill owns which section. A skill writing another's section is a bug. */
export const SECTION_OWNER: Record<Section, string> = {
  app: 'app-dossier',
  source: 'app-dossier',
  components: 'app-components',
  api: 'app-api',
  map: 'app-explorer (map.mjs)',
  screens: 'app-explorer (explore.mjs)',
  testability: 'compile-model.ts',
};
