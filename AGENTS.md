# Repository Guidelines

## Project Structure & Module Organization

This repository converts a local application clone into a Playwright framework through static analysis; generation requires no browser.

- `scripts/repo-analyzer/`: framework detection, route/component/API extraction, fixture apps, and Node.js tests.
- `scripts/framework-generator/`: analysis validation, page models, file writers, and language adapters.
- `analysis/`: reports and API maps *produced* by the analyzer — absent on this branch until it runs.
- `generated-framework/`: the Playwright project the generator *produces*; reusable code in `src/`, scenarios in `tests/e2e/`. Absent until `generate.ts` runs.
- `codegen-recordings/` and `test-case-candidates/`: recorded flows and candidate scenarios, added as you record them.
- `.claude/`: agent instructions, skills, and enforcement hooks. See `CLAUDE.md` for architecture details.

## Build, Test, and Development Commands

Run these from the repository root; configuration paths resolve relative to it. Install dependencies with `npm ci --prefix <directory>` for each of the two script packages and `generated-framework`.

- `npm test --prefix scripts/repo-analyzer`: run Node.js analyzer tests.
- `npm run typecheck --prefix scripts/repo-analyzer`: check the analyzer TypeScript.
- `npm test --prefix scripts/framework-generator`: run generator contract tests.
- `npm run typecheck --prefix scripts/framework-generator`: check the generator TypeScript.
- `npm run analyze`: run repo analysis from `appPath` in root `app-config.yaml` in the required order.
- `npm run check-analysis --prefix scripts/framework-generator`: validate analysis freshness and schema.
- `npm run generate:dry --prefix scripts/framework-generator`: preview generation; use `npm run generate --prefix scripts/framework-generator` to write output.
- `npm run typecheck --prefix generated-framework`: check TypeScript without emitting files.
- `npm test --prefix generated-framework`: execute Playwright tests.

Before browser tests, run `npx playwright install chromium` inside `generated-framework` and configure its `.env` from `.env.example`.

## Coding Style & Naming Conventions

Follow existing two-space indentation, single quotes, semicolons, and ES modules (`.ts` for tooling). Use camelCase functions and PascalCase classes. Preserve LF line endings. No dedicated formatter or linter is configured.

Never hand-edit `analysis/` or `**/*.generated.ts`. Regenerate reports and output; put custom actions and assertions in protected `<Name>Page.ts` subclasses.

## Testing Guidelines

Analyzer tests use `node:test` and `node:assert/strict`, with `__tests__/*.test.ts`, fixture apps, and report snapshots. Add regression cases for parser changes. Playwright scenarios use `tests/e2e/<module>/*.spec.ts`; keep locators in page objects and prefer web-first assertions over fixed sleeps. No numeric coverage threshold is configured. Validate generator changes with the analysis gate, dry run, and generated-output diff.

## Commit & Pull Request Guidelines

History uses short descriptive messages, without a consistent prefix scheme. Use concise imperative subjects. PRs should explain behavior changes, affected pipeline stages, verification commands/results, and related issues. Explain generated diffs; attach traces or screenshots when relevant to browser failures. Keep credentials and authentication state out of commits.
