import { createContext, useContext } from 'react';

/**
 * Page scrolling for the whole app, with or without the smooth-scroll layer.
 *
 * `components/SmoothScroll.tsx` registers a Lenis instance here when motion is
 * on. Everything else scrolls the page through these helpers, so no caller
 * needs to know whether Lenis is present:
 *  - a native scroll under Lenis leaves Lenis with a stale position, and the
 *    next wheel notch then jumps back from it;
 *  - a scroll while Lenis is stopped (an open modal) needs `force`;
 *  - Lenis clamps every target to a cached page height, which it measures only
 *    250ms after a resize. A modal lock makes the body `position: fixed`, so the
 *    cached height falls to one viewport and the limit to 0. The unlock then
 *    restores the body and scrolls back at once, before Lenis measures again:
 *    the target clamped to 0 and the page jumped to the hero. So each helper
 *    tells Lenis to measure again (`resize`) before it scrolls. This also
 *    protects a cross-page anchor, which scrolls just after the new page
 *    mounts, when the cached height can still be the old page's.
 *
 * This file does not import Lenis or `lib/motion.ts`, so `lib/modal.ts` and
 * `components/navigation.ts` can use it without a cycle.
 */

/** The part of Lenis that the helpers use. */
export interface PageScroller {
  scrollTo(
    target: number | HTMLElement,
    options?: { immediate?: boolean; force?: boolean },
  ): void;
  stop(): void;
  start(): void;
  /** Measures the page again, so `scrollTo` clamps to the current height. */
  resize(): void;
}

let active: PageScroller | null = null;

export const registerScroller = (scroller: PageScroller | null) => {
  active = scroller;
};

/**
 * True while the smooth-scroll layer is active. It starts false and becomes
 * true only after Lenis mounts, so the first render always equals the fallback.
 */
export const SmoothScrollContext = createContext(false);

export const useSmoothScrollActive = (): boolean => useContext(SmoothScrollContext);

/** Scrolls the page to `top`. `smooth: false` jumps with no animation. */
export const scrollToY = (top: number, smooth: boolean) => {
  if (active) {
    active.resize();
    active.scrollTo(top, { immediate: !smooth, force: true });
    return;
  }
  window.scrollTo({ top, left: 0, behavior: (smooth ? 'smooth' : 'instant') as ScrollBehavior });
};

/**
 * Scrolls the page to `top` at once, for a pointer drag (`lib/pinnedTrack.ts`).
 * It does not tell Lenis to measure again: a drag does not change the page
 * height, and a measurement on every pointer move costs a layout read.
 */
export const dragScrollTo = (top: number) => {
  if (active) {
    active.scrollTo(top, { immediate: true, force: true });
    return;
  }
  window.scrollTo({ top, left: 0, behavior: 'instant' as ScrollBehavior });
};

/**
 * Scrolls the page so `el` sits at the top. Lenis and `scrollIntoView` both
 * subtract the element's `scroll-margin-top` and the page's `scroll-padding-top`
 * (the header height, index.html), so the target lands at the same place.
 */
export const scrollToElement = (el: HTMLElement, smooth: boolean) => {
  if (active) {
    active.resize();
    active.scrollTo(el, { immediate: !smooth, force: true });
    return;
  }
  el.scrollIntoView({ behavior: (smooth ? 'smooth' : 'instant') as ScrollBehavior, block: 'start' });
};

/** Stops wheel smoothing while an overlay locks the page. */
export const stopScroll = () => active?.stop();

/** Starts wheel smoothing again after the overlay releases the page. */
export const startScroll = () => active?.start();
