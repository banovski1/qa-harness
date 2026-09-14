import type { AppModel } from '../../../model-compiler/model-types.ts';

/**
 * Three screens chosen to be the three cases a reviewer must be able to tell apart:
 * one crawled and strong, one crawled and weak, one never reached at all.
 */
export function fixtureModel(): AppModel {
  return {
    app: {
      name: 'demoapp', baseUrl: 'https://demo.test', repoPath: '/tmp/demo',
      repoCommit: 'abcdef1234567890', stack: 'Vue 3 + Symfony',
      generatedAt: '2026-09-14T00:00:00.000Z',
    },
    components: {
      NavigationBar: {
        kind: 'region', seenOn: 3, description: 'The primary menu',
        root: { strategy: 'css', args: ['.oxd-topbar'] },
        controls: { admin: { strategy: 'role', args: ['link', 'Admin'] } },
      },
      TextField: { kind: 'field', seenOn: 3, description: 'A text input' },
      RecordTable: {
        kind: 'collection', seenOn: 2, description: 'The app table',
        root: { strategy: 'css', args: ['.oxd-table'] },
        table: { row: 'tbody tr', cell: 'td', headerCell: 'thead th' },
      },
    },
    screens: [
      {
        name: 'LoginPage', path: '/auth/login', url: 'https://demo.test/auth/login',
        title: 'Login', aliases: [],
        identity: { urlPattern: '^/auth/login$', heading: 'Login' },
        source: { component: 'Login.vue', route: '/auth/login' },
        crawled: true, unverified: 0,
        uses: [
          { component: 'TextField', as: 'username', label: 'Username', via: 'proximity' },
          { component: 'TextField', as: 'password', label: 'Password', via: 'proximity' },
        ],
        actions: [{ name: 'login', via: 'submit', leadsTo: 'DashboardPage' }],
        testability: {
          confidence: 0.9, addressable: 2, unaddressable: 0, hasTable: false,
          crawled: true, recorded: false, missing: [],
        },
      },
      {
        name: 'DashboardPage', path: '/dashboard', url: 'https://demo.test/dashboard',
        title: 'Dashboard', aliases: [],
        identity: { urlPattern: '^/dashboard$', heading: 'Dashboard' },
        source: { component: null, route: '/dashboard' },
        crawled: true, unverified: 4,
        uses: [{ component: 'NavigationBar', as: 'navigationBar' }],
        actions: [],
        testability: {
          confidence: 0.5, addressable: 1, unaddressable: 4, hasTable: false,
          crawled: true, recorded: false,
          missing: ['4 controls carry no label, role name or field identifier'],
        },
      },
      {
        name: 'ReportPage', path: '/reports/{id}', url: '', title: '', aliases: [],
        identity: { urlPattern: '^/reports/[^/]+$', heading: null },
        source: { component: null, route: '/reports/{id}' },
        crawled: false, unverified: 0, uses: [], actions: [],
        testability: {
          confidence: 0, addressable: 0, unaddressable: 0, hasTable: false,
          crawled: false, recorded: false,
          missing: ['the crawl never reached this route — only its URL is known'],
        },
      },
    ],
    api: { resources: {}, endpoints: [], auth: null },
    stats: { screens: 3, crawled: 2, declaredOnly: 1, components: 3 },
  };
}
