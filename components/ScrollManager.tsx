import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { focusTarget } from '../lib/focus';
import { scrollToElement, scrollToY } from '../lib/scroll';

/** How long to keep looking for a hash target while a lazy route mounts. */
const HASH_RETRY_INTERVAL_MS = 50;
const HASH_RETRY_LIMIT = 20;

/**
 * How long to hold a hash target in place after a landing from another route.
 * The new page grows after its first paint (pin runways, images, fonts), so one
 * scroll lands too high or too low. The hold measures the target again and
 * corrects the scroll until the time ends or the reader scrolls.
 */
const HOLD_INTERVAL_MS = 100;
const HOLD_LIMIT_MS = 3000;
const HOLD_TOLERANCE_PX = 2;

/** Any of these from the reader ends the hold, so it never fights a scroll. */
const READER_INPUT = ['wheel', 'touchstart', 'pointerdown', 'keydown'] as const;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** The page offset where a scroll puts `el`: the header clearance plus its own margin. */
const landingTop = (el: HTMLElement) =>
  (parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0) +
  (parseFloat(getComputedStyle(el).scrollMarginTop) || 0);

/**
 * Puts the viewport where a new route expects it. Pageview reporting is not
 * here — it belongs with whichever page knows its own title (see
 * lib/pageMeta.ts).
 *
 * Renders nothing.
 */
const ScrollManager = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const last = useRef({ pathname: location.pathname, search: location.search });
  const firstRun = useRef(true);

  useEffect(() => {
    const isFirst = firstRun.current;
    firstRun.current = false;
    const prev = last.current;
    last.current = { pathname: location.pathname, search: location.search };

    // When only the query string changes (the Work filters and pages), the
    // reader stays on the same page. The page sets its own scroll, so this
    // does not go to the top. A link to the same URL still goes to the top.
    const queryOnly = prev.pathname === location.pathname && prev.search !== location.search && !location.hash;
    if (queryOnly) return;

    // POP is the back/forward button: the browser restores the previous offset
    // itself, and scrolling here would fight it. The first load also reports
    // POP, but it is not a back step. A hash on the first load still needs its
    // scroll, because the browser looks for the target before React draws it.
    if (navigationType === 'POP' && !(isFirst && location.hash)) return;

    // Both scrolls go through `lib/scroll`, so the smooth-scroll layer learns the
    // new position and the next wheel notch does not jump back from the old one.
    if (!location.hash) {
      scrollToY(0, false);
      // Move the focus to the new page, so the next Tab starts at its top.
      focusTarget(document.querySelector<HTMLElement>('main'));
      return;
    }

    // The target may live inside a lazy chunk that hasn't mounted yet. Poll for
    // it on a timer — rAF is the wrong tool here, since it stops firing in
    // backgrounded tabs and in the frozen-motion verification preview.
    const id = decodeURIComponent(location.hash.slice(1));
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const samePage = !isFirst && prev.pathname === location.pathname;
    let attempts = 0;
    let timer: number | undefined;
    let holdTimer: number | undefined;

    const endHold = () => {
      if (holdTimer !== undefined) window.clearTimeout(holdTimer);
      holdTimer = undefined;
      READER_INPUT.forEach((type) => window.removeEventListener(type, endHold));
    };

    const hold = (el: HTMLElement) => {
      const start = Date.now();
      READER_INPUT.forEach((type) => window.addEventListener(type, endHold, { passive: true }));
      const check = () => {
        const off = el.getBoundingClientRect().top - landingTop(el);
        // At the page end the target cannot reach the top. That is its final place.
        const atEnd = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 1;
        if (Math.abs(off) > HOLD_TOLERANCE_PX && !(off > 0 && atEnd)) scrollToElement(el, false);
        if (Date.now() - start < HOLD_LIMIT_MS) holdTimer = window.setTimeout(check, HOLD_INTERVAL_MS);
        else endHold();
      };
      holdTimer = window.setTimeout(check, HOLD_INTERVAL_MS);
    };

    const tryScroll = () => {
      const el = document.getElementById(id);
      if (!el) {
        if (++attempts < HASH_RETRY_LIMIT) timer = window.setTimeout(tryScroll, HASH_RETRY_INTERVAL_MS);
        return;
      }
      focusTarget(el);
      // An anchor on the page already on screen can glide: its layout is final.
      // A landing from another route, or a first load, jumps and then holds the
      // target while the new page grows. A full-page glide there reads as jank.
      if (samePage) {
        scrollToElement(el, !reduced);
        return;
      }
      scrollToElement(el, false);
      hold(el);
    };
    tryScroll();

    return () => {
      if (timer !== undefined) window.clearTimeout(timer);
      endHold();
    };
  }, [location.key, location.hash, navigationType]);

  return null;
};

export default ScrollManager;
