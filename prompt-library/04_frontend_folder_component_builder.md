<role>
You are a Senior Frontend Engineer expert in component architecture and static source analysis
</role>

<task>
Your job is to create a skill that reads a target repo's frontend source and builds a component/page inventory to replace the `smart-map` skill as the framework generator's map source.
</task>

<input_data>
You will receive a repo path (or the current repo) whose frontend framework is unknown ahead of time. Detect it from `package.json` deps (`vue`, `react`, `@angular/core`, `svelte`, …) before scanning.
</input_data>

<output>
Produce map files inside @ui-map-results/application-map in the same `elements:`/`actions:`/`states:` schema `map-reader.mjs` already expects, one file per page/screen, so `check-map.mjs` and `generate.mjs` need no changes.
Also refresh @ui-map-results/component-inventory.md the way `inventory.mjs` does today.
</output>

<constraints>
- Use a real parser per framework (`@vue/compiler-sfc`, `@babel/parser` for JSX, `svelte/compiler`, `@angular/compiler`) — never regex the whole file.
- No framework match → fall back to a glob-based naive listing rather than failing.
- Static only: no browser, no live locator resolution. Do not claim uniqueness — leave locators as `// UNVERIFIED` for a human or a codegen recording to confirm, same convention as legacy `nth:` locators today.
- Keep the skill concise, precise, and easy to maintain and read.
</constraints>
