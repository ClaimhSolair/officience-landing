import React, { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue, type Variants } from 'framer-motion';
import Container from './ui/Container';
import { RevealChild } from './ui/Reveal';
import SectionBadge from './ui/SectionBadge';
import ApproachMark, { type MarkName } from './ui/ApproachMark';
import { EASE, MOTION, SEC, STAGGER, STICKY_TOP, useMinWidth, useMotionEnabled } from '../lib/motion';

/**
 * Figma 3144:3723 (1920) and 3137:2432 (390).
 *
 * Three steps, each opened by a vertical rule: a number, a pinwheel mark, then
 * the step's name and what happens in it. Desktop lays them in a row and aligns
 * the three text blocks to a common line — which is why the mark sits in a
 * fixed-height slot rather than being followed by a plain gap.
 *
 * The row starts at md, not lg: Figma only draws 390 and 1920, and taking the 390
 * stack all the way to 1023 left three full-width steps on a tablet where three
 * columns fit comfortably. The mark keeps a fixed slot at md for the same reason it
 * has one at lg — Engage's mark is 105px where the other two are 100, so without it
 * the three text blocks start on different lines. Below md the steps stack and the
 * marks get a plain gap, as the 390 artboard draws them.
 *
 * Nothing here is interactive: the artboards draw no CTA in this section, so the
 * survey entry points live only in Connect With Us.
 *
 * **Motion (item 9, interyo).** From lg the section is pinned: the heading holds
 * still at the top of the screen while the three steps chain in from the right,
 * one after another, driven by scroll position rather than by a clock. That
 * procession *is* the effect — the heading staying put is what the steps are
 * measured against — so this is the one place in the pass that spends page height
 * on a pin. Below lg it is unpinned and the steps arrive as they are scrolled to,
 * which is what interyo itself ships at 390.
 */

interface Step {
  number: string;
  name: string;
  body: string;
  mark: MarkName;
  /** The marks are drawn at different sizes; Engage's is the largest. */
  markClass: string;
}

const STEPS: Step[] = [
  {
    number: '01',
    name: 'Engage',
    body: "Meet our engagers to understand your pain points, find solutions, and build a roadmap together. We're COSMIC.",
    mark: 'engage',
    markClass: 'h-[105px] w-[105px] lg:h-[169px] lg:w-[169px]',
  },
  {
    number: '02',
    name: 'Collaborate',
    body: 'Execute your project in agile mode — with proximity, transparency, and productivity. Small teams, people magic.',
    mark: 'collaborate',
    markClass: 'h-[100px] w-[100px] lg:h-[140px] lg:w-[140px]',
  },
  {
    number: '03',
    name: 'Run',
    body: 'Roll-out in production, adopt the products, and support your users. People first, tech second.',
    mark: 'run',
    markClass: 'h-[100px] w-[100px] lg:h-[140px] lg:w-[140px]',
  },
];

/**
 * How the pinned runway is divided. Step i occupies `[START + i*PITCH, + SPAN]`,
 * which leaves a beat of stillness at the end before the section releases —
 * without it the last step is still arriving as the pin lets go, and the whole
 * procession reads as unfinished.
 */
const START = 0.08;
const PITCH = 0.28;
const SPAN = 0.26;

/** Unpinned fallback: the same arrival, on its own clock. */
const STEP_VARIANTS: Variants = {
  hidden: { x: 200, opacity: 0 },
  shown: { x: 0, opacity: 1, transition: { duration: SEC.revealBase, ease: [...EASE.reveal] } },
};
const STEP_VARIANTS_FLAT: Variants = {
  hidden: { opacity: 0 },
  shown: { opacity: 1, transition: { duration: SEC.revealBase, ease: [...EASE.reveal] } },
};
const LIST_VARIANTS: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: STAGGER.loose } },
};

/**
 * One step. Pinned, it is a pure function of how far through the section the
 * reader has scrolled; unpinned, it plays its own arrival on entry. The hooks run
 * either way and only the binding changes, because a MotionValue cannot be
 * created conditionally and `MotionConfig` cannot reach one.
 */
const StepItem: React.FC<{
  step: Step;
  index: number;
  progress: MotionValue<number>;
  pinned: boolean;
  motionOn: boolean;
}> = ({ step, index, progress, pinned, motionOn }) => {
  const from = START + index * PITCH;
  const to = from + SPAN;

  // The full 350px interyo measures. Safe here in a way it was not before: the
  // step travels inside a pinned frame that clips its own overflow, so the offset
  // never has to be small enough to keep an observer happy.
  const x = useTransform(progress, [from, to], [350, 0], { clamp: true });
  // Opacity finishes a little ahead of the travel, so the step is readable for
  // the last of its journey rather than arriving and only then becoming visible.
  const opacity = useTransform(progress, [from, to - 0.08], [0, 1], { clamp: true });

  return (
    <motion.li
      style={pinned ? { x, opacity } : undefined}
      variants={pinned ? undefined : motionOn ? STEP_VARIANTS : STEP_VARIANTS_FLAT}
      /* At 390 the rules run past the copy: the artboard gives its three steps
         340/350/350px regardless of how much text each holds, so the rule length
         is a constant, not a consequence. One min-height says that; Engage ends
         up 10px longer than drawn. From md the steps sit in a row and the rule is
         the content's own height again. */
      className="flex min-h-[350px] flex-col border-l border-border-field pl-fig-40 md:min-h-0 md:flex-1 md:pl-fig-24 lg:pl-fig-32"
    >
      <p aria-hidden="true" className="font-sans font-semibold text-[24px] leading-[32px] text-subtitle lg:text-h2">
        {step.number}
      </p>

      {/* Fixed slot from lg so all three text blocks start on one line. */}
      <div className="mt-fig-24 md:h-[105px] lg:mt-fig-32 lg:h-[169px]">
        <ApproachMark name={step.mark} className={step.markClass} />
      </div>

      <div className="mt-fig-24 flex flex-col gap-fig-8 lg:mt-fig-116 lg:gap-fig-24">
        <h3 className="font-sans text-h3 text-text-primary lg:text-display-sm">{step.name}</h3>
        <p className="font-body text-body-lg text-text-default lg:text-subtitle-2">{step.body}</p>
      </div>
    </motion.li>
  );
};

const HowWeEngage: React.FC = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const motionOn = useMotionEnabled();
  const wide = useMinWidth(1024);
  const pinned = motionOn && wide && MOTION.approach;

  // Runs from the moment the section's top reaches the top of the screen until
  // its bottom reaches the bottom — which, at 220vh against a 100vh viewport, is
  // 120vh of scroll spent pinned.
  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ['start start', 'end end'] });

  return (
    <section id="approach" className="bg-bg-secondary">
      {/* The extra height only exists when something is pinned to it. With motion
          off, or below lg, the wrapper collapses to its contents so nobody
          scrolls through a runway with nothing on it. */}
      <div ref={wrapRef} className={`relative ${pinned ? 'lg:h-[220vh]' : ''}`}>
        <div
          className={`${
            pinned
              ? `lg:sticky ${STICKY_TOP} lg:flex lg:h-[calc(100vh-113px)] lg:flex-col lg:justify-center 3xl:h-[calc(100vh-119px)]`
              : ''
          } overflow-x-clip`}
        >
          <Container className="flex flex-col gap-fig-32 py-fig-32 lg:gap-fig-146 lg:py-fig-100">
            {/* Header. The blurb sits bottom-aligned against the title at desktop,
                in a 600px block flush with the content edge. Pinned, this is the
                part that holds still while the steps arrive against it. */}
            <motion.div
              className="flex flex-col gap-fig-24 lg:flex-row lg:items-end lg:justify-between lg:gap-fig-32"
              variants={LIST_VARIANTS}
              initial="hidden"
              whileInView="shown"
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="flex flex-col items-start gap-fig-8 lg:gap-fig-16">
                <RevealChild as="span" y={20} duration={SEC.revealFast}>
                  <SectionBadge>How We Work</SectionBadge>
                </RevealChild>
                <RevealChild as="span" y={28}>
                  <h2 className="font-sans text-h1 text-text-default lg:whitespace-nowrap lg:text-[86px] lg:font-semibold lg:leading-[74px] lg:tracking-[-0.03em]">
                    Our Approach
                  </h2>
                </RevealChild>
              </div>

              <RevealChild
                as="p"
                y={20}
                duration={SEC.revealFast}
                className="font-body text-body-md text-subtitle lg:w-[600px] lg:min-w-0 lg:text-subtitle-1"
              >
                How we transform your vision into seamless digital reality with agile speed.
              </RevealChild>
            </motion.div>

            {/* Steps. `items-start` is load-bearing: each rule is its own step's
                height, and the artboard draws the third one shorter because Run's
                copy is shorter. Stretching them would flatten that. */}
            <motion.ol
              className="flex flex-col gap-fig-40 md:flex-row md:items-start md:gap-fig-24 lg:gap-fig-120"
              variants={pinned ? undefined : LIST_VARIANTS}
              initial={pinned ? false : 'hidden'}
              whileInView={pinned ? undefined : 'shown'}
              viewport={pinned ? undefined : { once: true, amount: 0.15 }}
            >
              {STEPS.map((step, i) => (
                <StepItem
                  key={step.number}
                  step={step}
                  index={i}
                  progress={scrollYProgress}
                  pinned={pinned}
                  motionOn={motionOn}
                />
              ))}
            </motion.ol>
          </Container>
        </div>
      </div>
    </section>
  );
};

export default HowWeEngage;
