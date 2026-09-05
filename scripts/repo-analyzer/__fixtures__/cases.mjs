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
//   endpoints           paths the backend registry row's own routes() must return
//   tier / apiPaths     the api-docs tier letter and the endpoints it must report

export const CASES = [
  {
    app: 'vue-spa', frontend: 'vue', backend: null,
    routeStrategy: /vue-router config/,
    routes: ['/login', '/orders/{orderId}'],
    components: ['LoginForm'],
    props: {LoginForm: ['redirectTo', 'compact']},
    testIds: ['username', 'submit'],
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
    components: ['user-card.component'],
    props: {'user-card.component': ['name', 'role']},
    // Angular's compiler hands back class instances, not plain `{type: string}` nodes: this row is
    // what proves the template walker still reaches them.
    testIds: ['user-card', 'user-name'],
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
    // Ships a spec *and* has extractable express routes: Tier A must win and stop, so the
    // source-only endpoint below must not appear in the report.
    app: 'spec-app', frontend: 'unknown', backend: 'express',
    tier: 'A', apiPaths: ['/api/tickets', '/api/tickets/{ticketId}'],
    apiPathsAbsent: ['/api/only-in-source'],
  },
  {app: 'unknown-app', frontend: 'unknown', backend: null, routeStrategy: null, routes: []},
];
