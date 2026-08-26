import React from 'react';
import { CSS_EASE, MS, useMotionEnabled } from '../../lib/motion';

/**
 * A label that rolls up one slot on hover, revealing an identical copy — the
 * menu behaviour from oma-genera (`.claude/motion-catalog.md`, item 1).
 *
 * The copy is positioned a full container-height below and the stack moves by
 * exactly that height, so the two always land on the same baseline whatever the
 * type size — the reference's slot tracks line-height (49px at 1440, 34px at
 * 390) rather than any fixed pixel value.
 *
 * The vertical padding is what stops the clip from shaving glyphs: the menu's
 * own type sets a line box shorter than its font size (64px text on 58px
 * leading), so a window sized to the line box would cut ascenders. The matching
 * negative margin keeps the occupied height unchanged, so nothing in the
 * approved layout moves.
 *
 * Hover and focus-visible only — there is no hover on touch, and the reference
 * has no touch equivalent.
 */
const RollText: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  // Gated in JS rather than with `motion-reduce:`, so the review override can
  // reach it — a CSS media query cannot be overridden from script.
  const motionOn = useMotionEnabled();

  return (
  <span className={`inline-block overflow-hidden -my-[0.15em] ${className}`}>
    <span
      className={`relative block py-[0.15em] transition-transform ${
        motionOn ? 'group-hover:-translate-y-full group-focus-visible:-translate-y-full' : ''
      }`}
      style={{ transitionDuration: `${motionOn ? MS.roll : 0}ms`, transitionTimingFunction: CSS_EASE.roll }}
    >
      {children}
      <span aria-hidden="true" className="absolute inset-x-0 top-full block py-[0.15em]">
        {children}
      </span>
    </span>
  </span>
  );
};

export default RollText;
