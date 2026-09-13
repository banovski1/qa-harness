// In-page fragment. Concatenated into a run-code bundle by build-bundle.mjs;
// it therefore declares globals and must not use import/export/require.

// The ladder, best to worst. Every consumer of a locator in this repo reads its
// ordering from here, so a change reaches all of them at once.
var LADDER = [
  'testId',
  'role',
  'label',
  'placeholder',
  // A label the app renders next to a control but never associated with it. Semantic —
  // it is the word a person reads — but resolved by walking the DOM, not by asking the
  // accessibility tree, so it ranks below the associations the app actually declared.
  'proximity',
  'scoped',
  'attribute',
  'text',
  'css',
];

// `scoped` is a CSS expression, but it is anchored to a semantic attribute the
// application put there on purpose (`[data-name="firstName"] input`), so it
// breaks only when that name does. It is the rung for an app whose inputs carry
// no label association — which, on a form-heavy CRM, is most of them.
var SEMANTIC_STRATEGIES = ['testId', 'role', 'label', 'placeholder', 'proximity', 'scoped'];

function rankOf(strategy) {
  var i = LADDER.indexOf(strategy);
  return i === -1 ? LADDER.length : i;
}

// Candidates arrive unordered from the extractor; the best unique one wins, and
// a candidate that matches several elements can never be chosen.
function chooseLocator(candidates) {
  var usable = candidates.filter(function (c) { return c.matchCount === 1; });
  usable.sort(function (a, b) { return rankOf(a.strategy) - rankOf(b.strategy); });
  if (usable.length) {
    // A CSS path always resolves to one element, so calling it "unique" would
    // report structural luck as a semantic result. It is uniquely resolvable and
    // fragile, and the two are recorded separately.
    var chosen = usable[0];
    var fragile = SEMANTIC_STRATEGIES.indexOf(chosen.strategy) === -1;
    var hadSemantic = candidates.some(function (c) {
      return SEMANTIC_STRATEGIES.indexOf(c.strategy) !== -1;
    });
    return {
      chosen: chosen,
      unique: true,
      fragile: fragile,
      reason: fragile
        ? (hadSemantic
          ? 'no semantic candidate resolved uniquely; fell back to ' + chosen.strategy
          : 'element carries no test id, accessible name, label, placeholder or named ancestor')
        : null,
      candidates: candidates,
    };
  }
  var fallback = candidates.slice().sort(function (a, b) {
    return rankOf(a.strategy) - rankOf(b.strategy);
  })[0] || null;
  return {
    chosen: fallback,
    unique: false,
    fragile: true,
    reason: fallback
      ? 'no candidate resolved to exactly one element (best matches ' + fallback.matchCount + ')'
      : 'no locator candidate could be built',
    candidates: candidates,
  };
}
