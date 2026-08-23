import { test as generated } from './page-fixtures';
import { DashboardPage } from '../pages/dashboard/DashboardPage';

// Add hand-written fixtures here: one property per fixture, then wire it in the
// extend() call below.
export interface ExtraFixtures {
  dashboardPage: DashboardPage;
}

export const test = generated.extend<ExtraFixtures>({
  dashboardPage: async ({ page }, use) => { await use(new DashboardPage(page)); },
});
