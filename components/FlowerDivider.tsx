import React from 'react';
import { motion } from 'framer-motion';
import { ASSETS } from '../assets';
import { EASE, MOTION, SEC, useMotionEnabled } from '../lib/motion';

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
 * The mark **fades in** once, as the band scrolls up under the hero — the review
 * replaced moonx's scale-and-spin scrub with a plain cross-fade
 * (`.claude/motion-catalog.md`, item 3): a calm settle rather than a zoom-through,
 * completing within about one scroll of leaving the hero. Divergence from the
 * measured moonx law, recorded there. Opacity only, so the band's fixed heights
 * are untouched, nothing below it moves, and no anchor shifts.
 */
const FlowerDivider: React.FC = () => {
  const motionOn = useMotionEnabled();
  const fading = MOTION.flower && motionOn;

  return (
    <div
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
        initial={fading ? { opacity: 0 } : false}
        whileInView={fading ? { opacity: 1 } : undefined}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: SEC.revealSlow, ease: [...EASE.reveal] }}
      />
    </div>
  );
};

export default FlowerDivider;
