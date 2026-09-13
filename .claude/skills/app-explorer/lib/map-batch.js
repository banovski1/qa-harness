// One module of the map, walked in the browser.
//
// The map crawl answers a different question from the deep crawl: not "prove a
// locator for every control" but "where are the screens, and what is on them".
// So it navigates the way a person does — through the application's own menus —
// and it never presses a button that could change data.
async page => {
  const CONFIG = __CONFIG__;
  const SRC = __EXTRACTOR_SRC__;
  const extract = new Function(SRC + '\nreturn __mapExtract();');
  const navOf = new Function('options', SRC + '\nreturn __mapNav(options);');

  const deadline = Date.now() + CONFIG.budgetMs;
  const outOfTime = () => Date.now() > deadline;

  const settle = async () => {
    try { await page.waitForLoadState('domcontentloaded', { timeout: CONFIG.settleTimeout }); } catch (e) {}
    try { await page.waitForLoadState('networkidle', { timeout: CONFIG.settleTimeout }); } catch (e) {}
    // A redirect can destroy the context this sampler runs in. That means the page
    // navigated, not that the crawl failed: report "not settled" and let the caller
    // settle again on the new document.
    return page.evaluate(async cfg => {
      let mutations = 0;
      const observer = new MutationObserver(records => { mutations += records.length; });
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

  // An application that redirects after load destroys the context an evaluate is
  // running in. That is ordinary behaviour, so it is retried once rather than
  // recorded as a broken screen.
  const evaluate = async (fn, arg) => {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        return await page.evaluate(fn, arg);
      } catch (e) {
        if (!/Execution context was destroyed|Target closed|navigation/i.test(e.message) || attempt === 2) throw e;
        await settle();
      }
    }
  };

  /** Resolve a href against the current page — the sandbox has no URL global. */
  const absolute = async href => evaluate(h => new URL(h, location.href).href, href);

  /**
   * Click a menu item by name, without evaluating across the navigation it causes.
   * The element is marked in the page, then pressed by Playwright, so the click and
   * the context teardown never race inside the same call.
   */
  /**
   * Wait for the address to change, briefly.
   *
   * A click that navigates has not navigated yet when it returns, so reading the
   * URL immediately reports the old screen. Only used where a change is expected —
   * opening a dropdown legitimately changes nothing, and must not cost a wait.
   */
  const waitForUrlChange = async (from, timeout) => {
    await page.waitForFunction(previous => location.href !== previous, from, { timeout: timeout || 6000 })
      .catch(() => {});
    return page.url() !== from;
  };

  const clickByName = async name => {
    const found = await evaluate(target => {
      const clean = s => (s || '').replace(/\s+/g, ' ').trim().slice(0, 60);
      document.querySelectorAll('[data-map-target]').forEach(el => el.removeAttribute('data-map-target'));
      const ITEM = 'a[href],button,[role="menuitem"],[role="tab"],[role="link"],[aria-haspopup],[class*="nav-tab" i],[class*="menu-item" i],[class*="navitem" i]';
      const all = Array.from(document.querySelectorAll(ITEM));
      // Innermost first: clicking the <li> can miss the handler on the <span> inside.
      const matches = all.filter(el => clean(el.innerText || el.textContent || el.getAttribute('aria-label')) === target
        && el.getClientRects().length);
      const match = matches.sort((a, b) => (a.contains(b) ? 1 : b.contains(a) ? -1 : 0))[0];
      if (!match) return false;
      match.setAttribute('data-map-target', '1');
      return true;
    }, name);
    if (!found) return false;
    // A menu click is instantaneous or it is wrong. Waiting a full navigation
    // timeout on each one is how a two-minute crawl became a six-minute one.
    try {
      await page.locator('[data-map-target]').first().click({ timeout: CONFIG.clickTimeout, noWaitAfter: true });
    } catch (e) {
      // Covered, animating, or moving: press it directly rather than give up.
      const dispatched = await evaluate(() => {
        const el = document.querySelector('[data-map-target]');
        if (!el) return false;
        el.click();
        return true;
      }).catch(() => false);
      if (!dispatched) return false;
    }
    await settle();
    return true;
  };

  /**
   * The map is a map of the application, not of the web. An "Upgrade" link to a
   * marketing site is a real menu item and a worthless screen, so it is recorded
   * in the menu and never opened.
   */
  // The run-code sandbox has no URL constructor, so origins are compared as text.
  // Resolution against the page still happens in the browser, via absolute().
  const originOf = value => (String(value).match(/^[a-z][a-z0-9+.-]*:\/\/[^/]+/i) || [''])[0].toLowerCase();

  const withinApp = url => {
    const origin = originOf(url);
    if (!origin || origin !== originOf(CONFIG.baseUrl)) return false;
    return !(CONFIG.exclude || []).some(pattern => {
      try { return new RegExp(pattern, 'i').test(url); } catch (e) { return false; }
    });
  };

  /**
   * Navigate, tolerating a page that is already navigating.
   *
   * A menu that moves by script leaves a navigation in flight; `page.goto` called
   * into that throws, and an exception here used to abandon the whole module and
   * leave the crawl reading the previous module's screen. So it retries, settles
   * between attempts, and reports failure by returning rather than by throwing.
   */
  const goTo = async (url, attempts = 3) => {
    for (let attempt = 0; attempt < attempts; attempt++) {
      try {
        await page.goto(url, { waitUntil: 'commit', timeout: CONFIG.navTimeout });
        return await settle();
      } catch (e) {
        await settle();
        if (page.url().split('#')[0] === url.split('#')[0]) return true;   // it arrived anyway
        try {
          await page.evaluate(target => { window.location.href = target; }, url);
        } catch (inner) { /* the context was mid-teardown; the next attempt has a fresh one */ }
        await settle();
        if (page.url().split('#')[0] === url.split('#')[0]) return true;
      }
    }
    return false;
  };

  // ---- authentication, identical in contract to the deep crawl
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
        return { ok: false, authenticated: false, error: 'auth step failed: ' + step.selector + ' — ' + e.message };
      }
    }
    await settle();
    if (CONFIG.auth.readyWhen) {
      const ok = await page.locator(CONFIG.auth.readyWhen).first()
        .waitFor({ state: 'visible', timeout: CONFIG.navTimeout }).then(() => true, () => false);
      if (!ok) return { ok: false, authenticated: false, error: 'post-login marker never appeared' };
    }
  }

  // Activating a menu item: a link is followed by URL, anything else is clicked
  // where it stands. Clicking is confined to menus — never to page content.
  const activate = async (menuIndex, itemIndex, scope) => {
    const nav = await evaluate(navOf, {});
    const menu = scope === 'primary' ? nav.primary : (nav.secondary[menuIndex] || { items: [] });
    const item = menu.items[itemIndex];
    if (!item) return null;
    if (item.href && !/^#?$/.test(item.href) && !item.href.startsWith('javascript:')) {
      await goTo(await absolute(item.href));
      return item;
    }
    await clickByName(item.name);
    return item;
  };

  const capture = async (name, source) => {
    // Settling proves the page stopped changing, not that the application finished
    // rendering into it. An empty content region is not a screen with no controls.
    if (CONFIG.contentSelector) {
      const present = await page.locator(CONFIG.contentSelector).first()
        .waitFor({ state: 'visible', timeout: CONFIG.settleTimeout }).then(() => true, () => false);
      if (present) {
        await page.waitForFunction(
          selector => {
            const root = document.querySelector(selector);
            return !!root && root.querySelectorAll('a,button,input,select,textarea,table,th').length > 0;
          },
          CONFIG.contentSelector,
          { timeout: CONFIG.settleTimeout },
        ).catch(() => {});
        await settle();
      }
    }
    const surface = await evaluate(extract);
    return { name, via: source, ...surface };
  };

  const results = [];
  const errors = [];
  // Not failures: places the crawl deliberately did not go, and why.
  const notes = [];

  for (const module of CONFIG.modules) {
    if (outOfTime()) { errors.push({ module: module.name, error: 'budget exhausted before this module' }); continue; }
    const entry = { module: module.name, screens: [], menu: [] };
    try {
      // The module's own segment — "pim" in ".../web/index.php/pim/viewMyDetails".
      const sectionOf = value => (String(value).replace(originOf(value), '').split('?')[0]
        .split('/').filter(Boolean).slice(-2, -1)[0] || '');
      // A module may redirect deeper into itself: /pim/viewMyDetails becomes
      // /pim/viewPersonalDetails/empNumber/7. That is still the same module, so the
      // test is whether its segment appears at all — not whether it is in the same
      // position, which rejects every screen with a record id in the path.
      const inSection = (url, section) => !section
        || String(url).replace(originOf(url), '').split('?')[0].split('/').filter(Boolean).includes(section);

      if (module.url) {
        let arrived = await goTo(module.url);
        // A module can hold the session — OrangeHRM's Maintenance screen refuses to
        // leave until a password is given — and the next module then silently
        // records the previous one's screen. One recovery through the home page,
        // then the truth either way.
        if (!arrived || !inSection(page.url(), sectionOf(module.url))) {
          await goTo(CONFIG.baseUrl);
          arrived = await goTo(module.url);
        }
        if (!inSection(page.url(), sectionOf(module.url))) {
          entry.landedElsewhere = page.url();
          entry.note = 'the application would not leave the previous screen, so this module was not mapped';
          results.push(entry);
          continue;
        }
        if (!arrived) {
          errors.push({ module: module.name, error: 'could not navigate to the module: ' + module.url });
          results.push(entry);
          continue;
        }
      } else {
        // A module with no href is opened by clicking it. That click can silently
        // do nothing — a previous screen may be holding the session — and the crawl
        // would then record that screen under this module's name. So the URL has to
        // change, and if it does not, one recovery through the home page is tried.
        const before = page.url();
        await activate(0, module.index, 'primary');
        await waitForUrlChange(before, CONFIG.clickTimeout);
        if (page.url() === before) {
          await goTo(CONFIG.baseUrl);
          await activate(0, module.index, 'primary');
          await waitForUrlChange(before, CONFIG.clickTimeout);
        }
        if (page.url() === before) {
          entry.landedElsewhere = before;
          entry.note = 'the menu item did not open — the application stayed on the previous screen';
          results.push(entry);
          continue;
        }
      }

      // Recorded so a module that redirects is still traceable to where it landed.
      const landed = page.url();
      if (landed !== module.url) entry.landedAt = landed;

      const first = await capture(module.name, 'primary menu');
      // The section is re-checked against what was actually captured: an app can
      // let the crawl arrive and then send it back, and a screen recorded under the
      // wrong module is worse than a module recorded as unreachable.
      if (module.url && !inSection(first.url, sectionOf(module.url))) {
        entry.landedElsewhere = first.url;
        entry.note = 'the application redirected away from this module, so it was not mapped';
        results.push(entry);
        continue;
      }
      entry.screens.push(first);

      // Whatever menu appeared that is not the primary one is this module's own.
      const nav = await evaluate(navOf, { excludeNames: CONFIG.primaryNames });
      const submenus = (nav.secondary || []).flatMap(m => m.items).filter(i => i.name);
      const unique = [];
      const seen = new Set(CONFIG.primaryNames.map(n => n.toLowerCase()));
      for (const item of submenus) {
        const key = item.name.toLowerCase();
        // Pagination controls sit in a nav landmark and are not menu entries.
        if (/^[\d\s.,>«»<-]+$/.test(item.name)) continue;
        if (seen.has(key)) continue;
        seen.add(key);
        unique.push(item);
      }
      // A tag cloud is indistinguishable from a menu by markup, and Conduit puts one
      // in a sidebar. It is distinguishable by shape: menu entries lead to different
      // parts of the application, while a value list leads to one part many times.
      // Keep two as samples and record the pattern instead of crawling fifteen.
      const prefixOf = href => {
        if (!href) return null;
        const path = String(href).replace(originOf(href), '').split('?')[0].split('/').filter(Boolean);
        return path.length > 1 ? path.slice(0, -1).join('/') : null;
      };
      const byPrefix = new Map();
      for (const item of unique) {
        const prefix = prefixOf(item.href);
        if (!prefix) continue;
        byPrefix.set(prefix, (byPrefix.get(prefix) || 0) + 1);
      }
      const valueLists = new Set([...byPrefix].filter(([, n]) => n > 5).map(([prefix]) => prefix));
      const sampled = new Map();
      const menuItems = unique.filter(item => {
        const prefix = prefixOf(item.href);
        if (!prefix || !valueLists.has(prefix)) return true;
        const seenSoFar = sampled.get(prefix) || 0;
        sampled.set(prefix, seenSoFar + 1);
        return seenSoFar < 2;
      });
      for (const prefix of valueLists) {
        entry.valueLists = entry.valueLists || [];
        entry.valueLists.push({ path: '/' + prefix + '/…', count: byPrefix.get(prefix),
          note: 'a list of values, not a menu — two were sampled' });
      }
      unique.length = 0;
      unique.push(...menuItems);
      entry.menu = unique.map(i => ({ name: i.name, hasPopup: i.hasPopup || undefined }));

      const moduleUrl = page.url();
      let visited = 0;
      for (const item of unique) {
        if (visited >= CONFIG.maxScreensPerModule) {
          notes.push({ module: module.name, skipped: item.name, why: 'the per-module screen limit was reached' });
          break;
        }
        if (outOfTime()) {
          notes.push({ module: module.name, skipped: item.name, why: 'the time budget ran out — raise --per-module-seconds' });
          break;
        }
        try {
          if (item.href && !/^#?$/.test(item.href) && !item.href.startsWith('javascript:')) {
            if (!withinApp(await absolute(item.href))) continue;   // external: named, not opened
            await goTo(await absolute(item.href));
            entry.screens.push(await capture(item.name, 'module menu'));
            visited++;
            continue;
          }
          // A menu item with no href either opens a submenu or switches the screen.
          await goTo(moduleUrl);
          const before = page.url();
          if (!(await clickByName(item.name))) continue;
          // Did it open a menu, or change the screen?
          const revealed = await evaluate(({ known, src }) => {
            const clean = (s) => (s || '').replace(/\s+/g, ' ').trim().slice(0, 60);
            const open = Array.from(document.querySelectorAll('[role="menu"],[class*="dropdown" i],[class*="submenu" i]'))
              .filter(el => el.getClientRects().length);
            const names = [];
            for (const menu of open) {
              for (const el of menu.querySelectorAll('a[href],button,[role="menuitem"],li')) {
                const n = clean(el.innerText || el.textContent);
                const href = el.tagName === 'A' ? el.getAttribute('href') : (el.querySelector('a') ? el.querySelector('a').getAttribute('href') : null);
                if (n && n.length <= 40 && !known.includes(n)) names.push({ name: n, href });
              }
            }
            return names.slice(0, 10);
          }, { known: unique.map(i => i.name), src: SRC });

          if (revealed.length) {
            // The same entry matches as both the <li> and the <a> inside it.
            const children = [];
            const seenChild = new Set();
            for (const child of revealed) {
              const key = child.name.toLowerCase();
              if (seenChild.has(key)) continue;
              seenChild.add(key);
              children.push(child);
            }
            const parent = entry.menu.find(m => m.name === item.name);
            if (parent) parent.children = children.map(c => c.name);

            for (const child of children) {
              if (visited >= CONFIG.maxScreensPerModule || outOfTime()) {
                notes.push({ module: module.name, skipped: item.name + ' → ' + child.name, why: outOfTime() ? 'the time budget ran out' : 'the per-module screen limit was reached' });
                break;
              }
              const usable = child.href && !/^#?$/.test(child.href) && !child.href.startsWith('javascript:');
              try {
                if (usable) {
                  const childUrl = await absolute(child.href);
                  if (!withinApp(childUrl)) { notes.push({ module: module.name, skipped: child.name, why: 'outside the application' }); continue; }
                  await goTo(childUrl);
                } else {
                  // href="#": the menu navigates by script. Re-open the parent, since
                  // the previous child's navigation closed it, and press the entry.
                  await goTo(moduleUrl);
                  if (!(await clickByName(item.name))) {
                    notes.push({ module: module.name, skipped: child.name, why: 'the parent menu "' + item.name + '" would not open' });
                    continue;
                  }
                  const beforeChild = page.url();
                  if (!(await clickByName(child.name))) {
                    notes.push({ module: module.name, skipped: child.name, why: 'the entry could not be pressed' });
                    continue;
                  }
                  await waitForUrlChange(beforeChild, CONFIG.clickTimeout);
                  if (!withinApp(page.url())) {
                    notes.push({ module: module.name, skipped: child.name, why: 'led outside the application', landed: page.url(), base: CONFIG.baseUrl });
                    await goTo(moduleUrl);
                    continue;
                  }
                }
                entry.screens.push(await capture(item.name + ' → ' + child.name, 'module submenu'));
                visited++;
              } catch (e) {
                errors.push({ module: module.name, item: item.name + ' → ' + child.name, error: String(e.message).slice(0, 200) });
              }
            }
            await goTo(moduleUrl);
          } else if (page.url() !== before) {
            entry.screens.push(await capture(item.name, 'module menu'));
            visited++;
          }
        } catch (e) {
          errors.push({ module: module.name, item: item.name, error: String(e.message).slice(0, 200) });
        }
      }
    } catch (e) {
      errors.push({ module: module.name, error: String(e.message).slice(0, 300) });
    }
    results.push(entry);
    // Every module starts from the same place, whatever the last one left behind.
    await goTo(CONFIG.baseUrl).catch(() => {});
  }

  return { ok: true, authenticated: true, results, errors, notes, timedOut: outOfTime() };
}
