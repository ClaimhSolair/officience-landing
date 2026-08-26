import React from 'react';
import { motion } from 'framer-motion';
import { EASE, SEC, useMotionEnabled } from '../../lib/motion';

/**
 * The one entrance every timed reveal in the Sept-2026 pass uses: a short travel
 * plus a fade, on the curve fitted from nexvio's own section headings
 * (`.claude/motion-catalog.md`) — `y 40 -> 0`, `opacity 0 -> 1`, ~1s easeOutCubic.
 *
 * **Reduced motion keeps the fade and drops the travel.** Movement across the
 * screen is what the preference is asking us to stop; a cross-fade carries no
 * vestibular risk, and a page that goes completely inert is a worse answer for
 * the many visitors whose OS reports `reduce` without them ever having chosen
 * it. Scroll-scrubs are a different matter and still collapse to static.
 *
 * `once` on purpose: a section that replays on every re-entry turns a long page
 * into a flicker reel on the way back up.
 */
const TAGS = {
  li: motion.li,
  div: motion.div,
  article: motion.article,
} as const;

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  as?: keyof typeof TAGS;
  /** Horizontal travel. Item 9's cards arrive from the right. */
  x?: number;
  /** Vertical travel. Defaults to the measured 40px rise. */
  y?: number;
  delay?: number;
  /** Lets a caller keep the element static without changing its markup. */
  enabled?: boolean;
}

const Reveal: React.FC<RevealProps> = ({
  children,
  className = '',
  as = 'div',
  x = 0,
  y = 40,
  delay = 0,
  enabled = true,
}) => {
  const motionOn = useMotionEnabled();
  const Tag = TAGS[as];

  // Switched off outright: render the plain element, so nothing is ever left
  // holding an opacity of 0 with no animation coming to clear it.
  if (!enabled) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }

  const travel = motionOn ? { x, y } : {};

  return (
    <Tag
      className={className}
      initial={{ ...travel, opacity: 0 }}
      whileInView={{ x: 0, y: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: SEC.reveal, ease: EASE.reveal, delay: motionOn ? delay : 0 }}
    >
      {children}
    </Tag>
  );
};

export default Reveal;
