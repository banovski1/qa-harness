# TypeScript Tooling Migration Design

## Goal

Migrate the repository analyzer and framework generator from JavaScript `.mjs` sources to TypeScript without changing analyzer behavior. Preserve the root `app-config.yaml` workflow, the `npm run analyze` command, ES module semantics, and generic Backbone/Handlebars plus `routes.json` support.

## Current Contract

The analyzer's existing behavior is the contract. Before migration, `npm test --prefix scripts/repo-analyzer` passes 139 tests across 51 top-level tests. That suite covers framework detection, route and component extraction, API documentation, live URLs, report snapshots, utility behavior, and the Backbone/Handlebars fixture with the `json-routes` backend.

The analyzer runs five stages in order: detection, routes, components, API documentation, and live URLs. When no `--app` argument is supplied, all stages resolve the target application from the repository-root `app-config.yaml`. The generator consumes analyzer JSON reports and API maps and emits language-specific Playwright projects.

## Runtime And Build Strategy

Use `tsx` to execute TypeScript source directly and `tsc --noEmit` for static checking. This keeps commands immediately runnable without committing build output or requiring a separate build before analysis.

Use Node ESM-compatible TypeScript configuration with `module` and `moduleResolution` set for Node's modern module model. Keep strict checking enabled, with narrowly scoped permissive types only where fully modeling third-party parser ASTs or dynamic language-adapter templates would turn the migration into a rewrite.

Package scripts own TypeScript execution. The root `npm run analyze` command remains stable. Direct commands that name `.mjs` files may move to package scripts and TypeScript entry points. Generator validation and preview are exposed as package scripts.

## Type Architecture

Introduce shared, explicit interfaces around stable data boundaries:

- Root project configuration: `appPath` and `baseUrl`.
- Frontend and backend registry entries and detection results.
- Route records, route collection results, component records, extracted elements, and locator descriptions.
- API documentation endpoints, parameters, tier results, and API map request specifications.
- Analyzer JSON report schemas for routes, components, live URLs, and label dictionaries.
- Generator configuration, application/page/element models, generation statistics, files to write, language adapters, and API resources.

JSON and YAML enter the system as `unknown` and are narrowed or validated at their consumption boundaries where practical. Runtime validation remains compatible with current error behavior; TypeScript types do not replace checks needed for user-authored files.

Keep the existing module layout unless a shared type module or a focused extraction materially reduces coupling. In particular, do not split large language templates merely to reduce line counts: their generated string bodies are cohesive outputs.

## Migration Slices

### Foundation And Contracts

Add TypeScript execution and type-check dependencies, shared compiler settings, package scripts, and shared domain/schema types. Migrate the root project-config module and the smallest contract tests first. Confirm the root config flow and analyzer execution plan before proceeding.

### Repository Analyzer

Migrate analyzer production modules, fixtures, and tests to `.ts` in dependency-aware groups. Update imports consistently for ESM execution. Preserve algorithms, report formatting, sort order, CLI arguments, exit behavior, and snapshots. Run focused tests after each group and the complete analyzer suite at the end of the slice.

The Backbone/Handlebars fixture must continue to detect frontend `backbone`, backend `json-routes`, template elements, and non-empty API documentation. No analyzer output under `analysis/` is hand-edited.

### Framework Generator

Migrate generator readers, models, writers, locator utilities, request specifications, orchestration, and language adapters. Use typed adapter and file contracts so every language implementation is checked without changing emitted content. Preserve ESM behavior and generator configuration defaults.

Run the analysis gate and dry-run generation after this slice. Generated framework output is not hand-edited or committed.

### Cleanup And Documentation

Remove obsolete `.mjs` tooling and test files after their TypeScript replacements pass. Update repository documentation to name supported package scripts and `.ts` paths. Report any intentionally retained JavaScript files, such as target-app fixture source used as parser input, separately from migrated tooling.

## Testing And Verification

Every behavior-affecting refactor follows a red-green-refactor cycle. Pure file-extension migrations are guarded by the already-green contract suite plus a failing type-check or entry-point test before implementation.

Required final verification:

1. Run the TypeScript type checks for both tooling packages.
2. Run `npm test --prefix scripts/repo-analyzer` and confirm all analyzer tests and snapshots pass.
3. Run `npm run analyze` against the app configured in root `app-config.yaml`.
4. Verify the result identifies an EspoCRM-like application as frontend `backbone` and backend `json-routes`.
5. Verify generated component and API documentation data are non-empty.
6. Run the framework generator analysis check through its package script.
7. Run framework generation in dry-run mode through its package script.
8. Inspect `git status` and generated diffs to ensure `analysis/` and `generated-framework/` are not committed.

## Commit Strategy

Commit the migration in logical, independently testable steps:

1. TypeScript foundation and shared contracts.
2. Repository analyzer migration.
3. Framework generator migration.
4. Command/documentation cleanup and final verification adjustments.

The exact boundary may be split further when a module group has its own meaningful test cycle. Each commit must leave its affected package runnable and tested.

## Out Of Scope

- Changes to analyzer detection or extraction behavior.
- New framework support or report fields.
- Hand edits to generated analyzer or framework output.
- A redesign of parser algorithms, generator templates, or generated Playwright architecture.
- Full static typing of third-party AST implementations when a narrow compatibility type is sufficient.
