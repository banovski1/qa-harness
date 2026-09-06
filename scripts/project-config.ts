// Root-level project config shared by analyzer and generator entrypoints.
// Kept deliberately small: appPath and baseUrl are the only required project facts.

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

  return {
    appPath: resolveConfigPath(raw.appPath, path.dirname(file)),
    baseUrl: String(raw.baseUrl),
  };
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
