import { test } from 'node:test';
import assert from 'node:assert/strict';
import { singular, parsePath, referencedEntity, resolveReference, deriveResources, tagEndpoints, article } from '../api-resources.ts';

test('singular preserves case, or nothing matches a camelCase reference', () => {
  assert.equal(singular('leaveTypes'), 'leaveType');
  assert.equal(singular('employees'), 'employee');
  assert.equal(singular('statuses'), 'status');
  assert.equal(singular('boxes'), 'box');
  assert.equal(singular('categories'), 'category');
  assert.equal(singular('people'), 'person');
  assert.equal(singular('status'), 'status');
});

test('a path is split into its collection and whether it targets one record', () => {
  assert.deepEqual(parsePath('/api/v2/pim/employees'),
    { entity: 'employees', collectionPath: '/api/v2/pim/employees', targetsOne: false, trailing: [] });
  const one = parsePath('/api/v2/pim/employees/{empNumber}');
  assert.equal(one.targetsOne, true);
  assert.equal(one.collectionPath, '/api/v2/pim/employees');
  // A segment after the id belongs to the record, so this is Employee, not Picture.
  const sub = parsePath('/api/v2/pim/employees/{n}/picture');
  assert.equal(sub.entity, 'employees');
  assert.deepEqual(sub.trailing, ['picture']);
  // A version or mount segment names no resource at all.
  assert.equal(parsePath('/api/v1/{entityType}').entity, null);
});

test('a field naming another resource is recognised', () => {
  assert.equal(referencedEntity('leaveTypeId'), 'LeaveType');
  assert.equal(referencedEntity('empNumber'), 'Emp');
  assert.equal(referencedEntity('firstName'), null);
});

test('a reference resolves to the shortest resource it prefixes, or nothing', () => {
  const names = ['Employee', 'EmployeeOnLeaveToday', 'LeaveType'];
  assert.equal(resolveReference('Emp', names), 'Employee');
  assert.equal(resolveReference('LeaveType', names), 'LeaveType');
  assert.equal(resolveReference('Xy', names), null);
  assert.equal(resolveReference('Nothing', names), null);
});

// The chain from the brief: entitlement and request both need an employee and a type.
const LEAVE = [
  { method: 'GET', path: '/api/v2/pim/employees' },
  { method: 'POST', path: '/api/v2/pim/employees', request: { firstName: 'string', lastName: 'string', __required: ['firstName', 'lastName'] } },
  { method: 'DELETE', path: '/api/v2/pim/employees/{empNumber}' },
  { method: 'GET', path: '/api/v2/leave/leave-types' },
  { method: 'POST', path: '/api/v2/leave/leave-types', request: { name: 'string' } },
  { method: 'POST', path: '/api/v2/leave/leave-entitlements', request: { empNumber: 'int', leaveTypeId: 'int', entitlement: 'number' } },
  { method: 'DELETE', path: '/api/v2/leave/leave-entitlements/{id}' },
  { method: 'POST', path: '/api/v2/leave/employees/leave-requests', request: { empNumber: 'int', leaveTypeId: 'int', fromDate: 'string' } },
  { method: 'PUT', path: '/api/v2/leave/employees/leave-requests/{id}', summary: 'Approve or reject' },
];

test('a create establishes its resource, and a delete is its cleanup', () => {
  const r = deriveResources(LEAVE);
  assert.equal(r.Employee.establishes, 'an Employee exists');
  assert.equal(r.Employee.cleanup, 'delete');
  assert.equal(r.LeaveType.cleanup, 'none');
});

test('a create payload naming another resource becomes a dependency', () => {
  const r = deriveResources(LEAVE);
  assert.deepEqual(r.LeaveEntitlement.requires, ['Employee', 'LeaveType']);
  assert.deepEqual(r.LeaveRequest.requires, ['Employee', 'LeaveType']);
  assert.deepEqual(r.Employee.requires, []);
});

test('required fields are distinguished from merely declared ones', () => {
  const r = deriveResources(LEAVE);
  assert.equal(r.Employee.ops.create!.requiredKnown, true);
  assert.deepEqual(r.Employee.ops.create!.requiredFields, ['firstName', 'lastName']);
  // OrangeHRM's annotations declare fields without saying which are mandatory.
  assert.equal(r.LeaveEntitlement.ops.create!.requiredKnown, false);
  assert.deepEqual(r.LeaveEntitlement.ops.create!.optionalFields, ['empNumber', 'leaveTypeId', 'entitlement']);
});

test('a verb after the id is an action, not CRUD', () => {
  const r = deriveResources([
    { method: 'GET', path: '/api/bookings' },
    { method: 'POST', path: '/api/bookings/{id}/cancel', summary: 'Cancel a booking' },
  ]);
  assert.equal(r.Booking.ops.actions!.length, 1);
  assert.equal(r.Booking.ops.actions![0].kind, 'action');
});

test('each endpoint is tagged with what it establishes; reads establish nothing', () => {
  const tagged = tagEndpoints(LEAVE, deriveResources(LEAVE));
  const byPath = (m: string, p: string) => tagged.find(t => t.method === m && t.path === p)!;
  assert.equal(byPath('POST', '/api/v2/pim/employees').precondition, 'establishes: an Employee exists');
  assert.equal(byPath('DELETE', '/api/v2/pim/employees/{empNumber}').precondition, 'cleanup: removes an Employee');
  assert.equal(byPath('GET', '/api/v2/pim/employees').precondition, null);
  assert.deepEqual(byPath('POST', '/api/v2/leave/leave-entitlements').requires, ['Employee', 'LeaveType']);
});

test('a path whose entity is a parameter names no resource', () => {
  // EspoCRM's whole API is "/api/v1/{entityType}" — generic, and not a resource.
  assert.deepEqual(deriveResources([{ method: 'POST', path: '/api/v1/{entityType}' }]), {});
});

test('a POST you cannot read back is an action, not established state', () => {
  const r = deriveResources([
    { method: 'POST', path: '/api/users/login', summary: 'Log in' },
    { method: 'GET', path: '/api/articles' },
    { method: 'POST', path: '/api/articles' },
  ]);
  assert.equal(r.Login.establishes, null);
  assert.equal(r.Article.establishes, 'an Article exists');
});

test('the article agrees with the noun', () => {
  const r = deriveResources([
    { method: 'GET', path: '/api/employees' }, { method: 'POST', path: '/api/employees' },
  ]);
  assert.equal(r.Employee.establishes, 'an Employee exists');
});

test('the article follows sound, not spelling', () => {
  assert.equal(article('User'), 'a');
  assert.equal(article('Article'), 'an');
  assert.equal(article('Employee'), 'an');
  assert.equal(article('Booking'), 'a');
});

// Names the generator has to survive. Both of these shipped broken code once.
test('two actions differing only by a trailing id are different operations', () => {
  const r = deriveResources([
    { method: 'GET', path: '/api/candidates' },
    { method: 'GET', path: '/api/candidates/{id}/history' },
    { method: 'GET', path: '/api/candidates/{id}/history/{historyId}' },
  ]);
  const paths = r.Candidate.ops.actions!.map((a) => a.path);
  assert.equal(paths.length, 2);
  assert.notEqual(paths[0], paths[1]);
});

test('a resource may be called Client without colliding with the API client', () => {
  const r = deriveResources([
    { method: 'GET', path: '/api/clients' },
    { method: 'POST', path: '/api/clients' },
  ]);
  assert.equal(r.Client.establishes, 'a Client exists');
});
