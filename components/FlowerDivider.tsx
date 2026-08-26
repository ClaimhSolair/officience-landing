import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ASSETS } from '../assets';
import { MOTION, useMinWidth, useMotionEnabled } from '../lib/motion';

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
 * The mark grows as the band crosses the viewport, reaching full size as the
 * band centres — moonx's zoom-through, adapted (`.claude/motion-catalog.md`,
 * item 3). Scale only: the band's fixed heights are untouched, so nothing below
 * it moves and no anchor shifts. Desktop only, because moonx drops the effect
 * at 390 — its hero is a static band there, with no scale change at any scroll
 * position — and reference behaviour is the spec per breakpoint.
 */
const FlowerDivider: React.FC = () => {
  const bandRef = useRef<HTMLDivElement>(null);
  const motionOn = useMotionEnabled();
  const wide = useMinWidth(1024);

  // Hooks stay unconditional; only the binding is gated. A scrub has to stop
  // being bound rather than merely hidden — `MotionConfig` does not reach a
  // MotionValue, so reduced motion is handled here or not at all.
  const { scrollYProgress } = useScroll({
    target: bandRef,
    offset: ['start end', 'center center'],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [0.45, 1]);
  const scrubbing = MOTION.flower && wide && motionOn;

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
        style={scrubbing ? { scale } : undefined}
      />
    </div>
  );
};

export default FlowerDivider;
