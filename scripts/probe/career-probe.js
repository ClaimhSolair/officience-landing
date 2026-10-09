// The Career layout probe. Every Career checkpoint runs it before the next
// section starts. It loads the real page into a same-origin iframe at a set
// width, so media queries follow the iframe, and measures the result.
//
// Use in the dev page (browser pane or Chrome console):
//   const p = await import('/scripts/probe/career-probe.js');
//   await p.gate('culture', [390, 1024, 1440]);
//
// Each gate returns { [width]: { pass, fails[] } }. Run two or three widths per
// call, because a long evaluation times out near 45s.
//
// Why each step exists (all from .claude/figma-adapter.md, Verification):
// - rAF is counted first. A hidden pane freezes it, and then nothing that
//   animates can be trusted.
// - `?motion=off` takes the reduced-motion path, so Reveal content is visible.
// - Lazy images never load in this profile, so they are forced eager.
// - Career images that are not uploaded yet are read from /assets-src.
// - Overflow is measured against clientWidth, and an element inside an ancestor
//   that clips is skipped, so the marquee and off-canvas menus do not count.

export const WIDTHS = [320, 375, 390, 768, 1024, 1280, 1440, 1536, 1910];

const R2_HOST = 'pub-767c5aebf4a841a595fec5daeb08d3b4.r2.dev';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Counts animation frames over one second. Zero means a frozen pane. */
export const rafPerSecond = () =>
  new Promise((resolve) => {
    let n = 0;
    const t0 = performance.now();
    const tick = () => {
      n += 1;
      if (performance.now() - t0 < 1000) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    setTimeout(() => resolve(n), 1100);
  });

const loadFrame = async (route, width, height = 900) => {
  const f = document.createElement('iframe');
  f.style.cssText = `position:absolute;left:0;top:0;width:${width}px;height:${height}px;border:0;outline:1px solid red;opacity:0.01;pointer-events:none;z-index:-1`;
  const sep = route.includes('?') ? '&' : '?';
  f.src = `${route}${sep}motion=off`;
  document.body.appendChild(f);
  await new Promise((r) => f.addEventListener('load', r, { once: true }));
  const win = f.contentWindow;
  const doc = f.contentDocument;
  // Tailwind CDN styles the page after React mounts. Wait, then fire resize so
  // code that measures on resize runs (ResizeObserver is dead in a frozen pane).
  await sleep(1200);
  win.dispatchEvent(new win.Event('resize'));
  [...doc.images].forEach((img) => {
    const fix = (s) => s && s.replaceAll(`https://${R2_HOST}/career/`, `${location.origin}/assets-src/career/`);
    const src = fix(img.getAttribute('src'));
    const set = fix(img.getAttribute('srcset'));
    img.loading = 'eager';
    if (set) img.setAttribute('srcset', set);
    if (src) {
      img.src = '';
      img.src = src;
    }
  });
  doc.querySelectorAll('source[srcset]').forEach((s) => {
    s.srcset = s.srcset.replaceAll(`https://${R2_HOST}/career/`, `${location.origin}/assets-src/career/`);
  });
  await sleep(1500);
  return { f, win, doc };
};

const clips = (el, win) => {
  for (let p = el.parentElement; p; p = p.parentElement) {
    if (p === p.ownerDocument.body || p === p.ownerDocument.documentElement) return false;
    const o = win.getComputedStyle(p).overflowX;
    if (o === 'hidden' || o === 'clip' || o === 'auto' || o === 'scroll') return true;
  }
  return false;
};

/** Leaf elements whose right edge passes the viewport. */
const overflowing = (doc, win) => {
  const cw = doc.documentElement.clientWidth;
  const out = [];
  doc.querySelectorAll('main *').forEach((el) => {
    if (el.children.length) return;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    if (r.right > cw + 0.5 && !clips(el, win)) out.push(`${el.tagName.toLowerCase()}.${(el.className?.baseVal ?? el.className ?? '').toString().slice(0, 40)} right=${r.right.toFixed(1)}`);
  });
  return out;
};

const box = (el) => el.getBoundingClientRect();
const lines = (el, win) => {
  const lh = parseFloat(win.getComputedStyle(el).lineHeight);
  return Math.round(box(el).height / lh);
};
const near = (a, b, tol) => Math.abs(a - b) <= tol;
const rel = (a, b, tol) => Math.abs(a / b - 1) <= tol;

/**
 * Helpers the expectations use. Each check returns [name, ok, detail].
 */
const helpers = (doc, win, width) => {
  const all = (sel) => [...doc.querySelectorAll(sel)];
  const one = (sel) => doc.querySelector(sel);
  return {
    width,
    doc,
    win,
    all,
    one,
    box,
    lines: (el) => lines(el, win),
    near,
    rel,
    /** Every match has the aspect ratio, within tol (relative). */
    aspect: (name, sel, ratio, tol = 0.01) => {
      const els = all(sel);
      if (!els.length) return [name, false, `no match for ${sel}`];
      const bad = els
        .map((e) => box(e).width / box(e).height)
        .filter((r) => !rel(r, ratio, tol));
      return [name, bad.length === 0, `want ${ratio.toFixed(3)} got ${els.map((e) => (box(e).width / box(e).height).toFixed(3)).join(',')}`];
    },
    /** No match scrolls inside itself (text fits its box). */
    fits: (name, sel) => {
      const els = all(sel);
      if (!els.length) return [name, false, `no match for ${sel}`];
      const bad = els.filter((e) => e.scrollHeight > e.clientHeight + 1 || e.scrollWidth > e.clientWidth + 1);
      return [name, bad.length === 0, bad.map((e) => `${e.scrollHeight}>${e.clientHeight}`).join(',') || 'ok'];
    },
    count: (name, sel, n) => {
      const c = all(sel).length;
      return [name, c === n, `want ${n} got ${c}`];
    },
    /** One number against a target, within an absolute tolerance. */
    value: (name, got, want, tol) => [name, near(got, want, tol), `want ${want}±${tol} got ${typeof got === 'number' ? got.toFixed(2) : got}`],
  };
};

/**
 * The expected values for each section, one place. A gate fails when the page
 * differs from these. If a gate fails twice, change the row (the mechanism),
 * not a px value.
 */
export const SECTIONS = {
  /** CP0: the probe itself runs clean on a page that already exists. */
  baseline: {
    route: '/services',
    checks: (h) => [h.value('page has a main', h.all('main').length, 1, 0)],
  },

  /** CP2: routes, nav and the page shell. */
  shell: {
    route: '/career',
    checks: (h) => {
      const page = h.one('[data-probe="career-page"]');
      const out = [
        ['career route renders its own page', !!page && h.win.location.pathname === '/career', h.win.location.pathname],
        ['page knows the job count', Number(page?.getAttribute('data-count')) > 0, page?.getAttribute('data-count')],
        h.value('scrollWidth <= clientWidth', Math.max(0, h.doc.documentElement.scrollWidth - h.doc.documentElement.clientWidth), 0, 0),
      ];
      const careerLinks = h.all('footer a[href="/career"]').length;
      out.push(['footer Career link is the route', careerLinks === 1, `found ${careerLinks}`]);
      return out;
    },
  },

  /** CP3: the hero. Photo whole at its own ratio (ruling 18b), scrim 467/839. */
  hero: {
    route: '/career',
    checks: (h) => {
      const photo = h.one('#career-hero [data-probe="hero-photo"]');
      const scrim = h.one('#career-hero [data-probe="hero-scrim"]');
      const title = h.one('#career-hero h1');
      const out = [h.aspect('hero photo 1440/839', '#career-hero [data-probe="hero-photo"]', 1440 / 839)];
      if (h.width >= 1024) {
        out.push(h.value('scrim / hero height', scrim ? box(scrim).height / box(photo).height : 0, 467 / 839, 0.01));
      }
      if (h.width >= 1280) out.push(h.value('title lines', title ? h.lines(title) : 0, 2, 0));
      else out.push(['title lines <= 3', title && h.lines(title) <= 3, title ? h.lines(title) : 'none']);
      return out;
    },
  },

  /** CP4: Our Culture. Cards 1392/860, band 83.05% wide, 40px off the bottom. */
  culture: {
    route: '/career',
    checks: (h) => {
      const out = [
        h.count('3 culture cards', '[data-probe="culture-card"]', 3),
        h.aspect('card photo 1392/860', '[data-probe="culture-photo"]', 1392 / 860),
        h.fits('band text fits', '[data-probe="culture-band"]'),
      ];
      const cards = h.all('[data-probe="culture-card"]');
      if (cards.length > 1) out.push(h.value('card gap', box(cards[1]).top - box(cards[0]).bottom, h.width >= 1024 ? 100 : 48, 1));
      if (h.width >= 1024) {
        cards.forEach((c, i) => {
          const band = c.querySelector('[data-probe="culture-band"]');
          const photo = c.querySelector('[data-probe="culture-photo"]');
          if (!band || !photo) return;
          out.push(h.value(`card ${i + 1} band/card width`, box(band).width / box(photo).width, 1156 / 1392, 0.01));
          out.push(h.value(`card ${i + 1} band bottom`, box(photo).bottom - box(band).bottom, 40, 1));
          out.push(h.value(`card ${i + 1} band centred`, box(band).left - box(photo).left - (box(photo).right - box(band).right), 0, 1));
        });
      }
      if (h.width === 1440) out.push(h.value('card width at 1440', cards[0] ? box(cards[0]).width : 0, 1392, 2));
      return out;
    },
  },

  /** CP5: Job Openings rows. */
  openings: {
    route: '/career',
    checks: (h) => {
      const page = h.one('[data-probe="career-page"]');
      const rowCount = h.all('[data-probe="job-row"]').length;
      const out = [['job rows = JOBS.length', rowCount > 0 && rowCount === Number(page?.getAttribute('data-count')), `rows ${rowCount}`]];
      const container = h.one('#job-openings [data-probe="rows"]');
      h.all('[data-probe="job-row"]').forEach((row, i) => {
        const apply = row.querySelector('[data-probe="apply"]');
        const title = row.querySelector('[data-probe="job-title"]');
        if (apply && container) out.push(h.value(`row ${i + 1} Apply inside`, Math.max(0, box(apply).right - box(container).right), 0, 0.5));
        if (h.width >= 768 && title) out.push(['title column >= 400', box(title).width >= 400, box(title).width.toFixed(0)]);
        if (h.width >= 1024 && apply) {
          out.push(h.value(`row ${i + 1} Apply width`, box(apply).width, 253, 1));
          out.push(h.value(`row ${i + 1} Apply height`, box(apply).height, 56, 1));
        }
      });
      const cnt = h.one('[data-probe="job-count"]');
      out.push(['count text matches data', !!cnt && cnt.textContent.includes(String(cnt.getAttribute('data-count')).padStart(2, '0')), cnt?.textContent]);
      return out;
    },
  },

  /** CP6: Benefits mosaic. */
  benefits: {
    route: '/career',
    checks: (h) => {
      const out = [
        h.fits('tile text fits', '[data-probe="benefit-tile"]'),
        // A text tile's ratio is a minimum; below 375 it grows to fit its text.
        h.aspect('tile 447/367', h.width >= 375 ? '[data-probe="benefit-tile"], [data-probe="benefit-photo"]' : '[data-probe="benefit-photo"]', 447 / 367, 0.015),
      ];
      const tiles = h.all('[data-probe="benefit-tile"], [data-probe="benefit-photo"], [data-probe="benefit-wide"]');
      const tops = {};
      tiles.forEach((t) => {
        const k = Math.round(box(t).top);
        (tops[k] = tops[k] || []).push(box(t).height);
      });
      Object.values(tops).forEach((hs, i) => out.push(h.value(`row ${i + 1} heights equal`, Math.max(...hs) - Math.min(...hs), 0, 1)));
      const cols = Object.values(tops)[0]?.length ?? 0;
      // Three columns need the 1280 column: at 1024 a 309px tile is 254px tall,
      // and the drawn tile text needs about 291px (spec, derivation grid).
      const want = h.width >= 1280 ? 3 : h.width >= 768 ? 2 : 1;
      out.push(h.value('columns', cols, want, 0));
      return out;
    },
  },

  /** CP7: the job page. */
  job: {
    route: '/career/senior-php-developer',
    checks: (h) => {
      const main = h.one('[data-probe="job-main"]');
      const side = h.one('[data-probe="job-side"]');
      const out = [['job page renders', !!main && !!side, h.win.location.pathname]];
      if (!main || !side) return out;
      if (h.width === 1440) {
        out.push(h.value('main column', box(main).width, 849, 2));
        out.push(h.value('side column', box(side).width, 463, 2));
      }
      const twoCols = Math.abs(box(main).top - box(side).top) < 1 || box(side).left > box(main).right;
      out.push(['two columns from 1280 only', h.width >= 1280 ? twoCols : !twoCols, `twoCols=${twoCols}`]);
      if (h.width < 1280) out.push(['Overview before the details', box(side).top < box(main).top, `${box(side).top.toFixed(0)} < ${box(main).top.toFixed(0)}`]);
      const listed = h.all('[data-probe="other-job"]').map((a) => a.getAttribute('href'));
      out.push(['sidebar lists other jobs only', listed.length > 0 && !listed.includes('/career/senior-php-developer'), listed.join(' ')]);
      return out;
    },
  },
};

/** Opens the apply form from the Overview card, as a visitor does. */
const openApplyForm = async (h) => {
  const btn = [...h.doc.querySelectorAll('[data-probe="job-overview"] button')].find((b) => /Apply for a job/.test(b.textContent));
  if (!btn) return;
  btn.focus();
  btn.click();
  // The form is a lazy chunk: wait for it to mount.
  for (let i = 0; i < 40 && !h.doc.querySelector('[data-probe="apply-dialog"]'); i += 1) await sleep(100);
  await sleep(400);
};

SECTIONS.modal = {
  route: '/career/senior-php-developer',
  prepare: openApplyForm,
  checks: (h) => {
    const dlg = h.one('[data-probe="apply-dialog"]');
    if (!dlg) return [['apply dialog opens', false, 'no dialog']];
    const out = [['apply dialog opens', true, '']];
    const vh = h.win.innerHeight;
    out.push(['dialog fits the viewport height', box(dlg).bottom <= vh + 0.5 && box(dlg).top >= -0.5, `${box(dlg).top.toFixed(0)}..${box(dlg).bottom.toFixed(0)} of ${vh}`]);
    if (h.width >= 1024) out.push(h.value('dialog width', box(dlg).width, 968, 1));
    if (h.width >= 1024) {
      const inputs = h.all('[data-probe="text-field"] input').map((i) => box(i).width);
      out.push(['text inputs 426 wide', inputs.length === 4 && inputs.every((w) => near(w, 426, 2)), inputs.map((w) => w.toFixed(1)).join(',')]);
    }
    const scroller = h.one('[data-probe="apply-scroll"]');
    if (vh <= 730) out.push(['form scrolls inside a short viewport', !!scroller && scroller.scrollHeight > scroller.clientHeight, scroller ? `${scroller.scrollHeight}>${scroller.clientHeight}` : 'none']);
    const checked = h.one('input[name="position"]:checked');
    out.push(['role chip pre-selected', checked?.value === 'Back-end', checked?.value ?? 'none']);
    const submit = h.one('[data-probe="apply-submit"]');
    out.push(['submit disabled while empty', !!submit && submit.disabled, String(submit?.disabled)]);
    const page = h.doc.querySelector('main')?.closest('[inert]');
    out.push(['page behind is inert', !!page, page ? 'inert' : 'not inert']);
    return out;
  },
};

/**
 * The apply form's behaviour: Tab stays inside, Escape closes and returns focus
 * to the opener, a non-PDF and a 5 MB file are refused inline, and Submit turns
 * on only when every required field is valid. Files go in through
 * DataTransfer, because a probe cannot drive the real file picker.
 */
export async function modalFlow(width = 1440) {
  const { f, win, doc } = await loadFrame('/career/senior-php-developer', width, 900);
  const out = [];
  const add = (name, ok, detail = '') => out.push([name, !!ok, detail]);
  const deferred = [];
  try {
    const h = helpers(doc, win, width);
    await openApplyForm(h);
    const dlg = doc.querySelector('[data-probe="apply-dialog"]');
    add('dialog opens', dlg);
    if (!dlg) return out;
    add('focus moves into the dialog', dlg.contains(doc.activeElement), doc.activeElement?.tagName);

    // Tab from the last control wraps to the first.
    const sel = 'a[href]:not([tabindex="-1"]), button:not([disabled]):not([tabindex="-1"]), input:not([disabled]):not([tabindex="-1"]), textarea:not([disabled]):not([tabindex="-1"])';
    const focusables = [...dlg.querySelectorAll(sel)].filter((e) => e.offsetParent !== null);
    focusables[focusables.length - 1].focus();
    doc.dispatchEvent(new win.KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
    add('Tab wraps inside the dialog', doc.activeElement === focusables[0], doc.activeElement?.outerHTML.slice(0, 60));

    // React tracks input values; set them through the native setter.
    const setVal = (el, v) => {
      const proto = el.tagName === 'TEXTAREA' ? win.HTMLTextAreaElement.prototype : win.HTMLInputElement.prototype;
      Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, v);
      el.dispatchEvent(new win.Event('input', { bubbles: true }));
    };
    const field = (n) => dlg.querySelector(`[name="${n}"]`);
    const putFile = async (bytes, name, type) => {
      const dt = new win.DataTransfer();
      dt.items.add(new win.File([bytes], name, { type }));
      const input = field('cv');
      input.files = dt.files;
      input.dispatchEvent(new win.Event('change', { bubbles: true }));
      await sleep(150);
    };
    const submit = () => dlg.querySelector('[data-probe="apply-submit"]');
    const cvError = () => dlg.querySelector('[data-probe="cv-error"]')?.textContent ?? '';

    setVal(field('name'), 'Alex Van Daang');
    setVal(field('email'), 'alex@example.com');
    setVal(field('school'), 'Foreign Trade University');
    setVal(field('phone'), '+84 1234 566');
    setVal(field('location'), 'Ho Chi Minh City, Viet Nam');
    field('consent').click();
    await sleep(150);
    add('submit stays off without a CV', submit().disabled);

    await putFile(new Uint8Array([104, 105]), 'notes.txt', 'text/plain');
    add('a .txt is refused inline', /PDF/i.test(cvError()) && submit().disabled, cvError());

    const big = new Uint8Array(5 * 1024 * 1024);
    big.set([37, 80, 68, 70]);
    await putFile(big, 'big.pdf', 'application/pdf');
    add('a 5 MB PDF is refused inline', /4 MB/.test(cvError()) && submit().disabled, cvError());

    const ok = new Uint8Array(2048);
    ok.set([37, 80, 68, 70]);
    await putFile(ok, 'cv.pdf', 'application/pdf');
    add('a valid form turns Submit on', !submit().disabled && cvError() === '', `disabled=${submit().disabled} err=${cvError()}`);

    // Escape closes and gives focus back to the button that opened the form.
    doc.dispatchEvent(new win.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    // The panel fades out before it unmounts.
    for (let i = 0; i < 20 && doc.querySelector('[data-probe="apply-dialog"]'); i += 1) await sleep(100);
    // The fade-out runs on requestAnimationFrame. A frozen pane never finishes
    // it, so there the unmount cannot be measured: it goes to `deferred` for a
    // real-browser check, and the close is proven by the focus and inert checks.
    const frameRate = await new Promise((res) => {
      let n = 0;
      const t0 = performance.now();
      const tick = () => {
        n += 1;
        if (performance.now() - t0 < 500) win.requestAnimationFrame(tick);
      };
      win.requestAnimationFrame(tick);
      setTimeout(() => res(n), 600);
    });
    if (frameRate === 0) deferred.push('Escape unmounts the dialog after its fade (rAF frozen here)');
    else add('Escape closes the dialog', !doc.querySelector('[data-probe="apply-dialog"]'));
    add('focus returns to "Apply for a job"', /Apply for a job/.test(doc.activeElement?.textContent ?? ''), doc.activeElement?.textContent);
    // The closed menu overlay is inert on purpose, so check the page wrapper only.
    add('page is no longer inert', !doc.querySelector('main')?.closest('[inert]'));
  } catch (e) {
    add('flow error', false, e.message);
  } finally {
    f.remove();
  }
  return { width, pass: out.every((r) => r[1]), fails: out.filter((r) => !r[1]).map((r) => `${r[0]}: ${r[2]}`), checks: out.length, deferred };
}

/**
 * A second application in one visit: apply to one job, send (the API is
 * stubbed, as it does not run under Vite), close, then apply to another job.
 * Focus must land on "Close" after the send, and inside a fresh form, with the
 * new job's chip, after the reopen.
 */
export async function reopenFlow(width = 1440) {
  const { f, win, doc } = await loadFrame('/career', width, 900);
  const out = [];
  const add = (name, ok, detail = '') => out.push([name, !!ok, detail]);
  try {
    win.fetch = async () => new win.Response(JSON.stringify({ ok: true }), { status: 200 });
    const dialog = () => doc.querySelector('[data-probe="apply-dialog"]');
    const applyButtons = () => [...doc.querySelectorAll('[data-probe="job-row"] [data-probe="apply"] button')];
    const open = async (i) => {
      const b = applyButtons()[i];
      b.focus();
      b.click();
      for (let n = 0; n < 40 && !dialog()?.querySelector('form'); n += 1) await sleep(100);
      await sleep(300);
    };
    const setVal = (el, v) => {
      Object.getOwnPropertyDescriptor(win.HTMLInputElement.prototype, 'value').set.call(el, v);
      el.dispatchEvent(new win.Event('input', { bubbles: true }));
    };

    await open(0);
    const fld = (n) => dialog().querySelector(`[name="${n}"]`);
    setVal(fld('name'), 'Alex');
    setVal(fld('email'), 'a@b.co');
    setVal(fld('school'), 'FTU');
    setVal(fld('phone'), '+84 1');
    setVal(fld('location'), 'HCMC');
    fld('consent').click();
    const dt = new win.DataTransfer();
    const pdf = new Uint8Array(2048);
    pdf.set([37, 80, 68, 70]);
    dt.items.add(new win.File([pdf], 'cv.pdf', { type: 'application/pdf' }));
    fld('cv').files = dt.files;
    fld('cv').dispatchEvent(new win.Event('change', { bubbles: true }));
    await sleep(200);
    dialog().querySelector('[data-probe="apply-submit"]').click();
    await sleep(600);
    add('focus moves to "Close" after the send', doc.activeElement?.textContent === 'Close', doc.activeElement?.tagName);

    [...dialog().querySelectorAll('button')].find((b) => b.textContent === 'Close').click();
    await sleep(400);
    await open(2);
    const checked = dialog()?.querySelector('input[name="position"]:checked')?.value;
    add('reopen shows a fresh form', !!dialog()?.querySelector('form') && !dialog()?.querySelector('[role="status"]'));
    add('reopen selects the new job\'s chip', checked === 'Front-end', checked);
    add('reopen puts focus inside the form', !!dialog()?.querySelector('form')?.contains(doc.activeElement), doc.activeElement?.tagName);
  } catch (e) {
    add('flow error', false, e.message);
  } finally {
    f.remove();
  }
  return { width, pass: out.every((r) => r[1]), fails: out.filter((r) => !r[1]).map((r) => `${r[0]}: ${r[2]}`), checks: out.length };
}

/** Runs one section's checks at the given widths. */
export async function gate(section, widths = WIDTHS, opts = {}) {
  const spec = SECTIONS[section];
  if (!spec) throw new Error(`no section ${section}`);
  const raf = await rafPerSecond();
  const report = { raf, frozen: raf === 0 };
  for (const w of widths) {
    const { f, win, doc } = await loadFrame(opts.route ?? spec.route, w, opts.height);
    try {
      const h = helpers(doc, win, w);
      if (spec.prepare) await spec.prepare(h);
      const results = spec.checks(h);
      const over = overflowing(doc, win);
      results.push(['no leaf past the viewport', over.length === 0, over.slice(0, 4).join(' | ') || 'ok']);
      const fails = results.filter((r) => !r[1]).map((r) => `${r[0]}: ${r[2]}`);
      report[w] = { pass: fails.length === 0, checks: results.length, fails };
    } catch (e) {
      report[w] = { pass: false, fails: [`probe error: ${e.message}`] };
    } finally {
      f.remove();
    }
  }
  return report;
}
