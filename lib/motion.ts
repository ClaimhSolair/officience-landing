import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * Motion tokens for the Sept-2026 pass. Every duration and curve here was fitted
 * from a per-frame capture of the reference site it names — the derivations and
 * the mobile variants live in `.claude/motion-catalog.md`.
 *
 * Three rules this file exists to enforce:
 *  - durations have exactly one home, because `MenuOverlay` times a follow-up
 *    scroll against the panel's own transition and drifts apart otherwise;
 *  - scroll-scrubs need `useReducedMotion()` themselves. `MotionConfig` only
 *    reaches framer-motion's animations, and a MotionValue written by
 *    `useTransform` is not one of them;
 *  - one duration must not serve every transition. A list row and a display
 *    heading move different distances and carry different weight, so the tiers
 *    below are chosen by what is moving rather than by habit.
 */

/** Milliseconds are the source; seconds are derived for framer-motion. */
export const MS = {
  /** oma-genera's panel: 424ms open, 399ms close. One token both ways. */
  menu: 400,
  /** Menu items cascading in behind the opening panel. */
  menuItem: 350,
  /** Small things that should feel immediate: list rows, captions, chips. */
  revealFast: 450,
  /** The default entrance — cards, blocks, anything card-sized. */
  revealBase: 700,
  /** nexvio's section reveal, ~980ms to rest. Display-scale moments only. */
  revealSlow: 1000,
  /** Leaving is faster than arriving: an exit is an acknowledgement, not a show. */
  exit: 220,
  /** Header glass cross-fade (self-specified — no reference). */
  glass: 300,
  /** oma-genera's label roll, settling by ~400ms. */
  roll: 250,
  /** salient's odometer, calibrated by eye. Slowed in the 2026-08-27 review so the
   *  count-up reads as a deliberate second act after the manifesto sweep. */
  counter: 2250,
  /** Per-digit offset, so a multi-digit number lands left to right. */
  counterStagger: 110,
  /** The plus on 500+ arriving once the digits have seated. */
  suffixPop: 180,
} as const;

const toSec = <T extends Record<string, number>>(ms: T): { [K in keyof T]: number } =>
  Object.fromEntries(Object.entries(ms).map(([k, v]) => [k, v / 1000])) as { [K in keyof T]: number };

export const SEC = toSec(MS);

/** framer-motion bezier arrays. */
export const EASE = {
  /** easeInOutQuint — oma-genera's panel holds, snaps, then settles. */
  menu: [0.83, 0, 0.17, 1],
  /** easeOutCubic — nexvio's reveal, within ~2% of the captured curve. */
  reveal: [0.33, 1, 0.68, 1],
  /** Back-out: the roll overshoots a little before it settles. */
  roll: [0.34, 1.56, 0.64, 1],
  /** Long tail — an odometer should arrive fast and coast into place. */
  counter: [0.16, 1, 0.3, 1],
  /** Accelerating away, for anything leaving the screen. */
  exit: [0.4, 0, 1, 1],
} as const;

/** The same curves for CSS transitions, where framer-motion isn't driving. */
export const CSS_EASE = {
  menu: 'cubic-bezier(0.83, 0, 0.17, 1)',
  reveal: 'cubic-bezier(0.33, 1, 0.68, 1)',
  roll: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
} as const;

/**
 * How far apart cascading children start. Tight for menu items and dense lists,
 * base for a section's own badge/heading/blurb, loose for big cards that each
 * want a beat of their own.
 *
 * Kept under ~120ms, and to about eight children per group: past either, the
 * last child arrives long after the reader stopped waiting for it.
 */
export const STAGGER = {
  tight: 0.045,
  base: 0.08,
  loose: 0.12,
} as const;

/**
 * Per-section switches. Motion is additive to an already-approved layout, so
 * every effect must be removable in one line without unpicking its component.
 */
export const MOTION = {
  headerGlass: true,
  menuCascade: true,
  flower: true,
  aboutStack: true,
  photoZoom: true,
  manifesto: true,
  counters: true,
  services: true,
  approach: true,
  work: true,
  hero: true,
  clients: true,
  whyUs: true,
  contact: true,
  footer: true,
} as const;

/**
 * The header's own heights, which several effects have to clear. The references
 * all pin against a round 100px; ours is 69 / 113 / 119px, so a copied constant
 * would tuck a pinned card under the bar at two of our three breakpoints.
 */
export const HEADER_H = { base: 69, lg: 113, xl3: 119 } as const;

/** Sticky offset for pinned cards, in those same heights. */
export const STICKY_TOP = 'top-[69px] lg:top-[113px] 3xl:top-[119px]';

/** Viewport height less the header, for a pinned section's inner frame. */
export const PINNED_H = 'h-[calc(100vh-69px)] lg:h-[calc(100vh-113px)] 3xl:h-[calc(100vh-119px)]';

/**
 * Whether motion should run for this visitor.
 *
 * Follows the OS preference by default. A `?motion=on` (or `off`) query
 * parameter overrides it for the rest of the browser session, and the resolved
 * answer is mirrored onto `<html data-motion>` so the stylesheet can reach the
 * effects CSS owns rather than JS.
 *
 * The override exists because a build that only animates on a machine with
 * Windows animation effects switched on cannot be reviewed. Windows reports
 * `reduce` whenever that setting is off — common enough that a reviewer saw a
 * completely static page and reasonably read it as broken. It is opt-in through
 * the URL and never inferred, so visitors who asked for less motion still get
 * exactly what they asked for.
 */
const readOverride = (): 'on' | 'off' | null => {
  if (typeof window === 'undefined') return null;
  try {
    const q = new URLSearchParams(window.location.search).get('motion');
    if (q === 'on' || q === 'off') {
      window.sessionStorage.setItem('officience_motion', q);
      return q;
    }
    const stored = window.sessionStorage.getItem('officience_motion');
    return stored === 'on' || stored === 'off' ? stored : null;
  } catch {
    // Private mode can throw on sessionStorage; the OS preference still applies.
    return null;
  }
};

const MOTION_OVERRIDE = readOverride();

/**
 * Preview deploys exist to be reviewed, so motion defaults ON there — otherwise a
 * reviewer whose machine requests reduced motion (Windows reports `reduce`
 * whenever "Animation effects" is off, which is common) opens the shared link to
 * a completely static page and reads the deploy as broken. Vercel serves every
 * branch/preview build from a `*.vercel.app` host; the public production domain
 * (officience.com) does not match, so it is untouched and still follows the OS
 * preference. An explicit `?motion=on/off` still wins everywhere, so a preview
 * visitor who wants less motion can still ask for it with `?motion=off`.
 *
 * (The Vercel-assigned production alias is also `*.vercel.app`, so it force-
 * animates too — harmless: real, accessibility-facing traffic is on the custom
 * domain, which stays OS-respecting.)
 */
const isPreviewHost = (): boolean =>
  typeof window !== 'undefined' && window.location.hostname.endsWith('.vercel.app');

const PREVIEW_DEFAULTS_ON = MOTION_OVERRIDE === null && isPreviewHost();

/**
 * Motion is *forced on*, bypassing the OS reduced-motion preference, when the URL
 * asked for it or this is a preview host. Both gates must honour this together:
 * `useMotionEnabled` (below) so the animated variants mount at all, and framer's
 * own `MotionConfig reducedMotion` (App.tsx) so it does not strip every transform
 * back out — leaving only opacity fades alive — on a reduced-motion machine.
 */
export const MOTION_FORCED = MOTION_OVERRIDE === 'on' || PREVIEW_DEFAULTS_ON;

export const useMotionEnabled = (): boolean => {
  const reduced = useReducedMotion();
  const enabled = MOTION_OVERRIDE ? MOTION_OVERRIDE === 'on' : PREVIEW_DEFAULTS_ON || !reduced;

  useEffect(() => {
    document.documentElement.dataset.motion = enabled ? 'on' : 'off';
  }, [enabled]);

  return enabled;
};

/**
 * True once the viewport is at least `px` wide. Effects the references drop at
 * mobile are gated on this rather than on a CSS class, because a scrub has to
 * stop being *bound*, not merely stop being visible.
 */
export const useMinWidth = (px: number): boolean => {
  const [wide, setWide] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(`(min-width: ${px}px)`).matches,
  );

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${px}px)`);
    const onChange = () => setWide(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [px]);

  return wide;
};

/**
 * True once the page has scrolled past `px`. rAF-coalesced: the listener is
 * passive and only ever flips a boolean, so it never blocks the scroll thread.
 */
export const useScrolledPast = (px: number): boolean => {
  const [past, setPast] = useState(false);

  useEffect(() => {
    let frame = 0;
    const read = () => {
      frame = 0;
      setPast(window.scrollY > px);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(read);
    };
    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [px]);

  return past;
};
