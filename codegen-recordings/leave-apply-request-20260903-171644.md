# Codegen recording: leave-apply-request

- Source URL: https://opensource-demo.orangehrmlive.com
- Recorded: 2026-09-03T17:16:44Z

## Steps

1. **goto** `/web/index.php/auth/login`
2. **click** `getByRole('textbox', { name: 'Username' })` — stable
3. **fill** `getByRole('textbox', { name: 'Username' })` = `"Admin"` — stable
4. **click** `getByRole('textbox', { name: 'Password' })` — stable
5. **fill** `getByRole('textbox', { name: 'Password' })` = `"admin123"` — stable
6. **click** `getByRole('button', { name: 'Login' })` — stable
7. **click** `getByRole('link', { name: 'Leave' })` — stable
   → candidate template: `topNavTab` (scripts/framework-generator/generator-config.yaml)
8. **click** `getByRole('link', { name: 'Apply' })` — stable
9. **click** `locator('.oxd-icon.bi-caret-down-fill.oxd-select-text--arrow')` — ⚠ UNSTABLE (raw CSS, no label scoping)
   → candidate template: `labelledSelect` (scripts/framework-generator/generator-config.yaml) — verify the field's label (e.g. "Leave Type") before substituting
10. **click** `getByRole('option', { name: 'CAN - Matternity' })` — stable
11. **click** `getByRole('textbox', { name: 'yyyy-dd-mm' }).first()` — ⚠ UNSTABLE (positional, `.first()` disambiguates two identically-labelled date fields)
12. **click** `getByText('1', { exact: true })` — ⚠ UNSTABLE (matches on visible text alone; a calendar day cell)
13. **click** `getByRole('textbox', { name: 'yyyy-dd-mm' }).nth(1)` — ⚠ UNSTABLE (positional, `.nth(1)`)
14. **click** `getByText('3', { exact: true })` — ⚠ UNSTABLE (matches on visible text alone; a calendar day cell)
15. **click** `locator('textarea')` — ⚠ UNSTABLE (raw CSS, no label scoping)
    → candidate template: `labelledTextarea` (scripts/framework-generator/generator-config.yaml) — verify the field's label (e.g. "Comments") before substituting
16. **fill** `locator('textarea')` = `"Please consider my leave"` — ⚠ UNSTABLE (same locator as step 15)
17. **click** `getByRole('button', { name: 'Apply' })` — stable
18. **click** `getByRole('button', { name: 'Apply' })` — stable (duplicate click, likely a re-submit after the app rejected the first attempt)
19. **click** `getByText('WarningFailed to Submit')` — ⚠ UNSTABLE (matches on visible text alone; this looks like an app-side validation/toast, not an intended assertion target)

## Raw generated code

<details>
<summary>playwright codegen output, unedited</summary>

```typescript
import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  await page.getByRole('textbox', { name: 'Username' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill('Admin');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('admin123');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'Leave' }).click();
  await page.getByRole('link', { name: 'Apply' }).click();
  await page.locator('.oxd-icon.bi-caret-down-fill.oxd-select-text--arrow').click();
  await page.getByRole('option', { name: 'CAN - Matternity' }).click();
  await page.getByRole('textbox', { name: 'yyyy-dd-mm' }).first().click();
  await page.getByText('1', { exact: true }).click();
  await page.getByRole('textbox', { name: 'yyyy-dd-mm' }).nth(1).click();
  await page.getByText('3', { exact: true }).click();
  await page.locator('textarea').click();
  await page.locator('textarea').fill('Please consider my leave');
  await page.getByRole('button', { name: 'Apply' }).click();
  await page.getByRole('button', { name: 'Apply' }).click();
  await page.getByText('WarningFailed to Submit').click();
});
```

</details>
