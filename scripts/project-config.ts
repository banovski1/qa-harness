// Root-level project config shared by analyzer and generator entrypoints.
// Kept deliberately small: appPath and baseUrl are the only required project facts.
// `appName` is derived rather than required — it names the folder every artifact for this
// app lands in, so two apps analyzed from the same checkout never overwrite each other.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import type {ProjectConfig} from './repo-analyzer/types.js';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export function projectConfigPath(): string {
  return path.join(REPO_ROOT, 'app-config.yaml');
}

export function loadProjectConfig(file = projectConfigPath()): ProjectConfig {
  if (!fs.existsSync(file)) {
    throw new Error(`Project config file not found: ${path.relative(REPO_ROOT, file) || file}`);
  }

  const raw = parseScalarYaml(fs.readFileSync(file, 'utf8'));
  const missing = ['appPath', 'baseUrl'].filter((key) => !raw[key]);
  if (missing.length > 0) {
    throw new Error(`Missing '${missing[0]}:' in ${path.basename(file)}.`);
  }

  const appPath = resolveConfigPath(raw.appPath, path.dirname(file));
  return {
    appPath,
    appName: slugifyAppName(raw.appName ?? path.basename(appPath)),
    baseUrl: String(raw.baseUrl),
  };
}

/**
 * `analysis/<app>/`, relative to the repo root: where the repo analyzer writes this app's
 * reports and where every consumer reads them from. One helper so the two cannot diverge.
 */
export function appAnalysisDir(config: ProjectConfig = loadProjectConfig()): string {
  return path.join('analysis', config.appName);
}

/**
 * The folder name artifacts for this app are written under. An explicit `appName:` wins;
 * otherwise the clone's own directory name is the title, so retargeting stays a config edit.
 */
export function slugifyAppName(value: string): string {
  const slug = String(value).trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  if (!slug) {
    throw new Error(`Cannot derive an app folder name from '${value}': set appName: in app-config.yaml.`);
  }
  return slug;
}

function parseScalarYaml(text: string): Record<string, string> {
  const values: Record<string, string> = {};
  for (const line of text.split(/\r?\n/)) {
    const match = /^\s*([A-Za-z][A-Za-z0-9]*)\s*:\s*(.*?)\s*$/.exec(line);
    if (!match) continue;
    const value = match[2].replace(/\s+#.*$/, '').trim();
    if (!value) continue;
    values[match[1]] = unquote(value);
  }
  return values;
}

function unquote(value: string): string {
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  return value;
}

function resolveConfigPath(value: string, baseDir: string): string {
  const raw = String(value);
  if (raw === '~') return os.homedir();
  if (raw.startsWith('~/')) return path.join(os.homedir(), raw.slice(2));
  return path.resolve(baseDir, raw);
}
