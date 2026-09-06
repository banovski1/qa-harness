// One entry per frontend framework. Adding support for a framework means adding a row here
// and nothing else — no analyzer branches on `framework`, they all read these fields.
//
//   id            stable slug used in reports and fixtures
//   label         human name
//   deps          manifest dependencies that identify it
//   beats         ids this entry outranks, so Nuxt wins over Vue on a repo that has both
//   extensions    component file extensions the parser understands
//   parse         (file, source) -> { name, props, testIds, error }
//   fileBasedRouter  { dirs, extensions, ignore } when routes come from a folder tree
//   routerLib     the client router package whose config file holds the route array

import {parseAngular, parseBackboneHandlebars, parseHtml, parseJsx, parseNaive, parseSvelte, parseVue} from './parsers.mjs';
import {rel} from './util.mjs';

export const FRONTEND_REGISTRY = [
  {
    id: 'nuxt', label: 'Nuxt', deps: ['nuxt', 'nuxt3', 'nuxt-edge'], beats: ['vue'],
    extensions: ['.vue'], parse: parseVue,
    fileBasedRouter: {dirs: ['pages'], extensions: ['.vue']},
    routerLib: 'vue-router',
  },
  {
    id: 'vue', label: 'Vue', deps: ['vue'],
    extensions: ['.vue'], parse: parseVue,
    fileBasedRouter: null, routerLib: 'vue-router',
  },
  {
    id: 'next', label: 'Next.js', deps: ['next'], beats: ['react'],
    extensions: ['.jsx', '.tsx', '.js', '.ts'], parse: parseJsx,
    // The app router names the file `page.*`; the pages router treats every file as a route.
    fileBasedRouter: {dirs: ['app', 'src/app', 'pages', 'src/pages'], extensions: ['.jsx', '.tsx', '.js', '.ts'], pageFile: 'page'},
    routerLib: null,
  },
  {
    id: 'remix', label: 'Remix', deps: ['@remix-run/react'], beats: ['react'],
    extensions: ['.jsx', '.tsx'], parse: parseJsx,
    fileBasedRouter: {dirs: ['app/routes'], extensions: ['.jsx', '.tsx'], flat: true},
    routerLib: null,
  },
  {
    id: 'sveltekit', label: 'SvelteKit', deps: ['@sveltejs/kit'], beats: ['svelte'],
    extensions: ['.svelte'], parse: parseSvelte,
    fileBasedRouter: {dirs: ['src/routes'], extensions: ['.svelte'], pageFile: '+page'},
    routerLib: null,
  },
  {
    id: 'svelte', label: 'Svelte', deps: ['svelte'],
    extensions: ['.svelte'], parse: parseSvelte,
    fileBasedRouter: null, routerLib: null,
  },
  {
    id: 'astro', label: 'Astro', deps: ['astro'],
    extensions: ['.astro'], parse: parseHtml,
    fileBasedRouter: {dirs: ['src/pages'], extensions: ['.astro', '.md', '.mdx', '.html']},
    routerLib: null,
  },
  {
    id: 'angular', label: 'Angular', deps: ['@angular/core'],
    extensions: ['.component.ts'], parse: parseAngular,
    fileBasedRouter: null, routerLib: '@angular/router',
  },
  {
    id: 'react', label: 'React', deps: ['react', 'preact'],
    extensions: ['.jsx', '.tsx'], parse: parseJsx,
    fileBasedRouter: null, routerLib: 'react-router',
  },
  {
    id: 'solid', label: 'SolidJS', deps: ['solid-js'],
    extensions: ['.jsx', '.tsx'], parse: parseJsx,
    fileBasedRouter: null, routerLib: '@solidjs/router',
  },
  {
    id: 'lit', label: 'Lit', deps: ['lit', 'lit-element'],
    extensions: ['.ts', '.js'], parse: parseNaive,
    fileBasedRouter: null, routerLib: null,
  },
  {
    id: 'ember', label: 'Ember', deps: ['ember-source'],
    extensions: ['.hbs'], parse: parseHtml,
    fileBasedRouter: {dirs: ['app/templates'], extensions: ['.hbs']},
    routerLib: null,
  },
  {
    id: 'backbone', label: 'Backbone / Handlebars', deps: ['backbone', 'bullbone', 'handlebars'],
    extensions: ['.js', '.ts', '.tpl', '.hbs', '.html'], parse: parseBackboneHandlebars,
    filePredicate: (file, detection) => /(^|\/)(components?|pages|views|screens|templates)(\/|$)/.test(rel(detection.frontend.root, file)),
    fileBasedRouter: null, routerLib: null,
  },
];

/** The naive mode: list PascalCase files under components/, parse nothing, guess nothing. */
export const UNKNOWN_FRONTEND = {
  id: 'unknown', label: 'not detected', deps: [],
  extensions: ['.vue', '.jsx', '.tsx', '.svelte', '.astro', '.html'],
  parse: parseNaive, fileBasedRouter: null, routerLib: null, naive: true,
};

export function matchFrontend(deps) {
  const hits = FRONTEND_REGISTRY.filter((entry) => entry.deps.some((dep) => dep in deps));
  if (hits.length === 0) return null;
  const beaten = new Set(hits.flatMap((entry) => entry.beats ?? []));
  return hits.find((entry) => !beaten.has(entry.id)) ?? hits[0];
}
