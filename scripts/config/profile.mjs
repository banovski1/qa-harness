// The one place the hand-written configuration is read.
//
// This replaces the per-app `app-profile.yaml`. There is one app per checkout now, its
// settings live in a flat `.env` at the root, and testing a second app is a second
// worktree (see the `app-worktree` skill) rather than a second directory here.
//
// Everything downstream still receives the same shaped object the YAML profile produced,
// so the crawlers, the compiler and the emitter did not have to learn about `.env`.

import { readFileSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

/**
 * A `.env` parser, deliberately small: `KEY=value`, `#` comments, optional surrounding
 * quotes. No interpolation and no `export` — a config file that needs a shell to be
 * understood is not the straightforward thing a `.env` is chosen for.
 */
export function parseEnvFile(text) {
  const out = {};
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"') && value.length > 1)
      || (value.startsWith("'") && value.endsWith("'") && value.length > 1)) {
      value = value.slice(1, -1);
    }
    out[key] = value;
  }
  return out;
}

/** A comma-separated list. Empty entries are dropped, so a trailing comma is harmless. */
function list(value) {
  return (value ?? '').split(',').map(s => s.trim()).filter(Boolean);
}

function num(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function expandHome(p) {
  return p && p.startsWith('~') ? join(homedir(), p.slice(1)) : p;
}

/**
 * The real environment wins over the file, so CI can set APP_PASSWORD without a `.env`
 * existing at all, and a developer can override one value for a single command.
 */
export function loadEnv(envPath = join(ROOT, '.env')) {
  const fromFile = existsSync(envPath) ? parseEnvFile(readFileSync(envPath, 'utf8')) : {};
  return { ...fromFile, ...process.env };
}

/**
 * A login form is a username, a password and a submit button. The YAML profile expressed
 * that as a general step machine, which bought generality nothing in the corpus ever used
 * and cost every reader a schema to learn. Four selectors say the same thing.
 *
 * `null` when no login URL is configured — an app that needs no credentials to be crawled.
 */
function authFrom(env) {
  if (!env.AUTH_LOGIN_URL) return null;
  const steps = [];
  if (env.AUTH_USERNAME_SELECTOR) {
    steps.push({ action: 'fill', selector: env.AUTH_USERNAME_SELECTOR, value: 'env:APP_USERNAME' });
  }
  if (env.AUTH_PASSWORD_SELECTOR) {
    steps.push({ action: 'fill', selector: env.AUTH_PASSWORD_SELECTOR, value: 'env:APP_PASSWORD' });
  }
  if (env.AUTH_SUBMIT_SELECTOR) {
    steps.push({ action: 'click', selector: env.AUTH_SUBMIT_SELECTOR });
  }
  return { loginUrl: env.AUTH_LOGIN_URL, steps, readyWhen: env.AUTH_READY_WHEN || null };
}

/** The profile, in the shape every consumer already expected. */
export function loadProfile(envPath) {
  const env = loadEnv(envPath);
  if (!env.APP_BASE_URL) {
    throw new Error(
      'APP_BASE_URL is not set. Copy .env.example to .env and fill it in — it is the only '
      + 'file in this repo anyone writes by hand.',
    );
  }
  return {
    name: env.APP_NAME || 'app',
    baseUrl: env.APP_BASE_URL,
    repoPath: expandHome(env.APP_REPO_PATH || ''),
    session: env.APP_SESSION || 'app',
    auth: authFrom(env),
    seedRoutes: list(env.CRAWL_SEED_ROUTES),
    exclude: list(env.CRAWL_EXCLUDE),
    budget: {
      maxScreens: num(env.CRAWL_MAX_SCREENS, 40),
      maxDepth: num(env.CRAWL_MAX_DEPTH, 2),
      mapMinutes: num(env.CRAWL_MAP_MINUTES, 8),
      maxScreensPerModule: num(env.CRAWL_MAX_SCREENS_PER_MODULE, 8),
    },
    specCandidates: list(env.API_SPEC_CANDIDATES),
    settings: {
      testIdAttribute: env.TEST_ID_ATTRIBUTE || 'data-testid',
      contentSelector: env.CONTENT_SELECTOR || 'main',
      batchSize: num(env.BATCH_SIZE, 6),
      settleTimeout: num(env.SETTLE_TIMEOUT, 8000),
      navTimeout: num(env.NAV_TIMEOUT, 30000),
    },
  };
}

/** The single artifact, at the root of the checkout. */
export const ANALYSIS_PATH = join(ROOT, 'analysis.json');
