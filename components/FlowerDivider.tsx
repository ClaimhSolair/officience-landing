import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ASSETS } from '../assets';
import { MOTION, useMotionEnabled } from '../lib/motion';

/**
 * The breather between the hero and About Us: one large Officience flower,
 * centred on the light background. Figma 3137:1873 (1920: 748px mark in a
 * 1000px band) and 3147:6893 (390: 199px mark in a 522px band).
 *
 * The mark is a single-colour SVG whose petals are knock-outs, so the light
 * background shows through them — which is why the band's background has to be
 * the page background rather than white.
 *
 * Purely decorative, so it is hidden from assistive tech and never blocks paint.
 *
 * The mark **fades in on scroll**: its opacity is tied to the band's own scroll
 * progress, so it stays hidden while the band is below the fold and fills in only
 * as the reader scrolls it up into view — not the instant a pixel of the tall
 * band peeks on load, which is what a viewport-enter trigger did. Opacity only
 * (moonx's scale-and-spin scrub was dropped in review; divergence recorded in
 * `.claude/motion-catalog.md`, item 3), so the band's fixed heights are
 * untouched, nothing below it moves, and no anchor shifts. A scrub bypasses
 * MotionConfig, so the bind is gated on `motionOn` here.
 */
const FlowerDivider: React.FC = () => {
  const bandRef = useRef<HTMLDivElement>(null);
  const motionOn = useMotionEnabled();
  const fading = MOTION.flower && motionOn;

  // 0 while the band is below the fold; fills in over the middle of its transit,
  // reaching full opacity a little before the band centres — so it is settled by
  // the time it is comfortably in view, roughly one scroll after it appears.
  const { scrollYProgress } = useScroll({ target: bandRef, offset: ['start end', 'center center'] });
  const opacity = useTransform(scrollYProgress, [0.3, 0.8], [0, 1]);

  return (
    <div
      ref={bandRef}
      aria-hidden="true"
      className="flex h-[522px] items-center justify-center bg-bg-secondary lg:h-[850px] 3xl:h-[1000px]"
    >
      {/* Not lazy: on a 390-wide screen this band starts around 420px down, well
          inside the first viewport, so deferring it only buys a visible pop-in for
          a 2.6 KB file. The intrinsic dimensions keep its box reserved before the
          bytes land. */}
      <motion.img
        src={ASSETS.brand.flower}
        alt=""
        width={748}
        height={748}
        className="h-auto w-[199px] lg:w-[576px] 3xl:w-[748px]"
        decoding="async"
        referrerPolicy="no-referrer"
        style={fading ? { opacity } : undefined}
      />
    </div>
  );
};

export default FlowerDivider;
