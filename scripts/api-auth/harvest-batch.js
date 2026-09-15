// Runs inside playwright-cli's `run-code`, so it receives the live `page`.
//
// One round trip: perform the app's own UI login, then harvest the credential it
// leaves behind *and* observe how the application presents it on a request of its
// own. Both halves have to come from the same session, which is why this is one
// script rather than a sequence of CLI calls.
async page => {
  const CONFIG = __CONFIG__;
  const context = page.context();
  const origin = new URL(CONFIG.loginUrl).origin;

  // Attach before navigating: the request that proves the presentation may fire
  // during login, and a listener added afterwards would miss it.
  const seen = [];
  page.on('request', request => {
    try {
      const url = new URL(request.url());
      if (url.origin !== origin) return;
      const type = request.resourceType();
      if (type !== 'xhr' && type !== 'fetch') return;
      seen.push({ url: request.url(), method: request.method(), headers: request.headers() });
    } catch { /* a malformed URL is not evidence */ }
  });

  const steps = [];
  const note = (step, ok, detail) => steps.push({ step, ok, detail });

  try {
    await page.goto(CONFIG.loginUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    note('open', true, CONFIG.loginUrl);

    for (const step of CONFIG.steps || []) {
      const locator = page.locator(step.selector).first();
      await locator.waitFor({ state: 'visible', timeout: 15000 });
      if (step.action === 'fill') await locator.fill(String(step.value ?? ''));
      else if (step.action === 'select') await locator.selectOption(String(step.value ?? ''));
      else await locator.click();
      note(step.action, true, step.selector);
    }

    if (CONFIG.readyWhen) {
      await page.locator(CONFIG.readyWhen).first().waitFor({ state: 'visible', timeout: 30000 });
      note('ready', true, CONFIG.readyWhen);
    } else {
      await page.waitForLoadState('networkidle', { timeout: 30000 });
      note('ready', true, 'networkidle');
    }
  } catch (error) {
    return JSON.stringify({
      ok: false,
      reason: `the UI login did not complete: ${error.message.split('\n')[0]}`,
      steps,
    });
  }

  // Give the application a moment to make a call of its own. Many SPAs fetch the
  // current user right after login, and that request is the observation we want.
  try {
    await page.waitForLoadState('networkidle', { timeout: 8000 });
  } catch { /* an app that goes quiet immediately is fine; we may just have no XHR */ }

  const storage = await page.evaluate(() => {
    const read = store => {
      const out = {};
      try {
        for (let i = 0; i < store.length; i++) {
          const key = store.key(i);
          const value = store.getItem(key);
          if (typeof value === 'string') out[key] = value;
        }
      } catch { /* storage can be blocked; absence is an answer */ }
      return out;
    };
    return { local: read(window.localStorage), session: read(window.sessionStorage) };
  });

  const cookies = {};
  for (const cookie of await context.cookies()) cookies[cookie.name] = cookie.value;

  return JSON.stringify({
    ok: true,
    url: page.url(),
    cookies,
    localStorage: storage.local,
    sessionStorage: storage.session,
    // Latest first: the most recent same-origin call is the most likely to carry
    // the settled post-login credential.
    observed: seen.reverse().slice(0, 10),
    steps,
  });
}
