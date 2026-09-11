// The fixture case table: one row per app under `__fixtures__/`, each pinning a registry row.
//
// Every row asserts at least one *positive* hit — a route, a component, a test-id, an endpoint.
// A parser that silently finds nothing is indistinguishable from an app with nothing to find, so
// an empty expectation would let a broken registry row pass. Rails has no fixture yet; its
// extractor is unproven, and that is a known gap rather than a covered one.
//
// Fields, all optional except `app`/`frontend`:
//   frontend, backend   expected detect() ids (`backend: null` means none matched)
//   frontendRoot        expected frontend root, relative to the app — pins the monorepo tie-break
//   routeStrategy       RegExp the collectRoutes() strategy string must match; `null` means none
//   routes              route paths that must be present
//   routesAbsent        route paths that must *not* be present — for a path only a broken
//                       traversal could reach, e.g. one lap further around an import cycle
//   labelDictionary     route path -> element names buildLabelDictionary() must carry for it. This
//                       is the join between the route half and the element half, so a route whose
//                       component resolved to a class name rather than a file empties it silently
//   components/props    component names and the props their parser must expose
//   testIds             test-id values that must be found in the markup
//   testIdCounts        value -> exact hit count, for pinning that a value is found *once* —
//                       e.g. a structural-directive-guarded element must not be double-counted
//   elements            extracted elements, each `{name, component, rung, locator?}` — pins the
//                       locator ladder per rung, so a regression that quietly drops every
//                       element to CSS fails here rather than in a generated framework
//   endpoints           paths the backend registry row's own routes() must return
//   endpointsAbsent     paths that must *not* appear in that same raw routes() output — for a
//                       mapping only a silent parser regression could produce, e.g. a
//                       commented-out annotation read as live, or an unresolvable class-level
//                       base composed onto its methods instead of dropping the class
//   endpointKinds       path -> the `kind` ('api' | 'page') that same raw route must carry —
//                       pins the return-type classification directly, independent of whatever
//                       tierB does with it
//   endpointMethods     path -> the HTTP verbs that same raw route must carry — pins a verb read
//                       from a `method =` attribute rather than defaulted to ANY
//   tier / apiPaths     the api-docs tier letter and the endpoints it must report

import type {ExtractedElement, LocatorRecord} from '../types.js';

interface FixtureCase {
  app: string;
  frontend: string;
  backend: string | null;
  frontendRoot?: string;
  routeStrategy?: RegExp | null;
  routes?: string[];
  routesAbsent?: string[];
  labelDictionary?: Record<string, string[]>;
  components?: string[];
  props?: Record<string, string[]>;
  testIds?: string[];
  testIdCounts?: Record<string, number>;
  elements?: (Pick<ExtractedElement, 'name' | 'component' | 'rung'> & {locator?: Partial<LocatorRecord>})[];
  endpoints?: string[];
  endpointsAbsent?: string[];
  endpointKinds?: Record<string, 'api' | 'page'>;
  endpointMethods?: Record<string, string[]>;
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
    // The two halves of the Angular route reader, each pinned by a path only that half can reach.
    // Constants: `/orders` is `AppRoutes.ORDERS`, `/orders/add` delegates through `Global.ADD`, and
    // `/orders/history` is a template literal composed from a sibling field. Lazy children:
    // everything under `/orders` comes from a `loadChildren` file, and `/legacy/cast` from a module
    // that only re-exports a sibling's array to `forChild`. `AppRoutes.RUNTIME_PATH` is computed,
    // so its route is absent from this list rather than present with a guessed path.
    routes: ['/', '/users/{userId}', '/orders', '/orders/add', '/orders/view/{orderId}', '/orders/history', '/orders/nested', '/legacy/cast', '/computed'],
    // The headline safety property, asserted rather than described. `AppRoutes.RUNTIME_PATH` is
    // computed, and each of these is a path that appears only if the refusal breaks in a specific
    // way: `/runtime/path` if the resolver starts evaluating expressions, `/computed/leaf` if it
    // degrades a refusal to '', `/computed/runtime/path/leaf` if it evaluates the join(), and
    // `/leaf` if a refused path stops taking its subtree with it. Plus one lap too many around
    // `order.routes.ts`'s self-import, which is what an unguarded cycle produces.
    routesAbsent: [
      '/orders/nested/nested',
      '/runtime/path',
      '/computed/leaf',
      '/computed/runtime/path/leaf',
      '/leaf',
    ],
    // A lazily-loaded child declaring `path: ''` names the same URL as the parent that loaded it,
    // and the child is the row that knows what renders there. Renders is asserted as the component
    // *file*, not the class name the route declares: that is what `buildLabelDictionary` joins on,
    // so a regression in the class index shows up here rather than as an empty dictionary.
    // `/legacy/cast` also pins that the index parses without the `jsx` plugin — its component
    // casts with `<HTMLInputElement>`, which `jsx` cannot read.
    renders: {
      '/orders': 'src/app/order-history.component.ts',
      '/orders/add': 'src/app/order-form.component.ts',
      '/legacy/cast': 'src/app/legacy-cast.component.ts',
    },
    // The span itself, end to end: a route path reaching the elements of the component it renders.
    // Both branches are covered — order-form declares its markup inline, order-history through
    // `templateUrl:` — and either half of the bridge breaking empties this.
    labelDictionary: {
      '/orders/add': ['orderIdInput', 'submitOrderButton', 'orderNameInput'],
      '/orders': ['urgentFlagInput'],
    },
    components: ['user-card.component', 'legacy-cast.component', 'order-form.component', 'order-history.component'],
    props: {'user-card.component': ['name', 'role'], 'legacy-cast.component': ['label']},
    // Angular's compiler hands back class instances, not plain `{type: string}` nodes: this row is
    // what proves the template walker still reaches them. `legacy-cast.component` pins the `jsx`
    // plugin regression — its `<HTMLInputElement>` cast must parse rather than error.
    testIds: ['user-card', 'user-name', 'legacy-cast', 'order-id', 'urgent-flag'],
    // `*ngIf` desugars to a `Template` host that duplicates its static attributes onto both
    // itself and the element it wraps, so `urgent-flag` must be read once, not twice
    // (`parseAngular`'s testIds dedupe in parsers.ts).
    testIdCounts: {'urgent-flag': 1},
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
    // The Java AST reader, one method per defect the old regex extractor got wrong: bare
    // @GetMapping, `path =`, `value =` beside `method =`, the array form, and a regex-constrained
    // `{id:[0-9]+}` path variable — every one of them composed onto the class-level
    // @RequestMapping base, which only a real parser can do. `server.servlet.context-path=/api`
    // in application.properties prefixes all of them again.
    app: 'spring-api', frontend: 'unknown', backend: 'spring',
    // `/api/home` is a page route under the same context-path prefix as every API route here;
    // `serverRoutes`'s filter must let a `kind: 'page'` route through despite the prefix match,
    // symmetrically with the Tier B override just below, or it lands in neither report.
    routes: ['/api/home'],
    endpoints: [
      '/api/v2/employees',            // bare @GetMapping: class base alone
      '/api/v2/employees/legacy',     // `path =` keyword form
      '/api/v2/employees/bulk',       // `value =` beside `method =` (verb read, not defaulted to ANY)
      '/api/v2/employees/active',     // array form, first element
      '/api/v2/employees/inactive',   // array form, second element
      '/api/v2/employees/{id:[0-9]+}', // a regex-constrained path variable survives intact
      '/api/home',                    // PageController: a genuine view-returning method
    ],
    // A commented-out annotation and an unresolvable class-level base are the two cases only a
    // real parser gets right: java-parser drops comments from the CST entirely, and a base built
    // from `IDENTIFIER + "literal"` cannot be resolved without the classpath, so the whole class
    // is dropped rather than emitting `/never` without its (unknown) prefix.
    // `/api/legacy/never` catches a regression that harvests the literal out of
    // `BASE_PATH + "/legacy"`; `/api/never` catches the different regression where
    // `mappingPaths` returns `[]` instead of `null`, dropping the base rather than the whole class.
    endpointsAbsent: ['/api/v2/employees/commented-out', '/api/legacy/never', '/api/never'],
    // The return-type chain in both directions: @RestController forces `api` regardless of
    // return type, and a bare @Controller method returning String with no @ResponseBody is a
    // page — the one distinction a typo in `springKind` would erase.
    endpointKinds: {'/api/v2/employees': 'api', '/api/home': 'page'},
    // `method =` before `value =` in bulkCreate's annotation: the verb read must not default to
    // ANY just because the value attribute is not the first one written.
    endpointMethods: {'/api/v2/employees/bulk': ['POST']},
    tier: 'B',
    // `/api/home` is a page route: its path starts with the app's context-path like every other
    // route here, but `kind: 'page'` overrides that prefix match, so it must not reach Tier B.
    apiPaths: [
      '/api/v2/employees', '/api/v2/employees/legacy', '/api/v2/employees/bulk',
      '/api/v2/employees/active', '/api/v2/employees/inactive', '/api/v2/employees/{id:[0-9]+}',
    ],
    apiPathsAbsent: ['/api/home'],
  },
  {
    // Both hash-router shapes at once: the `routeList` array and the classic `routes` hash. The
    // fragment is part of the path, the splat is not a screen, and an optional group resolves to
    // the URL without it — the three decisions a regression here would quietly reverse.
    app: 'backbone-handlebars', frontend: 'backbone', backend: 'json-routes',
    routeStrategy: /hash router/,
    routes: ['/#clearCache', '/#{controller}', '/#{controller}/view/{id}', '/#admin/settings', '/#admin/jobs'],
    routesAbsent: ['/#{actions}', '/#admin/jobs/{status}'],
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
