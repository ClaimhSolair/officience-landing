import React from 'react';
import { motion, type Transition, type Variants } from 'framer-motion';
import { EASE, SEC, STAGGER, useMotionEnabled } from '../../lib/motion';

/**
 * The entrance system for the Sept-2026 pass.
 *
 * **The container observes; the children move.** That inversion is the whole
 * point. When the observed element is also the translated one, its entrance
 * offset changes how much of it is on screen, so a travel large enough to read
 * as movement can push the element below the visibility threshold that would
 * have triggered it — the entrance then waits forever on a condition it is
 * itself preventing. Not hypothetical: it left Approach's third step invisible
 * at every width up to 1440 (24.6% intersection against a 25% threshold, 0% at
 * 768), and the fix at the time was to shrink the travel to 120px. Here the
 * wrapper never transforms, so its ratio is honest and the travel can be
 * whatever the design wants.
 *
 * Two shapes:
 *  - `<Reveal stagger>` + `<RevealChild>` — a cascade. The parent holds the
 *    trigger and the rhythm; each child carries its own offset.
 *  - `<Reveal y={40}>` — a single element, for the cases with nothing to
 *    cascade. Keep the travel modest here, or use the cascade form.
 *
 * **Reduced motion keeps the fade and drops the travel.** Movement across the
 * screen is what the preference asks us to stop; a cross-fade carries no
 * vestibular risk, and a page that goes completely inert is a worse answer for
 * the many visitors whose OS reports `reduce` without them ever choosing it.
 * Scroll-scrubs are a different matter and still collapse to static.
 *
 * `once` throughout: a section that replays on every re-entry turns a long page
 * into a flicker reel on the way back up.
 */
const TAGS = {
  div: motion.div,
  li: motion.li,
  ul: motion.ul,
  ol: motion.ol,
  p: motion.p,
  span: motion.span,
  article: motion.article,
  section: motion.section,
  header: motion.header,
  figure: motion.figure,
} as const;

type TagName = keyof typeof TAGS;

/** Built here rather than inline so parent and child always agree on the curve. */
const travelVariants = (x: number, y: number, motionOn: boolean, transition: Transition): Variants => ({
  hidden: motionOn ? { x, y, opacity: 0 } : { opacity: 0 },
  shown: { x: 0, y: 0, opacity: 1, transition },
});

interface CommonProps {
  children: React.ReactNode;
  className?: string;
  as?: TagName;
  /** Horizontal travel; positive arrives from the right. */
  x?: number;
  /** Vertical travel; positive arrives from below. */
  y?: number;
  /** Seconds. Defaults to the card-sized tier. */
  duration?: number;
  delay?: number;
  ease?: readonly number[];
  /** For anything the caller has to position itself — a sticky offset, a z-index. */
  style?: React.CSSProperties;
}

interface RevealProps extends CommonProps {
  /**
   * Cascade the `RevealChild`ren this far apart, in seconds; `true` takes the
   * standard rhythm. With it set, this element carries no travel of its own.
   */
  stagger?: number | boolean;
  /** How much must be on screen before it starts. */
  amount?: number;
  /** Lets a caller keep the element static without changing its markup. */
  enabled?: boolean;
  /** The observed element is often the one a caller needs to measure. */
  innerRef?: React.Ref<any>;
}

export const Reveal: React.FC<RevealProps> = ({
  children,
  className = '',
  as = 'div',
  x = 0,
  y = 40,
  duration,
  delay = 0,
  ease = EASE.reveal,
  stagger,
  amount = 0.2,
  enabled = true,
  innerRef,
  style,
}) => {
  const motionOn = useMotionEnabled();
  const Tag = TAGS[as];

  // Switched off outright: render the plain element, so nothing is ever left
  // holding an opacity of 0 with no animation coming to clear it.
  if (!enabled) {
    const Plain = as;
    return (
      <Plain className={className} style={style} ref={innerRef}>
        {children}
      </Plain>
    );
  }

  const transition: Transition = {
    duration: duration ?? SEC.revealBase,
    ease: ease as number[],
    delay: motionOn ? delay : 0,
  };

  // Cascade: the parent is a pure trigger. It animates nothing itself, which is
  // why its intersection ratio stays honest however far its children move.
  if (stagger) {
    const each = stagger === true ? STAGGER.base : stagger;
    const variants: Variants = {
      hidden: {},
      shown: { transition: { staggerChildren: motionOn ? each : each / 2, delayChildren: delay } },
    };

    return (
      <Tag
        ref={innerRef}
        className={className}
        style={style}
        variants={variants}
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, amount }}
      >
        {children}
      </Tag>
    );
  }

  return (
    <Tag
      ref={innerRef}
      className={className}
      style={style}
      variants={travelVariants(x, y, motionOn, transition)}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount }}
    >
      {children}
    </Tag>
  );
};

/**
 * One step of a cascade. It takes its cue from the nearest `Reveal` — framer
 * propagates the variant name down the tree — so it needs no observer, no
 * threshold and no delay arithmetic of its own.
 */
export const RevealChild: React.FC<CommonProps> = ({
  children,
  className = '',
  as = 'div',
  x = 0,
  y = 32,
  duration,
  delay = 0,
  ease = EASE.reveal,
  style,
}) => {
  const motionOn = useMotionEnabled();
  const Tag = TAGS[as];
  const transition: Transition = {
    duration: duration ?? SEC.revealBase,
    ease: ease as number[],
    delay: motionOn ? delay : 0,
  };

  return (
    <Tag className={className} style={style} variants={travelVariants(x, y, motionOn, transition)}>
      {children}
    </Tag>
  );
};

export default Reveal;
