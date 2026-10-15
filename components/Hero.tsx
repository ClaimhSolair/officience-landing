import React, { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue, type Variants } from 'framer-motion';
import { ASSETS } from '../assets';
import Button from './ui/Button';
import { HomeColumn, HOME_SUBTITLE } from './ui/HomeSection';
import { EASE, MOTION, SEC, STAGGER, useMotionEnabled, useScrub } from '../lib/motion';

/**
 * Figma 4285:7872, the hero of frame 4229:4651 (1440 wide, adapter 27a).
 *
 * The frame: a blue band 760 tall. The header covers its top 113px. The copy
 * is at the left and is centred in the 647px below the header. The five 3D
 * shapes are in a 580x564 box at left 860 and top 145, so the box touches the
 * right edge of the band.
 *
 * From lg, every value is the 1440 value times `--u` (adapter 27b). Two values
 * do not scale:
 *  - The band moves up under the header by `--header-h`, and its top padding is
 *    `--header-h`. The header is 113px from lg and 119px from fhd. Thus the copy
 *    area under the header is 647 x u at every step, and nothing goes under the
 *    header at lg or fhd.
 *  - The shapes box is anchored to the right edge of the band, as in the frame.
 *
 * The header is blue at all widths, and transparent on the hero from 1400
 * (ruling 24j). Both look the same on this blue band, so the hero moves up by
 * the full header height at all widths.
 *
 * Below lg there is no frame. These values are build choices that keep the
 * proportions of the frame (the headline uses the HOME_H2 sizes):
 *
 *   step       headline lead / rest       body    gaps   shapes box
 *   base       41/48 bold, 36/44 semi     16/26   20     300 wide (85% max)
 *   md 768     57/64 bold, 50/58 semi     20/30   24     420 wide
 *
 * Below lg the shapes box comes under the copy, against the right edge of the
 * screen. Thus the shapes never touch the copy. The ellipse goes past the right
 * edge of the box, as in the frame, and the band clips it.
 *
 * **The headline never animates.** It is the LCP element. The body, the button
 * and the shapes have an entrance, and the shapes drift up a little as the band
 * scrolls away.
 */

/**
 * The outer box of each shape node, in px of the 580x564 box (4285:7880-7884).
 * The file has the Figma crop, flip and turn baked in at this box (assets.ts),
 * so the CSS sets only the position and the size. `depth` is the scroll drift
 * in px, from the old hero (f3efdab).
 */
const SHAPE_BOX = { w: 580, h: 564 } as const;
const SHAPES = [
  { key: 'leaf', x: 378.09, y: 0, w: 186.966, h: 197.979, depth: 34 },
  { key: 'star', x: 130.35, y: 80.78, w: 190.998, h: 187.238, depth: 46 },
  { key: 'ellipse', x: 450.4, y: 284.67, w: 181.802, h: 179.906, depth: 30 },
  { key: 'ring', x: 52, y: 311, w: 202.928, h: 206.032, depth: 22 },
  { key: 'asterisk', x: 274.9, y: 397.2, w: 173.226, h: 174.893, depth: 58 },
] as const;

const pct = (v: number, of: number) => `${((v / of) * 100).toFixed(3)}%`;

const SHAPE_VARIANTS: Variants = {
  hidden: { opacity: 0, scale: 0.7 },
  shown: { opacity: 1, scale: 1, transition: { duration: SEC.revealBase, ease: [...EASE.roll] } },
};

const COPY_VARIANTS: Variants = {
  hidden: { y: 24, opacity: 0 },
  shown: { y: 0, opacity: 1, transition: { duration: SEC.revealFast, ease: [...EASE.reveal] } },
};

/**
 * One shape. The wrapper holds the position and the drift. The image holds the
 * entrance. Thus one element never changes between a style MotionValue and the
 * variants (CLAUDE.md, motion checks).
 */
const Shape: React.FC<{
  shape: (typeof SHAPES)[number];
  progress: MotionValue<number>;
  drifting: boolean;
}> = ({ shape, progress, drifting }) => {
  const y = useTransform(progress, [0, 1], [0, -shape.depth]);
  const file = ASSETS.hero.shapes[shape.key];
  const place: React.CSSProperties = {
    left: pct(shape.x, SHAPE_BOX.w),
    top: pct(shape.y, SHAPE_BOX.h),
    width: pct(shape.w, SHAPE_BOX.w),
    height: pct(shape.h, SHAPE_BOX.h),
  };
  return (
    <motion.div
      key={drifting ? 'drift' : 'still'}
      className="absolute"
      style={drifting ? { ...place, y } : place}
    >
      <motion.img
        src={file.url}
        width={file.w}
        height={file.h}
        alt=""
        variants={SHAPE_VARIANTS}
        decoding="async"
        referrerPolicy="no-referrer"
        className="block h-full w-full max-w-none"
      />
    </motion.div>
  );
};

const Hero: React.FC<{ onOpenSurvey: () => void }> = ({ onOpenSurvey }) => {
  const bandRef = useRef<HTMLElement>(null);
  const motionOn = useMotionEnabled();
  const animating = motionOn && MOTION.hero;
  // The splash screen is gone (user, 2026-10-09), so the entrance starts on mount.
  const state = 'shown';

  // The band is the target. It does not move, so the scroll progress is true.
  const { scrollYProgress } = useScroll({ target: bandRef, offset: ['start start', 'end start'] });
  const drift = useScrub(scrollYProgress);

  return (
    <section
      ref={bandRef}
      className="relative -mt-[var(--header-h)] overflow-hidden bg-bg-primary pt-[var(--header-h)] lg:h-[calc(var(--header-h)_+_647*var(--u))]"
    >
      <HomeColumn className="relative z-10 flex flex-col justify-center pt-[40px] md:pt-[64px] lg:h-full lg:pt-0">
        <div className="flex flex-col items-start gap-[20px] md:gap-[24px] lg:gap-[calc(32*var(--u))]">
          <h1 className="w-full font-sans font-semibold tracking-[-0.03em] text-white text-[36px] leading-[44px] md:text-[50px] md:leading-[58px] lg:w-[calc(924*var(--u))] lg:max-w-full lg:text-[length:calc(75*var(--u))] lg:leading-[calc(86*var(--u))]">
            {/* The space is in the large span, as in Figma, so the gap after
                "Full-stack" has the size of that span. */}
            <span className="font-bold text-off-pink text-[41px] leading-[48px] md:text-[57px] md:leading-[64px] lg:text-[length:calc(86*var(--u))] lg:leading-[calc(95*var(--u))]">
              {'Full-stack '}
            </span>
            data solutions to empower your business.
          </h1>

          <motion.div
            className="flex flex-col items-start gap-[20px] md:gap-[24px] lg:gap-[calc(32*var(--u))]"
            variants={{ shown: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }}
            initial={animating ? 'hidden' : false}
            animate={state}
          >
            {/* Two lines from lg, as Figma draws them. Below lg the text wraps. */}
            <motion.p variants={COPY_VARIANTS} className={`${HOME_SUBTITLE} text-white`}>
              We analyze, design, and code with AI — bringing Vietnamese{' '}
              <br className="hidden lg:inline" />
              agility to improve your services and speed up your growth.
            </motion.p>
            <motion.span variants={COPY_VARIANTS} className="inline-flex">
              {/* The on-blue primary button: white, blue label, no icon. */}
              <Button
                variant="secondary"
                size="home"
                onDark
                // Call the handler without arguments. If the click event goes in
                // as the survey branch, the survey reads an unknown branch and
                // the app stops (E2E 2026-10-15, A-1).
                onClick={() => onOpenSurvey()}
                className="border-transparent"
              >
                Let’s start!
              </Button>
            </motion.span>
          </motion.div>
        </div>
      </HomeColumn>

      {/* Decorative only: no alt text, out of the a11y tree, no click target.
          Not lazy, because the shapes are above the fold. The box keeps the
          580:564 aspect at every width. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none relative mb-[32px] ml-auto mt-[24px] aspect-[580/564] w-[300px] max-w-[85%] md:mb-[48px] md:mt-[16px] md:w-[420px] lg:absolute lg:right-0 lg:top-[calc(var(--header-h)_+_32*var(--u))] lg:m-0 lg:w-[calc(580*var(--u))] lg:max-w-none"
        variants={{ shown: { transition: { staggerChildren: STAGGER.tight } } }}
        initial={animating ? 'hidden' : false}
        animate={state}
      >
        {SHAPES.map((shape) => (
          <Shape key={shape.key} shape={shape} progress={drift} drifting={animating} />
        ))}
      </motion.div>
    </section>
  );
};

export default Hero;
