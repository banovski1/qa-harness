const SPEC = 'generated-framework/tests/e2e/admin/fixture.spec.ts';
const PAGE = 'generated-framework/src/pages/admin/FixturePage.ts';

export const CASES = [
  {
    name: 'clean spec passes',
    path: SPEC,
    expect: [],
    content: `import { test, expect } from '../../../src/fixtures';
import { uniqueUsername } from '../../../src/utils/testData';

test('an admin can create a system user', async ({ systemUsersPage, addSystemUserPage }) => {
  const username = uniqueUsername('qa');
  await systemUsersPage.goto();
  await systemUsersPage.openAddUserForm();
  await addSystemUserPage.createUser({ username });
  await expect(systemUsersPage.searchResults.locator).toContainText(username);
});
`,
  },
  {
    name: 'clean page object passes',
    path: PAGE,
    expect: [],
    content: `import { InputComponent } from '../../components';
import { FixturePageGenerated } from './FixturePage.generated';

export class FixturePage extends FixturePageGenerated {
  get username(): InputComponent {
    return new InputComponent(this.page.getByLabel('Username'), 'Username');
  }

  async search(term: string): Promise<void> {
    await this.username.fill(term);
    await this.searchButton.click();
  }
}
`,
  },
  {
    name: 'generated file is unwritable',
    path: 'generated-framework/src/pages/admin/FixturePage.generated.ts',
    expect: ['protected-path'],
    content: 'export class X {}\n',
  },
  {
    name: 'raw timeout is blocked',
    path: SPEC,
    expect: ['no-raw-timeout'],
    content: `test('x', async ({ page, dashboardPage }) => {
  await dashboardPage.goto();
  await page.waitForTimeout(3000);
});
`,
  },
  {
    name: 'locator in a spec is blocked',
    path: SPEC,
    expect: ['locator-in-spec'],
    content: `test('x', async ({ page }) => {
  await page.getByRole('button', { name: 'Save' }).click();
});
`,
  },
  {
    name: 'snapshot assertion is blocked',
    path: SPEC,
    expect: ['web-first-assert'],
    content: `test('x', async ({ dashboardPage }) => {
  expect(await dashboardPage.heading.locator.isVisible()).toBe(true);
});
`,
  },
  {
    name: 'inline network wait is blocked',
    path: SPEC,
    expect: ['network-before-action'],
    content: `test('x', async ({ page, addSystemUserPage }) => {
  await addSystemUserPage.saveButton.click();
  await page.waitForResponse('**/users');
});
`,
  },
  {
    name: 'force click is blocked',
    path: PAGE,
    expect: ['no-force'],
    content: `export class FixturePage {
  async save(): Promise<void> {
    await this.saveButton.click({ force: true });
  }
}
`,
  },
  {
    name: 'shared test data is blocked',
    path: SPEC,
    expect: ['unique-test-data'],
    content: `test('x', async ({ addSystemUserPage }) => {
  await addSystemUserPage.createUser('admin.qa');
});
`,
  },
  {
    name: 'Date.now suffix is blocked',
    path: SPEC,
    expect: ['unique-test-data'],
    content: `test('x', async ({ addSystemUserPage }) => {
  const username = 'qa' + Date.now();
  await addSystemUserPage.username.fill(username);
});
`,
  },
  {
    name: 'narration comments are blocked',
    path: SPEC,
    expect: ['no-narration'],
    content: `test('x', async ({ dashboardPage }) => {
  // Navigate to the dashboard
  await dashboardPage.goto();
});
`,
  },
  {
    name: 'comment budget is enforced',
    path: PAGE,
    expect: ['comment-budget'],
    content: `export class FixturePage {
  /** The username input on the search form. */
  get username(): unknown {
    return this.page.getByLabel('Username');
  }

  /** The role dropdown on the search form. */
  get role(): unknown {
    return this.page.getByLabel('Role');
  }

  /** The status dropdown on the search form. */
  get status(): unknown {
    return this.page.getByLabel('Status');
  }

  /** The submit control of the search form. */
  get submit(): unknown {
    return this.page.getByRole('button', { name: 'Search' });
  }

  /** The reset control of the search form. */
  get reset(): unknown {
    return this.page.getByRole('button', { name: 'Reset' });
  }
}
`,
  },
  {
    name: 'positional css is blocked',
    path: PAGE,
    expect: ['locator-priority', 'positional-locator', 'scoped-locator'],
    content: `export class FixturePage {
  get row(): unknown {
    return this.page.getByRole('row').locator('td:nth-child(3)');
  }
}
`,
  },
  {
    name: 'process.env is blocked',
    path: SPEC,
    expect: ['no-direct-env'],
    content: `test('x', async ({ page }) => {
  await page.goto(process.env.BASE_URL);
});
`,
  },
  {
    name: 'new page object in a spec is blocked',
    path: SPEC,
    expect: ['no-new-page-object'],
    content: `test('x', async ({ page }) => {
  const dashboard = new DashboardPage(page);
  await dashboard.goto();
});
`,
  },
  {
    name: 'local retries are blocked',
    path: SPEC,
    expect: ['no-local-retries'],
    content: `test.describe.configure({ retries: 3 });

test('x', async ({ dashboardPage }) => {
  await dashboardPage.goto();
});
`,
  },
  {
    name: 'the allow escape hatch is honoured',
    path: SPEC,
    expect: [],
    content: `test('x', async ({ page, dashboardPage }) => {
  await dashboardPage.goto();
  await page.waitForTimeout(500); // allow:no-raw-timeout third-party widget has no observable ready state
});
`,
  },
];
