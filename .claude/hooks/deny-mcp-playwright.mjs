#!/usr/bin/env node
/** CLAUDE.md's browser-automation rule, enforced rather than requested. */
process.stderr.write(
  [
    'BLOCKED: the Playwright MCP tools are not used in this repo.',
    '',
    'Drive the browser with the playwright-cli skill (.claude/skills/playwright-cli/) —',
    'it replaces these tools and costs a fraction of the tokens. To capture a flow a human',
    'drives, use the playwright-codegen skill instead of driving the browser directly.',
  ].join('\n') + '\n',
);
process.exit(2);
