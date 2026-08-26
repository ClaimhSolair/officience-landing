import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * Motion tokens for the Sept-2026 pass. Every duration and curve here was fitted
 * from a per-frame capture of the reference site it names — the derivations and
 * the mobile variants live in `.claude/motion-catalog.md`.
 *
 * Two rules this file exists to enforce:
 *  - durations have exactly one home, because `MenuOverlay` times a follow-up
 *    scroll against the panel's own transition and drifts apart otherwise;
 *  - scroll-scrubs need `useReducedMotion()` themselves. `MotionConfig` only
 *    reaches framer-motion's animations, and a MotionValue written by
 *    `useTransform` is not one of them.
 */

/** Milliseconds are the source; seconds are derived for framer-motion. */
export const MS = {
  /** oma-genera's panel: 424ms open, 399ms close. One token both ways. */
  menu: 400,
  /** nexvio's section reveal: ~980ms to rest. */
  reveal: 1000,
  /** Header glass cross-fade (self-specified — no reference). */
  glass: 300,
  /** oma-genera's label roll, settling by ~400ms. */
  roll: 250,
  /** salient's odometer. Its roll never fired under automation, so this is the
   *  one duration in the catalog calibrated by eye rather than measured. */
  counter: 1200,
  /** Per-digit offset, so a multi-digit number lands left to right. */
  counterStagger: 80,
} as const;

export const SEC = {
  menu: MS.menu / 1000,
  reveal: MS.reveal / 1000,
  glass: MS.glass / 1000,
  roll: MS.roll / 1000,
  counter: MS.counter / 1000,
  counterStagger: MS.counterStagger / 1000,
} as const;

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
} as const;

/** The same curves for CSS transitions, where framer-motion isn't driving. */
export const CSS_EASE = {
  menu: 'cubic-bezier(0.83, 0, 0.17, 1)',
  reveal: 'cubic-bezier(0.33, 1, 0.68, 1)',
  roll: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
} as const;

/**
 * The one entrance every timed reveal uses. `once` because a section that
 * re-animates on every pass turns a long page into a flicker reel.
 */
export const reveal = {
  initial: { y: 40, opacity: 0 },
  whileInView: { y: 0, opacity: 1 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: SEC.reveal, ease: EASE.reveal },
} as const;

/**
 * Per-section switches. Motion is additive to an already-approved layout, so
 * every effect must be removable in one line without unpicking its component.
 */
export const MOTION = {
  headerGlass: true,
  flower: true,
  aboutStack: true,
  photoZoom: true,
  manifesto: true,
  counters: true,
  services: true,
  approach: true,
  work: true,
} as const;

/**
 * Sticky offset for pinned cards, in the header's own heights. The references
 * all use a round 100px; ours has to clear a bar that is 69 / 113 / 119px tall,
 * so a copied constant would tuck the card under it at two breakpoints.
 */
export const STICKY_TOP = 'top-[69px] lg:top-[113px] 3xl:top-[119px]';

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

export const useMotionEnabled = (): boolean => {
  const reduced = useReducedMotion();
  const enabled = MOTION_OVERRIDE ? MOTION_OVERRIDE === 'on' : !reduced;

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
