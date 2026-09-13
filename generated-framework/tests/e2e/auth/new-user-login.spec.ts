import { test } from '../../../src/fixtures/test.ts';
import { IndexPage } from '../../../src/pages/web/IndexPage.ts';
import { loginAsUser } from '../../../src/utils/auth.ts';
import { uniqueName } from '../../../src/utils/unique-name.ts';

test.use({ storageState: { cookies: [], origins: [] } });

test('a newly created user can log in and reach the dashboard', async ({ page, given }) => {
  const username = uniqueName('ess_test');
  const password = 'Test1234!'; // allow:no-hardcoded-credentials this is the new test user's own password, created for this run via the API, not a real credential
  const employee = await given.employee();
  await given.user({ username, password, empNumber: employee.id });

  await loginAsUser(page, username, password);

  const dashboard = new IndexPage(page);
  await dashboard.expectLoaded();
  await dashboard.navigation.expectVisible();
});
