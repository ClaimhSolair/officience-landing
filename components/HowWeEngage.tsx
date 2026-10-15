import React, { useLayoutEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, type MotionValue, type Variants } from 'framer-motion';
import { HomeColumn, SectionHeader } from './ui/HomeSection';
import ApproachMark, { type MarkName } from './ui/ApproachMark';
import { EASE, HEADER_H, MOTION, PIN_FOLLOW, SEC, STAGGER, STICKY_TOP, useMinWidth, useMotionEnabled, useScrub } from '../lib/motion';

/**
 * "How we work" — node 4229:4871 of frame 4229:4651 (adapter 27).
 *
 * The section header, then a row of three steps. Each step is a 484px vertical
 * rule, then a 368px stack: the number, a pinwheel mark, the step name and its
 * text. From lg every value is the 1440 value x `--u` (adapter 27b).
 *
 * The frame aligns steps 1 and 2 to the centre of their rule and step 3 to the
 * top. The difference is a few px, and the build keeps it.
 *
 * FIGMA-SLIP: the three steps and two 63px gaps need 1350px, but the row has
 * 1344px inside its padding. The frame lets step 3 run 6px into the padding. Here
 * the stacks can shrink, so each stack is 2px narrower at 1440 and nothing runs
 * past the row. Between 1400 and 1439 (`--u` = 1) they shrink more.
 *
 * Below lg there is no Figma frame. These are build choices, kept from the
 * earlier build: a row of three from md, a stack below md, and no pin. The type
 * and the gaps are about half of the frame, and the marks are 0.62x.
 *
 * **Motion (ruling 27e: keep the pin).** From lg the section pins. The header
 * stays still at the top of the screen, and the three steps come in from the
 * right, one after the other. Scroll position moves them, not a clock. If the
 * window is too short, the column scales to fit. If it is far too short, or
 * below lg, the steps come in as they scroll into view. Under reduced motion
 * they only fade in.
 */

interface Step {
  number: string;
  name: string;
  body: string;
  mark: MarkName;
  /** The mark size in frame px. Engage's mark is the largest. */
  markPx: number;
  /** The stack gap in frame px: 64 for step 1, 80 for steps 2 and 3. */
  gapPx: number;
  /** The frame centres steps 1 and 2 on the rule, and puts step 3 at its top. */
  alignTop: boolean;
}

const STEPS: Step[] = [
  {
    number: '01',
    name: 'Engage',
    body: "We clarify your concerns, find options, and draft a plan together. We're COSMIC.",
    mark: 'engage',
    markPx: 169,
    gapPx: 64,
    alignTop: false,
  },
  {
    number: '02',
    name: 'Collaborate',
    body: 'We execute in agile mode — proximity, transparency, productivity.',
    mark: 'collaborate',
    markPx: 140.191,
    gapPx: 80,
    alignTop: false,
  },
  {
    number: '03',
    name: 'Run',
    body: 'We deploy, guide adoption, and support users. People first, tech second.',
    mark: 'run',
    markPx: 140.419,
    gapPx: 80,
    alignTop: true,
  },
];

/**
 * How the pinned runway is divided, in vh of scroll. Step i occupies
 * `[START + i*PITCH, + SPAN]`. A hold follows the last step before the section
 * releases. Without it the last step is still arriving as the pin lets go, and
 * the procession reads as unfinished.
 *
 * The steps keep the scroll lengths they had on a 90vh travel. The hold was 18vh.
 * The team asked for more reading time after the third card (2026-10-12), so the
 * hold is now 63vh. Tune `HOLD_VH`. The step timing does not change with it.
 */
const START_VH = 5.4;
const PITCH_VH = 27;
const SPAN_VH = 12.6;
const HOLD_VH = 63;
const TRAVEL_VH = START_VH + 2 * PITCH_VH + SPAN_VH + HOLD_VH;
const START = START_VH / TRAVEL_VH;
const PITCH = PITCH_VH / TRAVEL_VH;
const SPAN = SPAN_VH / TRAVEL_VH;

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

  // The full 350px interyo measures, over a narrow window so one flick spans it.
  // `progress` arrives already smoothed (`useScrub` in the section), so a flick
  // carries the step the rest of the way in rather than halting it where the
  // wheel stopped. Both x and opacity read that one value, so they cannot drift
  // apart the way a sprung x and a raw opacity did.
  const x = useTransform(progress, [from, to], [350, 0], { clamp: true });
  // Opacity finishes in the first part of the window, so the step is legible for
  // most of its slide rather than arriving and only then becoming visible.
  const opacity = useTransform(progress, [from, from + SPAN * 0.6], [0, 1], { clamp: true });

  // Below lg the rule stretches to the height of the stack. From lg it is the
  // frame's 484px rule, and the stack aligns to it as the frame draws.
  const cls = `flex gap-fig-24 md:min-w-0 md:flex-1 lg:flex-initial lg:gap-[calc(40*var(--u))] ${
    step.alignTop ? 'lg:items-start' : 'lg:items-center'
  }`;
  const vars = {
    ['--g' as string]: String(step.gapPx),
    ['--m' as string]: String(step.markPx),
  } as React.CSSProperties;
  const body = (
    <>
      <span aria-hidden="true" className="w-px shrink-0 self-stretch bg-border-field lg:h-[calc(484*var(--u))] lg:self-auto" />

      <div className="flex min-w-0 flex-col items-start gap-[calc(var(--g)*0.5px)] lg:w-[calc(368*var(--u))] lg:shrink lg:gap-[calc(var(--g)*var(--u))]">
        <p
          aria-hidden="true"
          className="font-sans text-[20px] font-semibold leading-[28px] text-subtitle md:text-[24px] md:leading-[32px] lg:text-[length:calc(28*var(--u))] lg:leading-[calc(40*var(--u))]"
        >
          {step.number}
        </p>

        <ApproachMark
          name={step.mark}
          className="block h-[calc(var(--m)*0.62px)] w-[calc(var(--m)*0.62px)] shrink-0 lg:h-[calc(var(--m)*var(--u))] lg:w-[calc(var(--m)*var(--u))]"
        />

        <div className="flex w-full flex-col gap-fig-12 lg:gap-[calc(20*var(--u))]">
          <h3 className="font-sans text-[32px] font-medium leading-[40px] text-text-primary md:text-[28px] md:leading-[36px] lg:text-[length:calc(50*var(--u))] lg:leading-[calc(58*var(--u))]">
            {step.name}
          </h3>
          <p className="font-body text-[16px] font-normal leading-[26px] text-text-default lg:text-[length:calc(16*var(--u))] lg:leading-[calc(26*var(--u))]">
            {step.body}
          </p>
        </div>
      </div>
    </>
  );

  // Two distinct elements, keyed, so a change in `pinned` remounts rather than
  // re-props. The pinned branch binds MotionValues to `style`; framer leaves the
  // last transform on the DOM node when style is later removed, so re-propping the
  // same <li> from pinned to unpinned strands it at x:350/opacity:0 — invisible.
  // A key forces a clean element for each mode. (This, plus starting `fits` false,
  // is why the unpinned fallback never inherits a stuck pinned transform.)
  if (pinned) {
    return (
      <motion.li key="pinned" style={{ ...vars, x, opacity }} className={cls}>
        {body}
      </motion.li>
    );
  }
  return (
    <motion.li key="flow" style={vars} variants={motionOn ? STEP_VARIANTS : STEP_VARIANTS_FLAT} className={cls}>
      {body}
    </motion.li>
  );
};

const HowWeEngage: React.FC = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const motionOn = useMotionEnabled();
  const wide = useMinWidth(1024);

  // The pinned composition **scales to fit** the viewport rather than being gated
  // on whether it fits at 1:1 — so the procession runs on any desktop height, not
  // only tall ones (the recurring "works on my external monitor, not my laptop"
  // report). It shrinks proportionally on a short window; only an absurdly short
  // window (scale < FLOOR) falls back to the unpinned arrivals. A CSS scale
  // shrinks paint, not layout, so the scaled content reserves its reduced height
  // on a wrapper.
  const wantsPin = motionOn && MOTION.approach && wide;
  const FLOOR = 0.5;
  const [dims, setDims] = useState({ h: 0, scale: 1 });
  // The pin starts only after the measurement (`dims.h` > 0). Before it, the
  // section shows the unpinned fallback.
  const pinned = wantsPin && dims.h > 0 && dims.scale >= FLOOR;
  const scaling = pinned && dims.scale < 1;
  // The height of the pinned column on screen, after the scale.
  const frameH = pinned ? dims.h * dims.scale : 0;

  useLayoutEffect(() => {
    if (!wantsPin) {
      setDims({ h: 0, scale: 1 });
      return;
    }
    const el = contentRef.current;
    if (!el) return;
    const measure = () => {
      const h = el.offsetHeight; // natural; offsetHeight ignores the applied scale
      if (!h) return;
      // 119 is the tallest header (3xl), so the fit is honest at every breakpoint.
      const avail = window.innerHeight - HEADER_H.xl3;
      setDims({ h, scale: Math.min(1, avail / h) });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [wantsPin]);

  // The runway is the column height + TRAVEL_VH, so the pin holds for TRAVEL_VH
  // of scroll. The progress starts when the section top reaches the top of the
  // screen. It ends when the section bottom reaches the bottom of the pinned
  // column (frameH below the top), which is where the pin releases.
  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ['start start', `end ${frameH}px`] });
  // Smoothed once for all three steps.
  const progress = useScrub(scrollYProgress);

  return (
    <section id="approach" className="bg-bg-secondary">
      {/* The extra height only exists when something is pinned to it. With motion
          off, below lg, or on a viewport far too short to hold the column even
          scaled, the wrapper collapses to its contents so nobody scrolls through
          an empty runway. */}
      <div
        ref={wrapRef}
        className="relative"
        style={pinned ? { height: `calc(${frameH}px + ${TRAVEL_VH}vh)` } : undefined}
      >
        <div
          className={`${
            pinned
              ? /* The pinned frame is the height of the column, not of the
                   window. Thus the page's 120 gap stays the same above and below
                   the section, and no empty band shows under the steps when the
                   pin releases. */
                `lg:sticky ${STICKY_TOP} ${PIN_FOLLOW}`
              : ''
          } overflow-x-clip`}
        >
          {/* Reserves the scaled composition's height, so the pinned column's
              layout shrinks with the scale and not merely its paint. */}
          <div style={scaling ? { height: dims.h * dims.scale } : undefined}>
            <HomeColumn
              innerRef={contentRef}
              style={scaling ? { transform: `scale(${dims.scale})`, transformOrigin: 'top center' } : undefined}
              className="flex flex-col gap-fig-40 md:gap-fig-48 lg:gap-[calc(80*var(--u))] lg:py-[calc(24*var(--u))]"
            >
              {/* The frame draws a "Check Our FAQ" button here. It stays hidden
                  until a FAQ page exists (ruling 27d). */}
              <SectionHeader
                headline="How we work"
                subtitle="We work simple. We let machines work, we take care of people."
              />

              {/* The list is the observer when unpinned, and the steps move. */}
              <motion.ol
                className="flex flex-col gap-fig-40 md:flex-row md:items-start md:gap-fig-24 lg:items-stretch lg:gap-[calc(63*var(--u))] lg:px-[calc(24*var(--u))] lg:py-[calc(40*var(--u))]"
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
                    progress={progress}
                    pinned={pinned}
                    motionOn={motionOn}
                  />
                ))}
              </motion.ol>
            </HomeColumn>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowWeEngage;
