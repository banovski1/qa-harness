// OrangeHRM: Vue 3 behind an external design system, labels with no `for` attribute —
// the case the label-anchored field template exists for.
import { test, expect } from '@playwright/test';
import { AddEmployeePage } from '../../src/pages/web/AddEmployeePage.ts';
import { ViewEmployeeListPage } from '../../src/pages/web/ViewEmployeeListPage.ts';
import { uniqueName } from '../../src/utils/unique-name.ts';

test('the employee list renders and the shared navigation is on it', async ({ page }) => {
  const list = new ViewEmployeeListPage(page);
  await list.goto();
  await list.navigation.expectVisible();
});

test('an unassociated label still addresses its input', async ({ page }) => {
  const form = new AddEmployeePage(page);
  await form.goto();
  const surname = uniqueName('Smoke');
  await form.firstName.fill('Pipeline');
  await form.lastName.fill(surname);
  await form.firstName.expectValue('Pipeline');
  await form.lastName.expectValue(surname);
});
