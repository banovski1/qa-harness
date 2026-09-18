export interface AuthStep { action: string; selector: string; value?: string }
export interface Profile {
  name: string;
  baseUrl: string;
  repoPath: string;
  session: string;
  auth: { loginUrl: string; steps: AuthStep[]; readyWhen: string | null } | null;
  seedRoutes: string[];
  exclude: string[];
  budget: { maxScreens: number; maxDepth: number; mapMinutes: number; maxScreensPerModule: number };
  specCandidates: string[];
  settings: {
    testIdAttribute: string;
    contentSelector: string;
    batchSize: number;
    settleTimeout: number;
    navTimeout: number;
  };
}
export declare const ROOT: string;
export declare const ANALYSIS_PATH: string;
export declare function parseEnvFile(text: string): Record<string, string>;
export declare function loadEnv(envPath?: string): Record<string, string | undefined>;
export declare function loadProfile(envPath?: string): Profile;
export declare function resolveEnvValue(value: unknown, env?: Record<string, string | undefined>): unknown;
