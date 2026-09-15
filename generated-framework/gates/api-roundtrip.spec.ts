// Generated once from analysis.json (56e23b3b09) on 2026-09-15.
// This file is yours now. Nothing regenerates it.

// Round-trips every resource that can be created on its own: create it, read it
// back, delete it, then prove it is gone.
//
// THIS WRITES TO THE TARGET APPLICATION. It is excluded from the default test run
// and only appears as a project when API_GATE is set:
//
//   npm run gate:api
//
// 27 resource(s) covered, 11 skipped for unmet dependencies.
import { test, expect } from '../src/fixtures/test.ts';

test('Customer: create, read back, delete, confirm gone', async ({ api, given }) => {
  const { id } = await given.customer();
  expect(id, 'the create response carried no usable id').toBeTruthy();

  // If this throws, the id above is not the one this API addresses records by.
  const fetched = await api.customer.get({ id: id });
  expect(fetched, 'the record could not be read back after creation').toBeTruthy();

  // Strict: a delete that removes nothing must fail here rather than warn.
  await given.cleanup({ strict: true });

  // The step that catches a delete which answered happily and did nothing.
  await expect(async () => {
    await api.customer.get({ id: id });
  }, 'the record was still readable after being deleted').rejects.toThrow();
});

test('CustomField: create, read back, delete, confirm gone', async ({ api, given }) => {
  const { id } = await given.customField();
  expect(id, 'the create response carried no usable id').toBeTruthy();

  // If this throws, the id above is not the one this API addresses records by.
  const fetched = await api.customField.get({ id: id });
  expect(fetched, 'the record could not be read back after creation').toBeTruthy();

  // Strict: a delete that removes nothing must fail here rather than warn.
  await given.cleanup({ strict: true });

  // The step that catches a delete which answered happily and did nothing.
  await expect(async () => {
    await api.customField.get({ id: id });
  }, 'the record was still readable after being deleted').rejects.toThrow();
});

test('Defined: create, read back, delete, confirm gone', async ({ api, given }) => {
  const { id } = await given.defined();
  expect(id, 'the create response carried no usable id').toBeTruthy();

  // Strict: a delete that removes nothing must fail here rather than warn.
  await given.cleanup({ strict: true });

  // This API offers no way to read one record, so "gone" cannot be proven here.
  // The strict cleanup above is the whole of the evidence.
  test.info().annotations.push({ type: 'unverified-delete', description: 'Defined has no get to confirm removal' });
});

test('Education: create, read back, delete, confirm gone', async ({ api, given }) => {
  const { id } = await given.education();
  expect(id, 'the create response carried no usable id').toBeTruthy();

  // If this throws, the id above is not the one this API addresses records by.
  const fetched = await api.education.get({ id: id });
  expect(fetched, 'the record could not be read back after creation').toBeTruthy();

  // Strict: a delete that removes nothing must fail here rather than warn.
  await given.cleanup({ strict: true });

  // The step that catches a delete which answered happily and did nothing.
  await expect(async () => {
    await api.education.get({ id: id });
  }, 'the record was still readable after being deleted').rejects.toThrow();
});

test('Employee: create, read back, delete, confirm gone', async ({ api, given }) => {
  const { id } = await given.employee();
  expect(id, 'the create response carried no usable id').toBeTruthy();

  // If this throws, the id above is not the one this API addresses records by.
  const fetched = await api.employee.get({ empNumber: id });
  expect(fetched, 'the record could not be read back after creation').toBeTruthy();

  // Strict: a delete that removes nothing must fail here rather than warn.
  await given.cleanup({ strict: true });

  // The step that catches a delete which answered happily and did nothing.
  await expect(async () => {
    await api.employee.get({ empNumber: id });
  }, 'the record was still readable after being deleted').rejects.toThrow();
});

test('EmploymentStatus: create, read back, delete, confirm gone', async ({ api, given }) => {
  const { id } = await given.employmentStatus();
  expect(id, 'the create response carried no usable id').toBeTruthy();

  // If this throws, the id above is not the one this API addresses records by.
  const fetched = await api.employmentStatus.get({ id: id });
  expect(fetched, 'the record could not be read back after creation').toBeTruthy();

  // Strict: a delete that removes nothing must fail here rather than warn.
  await given.cleanup({ strict: true });

  // The step that catches a delete which answered happily and did nothing.
  await expect(async () => {
    await api.employmentStatus.get({ id: id });
  }, 'the record was still readable after being deleted').rejects.toThrow();
});

test('Event: create, read back, delete, confirm gone', async ({ api, given }) => {
  const { id } = await given.event();
  expect(id, 'the create response carried no usable id').toBeTruthy();

  // If this throws, the id above is not the one this API addresses records by.
  const fetched = await api.event.get({ id: id });
  expect(fetched, 'the record could not be read back after creation').toBeTruthy();

  // Strict: a delete that removes nothing must fail here rather than warn.
  await given.cleanup({ strict: true });

  // The step that catches a delete which answered happily and did nothing.
  await expect(async () => {
    await api.event.get({ id: id });
  }, 'the record was still readable after being deleted').rejects.toThrow();
});

test('Holiday: create, read back, delete, confirm gone', async ({ api, given }) => {
  const { id } = await given.holiday();
  expect(id, 'the create response carried no usable id').toBeTruthy();

  // If this throws, the id above is not the one this API addresses records by.
  const fetched = await api.holiday.get({ id: id });
  expect(fetched, 'the record could not be read back after creation').toBeTruthy();

  // Strict: a delete that removes nothing must fail here rather than warn.
  await given.cleanup({ strict: true });

  // The step that catches a delete which answered happily and did nothing.
  await expect(async () => {
    await api.holiday.get({ id: id });
  }, 'the record was still readable after being deleted').rejects.toThrow();
});

test('JobCategory: create, read back, delete, confirm gone', async ({ api, given }) => {
  const { id } = await given.jobCategory();
  expect(id, 'the create response carried no usable id').toBeTruthy();

  // If this throws, the id above is not the one this API addresses records by.
  const fetched = await api.jobCategory.get({ id: id });
  expect(fetched, 'the record could not be read back after creation').toBeTruthy();

  // Strict: a delete that removes nothing must fail here rather than warn.
  await given.cleanup({ strict: true });

  // The step that catches a delete which answered happily and did nothing.
  await expect(async () => {
    await api.jobCategory.get({ id: id });
  }, 'the record was still readable after being deleted').rejects.toThrow();
});

test('JobTitle: create, read back, delete, confirm gone', async ({ api, given }) => {
  const { id } = await given.jobTitle();
  expect(id, 'the create response carried no usable id').toBeTruthy();

  // If this throws, the id above is not the one this API addresses records by.
  const fetched = await api.jobTitle.get({ id: id });
  expect(fetched, 'the record could not be read back after creation').toBeTruthy();

  // Strict: a delete that removes nothing must fail here rather than warn.
  await given.cleanup({ strict: true });

  // The step that catches a delete which answered happily and did nothing.
  await expect(async () => {
    await api.jobTitle.get({ id: id });
  }, 'the record was still readable after being deleted').rejects.toThrow();
});

test('Language: create, read back, delete, confirm gone', async ({ api, given }) => {
  const { id } = await given.language();
  expect(id, 'the create response carried no usable id').toBeTruthy();

  // If this throws, the id above is not the one this API addresses records by.
  const fetched = await api.language.get({ id: id });
  expect(fetched, 'the record could not be read back after creation').toBeTruthy();

  // Strict: a delete that removes nothing must fail here rather than warn.
  await given.cleanup({ strict: true });

  // The step that catches a delete which answered happily and did nothing.
  await expect(async () => {
    await api.language.get({ id: id });
  }, 'the record was still readable after being deleted').rejects.toThrow();
});

test('LeaveType: create, read back, delete, confirm gone', async ({ api, given }) => {
  const { id } = await given.leaveType();
  expect(id, 'the create response carried no usable id').toBeTruthy();

  // If this throws, the id above is not the one this API addresses records by.
  const fetched = await api.leaveType.get({ leaveTypeId: id });
  expect(fetched, 'the record could not be read back after creation').toBeTruthy();

  // Strict: a delete that removes nothing must fail here rather than warn.
  await given.cleanup({ strict: true });

  // The step that catches a delete which answered happily and did nothing.
  await expect(async () => {
    await api.leaveType.get({ leaveTypeId: id });
  }, 'the record was still readable after being deleted').rejects.toThrow();
});

test('Licens: create, read back, delete, confirm gone', async ({ api, given }) => {
  const { id } = await given.licens();
  expect(id, 'the create response carried no usable id').toBeTruthy();

  // If this throws, the id above is not the one this API addresses records by.
  const fetched = await api.licens.get({ id: id });
  expect(fetched, 'the record could not be read back after creation').toBeTruthy();

  // Strict: a delete that removes nothing must fail here rather than warn.
  await given.cleanup({ strict: true });

  // The step that catches a delete which answered happily and did nothing.
  await expect(async () => {
    await api.licens.get({ id: id });
  }, 'the record was still readable after being deleted').rejects.toThrow();
});

test('Location: create, read back, delete, confirm gone', async ({ api, given }) => {
  const { id } = await given.location();
  expect(id, 'the create response carried no usable id').toBeTruthy();

  // If this throws, the id above is not the one this API addresses records by.
  const fetched = await api.location.get({ id: id });
  expect(fetched, 'the record could not be read back after creation').toBeTruthy();

  // Strict: a delete that removes nothing must fail here rather than warn.
  await given.cleanup({ strict: true });

  // The step that catches a delete which answered happily and did nothing.
  await expect(async () => {
    await api.location.get({ id: id });
  }, 'the record was still readable after being deleted').rejects.toThrow();
});

test('Membership: create, read back, delete, confirm gone', async ({ api, given }) => {
  const { id } = await given.membership();
  expect(id, 'the create response carried no usable id').toBeTruthy();

  // If this throws, the id above is not the one this API addresses records by.
  const fetched = await api.membership.get({ id: id });
  expect(fetched, 'the record could not be read back after creation').toBeTruthy();

  // Strict: a delete that removes nothing must fail here rather than warn.
  await given.cleanup({ strict: true });

  // The step that catches a delete which answered happily and did nothing.
  await expect(async () => {
    await api.membership.get({ id: id });
  }, 'the record was still readable after being deleted').rejects.toThrow();
});

test('Nationality: create, read back, delete, confirm gone', async ({ api, given }) => {
  const { id } = await given.nationality();
  expect(id, 'the create response carried no usable id').toBeTruthy();

  // If this throws, the id above is not the one this API addresses records by.
  const fetched = await api.nationality.get({ id: id });
  expect(fetched, 'the record could not be read back after creation').toBeTruthy();

  // Strict: a delete that removes nothing must fail here rather than warn.
  await given.cleanup({ strict: true });

  // The step that catches a delete which answered happily and did nothing.
  await expect(async () => {
    await api.nationality.get({ id: id });
  }, 'the record was still readable after being deleted').rejects.toThrow();
});

test('OauthClient: create, read back, delete, confirm gone', async ({ api, given }) => {
  const { id } = await given.oauthClient();
  expect(id, 'the create response carried no usable id').toBeTruthy();

  // If this throws, the id above is not the one this API addresses records by.
  const fetched = await api.oauthClient.get({ id: id });
  expect(fetched, 'the record could not be read back after creation').toBeTruthy();

  // Strict: a delete that removes nothing must fail here rather than warn.
  await given.cleanup({ strict: true });

  // The step that catches a delete which answered happily and did nothing.
  await expect(async () => {
    await api.oauthClient.get({ id: id });
  }, 'the record was still readable after being deleted').rejects.toThrow();
});

test('OpenidProvider: create, read back, delete, confirm gone', async ({ api, given }) => {
  const { id } = await given.openidProvider();
  expect(id, 'the create response carried no usable id').toBeTruthy();

  // If this throws, the id above is not the one this API addresses records by.
  const fetched = await api.openidProvider.get({ id: id });
  expect(fetched, 'the record could not be read back after creation').toBeTruthy();

  // Strict: a delete that removes nothing must fail here rather than warn.
  await given.cleanup({ strict: true });

  // The step that catches a delete which answered happily and did nothing.
  await expect(async () => {
    await api.openidProvider.get({ id: id });
  }, 'the record was still readable after being deleted').rejects.toThrow();
});

test('PayGrade: create, read back, delete, confirm gone', async ({ api, given }) => {
  const { id } = await given.payGrade();
  expect(id, 'the create response carried no usable id').toBeTruthy();

  // If this throws, the id above is not the one this API addresses records by.
  const fetched = await api.payGrade.get({ id: id });
  expect(fetched, 'the record could not be read back after creation').toBeTruthy();

  // Strict: a delete that removes nothing must fail here rather than warn.
  await given.cleanup({ strict: true });

  // The step that catches a delete which answered happily and did nothing.
  await expect(async () => {
    await api.payGrade.get({ id: id });
  }, 'the record was still readable after being deleted').rejects.toThrow();
});

test('Post: create, read back, delete, confirm gone', async ({ api, given }) => {
  const { id } = await given.post();
  expect(id, 'the create response carried no usable id').toBeTruthy();

  // If this throws, the id above is not the one this API addresses records by.
  const fetched = await api.post.get({ id: id });
  expect(fetched, 'the record could not be read back after creation').toBeTruthy();

  // This API declares no delete, so the record stays. Said out loud rather than
  // left as a quietly growing pile of test data.
  test.info().annotations.push({ type: 'no-cleanup', description: 'Post cannot be removed through the API' });
});

test('ReportingMethod: create, read back, delete, confirm gone', async ({ api, given }) => {
  const { id } = await given.reportingMethod();
  expect(id, 'the create response carried no usable id').toBeTruthy();

  // If this throws, the id above is not the one this API addresses records by.
  const fetched = await api.reportingMethod.get({ id: id });
  expect(fetched, 'the record could not be read back after creation').toBeTruthy();

  // Strict: a delete that removes nothing must fail here rather than warn.
  await given.cleanup({ strict: true });

  // The step that catches a delete which answered happily and did nothing.
  await expect(async () => {
    await api.reportingMethod.get({ id: id });
  }, 'the record was still readable after being deleted').rejects.toThrow();
});

test('Request: create, read back, delete, confirm gone', async ({ api, given }) => {
  const { id } = await given.request();
  expect(id, 'the create response carried no usable id').toBeTruthy();

  // If this throws, the id above is not the one this API addresses records by.
  const fetched = await api.request.get({ id: id });
  expect(fetched, 'the record could not be read back after creation').toBeTruthy();

  // This API declares no delete, so the record stays. Said out loud rather than
  // left as a quietly growing pile of test data.
  test.info().annotations.push({ type: 'no-cleanup', description: 'Request cannot be removed through the API' });
});

test('Skill: create, read back, delete, confirm gone', async ({ api, given }) => {
  const { id } = await given.skill();
  expect(id, 'the create response carried no usable id').toBeTruthy();

  // If this throws, the id above is not the one this API addresses records by.
  const fetched = await api.skill.get({ id: id });
  expect(fetched, 'the record could not be read back after creation').toBeTruthy();

  // Strict: a delete that removes nothing must fail here rather than warn.
  await given.cleanup({ strict: true });

  // The step that catches a delete which answered happily and did nothing.
  await expect(async () => {
    await api.skill.get({ id: id });
  }, 'the record was still readable after being deleted').rejects.toThrow();
});

test('Subunit: create, read back, delete, confirm gone', async ({ api, given }) => {
  const { id } = await given.subunit();
  expect(id, 'the create response carried no usable id').toBeTruthy();

  // If this throws, the id above is not the one this API addresses records by.
  const fetched = await api.subunit.get({ id: id });
  expect(fetched, 'the record could not be read back after creation').toBeTruthy();

  // Strict: a delete that removes nothing must fail here rather than warn.
  await given.cleanup({ strict: true });

  // The step that catches a delete which answered happily and did nothing.
  await expect(async () => {
    await api.subunit.get({ id: id });
  }, 'the record was still readable after being deleted').rejects.toThrow();
});

test('TerminationReason: create, read back, delete, confirm gone', async ({ api, given }) => {
  const { id } = await given.terminationReason();
  expect(id, 'the create response carried no usable id').toBeTruthy();

  // If this throws, the id above is not the one this API addresses records by.
  const fetched = await api.terminationReason.get({ id: id });
  expect(fetched, 'the record could not be read back after creation').toBeTruthy();

  // Strict: a delete that removes nothing must fail here rather than warn.
  await given.cleanup({ strict: true });

  // The step that catches a delete which answered happily and did nothing.
  await expect(async () => {
    await api.terminationReason.get({ id: id });
  }, 'the record was still readable after being deleted').rejects.toThrow();
});

test('Type: create, read back, delete, confirm gone', async ({ api, given }) => {
  const { id } = await given.type();
  expect(id, 'the create response carried no usable id').toBeTruthy();

  // If this throws, the id above is not the one this API addresses records by.
  const fetched = await api.type.get({ id: id });
  expect(fetched, 'the record could not be read back after creation').toBeTruthy();

  // Strict: a delete that removes nothing must fail here rather than warn.
  await given.cleanup({ strict: true });

  // The step that catches a delete which answered happily and did nothing.
  await expect(async () => {
    await api.type.get({ id: id });
  }, 'the record was still readable after being deleted').rejects.toThrow();
});

test('UserSync: create, read back, delete, confirm gone', async ({ api, given }) => {
  const { id } = await given.userSync();
  expect(id, 'the create response carried no usable id').toBeTruthy();

  // This API declares no delete, so the record stays. Said out loud rather than
  // left as a quietly growing pile of test data.
  test.info().annotations.push({ type: 'no-cleanup', description: 'UserSync cannot be removed through the API' });
});

test.skip('Candidate: needs an existing Vacancy', () => {
  // Creating one of these needs another record first, and which field carries
  // that id is not recorded anywhere — only guessable from its name. Guessing is
  // what this gate exists to catch, so it does not guess.
});

test.skip('Kpis: needs an existing JobTitle', () => {
  // Creating one of these needs another record first, and which field carries
  // that id is not recorded anywhere — only guessable from its name. Guessing is
  // what this gate exists to catch, so it does not guess.
});

test.skip('LeaveEntitlement: needs an existing Employee and LeaveType and Location', () => {
  // Creating one of these needs another record first, and which field carries
  // that id is not recorded anywhere — only guessable from its name. Guessing is
  // what this gate exists to catch, so it does not guess.
});

test.skip('LeaveRequest: needs an existing Employee and LeaveType', () => {
  // Creating one of these needs another record first, and which field carries
  // that id is not recorded anywhere — only guessable from its name. Guessing is
  // what this gate exists to catch, so it does not guess.
});

test.skip('Project: needs an existing Customer', () => {
  // Creating one of these needs another record first, and which field carries
  // that id is not recorded anywhere — only guessable from its name. Guessing is
  // what this gate exists to catch, so it does not guess.
});

test.skip('Registration: needs an existing Subunit', () => {
  // Creating one of these needs another record first, and which field carries
  // that id is not recorded anywhere — only guessable from its name. Guessing is
  // what this gate exists to catch, so it does not guess.
});

test.skip('Review: needs an existing Employee', () => {
  // Creating one of these needs another record first, and which field carries
  // that id is not recorded anywhere — only guessable from its name. Guessing is
  // what this gate exists to catch, so it does not guess.
});

test.skip('Tracker: needs an existing Employee', () => {
  // Creating one of these needs another record first, and which field carries
  // that id is not recorded anywhere — only guessable from its name. Guessing is
  // what this gate exists to catch, so it does not guess.
});

test.skip('User: needs an existing Employee', () => {
  // Creating one of these needs another record first, and which field carries
  // that id is not recorded anywhere — only guessable from its name. Guessing is
  // what this gate exists to catch, so it does not guess.
});

test.skip('Vacancy: needs an existing Employee and JobTitle', () => {
  // Creating one of these needs another record first, and which field carries
  // that id is not recorded anywhere — only guessable from its name. Guessing is
  // what this gate exists to catch, so it does not guess.
});

test.skip('WorkShift: needs an existing Employee', () => {
  // Creating one of these needs another record first, and which field carries
  // that id is not recorded anywhere — only guessable from its name. Guessing is
  // what this gate exists to catch, so it does not guess.
});
