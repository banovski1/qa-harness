// Template for one crawl batch. build-bundle.mjs substitutes the two
// placeholders below, then the driver runs the result through
// `playwright-cli run-code --filename=`. Batches are bounded so a crawl is
// resumable and no single call can run away.
async page => {
  const CONFIG = __CONFIG__;
  const EXTRACTOR_SRC = __EXTRACTOR_SRC__;
  const extract = new Function('options', EXTRACTOR_SRC + '\nreturn __extractScreen(options);');

  const network = [];
  let currentScreen = null;

  const shapeOf = (value, depth) => {
    if (depth > 3) return '…';
    if (value === null) return 'null';
    if (Array.isArray(value)) return value.length ? [shapeOf(value[0], depth + 1)] : [];
    if (typeof value === 'object') {
      const out = {};
      for (const key of Object.keys(value).slice(0, 40)) out[key] = shapeOf(value[key], depth + 1);
      return out;
    }
    return typeof value;
  };

  // Bodies are reduced to keys and types in the page process; no value ever
  // reaches an artifact, so a crawl cannot leak demo data or a token.
  page.on('response', async response => {
    const request = response.request();
    const type = request.resourceType();
    if (type !== 'xhr' && type !== 'fetch') return;
    const entry = {
      screen: currentScreen,
      method: request.method(),
      url: response.url(),
      status: response.status(),
      requestShape: null,
      responseShape: null,
    };
    try {
      const post = request.postData();
      if (post && post.trim().startsWith('{')) entry.requestShape = shapeOf(JSON.parse(post), 0);
    } catch (e) { /* not json */ }
    try {
      const headers = response.headers();
      if ((headers['content-type'] || '').includes('json')) {
        const body = await response.text();
        if (body.length < 400000) entry.responseShape = shapeOf(JSON.parse(body), 0);
      }
    } catch (e) { /* body unavailable */ }
    network.push(entry);
  });

  // Settle on evidence: in-flight requests drained, then a DOM whose mutation
  // count holds steady across consecutive samples. Nothing here waits on a clock
  // for its own sake.
  const settle = async () => {
    try { await page.waitForLoadState('domcontentloaded', { timeout: CONFIG.settleTimeout }); } catch (e) {}
    try { await page.waitForLoadState('networkidle', { timeout: CONFIG.settleTimeout }); } catch (e) {}
    return page.evaluate(async cfg => {
      let mutations = 0;
      const observer = new MutationObserver(records => { mutations += records.length; });
      observer.observe(document.documentElement, { subtree: true, childList: true, attributes: true });
      const sample = () => new Promise(resolve => setTimeout(resolve, cfg.sampleMs));
      let quiet = 0;
      for (let i = 0; i < cfg.maxSamples; i++) {
        const before = mutations;
        await sample();
        if (mutations === before) { quiet++; if (quiet >= cfg.quietSamples) { observer.disconnect(); return true; } }
        else quiet = 0;
      }
      observer.disconnect();
      return false;
    }, { sampleMs: CONFIG.sampleMs, maxSamples: CONFIG.maxSamples, quietSamples: CONFIG.quietSamples });
  };

  const goTo = async url => {
    const before = page.url();
    try {
      await page.goto(url, { waitUntil: 'commit', timeout: CONFIG.navTimeout });
    } catch (e) {
      // A hash-only change is not a navigation; drive the router instead.
      await page.evaluate(target => { window.location.href = target; }, url);
    }
    if (page.url() === before && page.url() !== url) {
      await page.evaluate(target => { window.location.href = target; }, url);
    }
    return settle();
  };

  const results = [];
  if (CONFIG.auth) {
    currentScreen = '__auth__';
    await goTo(CONFIG.auth.loginUrl);
    // An already-authenticated session must not be driven through a login form
    // that is not on screen, so the marker is checked before the steps run.
    let already = false;
    if (CONFIG.auth.readyWhen) {
      already = await page.locator(CONFIG.auth.readyWhen).first()
        .waitFor({ state: 'visible', timeout: CONFIG.settleTimeout })
        .then(() => true, () => false);
    }
    for (const step of already ? [] : (CONFIG.auth.steps || [])) {
      const target = page.locator(step.selector).first();
      try {
        await target.waitFor({ state: 'visible', timeout: CONFIG.navTimeout });
        if (step.action === 'fill') await target.fill(step.value);
        else if (step.action === 'select') await target.selectOption(step.value);
        else if (step.action === 'check') await target.check();
        else await target.click();
      } catch (e) {
        results.push({ target: '__auth__', ok: false, error: 'auth step failed: ' + step.selector + ' — ' + e.message });
        return { results, network, authenticated: false };
      }
    }
    await settle();
    if (CONFIG.auth.readyWhen) {
      try {
        await page.locator(CONFIG.auth.readyWhen).first().waitFor({ state: 'visible', timeout: CONFIG.navTimeout });
      } catch (e) {
        return { results, network, authenticated: false, error: 'post-login marker never appeared: ' + CONFIG.auth.readyWhen };
      }
    }
  }

  for (const target of CONFIG.targets) {
    currentScreen = target.id;
    let settled = false;
    let screen = null;
    let error = null;
    for (let attempt = 0; attempt < 2 && !screen; attempt++) {
      try {
        settled = await goTo(target.url);
        // Settling proves the page stopped changing; it does not prove the
        // application finished rendering into it. A screen whose content region
        // is still empty is not ready, and extracting it would record a real
        // screen as a nearly empty one.
        if (CONFIG.contentSelector) {
          const ready = await page.locator(CONFIG.contentSelector).first()
            .waitFor({ state: 'visible', timeout: CONFIG.settleTimeout })
            .then(() => true, () => false);
          if (ready) {
            await page.waitForFunction(
              selector => {
                const root = document.querySelector(selector);
                return !!root && root.querySelectorAll('a,button,input,select,textarea').length > 0;
              },
              CONFIG.contentSelector,
              { timeout: CONFIG.settleTimeout },
            ).catch(() => {});
            await settle();
          }
        }
        screen = await page.evaluate(extract, { testIdAttribute: CONFIG.testIdAttribute });
      } catch (e) {
        error = e.message;
        screen = null;
      }
    }
    // A screen that will not yield is recorded as failed, never dropped: an
    // absent screen must always be visible in the report.
    results.push(screen
      ? { target: target.id, url: target.url, ok: true, settled, screen }
      : { target: target.id, url: target.url, ok: false, settled, error: error || 'extraction returned nothing' });
  }

  return { results, network, authenticated: true, finalUrl: page.url() };
}
