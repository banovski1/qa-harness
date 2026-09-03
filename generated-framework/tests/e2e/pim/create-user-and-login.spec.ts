import { test, expect, uniqueName, uniqueUsername, uniqueSuffix } from '../../../src/fixtures';
import { loginAs } from '../../../src/utils/auth';
import { requiredEnv } from '../../../src/utils/env';

test.use({ storageState: { cookies: [], origins: [] } });

test('admin creates a user in PIM and the new user logs in', async ({ page, addEmployeePage, dashboardPage }) => {
  await loginAs(page, requiredEnv('APP_USERNAME'), requiredEnv('APP_PASSWORD'));

  const firstName = uniqueName('Qa');
  const lastName = uniqueName('User');
  const username = uniqueUsername('qauser');
  const password = `Qa${uniqueSuffix()}!1`;

  await addEmployeePage.navigation.pimMenuLink.click();
  await addEmployeePage.addEmployeeMenuItem.click();
  await addEmployeePage.createEmployeeWithLogin({ firstName, lastName, username, password });

  await loginAs(page, username, password);

  await expect(dashboardPage.dashboardHeading.locator).toBeVisible();
  await expect(dashboardPage.navigation.currentUserHeading.locator).toContainText(firstName);
});
