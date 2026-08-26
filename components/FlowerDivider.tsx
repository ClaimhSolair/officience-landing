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
 * The mark grows **and turns** as the band crosses the viewport, reaching full
 * size square-on as the band centres — moonx's zoom-through, adapted
 * (`.claude/motion-catalog.md`, item 3). Two deliberate divergences, both
 * recorded there: moonx scales without rotating, but this mark is a pinwheel and
 * a pinwheel that never turns wastes its own metaphor; and moonx drops the
 * effect entirely at 390, where we keep a gentler version of it rather than
 * leaving the phone with a dead band.
 *
 * Transform only, so the band's fixed heights are untouched, nothing below it
 * moves, and no anchor shifts.
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

  // The phone gets a shorter throw on both axes: the mark is 199px there against
  // 748 at 1920, so the same 0.45 start would have it arrive from almost nothing,
  // and a two-thirds turn at that size reads as a fidget rather than a flourish.
  const scale = useTransform(scrollYProgress, [0, 1], wide ? [0.45, 1] : [0.75, 1]);
  const rotate = useTransform(scrollYProgress, [0, 1], wide ? [-65, 0] : [-30, 0]);
  const scrubbing = MOTION.flower && motionOn;

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
        style={scrubbing ? { scale, rotate } : undefined}
      />
    </div>
  );
};

export default FlowerDivider;
