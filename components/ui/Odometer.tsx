import React from 'react';
import { motion } from 'framer-motion';
import { EASE, SEC, useMotionEnabled } from '../../lib/motion';

/**
 * A number that rolls into place like a mechanical counter — salient's
 * milestone treatment (`.claude/motion-catalog.md`, item 6).
 *
 * Each digit is a tape of five 0–9 loops behind a one-glyph window, resting at
 * `−(10 + digit)` glyphs, so every digit turns through at least one full
 * revolution before it lands. That is the reference's anatomy exactly, measured
 * at both breakpoints.
 *
 * The tape is translated in **percentages of its own height** rather than
 * pixels: 50 glyphs means one glyph is 2%, so the maths holds at any type size
 * without measuring anything. The window is sized by an invisible glyph rather
 * than a length, which keeps it exactly one line tall even where the design
 * sets a line box tighter than the font size (86px type on 74px leading).
 *
 * Digits carry no descenders, so that tight line box crops nothing.
 */
const GLYPHS = Array.from({ length: 50 }, (_, i) => i % 10);

interface OdometerProps {
  /** The finished number, e.g. `500+`. Non-digits render static. */
  value: string;
}

const Odometer: React.FC<OdometerProps> = ({ value }) => {
  const motionOn = useMotionEnabled();

  // Nothing to roll for a visitor who asked for less motion, and no reason to
  // ship 50 glyphs per digit to them either.
  if (!motionOn) return <>{value}</>;

  let digitIndex = 0;

  return (
    <>
      <span className="sr-only">{value}</span>
      <span aria-hidden="true" className="inline-flex">
        {[...value].map((ch, i) => {
          if (!/[0-9]/.test(ch)) {
            return <span key={`${ch}-${i}`}>{ch}</span>;
          }
          const digit = Number(ch);
          const delay = digitIndex * SEC.counterStagger;
          digitIndex += 1;

          return (
            <span key={`${ch}-${i}`} className="relative inline-block overflow-hidden">
              <span className="invisible block">0</span>
              <motion.span
                className="absolute inset-x-0 top-0 block"
                initial={{ y: '0%' }}
                whileInView={{ y: `-${(10 + digit) * 2}%` }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: SEC.counter, ease: EASE.counter, delay }}
              >
                {GLYPHS.map((g, k) => (
                  <span key={k} className="block">
                    {g}
                  </span>
                ))}
              </motion.span>
            </span>
          );
        })}
      </span>
    </>
  );
};

export default Odometer;
