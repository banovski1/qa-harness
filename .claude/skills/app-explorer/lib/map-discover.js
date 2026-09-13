// Log in once, then report the application's primary menu.
async page => {
  const CONFIG = __CONFIG__;
  const SRC = __EXTRACTOR_SRC__;
  const navOf = new Function('options', SRC + '\nreturn __mapNav(options);');

  const settle = async () => {
    try { await page.waitForLoadState('domcontentloaded', { timeout: CONFIG.settleTimeout }); } catch (e) {}
    try { await page.waitForLoadState('networkidle', { timeout: CONFIG.settleTimeout }); } catch (e) {}
    // A redirect can destroy the context this sampler runs in. That means the page
    // navigated, not that the crawl failed: report "not settled" and let the caller
    // settle again on the new document.
    return page.evaluate(async cfg => {
      let mutations = 0;
      const observer = new MutationObserver(r => { mutations += r.length; });
      observer.observe(document.documentElement, { subtree: true, childList: true, attributes: true });
      let quiet = 0;
      for (let i = 0; i < cfg.maxSamples; i++) {
        const before = mutations;
        await new Promise(r => setTimeout(r, cfg.sampleMs));
        if (mutations === before) { quiet++; if (quiet >= cfg.quietSamples) { observer.disconnect(); return true; } }
        else quiet = 0;
      }
      observer.disconnect();
      return false;
    }, { sampleMs: CONFIG.sampleMs, maxSamples: CONFIG.maxSamples, quietSamples: CONFIG.quietSamples })
      .catch(() => false);
  };

  const goTo = async url => {
    try { await page.goto(url, { waitUntil: 'commit', timeout: CONFIG.navTimeout }); }
    catch (e) { await page.evaluate(t => { window.location.href = t; }, url); }
    return settle();
  };

  if (CONFIG.auth) {
    await goTo(CONFIG.auth.loginUrl);
    let already = false;
    if (CONFIG.auth.readyWhen) {
      already = await page.locator(CONFIG.auth.readyWhen).first()
        .waitFor({ state: 'visible', timeout: CONFIG.settleTimeout }).then(() => true, () => false);
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
        return { ok: false, error: 'auth step failed: ' + step.selector + ' — ' + e.message };
      }
    }
    await settle();
  } else {
    await goTo(CONFIG.baseUrl);
  }

  const nav = await page.evaluate(navOf, {});
  return { ok: true, url: page.url(), primary: nav.primary, secondary: nav.secondary };
}
