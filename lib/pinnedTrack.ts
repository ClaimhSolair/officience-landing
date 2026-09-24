import { useLayoutEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type RefObject } from 'react';
import { useScroll, useTransform, type MotionValue } from 'framer-motion';
import { HEADER_H, useScrub } from './motion';
import { dragScrollTo, scrollToY } from './scroll';

/**
 * The pinned horizontal track: a section pins under the header, and the page's
 * vertical scroll moves a row of cards sideways.
 *
 * Proven Results (home page) and Our Journey (About Us) both use it, so the two
 * sections move the same way (user, 2026-09-24). The logic came out of
 * `components/ProvenResults.tsx` with no change in behaviour.
 *
 * The parts:
 *  - `measureTrack` measures the track and returns its geometry, or `null` when
 *    the section must keep its static rail.
 *  - `usePinnedTrack` measures on mount, on resize and on each box change, and
 *    gives the smoothed progress and the track's `x`.
 *  - `useCardEntrance` gives a card its fade and lift as it comes in.
 *  - `useTrackDrag` lets a pointer drag the pinned track. The drag moves the
 *    page scroll, so the scroll stays the one source of the track position.
 */

/** What one pinned track needs to know about itself, all of it measured. */
export interface TrackGeometry {
  /** How far the track travels, in screen pixels. */
  travel: number;
  /** Proportional reduction (<=1) so the whole pinned column clears the frame. */
  scale: number;
  /** The scaled track's height, reserved on the wrapper so the reduction shrinks
   *  the column's layout and not merely its paint. */
  trackH: number;
  /** Total height of the scroll wrapper, in pixels. */
  height: number;
  /** Wrapper progress where the opening hold ends and the track starts to move. */
  holdEnd: number;
  /** Wrapper progress where the track stops. The dwell runs from here to 1. */
  scrubEnd: number;
  /**
   * Per-card `[start, end]` in wrapper progress, or `null` for a card already on
   * screen when the pin engages — those are shown settled, not animated in.
   */
  windows: ([number, number] | null)[];
}

/**
 * The floor below which the track is too small to pin for, so the section keeps
 * the swipe rail instead. Low enough that the pin engages on any real laptop.
 */
export const MIN_SCALE = 0.5;
/** Track pixels per pixel of scroll — nava runs about 1.14. */
export const RATE = 1.15;
/**
 * The track holds still for the first slice of the runway, so the first card is
 * fully read before anything rolls — the arrival the review asked for, "only once
 * the first card is fully on screen". The per-card windows map through the same
 * hold so a card's fade begins exactly as it enters, not before.
 */
export const HOLD = 0.08;
/**
 * The track holds still on its last card before the pin releases, so the last
 * card is read before the next section arrives (user, 2026-09-24). A fraction of
 * the viewport height: 0.3 is about 320px of scroll at 1080, three wheel notches.
 * The dwell also lets the smoothed track land while the section is still pinned.
 */
export const DWELL = 0.3;

/**
 * Measures the track. Everything here is layout geometry (`offsetLeft`,
 * `offsetWidth`), never `getBoundingClientRect`, because layout offsets ignore
 * transforms — so a measurement taken while the track is mid-scrub returns the
 * same answer as one taken at rest.
 *
 * `chrome` is the height that the pinned column needs beside the track.
 */
export const measureTrack = (track: HTMLElement, chrome: number): TrackGeometry | null => {
  const kids = Array.from(track.children) as HTMLElement[];
  if (kids.length < 2) return null;

  const cs = getComputedStyle(track);
  const inner = track.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
  const cardH = kids[0].offsetHeight;
  if (!inner || !cardH) return null;

  // The whole pinned column must clear the frame, not just the card: the header
  // block, the section paddings and the dots row take vertical space beside the
  // track (`chrome`, measured), and the frame is the viewport less the header it
  // pins beneath. Budget against the tallest header (119, 3xl) so the check never
  // promises a fit the 3xl bar would eat. Below MIN_SCALE the track is too small
  // to pin for, so the section keeps the swipe rail instead.
  const frame = window.innerHeight - HEADER_H.xl3;
  const scale = Math.min(1, (frame - chrome) / cardH);
  if (scale < MIN_SCALE) return null;
  // Reserved on the wrapper so the column's layout height drops with the scale,
  // not just its paint. Without this the column stays cardH tall and overflows.
  const trackH = cardH * scale;

  const origin = kids[0].offsetLeft;
  const last = kids[kids.length - 1];
  const contentW = (last.offsetLeft + last.offsetWidth - origin) * scale;
  const travel = contentW - inner;
  if (travel <= 0) return null;

  // The runway in scroll pixels: the opening hold and the scrub keep their earlier
  // lengths (travel / RATE together), and the dwell is added after them. So the
  // track moves at the same rate as before, and only the end is longer.
  const scrubPx = travel / RATE;
  const runway = scrubPx + DWELL * window.innerHeight;
  const holdEnd = (HOLD * scrubPx) / runway;
  const scrubEnd = scrubPx / runway;
  const moving = scrubEnd - holdEnd;

  // A card already within the frame when the pin engages gets no window — it is
  // rendered settled. The rest open as their left edge crosses the right edge of
  // the frame and close once they are most of the way in, mapped into the moving
  // part of the runway so the fade begins exactly as the track brings the card
  // into view.
  const windows = kids.map((kid) => {
    const left = (kid.offsetLeft - origin) * scale;
    if (left <= inner) return null;
    const startRaw = (left - inner) / travel;
    const start = holdEnd + moving * startRaw;
    const span = Math.max(0.1, (kid.offsetWidth * scale * 0.7) / travel) * moving;
    const end = Math.min(scrubEnd, start + span);
    return [start, Math.max(end, start + 0.05)] as [number, number];
  });

  return { travel, scale, trackH, height: window.innerHeight + runway, holdEnd, scrubEnd, windows };
};

interface PinnedTrackRefs {
  /** The tall scroll wrapper. Its progress drives the track. */
  wrapRef: RefObject<HTMLElement>;
  /** The pinned column. Its vertical padding counts as chrome. */
  columnRef: RefObject<HTMLElement>;
  /** The track: its children are the cards. */
  trackRef: RefObject<HTMLElement>;
  /** A heading block pinned in the same column, if there is one. */
  headerRef?: RefObject<HTMLElement>;
}

/**
 * Measures the track and drives it. `wantsPin` is true when the section may pin
 * (motion on, a wide screen). `pinned` is true only after a measurement exists,
 * so the first render always equals the static fallback.
 *
 * It re-measures on mount, on resize, and whenever the track's own box changes.
 * The last of those catches the track settling after the web fonts swap and the
 * card images decode. Until a measurement exists the wrapper has no extra height
 * at all, so the page is never briefly taller than it should be.
 */
export const usePinnedTrack = (wantsPin: boolean, refs: PinnedTrackRefs) => {
  const { wrapRef, columnRef, trackRef, headerRef } = refs;
  const [geom, setGeom] = useState<TrackGeometry | null>(null);

  useLayoutEffect(() => {
    if (!wantsPin) {
      setGeom(null);
      return;
    }
    const track = trackRef.current;
    const col = columnRef.current;
    const header = headerRef ? headerRef.current : null;
    if (!track || !col || (headerRef && !header)) return;

    // `chrome` is the persistent non-track height when pinned: the column's own
    // top+bottom padding, plus the header block and its bottom margin when the
    // column pins one. Computed from those parts directly rather than as
    // `column - track`, so it stays invariant whether or not the track is
    // currently pinned or a dots row is rendered.
    const read = () => {
      const cs = getComputedStyle(col);
      let chrome = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
      if (header) chrome += header.offsetHeight + parseFloat(getComputedStyle(header).marginBottom);
      setGeom(measureTrack(track, Math.max(0, chrome)));
    };
    read();

    const ro = new ResizeObserver(read);
    ro.observe(track);
    ro.observe(col);
    if (header) ro.observe(header);
    window.addEventListener('resize', read);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', read);
    };
  }, [wantsPin]);

  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ['start start', 'end end'] });
  // Smoothed once, and both the track and the cards read this one value, so the
  // cards cannot drift from the track on a fast scroll. Without smoothing the
  // track is welded to the wheel and stops dead.
  const progress = useScrub(scrollYProgress);
  // Still until `holdEnd` so the first card is read before the roll, and still
  // again after `scrubEnd` for the dwell on the last card.
  const trackX = useTransform(
    progress,
    [geom?.holdEnd ?? HOLD, geom?.scrubEnd ?? 1],
    [0, -(geom?.travel ?? 0)],
    { clamp: true },
  );

  return { geom, pinned: wantsPin && geom !== null, progress, trackX };
};

/**
 * A card's arrival while pinned: the picture fades from 0.35 and the card lifts
 * 32px into place over its window. No zoom — the review removed it. Both hooks
 * run unconditionally, so the hook count stays stable when a resize flips a card
 * between windowed and settled.
 */
export const useCardEntrance = (progress: MotionValue<number>, win?: [number, number] | null) => {
  const [start, end] = win ?? [0, 1];
  const settle = start + (end - start) * 0.8;
  const imgOpacity = useTransform(progress, [start, settle], [0.35, 1], { clamp: true });
  const cardY = useTransform(progress, [start, end], [32, 0], { clamp: true });
  return { imgOpacity, cardY };
};

/** A move shorter than this is a click or a tap, not a drag. */
const DRAG_START = 4;
/** How far a release glides: the release speed times this many milliseconds. */
const GLIDE_MS = 250;

/**
 * Drag for a pinned track. A drag moves the page scroll, and the scroll moves
 * the track, so the drag cannot disagree with the pin: the track follows the
 * pointer 1:1, and the scroll stays inside the track's moving range.
 *
 * The track moves `travel` px while the page scrolls `(scrubEnd - holdEnd)` of
 * the runway, so one track pixel is `(1 - HOLD) / RATE` scroll pixels.
 *
 * Mouse, pen and touch all use pointer events. Give the track
 * `touch-action: pan-y`: a vertical swipe then scrolls the page natively, and a
 * horizontal swipe comes here. A release glides on through the smooth-scroll
 * layer at the release speed.
 */
export const useTrackDrag = (geom: TrackGeometry | null, wrapRef: RefObject<HTMLElement>) => {
  const drag = useRef<{
    id: number;
    x0: number;
    y0: number;
    moved: boolean;
    lastX: number;
    lastT: number;
    v: number;
  } | null>(null);
  const [dragging, setDragging] = useState(false);

  /** The page scroll range where the track moves, and scroll px per track px. */
  const scale = () => {
    const wrap = wrapRef.current;
    if (!wrap || !geom) return null;
    const runway = geom.height - window.innerHeight;
    const top = wrap.getBoundingClientRect().top + window.scrollY;
    const from = top + geom.holdEnd * runway;
    const to = top + geom.scrubEnd * runway;
    return { from, to, perPx: (to - from) / geom.travel };
  };
  const clamp = (y: number, s: { from: number; to: number }) => Math.min(s.to, Math.max(s.from, y));

  const onPointerDown = (e: ReactPointerEvent<HTMLElement>) => {
    if (!geom || (e.pointerType === 'mouse' && e.button !== 0)) return;
    drag.current = {
      id: e.pointerId,
      x0: e.clientX,
      y0: window.scrollY,
      moved: false,
      lastX: e.clientX,
      lastT: e.timeStamp,
      v: 0,
    };
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.x0;
    if (!d.moved) {
      if (Math.abs(dx) < DRAG_START) return;
      d.moved = true;
      setDragging(true);
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    const s = scale();
    if (!s) return;
    const dt = e.timeStamp - d.lastT;
    if (dt > 0) d.v = 0.8 * ((e.clientX - d.lastX) / dt) + 0.2 * d.v;
    d.lastX = e.clientX;
    d.lastT = e.timeStamp;
    // A drag to the right shows earlier cards, so the page scrolls up.
    dragScrollTo(clamp(d.y0 - dx * s.perPx, s));
  };

  const endDrag = (e: ReactPointerEvent<HTMLElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    drag.current = null;
    if (!d.moved) return;
    setDragging(false);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    const s = scale();
    // A cancelled pointer (the browser took the gesture) does not glide.
    if (!s || e.type === 'pointercancel' || Math.abs(d.v) < 0.05) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    scrollToY(clamp(window.scrollY - d.v * GLIDE_MS * s.perPx, s), true);
  };

  return {
    dragging,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
    },
  };
};
