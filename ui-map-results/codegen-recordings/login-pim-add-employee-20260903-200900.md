# Codegen recording: login-pim-add-employee

- Source URL: https://opensource-demo.orangehrmlive.com
- Recorded: 2026-09-03T20:09:00Z

## Steps

1. **goto** `https://opensource-demo.orangehrmlive.com/web/index.php/auth/login`
2. **click** `getByRole('textbox', { name: 'Username' })` — stable
3. **fill** `getByRole('textbox', { name: 'Username' })` = `"Admin"` — stable
4. **click** `getByRole('textbox', { name: 'Password' })` — stable
5. **fill** `getByRole('textbox', { name: 'Password' })` = `"admin123"` — stable
6. **click** `getByRole('button', { name: 'Login' })` — stable
7. **click** `getByRole('link', { name: 'PIM' })` — stable
8. **click** `getByRole('listitem').filter({ hasText: 'Add Employee' })` — stable
9. **click** `getByRole('textbox', { name: 'First Name' })` — stable
10. **fill** `getByRole('textbox', { name: 'First Name' })` = `"ESS"` — stable
11. **click** `getByRole('textbox', { name: 'Last Name' })` — stable
12. **fill** `getByRole('textbox', { name: 'Last Name' })` = `"User"` — stable
13. **click** `locator('.oxd-switch-input')` — ⚠ UNSTABLE (raw CSS, matches on class only, no label)
14. **click** `getByRole('textbox').nth(5)` — ⚠ UNSTABLE (positional, unlabeled generic textbox)
    → candidate template: `labelledInput` (scripts/framework-generator/generator-config.yaml) once the field's actual label (Employee Id / Username) is confirmed
15. **fill** `getByRole('textbox').nth(5)` = `"ess_test"` — ⚠ UNSTABLE (same locator as step 14)
16. **click** `locator('input[type="password"]').first()` — ⚠ UNSTABLE (positional CSS, no label)
    → candidate template: `labelledInput` (label likely "Password")
17. **fill** `locator('input[type="password"]').first()` = `"Test1234!"` — ⚠ UNSTABLE (same locator as step 16)
18. **click** `locator('input[type="password"]').nth(1)` — ⚠ UNSTABLE (positional CSS, no label)
    → candidate template: `labelledInput` (label likely "Confirm Password")
19. **fill** `locator('input[type="password"]').nth(1)` = `"Test1234!"` — ⚠ UNSTABLE (same locator as step 18)
20. **click** `getByRole('button', { name: 'Save' })` — stable
21. **click** `getByRole('textbox').nth(4)` — ⚠ UNSTABLE (positional, unlabeled generic textbox)
22. **click** `getByText('Employee Id already exists')` — ⚠ UNSTABLE (matches on visible text only; a validation-error message, not a stable control)
23. **click** `getByRole('textbox').nth(4)` — ⚠ UNSTABLE (same locator as step 21)
24. **fill** `getByRole('textbox').nth(4)` = `"0439"` — ⚠ UNSTABLE (same locator as step 21)
25. **click** `getByRole('button', { name: 'Save' })` — stable
26. **click** `getByRole('heading', { name: 'ESS User' })` — stable
27. **click** `locator('span').filter({ hasText: 'mandaUdhay userJ' })` — ⚠ UNSTABLE (raw CSS + concatenated text match, likely a user-menu/avatar dropdown trigger)
28. **click** `getByRole('menuitem', { name: 'Logout' })` — stable
29. **click** `getByRole('textbox', { name: 'Username' })` — stable
30. **fill** `getByRole('textbox', { name: 'Username' })` = `"ess_test"` — stable
31. **press** `getByRole('textbox', { name: 'Username' })` → `Tab` — stable
32. **fill** `getByRole('textbox', { name: 'Password' })` = `"Test1234!"` — stable
33. **press** `getByRole('textbox', { name: 'Password' })` → `Enter` — stable
34. **click** `getByRole('button', { name: 'Login' })` — stable
35. **assert** `expect(getByRole('heading')).toContainText('Dashboard')` — stable

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
  await page.getByRole('link', { name: 'PIM' }).click();
  await page.getByRole('listitem').filter({ hasText: 'Add Employee' }).click();
  await page.getByRole('textbox', { name: 'First Name' }).click();
  await page.getByRole('textbox', { name: 'First Name' }).fill('ESS');
  await page.getByRole('textbox', { name: 'Last Name' }).click();
  await page.getByRole('textbox', { name: 'Last Name' }).fill('User');
  await page.locator('.oxd-switch-input').click();
  await page.getByRole('textbox').nth(5).click();
  await page.getByRole('textbox').nth(5).fill('ess_test');
  await page.locator('input[type="password"]').first().click();
  await page.locator('input[type="password"]').first().fill('Test1234!');
  await page.locator('input[type="password"]').nth(1).click();
  await page.locator('input[type="password"]').nth(1).fill('Test1234!');
  await page.getByRole('button', { name: 'Save' }).click();
  await page.getByRole('textbox').nth(4).click();
  await page.getByText('Employee Id already exists').click();
  await page.getByRole('textbox').nth(4).click();
  await page.getByRole('textbox').nth(4).fill('0439');
  await page.getByRole('button', { name: 'Save' }).click();
  await page.getByRole('heading', { name: 'ESS User' }).click();
  await page.locator('span').filter({ hasText: 'mandaUdhay userJ' }).click();
  await page.getByRole('menuitem', { name: 'Logout' }).click();
  await page.getByRole('textbox', { name: 'Username' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill('ess_test');
  await page.getByRole('textbox', { name: 'Username' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password' }).fill('Test1234!');
  await page.getByRole('textbox', { name: 'Password' }).press('Enter');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByRole('heading')).toContainText('Dashboard');
});
```

</details>
