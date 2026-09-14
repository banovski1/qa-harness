import { test } from '../../../src/fixtures/test.ts';
import { LoginPage } from '../../../src/pages/web/LoginPage.ts';
import { IndexPage } from '../../../src/pages/web/IndexPage.ts';

test.use({ storageState: { cookies: [], origins: [] } });

test('a user created via the API can log in and reach the dashboard', async ({ page, given }) => {
  const username = 'ess_test';
  const password = 'Test1234!'; // allow:no-hardcoded-credentials test data required by the script's step 1, not an app secret
  const employee = await given.employee();
  await given.user({ username, password, empNumber: employee.id });

  const login = new LoginPage(page);
  await login.goto();
  await login.loginAs(username, password);

  const dashboard = new IndexPage(page);
  await dashboard.expectLoaded();
  await dashboard.navigation.expectVisible();
});
