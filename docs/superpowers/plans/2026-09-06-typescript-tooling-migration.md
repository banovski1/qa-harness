# TypeScript Tooling Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the repository analyzer and framework generator `.mjs` tooling with typed TypeScript while preserving analyzer output and the root `npm run analyze` workflow.

**Architecture:** Execute `.ts` sources directly with `tsx` and enforce static correctness with `tsc --noEmit`. Introduce shared contract modules at the analyzer and generator boundaries, then migrate existing modules in dependency order without changing their algorithms or report formats.

**Tech Stack:** Node.js 22, TypeScript, tsx, Node ESM, node:test, js-yaml, existing Babel/Vue/Svelte/Angular parser dependencies.

**Spec:** `docs/superpowers/specs/2026-09-06-typescript-tooling-migration-design.md`

## Global Constraints

- Existing analyzer behavior and snapshots are the runtime contract.
- Keep root `npm run analyze` stable and preserve root `app-config.yaml` resolution.
- Preserve Backbone/Handlebars detection and `routes.json` API route support.
- Keep ES module behavior.
- Do not hand-edit or commit `analysis/`, `generated-framework/`, or `**/*.generated.ts`.
- Use two-space indentation, single quotes, semicolons, camelCase functions, and PascalCase classes.
- Type stable boundaries explicitly; use narrow compatibility types for third-party ASTs and generated-code templates.

---

### Task 1: TypeScript Foundation And Shared Project Config

**Files:**
- Create: `tsconfig.base.json`
- Create: `scripts/repo-analyzer/tsconfig.json`
- Create: `scripts/framework-generator/tsconfig.json`
- Create: `scripts/repo-analyzer/types.ts`
- Rename: `scripts/project-config.mjs` to `scripts/project-config.ts`
- Rename: `scripts/repo-analyzer/__tests__/unit.test.mjs` to `scripts/repo-analyzer/__tests__/unit.test.ts`
- Modify: `package.json`
- Modify: `scripts/repo-analyzer/package.json`
- Modify: `scripts/framework-generator/package.json`
- Modify: both package lockfiles

**Interfaces:**
- Produces: `ProjectConfig`, `CliArgs`, `DetectionResult`, `RouteRecord`, `ComponentRecord`, `ApiEndpoint`, and analyzer report schema interfaces from `scripts/repo-analyzer/types.ts`.
- Produces: `loadProjectConfig(file?: string): ProjectConfig` and `projectConfigPath(): string`.
- Consumes: existing scalar YAML syntax and repository-root path resolution.

- [ ] **Step 1: Add a failing TypeScript contract test**

Rename the unit test to `.ts`, update imports to `.js` ESM specifiers, and add compile-time assignments that exercise the public config and analyzer plan types:

```typescript
import type {CliArgs, ProjectConfig} from '../types.js';

test('public analyzer contracts accept the root project config flow', () => {
  const config: ProjectConfig = loadProjectConfig(fixtureConfig);
  const args: CliArgs = {pathPrefix: '/web'};
  assert.equal(config.baseUrl, 'https://example.test');
  assert.equal(analyzerPlan(args).at(-1)?.args.at(-1), '/web');
});
```

- [ ] **Step 2: Run the type check and verify RED**

Run: `npm run typecheck --prefix scripts/repo-analyzer`

Expected: FAIL because the TypeScript configuration, runner dependencies, and `types.ts` do not exist yet.

- [ ] **Step 3: Add TypeScript execution and compiler setup**

Add `typescript`, `tsx`, `@types/node`, and `@types/js-yaml` as development dependencies to each tooling package. Configure NodeNext ESM, `strict: true`, `noEmit: true`, `allowJs: true`, `checkJs: false`, `resolveJsonModule: true`, and `skipLibCheck: true` in the shared config. Package configs include their source/test trees plus shared modules needed by that package.

Add scripts with these contracts:

```json
{
  "test": "tsx --test __tests__/*.test.ts",
  "typecheck": "tsc -p tsconfig.json --noEmit"
}
```

- [ ] **Step 4: Add shared analyzer contracts and migrate project config**

Define discriminated or named interfaces for the stable analyzer records. Parse scalar YAML into `Record<string, string>`, return `ProjectConfig`, and retain the exact missing-file/missing-key messages and tilde expansion behavior.

- [ ] **Step 5: Run focused verification**

Run: `npm run typecheck --prefix scripts/repo-analyzer`

Run: `npm test --prefix scripts/repo-analyzer`

Expected: PASS with the existing unit behavior; fixture/report tests become available again as they migrate in Task 2.

- [ ] **Step 6: Commit**

```bash
git add package.json scripts/project-config.ts tsconfig.base.json scripts/repo-analyzer scripts/framework-generator/package.json scripts/framework-generator/package-lock.json
git commit -m "Add TypeScript tooling foundation"
```

---

### Task 2: Repository Analyzer Migration

**Files:**
- Rename: all production `scripts/repo-analyzer/*.mjs` files to `.ts`
- Rename: `scripts/repo-analyzer/__fixtures__/cases.mjs` and `run.mjs` to `.ts`
- Rename: remaining `scripts/repo-analyzer/__tests__/*.test.mjs` to `.test.ts`
- Modify: `scripts/repo-analyzer/types.ts`
- Modify: `scripts/repo-analyzer/package.json`
- Modify: `package.json`
- Modify: analyzer imports of generator locator/naming modules after those modules migrate in Task 3

**Interfaces:**
- Consumes: `ProjectConfig`, filesystem contents, parser AST compatibility values, registry definitions, and CLI arguments.
- Produces: typed detection, route collection, component collection, API documentation, live URL, label dictionary, and report results with byte-for-byte stable markdown snapshots.

- [ ] **Step 1: Make the migrated analyzer suite fail on unresolved TypeScript entry points**

Rename test and fixture harness files first, change imports to `.js` ESM specifiers, and point the root/analyzer scripts at `analyze.ts`. Keep all existing assertions unchanged.

Run: `npm test --prefix scripts/repo-analyzer`

Expected: FAIL because production `.ts` modules and typed imports are not available yet.

- [ ] **Step 2: Migrate utilities, reports, registries, and detection**

Rename and type `util`, `report`, `registry-frontend`, `registry-backend`, and `detect`. Apply shared contracts to registry match functions and detection results. Preserve manifest precedence, auxiliary-path scoring, fallback detection, `routes.json` matching, report writes, and CLI output.

Add package scripts `test:unit` and `test:analyzers`, then run focused tests:

```bash
npm run test:unit --prefix scripts/repo-analyzer
npm run test:analyzers --prefix scripts/repo-analyzer
```

Expected: registry/detection/unit cases pass or expose only modules still pending in the next step.

- [ ] **Step 3: Migrate parsers, i18n, and component extraction**

Rename and type `parsers`, `elements-vue`, `i18n`, and `components`. Use a small recursive AST compatibility type such as:

```typescript
export type AstNode = Record<string, unknown> & {type?: string};
export type AstVisitor = (node: AstNode) => void;
```

Keep framework-specific parsing and extracted element/locator behavior unchanged. Use shared component and locator contracts for return values.

Run: `npm run test:unit --prefix scripts/repo-analyzer`

Run: `npm run test:analyzers --prefix scripts/repo-analyzer`

Expected: PASS, including Backbone/Handlebars elements and all locator ladder assertions.

- [ ] **Step 4: Migrate routes, API docs, live URLs, and orchestration**

Rename and type `routes`, `api-docs`, `live-urls`, and `analyze`. Preserve stage order and forward `pathPrefix` only to live URL generation. Update child process entry paths to `.ts` and ensure execution uses the TypeScript runner rather than raw Node for spawned stages.

Run: `npm run analyze -- --app scripts/repo-analyzer/__fixtures__/backbone-handlebars`

Expected: PASS; reports identify `backbone` and `json-routes` with non-empty component/API data. Remove the generated `analysis/` directory from the working tree only if it is untracked and was created by this command.

- [ ] **Step 5: Run full analyzer checks**

Run: `npm run typecheck --prefix scripts/repo-analyzer`

Run: `npm test --prefix scripts/repo-analyzer`

Expected: PASS, 139 tests, unchanged report snapshots.

- [ ] **Step 6: Commit**

```bash
git add package.json scripts/project-config.ts scripts/repo-analyzer
git commit -m "Migrate repository analyzer to TypeScript"
```

---

### Task 3: Framework Generator Core Migration

**Files:**
- Create: `scripts/framework-generator/types.ts`
- Rename: generator core `.mjs` files outside `languages/` to `.ts`
- Modify: `scripts/framework-generator/package.json`
- Modify: `scripts/framework-generator/tsconfig.json`

**Interfaces:**
- Consumes: analyzer report schemas, generator YAML, API-map YAML, locator maps, and shared project config.
- Produces: `GeneratorConfig`, `ApplicationModel`, `PageModel`, `ElementModel`, `ApiModel`, `GeneratedFile`, `GenerationContext`, and `LanguageAdapter` contracts.

- [ ] **Step 1: Add failing generator contract tests**

Create `scripts/framework-generator/__tests__/contracts.test.ts` using temporary analysis/config directories. Test real readers with literal route/component data and assert the normalized page/API model. Include malformed JSON and missing required config cases.

Run: `npm test --prefix scripts/framework-generator`

Expected: FAIL because the TypeScript generator modules and test script are not present.

- [ ] **Step 2: Define generator contracts and migrate pure utilities**

Define the generator domain types, then migrate `naming`, `locator-spec`, `locator-ladder`, `page-model`, `request-spec`, `code-writer`, and `file-writer`. Preserve output quoting, naming, locator ranking, merge behavior, and write protection.

Run: `npm test --prefix scripts/framework-generator`

Expected: focused contract tests for utility consumers pass.

- [ ] **Step 3: Migrate analysis and API readers**

Rename and type `analysis-reader`, `api-map-reader`, `smart-api-map`, `check-api-map`, and `check-analysis`. Narrow parsed JSON/YAML from `unknown`, retain current validation/error messages, and return the typed application/API models.

Run: `npm run typecheck --prefix scripts/framework-generator`

Run: `npm test --prefix scripts/framework-generator`

Expected: PASS.

- [ ] **Step 4: Migrate generator orchestration**

Rename and type `generate`, export `main(argv: string[] = process.argv.slice(2)): Promise<void>` for contract testing, retain CLI catch/exit behavior, and type the generation context passed to adapters and writers.

Run: `npm run check-analysis --prefix scripts/framework-generator`

Expected: PASS against current analyzer output when present.

- [ ] **Step 5: Commit**

```bash
git add scripts/framework-generator
git commit -m "Migrate framework generator core to TypeScript"
```

---

### Task 4: Language Adapter Migration

**Files:**
- Rename: all `scripts/framework-generator/languages/*.mjs` files to `.ts`
- Modify: `scripts/framework-generator/types.ts`
- Modify: imports and documentation strings that refer to tooling source filenames

**Interfaces:**
- Consumes: `GenerationContext`, page/API models, scaffold definitions, and generated-file contracts.
- Produces: one `LanguageAdapter` per supported language and the same generated file contents as before.

- [ ] **Step 1: Extend the adapter contract test and verify RED**

Add a table-driven test that loads every supported adapter and verifies it satisfies real adapter behavior for a minimal page context: supported ID lookup, static files array, empty directories array, and either generated page files or the intentional `null` scaffold response.

Run: `npm test --prefix scripts/framework-generator`

Expected: FAIL while adapter imports still point to missing `.mjs` modules or do not satisfy the typed contract.

- [ ] **Step 2: Migrate scaffold and non-TypeScript adapters**

Rename and type `scaffold`, `javascript`, `python`, `java`, and `csharp`. Type scaffold definitions and generated files while leaving embedded target-language strings unchanged.

Run: `npm test --prefix scripts/framework-generator`

Expected: the adapter table passes for migrated languages.

- [ ] **Step 3: Migrate TypeScript adapter and runtime template**

Rename and type `typescript` and `typescript-runtime`. Treat embedded generated TypeScript bodies as strings; type only the functions and context used to assemble them. Update `languages/index.ts` to expose a typed adapter map.

Run: `npm run typecheck --prefix scripts/framework-generator`

Run: `npm test --prefix scripts/framework-generator`

Expected: PASS for all supported adapters.

- [ ] **Step 4: Verify generated output through dry run**

Run: `npm run generate:dry --prefix scripts/framework-generator`

Expected: PASS and print the generation plan without writing `generated-framework/`.

- [ ] **Step 5: Commit**

```bash
git add scripts/framework-generator
git commit -m "Migrate generator language adapters to TypeScript"
```

---

### Task 5: Documentation, End-To-End Verification, And Cleanup

**Files:**
- Modify: `AGENTS.md`
- Modify: `CLAUDE.md`
- Modify: `README.md`
- Modify: `scripts/framework-generator/README.md`
- Modify: `.gitignore` only if TypeScript runtime/build artifacts require an entry

**Interfaces:**
- Consumes: package scripts established by earlier tasks.
- Produces: stable documented commands and a repository containing no obsolete tooling/test `.mjs` files.

- [ ] **Step 1: Update documentation and command references**

Document these supported commands:

```bash
npm run analyze
npm test --prefix scripts/repo-analyzer
npm run typecheck --prefix scripts/repo-analyzer
npm run check-analysis --prefix scripts/framework-generator
npm run generate:dry --prefix scripts/framework-generator
npm run typecheck --prefix scripts/framework-generator
```

Change source references from `.mjs` to `.ts`. Do not change references to fixture application JavaScript, generated target-language files, or general ES module behavior.

- [ ] **Step 2: Verify no obsolete tooling `.mjs` remains**

Run:

```bash
find scripts/repo-analyzer scripts/framework-generator -type f -name '*.mjs' -not -path '*/node_modules/*'
```

Expected: no output. Any intentional `.js` files are parser fixtures or dependency files, not unmigrated tooling.

- [ ] **Step 3: Run complete static and contract verification**

Run: `npm run typecheck --prefix scripts/repo-analyzer`

Run: `npm run typecheck --prefix scripts/framework-generator`

Run: `npm test --prefix scripts/repo-analyzer`

Run: `npm test --prefix scripts/framework-generator`

Expected: all commands pass; analyzer remains at 139 tests unless newly added behavioral contract tests increase the count.

- [ ] **Step 4: Run configured EspoCRM analysis**

Run: `npm run analyze`

Inspect the generated JSON with a read-only command and assert:

```text
frontend.framework = backbone
backend.framework = json-routes
frontend-components.json components.length > 0
api-documentation.json endpoints.length > 0
```

Do not stage generated analysis files.

- [ ] **Step 5: Run generator validation and dry run**

Run: `npm run check-analysis --prefix scripts/framework-generator`

Run: `npm run generate:dry --prefix scripts/framework-generator`

Expected: both pass against the configured application analysis, and dry run does not write generated framework output.

- [ ] **Step 6: Inspect repository state**

Run: `git diff --check`

Run: `git status --short`

Run: `git diff --stat HEAD`

Expected: no generated analysis/framework files staged; only intended documentation or cleanup changes remain.

- [ ] **Step 7: Commit**

```bash
git add AGENTS.md CLAUDE.md README.md scripts/framework-generator/README.md .gitignore
git commit -m "Document TypeScript tooling commands"
```

- [ ] **Step 8: Record final evidence**

Capture commit IDs, exact test counts, type-check results, EspoCRM detection values, generator validation output, dry-run result, and any intentional remaining JavaScript files for the final summary.
