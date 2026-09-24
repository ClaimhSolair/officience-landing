import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { cancelFrame, frame } from 'framer-motion';
import { MOTION, useMotionEnabled } from '../lib/motion';
import { SmoothScrollContext, registerScroller } from '../lib/scroll';

/**
 * Wheel smoothing for the whole app (Lenis).
 *
 * The team found the page "stiff and jagged" (2026-09-24). The cause was not one
 * effect: nothing smoothed the wheel, so each notch moved the page, and every
 * scroll-linked effect on it, in one step. Springs on single effects could not
 * fix that — the page itself still stepped. Lenis eases the scroll position, so
 * the page and every scrub derived from it glide together.
 *
 * Limits, all on purpose:
 *  - Only the wheel and the trackpad are smoothed. Touch stays native
 *    (`syncTouch: false`), because phones already scroll with momentum.
 *  - It runs only when motion is on (`useMotionEnabled`), so a visitor who asks
 *    for reduced motion keeps native scroll. `MOTION.smoothScroll` switches it
 *    off in one line.
 *  - Lenis steps inside framer-motion's own frame loop, not a second
 *    requestAnimationFrame loop, so the scroll and the MotionValues read from it
 *    update in the same frame.
 *
 * Nested scroll areas (the menu, the survey) carry `data-lenis-prevent`, so the
 * wheel scrolls them natively.
 */
const SmoothScroll: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const motionOn = useMotionEnabled();
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!motionOn || !MOTION.smoothScroll) return;

    const lenis = new Lenis({ smoothWheel: true, syncTouch: false, autoRaf: false });
    const step = ({ timestamp }: { timestamp: number }) => lenis.raf(timestamp);
    frame.update(step, true);
    registerScroller(lenis);
    setActive(true);

    return () => {
      cancelFrame(step);
      registerScroller(null);
      lenis.destroy();
      setActive(false);
    };
  }, [motionOn]);

  return <SmoothScrollContext.Provider value={active}>{children}</SmoothScrollContext.Provider>;
};

export default SmoothScroll;
