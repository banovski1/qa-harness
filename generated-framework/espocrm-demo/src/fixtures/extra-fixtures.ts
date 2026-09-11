import { test as generated } from './page-fixtures';

// Add hand-written fixtures here: one property per fixture, then wire it in the
// extend() call below. Empty until a scenario needs one.
export interface ExtraFixtures {}

export const test = generated.extend<ExtraFixtures>({});
