// The fixture case table: one row per app under `__fixtures__/`, each pinning a registry row.
//
// Every row asserts at least one *positive* hit — a route, a component, a test-id, an endpoint.
// A parser that silently finds nothing is indistinguishable from an app with nothing to find, so
// an empty expectation would let a broken registry row pass. Rails and Spring have no fixture yet;
// their extractors are unproven, and that is a known gap rather than a covered one.
//
// Fields, all optional except `app`/`frontend`:
//   frontend, backend   expected detect() ids (`backend: null` means none matched)
//   frontendRoot        expected frontend root, relative to the app — pins the monorepo tie-break
//   routeStrategy       RegExp the collectRoutes() strategy string must match; `null` means none
//   routes              route paths that must be present
//   components/props    component names and the props their parser must expose
//   testIds             test-id values that must be found in the markup
//   elements            extracted elements, each `{name, component, rung, locator?}` — pins the
//                       locator ladder per rung, so a regression that quietly drops every
//                       element to CSS fails here rather than in a generated framework
//   endpoints           paths the backend registry row's own routes() must return
//   tier / apiPaths     the api-docs tier letter and the endpoints it must report

import type {ExtractedElement, LocatorRecord} from '../types.js';

interface FixtureCase {
  app: string;
  frontend: string;
  backend: string | null;
  frontendRoot?: string;
  routeStrategy?: RegExp | null;
  routes?: string[];
  components?: string[];
  props?: Record<string, string[]>;
  testIds?: string[];
  elements?: (Pick<ExtractedElement, 'name' | 'component' | 'rung'> & {locator?: Partial<LocatorRecord>})[];
  endpoints?: string[];
  tier?: 'A' | 'B';
  apiPaths?: string[];
  apiPathsAbsent?: string[];
  renders?: Record<string, string>;
}

export const CASES: FixtureCase[] = [
  {
    app: 'vue-spa', frontend: 'vue', backend: null,
    routeStrategy: /vue-router config/,
    routes: ['/login', '/orders/{orderId}'],
    components: ['LoginForm'],
    props: {LoginForm: ['redirectTo', 'compact']},
    testIds: ['username', 'submit', 'order-id'],
    // One element per rung the extractor can reach, so a change to the ladder shows up as a
    // rung moving rather than as a silently different selector.
    elements: [
      {name: 'orderIdInput', component: 'input', rung: 1, locator: {strategy: 'getByTestId', args: ['order-id']}},
      {name: 'placeOrderButton', component: 'button', rung: 2, locator: {strategy: 'getByRole', args: ['button'], name: 'Place Order'}},
      {name: 'orderNameInput', component: 'input', rung: 4, locator: {strategy: 'template', args: ['labelledInput'], name: 'Order Name'}},
      {name: 'notesLongInput', component: 'longInput', rung: 4, locator: {strategy: 'template', args: ['labelledTextarea'], name: 'Notes'}},
      {name: 'quantityTable', component: 'table', rung: 4, locator: {strategy: 'template', args: ['tableByColumn'], name: 'Quantity'}},
      {name: 'searchOrdersInput', component: 'input', rung: 5, locator: {strategy: 'getByPlaceholder', args: ['Search orders']}},
      {name: 'quantityInput', component: 'input', rung: 6, locator: {strategy: 'css', args: ['[name="quantity"]']}},
    ],
  },
  {
    app: 'react-router', frontend: 'react', backend: null,
    routeStrategy: /react-router config/,
    routes: ['/', '/users/{userId}'],
    components: ['UserCard', 'routes'],
    props: {UserCard: ['name', 'role', '...rest']},
    testIds: ['user-card', 'user-name'],
  },
  {
    app: 'next-app', frontend: 'next', backend: null,
    routeStrategy: /file-based router/,
    routes: ['/', '/blog/{slug}'],
    components: ['page'],
    testIds: ['home'],
  },
  {
    app: 'sveltekit', frontend: 'sveltekit', backend: null,
    routeStrategy: /file-based router/,
    routes: ['/', '/items/{id}'],
    props: {'+page': ['title']},
    testIds: ['page-title', 'item'],
  },
  {
    app: 'angular-app', frontend: 'angular', backend: null,
    routeStrategy: /@angular\/router config/,
    routes: ['/', '/users/{userId}'],
    components: ['user-card.component', 'legacy-cast.component', 'order-form.component', 'order-history.component'],
    props: {'user-card.component': ['name', 'role'], 'legacy-cast.component': ['label']},
    // Angular's compiler hands back class instances, not plain `{type: string}` nodes: this row is
    // what proves the template walker still reaches them. `legacy-cast.component` pins the `jsx`
    // plugin regression — its `<HTMLInputElement>` cast must parse rather than error.
    testIds: ['user-card', 'user-name', 'legacy-cast', 'order-id', 'urgent-flag'],
    // One element per rung the Angular extractor can reach, split across the two ways a component
    // names its template: `order-form.component.ts` declares its markup inline; `urgentFlagInput`
    // comes from `order-history.component.html` through `templateUrl:` — 1601 of the app-under-test's
    // 1657 components use that branch, and it carried no element coverage before this row. The same
    // control also proves a `*ngIf` host (a `Template` node) is walked rather than counted itself.
    elements: [
      {name: 'orderIdInput', component: 'input', rung: 1, locator: {strategy: 'getByTestId', args: ['order-id']}},
      {name: 'submitOrderButton', component: 'button', rung: 2, locator: {strategy: 'getByRole', args: ['button'], name: 'Submit Order'}},
      {name: 'notesLongInput', component: 'longInput', rung: 3, locator: {strategy: 'getByLabel', args: ['Notes']}},
      {name: 'orderNameInput', component: 'input', rung: 4, locator: {strategy: 'template', args: ['labelledInput'], name: 'Order Name'}},
      {name: 'searchOrdersInput', component: 'input', rung: 5, locator: {strategy: 'getByPlaceholder', args: ['Search orders']}},
      {name: 'quantityInput', component: 'input', rung: 6, locator: {strategy: 'css', args: ['[name="quantity"]']}},
      {name: 'urgentFlagInput', component: 'input', rung: 1, locator: {strategy: 'getByTestId', args: ['urgent-flag']}},
    ],
  },
  {
    app: 'svelte-app', frontend: 'svelte', backend: null,
    routeStrategy: null, routes: [],
    components: ['Counter'],
    props: {Counter: ['label', 'count']},
    testIds: ['counter-increment', 'counter-label'],
  },
  {
    // A server-routed app: the page component is named by a PHP controller, not by any client
    // router. This is the OrangeHRM shape reduced to five files.
    app: 'symfony-app', frontend: 'vue', backend: 'symfony',
    frontendRoot: 'src/client',
    routeStrategy: /Symfony server routing/,
    routes: ['/thing/viewThingList', '/thing/viewThing/id/{id}'],
    components: ['ThingList'],
    props: {ThingList: ['title', 'rows']},
    testIds: ['thing-list-title'],
    endpoints: ['/api/v2/things'],
    tier: 'B', apiPaths: ['/api/v2/things'],
    // The bridge itself: routes.yaml -> ThingController -> new Component('thing-list') -> the .vue file.
    renders: {'/thing/viewThingList': 'src/client/src/thing/pages/ThingList.vue'},
  },
  {
    app: 'monorepo-app', frontend: 'vue', backend: null,
    // Both roots match Vue and the installer deliberately holds *more* files than the product,
    // so only the auxiliary-segment penalty can pick the right one. Sizing it the other way would
    // let the penalty be deleted without a test noticing.
    frontendRoot: 'src/client',
    components: ['Alpha', 'Zeta'],
    testIds: ['Alpha-root'],
  },
  {app: 'nest-api', frontend: 'unknown', backend: 'nest', endpoints: ['/api/users/:id', '/api/users'], tier: 'B'},
  {app: 'express-api', frontend: 'unknown', backend: 'express', endpoints: ['/api/widgets', '/api/widgets/:widgetId'], tier: 'B'},
  {app: 'django-api', frontend: 'unknown', backend: 'django', endpoints: ['/api/orders/', '/api/orders/<int:order_id>/'], tier: 'B'},
  {app: 'flask-api', frontend: 'unknown', backend: 'fastapi', endpoints: ['/api/health', '/api/items'], tier: 'B'},
  {app: 'laravel-app', frontend: 'unknown', backend: 'laravel', endpoints: ['/api/invoices', '/api/invoices/{invoice}'], tier: 'B'},
  {
    app: 'backbone-handlebars', frontend: 'backbone', backend: 'json-routes',
    components: ['detail'],
    testIds: ['contact-detail'],
    elements: [
      {name: 'nameInput', component: 'input', rung: 4, locator: {strategy: 'template', args: ['labelledInput'], name: 'Name'}},
      {name: 'saveButton', component: 'button', rung: 2, locator: {strategy: 'getByRole', args: ['button'], name: 'Save'}},
    ],
    endpoints: ['/Contact/:id', '/Contact'],
    tier: 'B', apiPaths: ['/Contact/:id', '/Contact'],
  },
  {
    // Ships a spec *and* has extractable express routes: Tier A must win and stop, so the
    // source-only endpoint below must not appear in the report.
    app: 'spec-app', frontend: 'unknown', backend: 'express',
    tier: 'A', apiPaths: ['/api/tickets', '/api/tickets/{ticketId}'],
    apiPathsAbsent: ['/api/only-in-source'],
  },
  {app: 'unknown-app', frontend: 'unknown', backend: null, routeStrategy: null, routes: []},
];
