import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderResource, renderApi, resourceProperties } from '../emit/api.ts';
import type { AppModel } from '../../model-compiler/model-types.ts';
import { fixtureModel } from './fixtures/model.ts';
import { emit } from '../emit/emit.ts';

function withResources(): AppModel {
  const model = fixtureModel();
  model.api.resources = {
    Employee: {
      establishes: 'an employee exists', requires: [],
      ops: {
        list: { path: '/api/v2/pim/employees', summary: 'List employees' },
        create: { path: '/api/v2/pim/employees', requiredFields: ['firstName'], optionalFields: [], requiredKnown: true },
        delete: { path: '/api/v2/pim/employees/{empNumber}' },
        actions: [],
      },
    },
    // A resource genuinely called Client would shadow the raw HTTP client.
    Client: { establishes: null, requires: [], ops: { list: { path: '/api/v2/clients' }, actions: [] } },
  };
  return model;
}

test('each resource is its own class in its own file', () => {
  const model = withResources();
  const employee = renderResource('Employee', (model.api.resources as any).Employee, model);
  assert.match(employee, /export class EmployeeApi/);
  assert.ok(!employee.includes('ClientApi'), 'a resource file holds one resource');
  assert.match(employee, /async create<T = any>/);
  assert.match(employee, /async remove\(/);
});

test('the Api aggregate imports every resource file and exposes each once', () => {
  const model = withResources();
  const api = renderApi(model);
  assert.match(api, /import \{ EmployeeApi \} from '\.\/EmployeeApi\.ts'/);
  assert.match(api, /import \{ ClientApi \} from '\.\/ClientApi\.ts'/);
  assert.match(api, /readonly employee: EmployeeApi/);
});

test('a resource named Client cannot shadow the raw http client', () => {
  const props = resourceProperties(withResources());
  assert.notEqual(props.get('Client'), 'http');
  assert.equal(new Set(props.values()).size, props.size, 'no two resources share a property');
});

test('a resource-bearing model emits one un-suffixed file per resource', () => {
  const model = withResources();
  const writer = emit(model, null, '/tmp/does-not-matter', { dryRun: true });
  const paths = writer.planned.map(p => p.path);
  assert.ok(paths.includes('src/api/EmployeeApi.ts'));
  assert.ok(paths.includes('src/api/ClientApi.ts'));
  assert.ok(paths.includes('src/api/Api.ts'));
  assert.ok(paths.includes('src/api/Preconditions.ts'));
  assert.deepEqual(paths.filter(p => p.includes('.generated.')), []);
});
