import React, { useEffect, useId, useRef } from 'react';
import { animate, motion, useInView, useMotionTemplate, useMotionValue } from 'framer-motion';
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
 *
 * Each spinning digit carries a **vertical motion blur** that peaks early in the
 * roll and resolves to zero as it settles — the smear a physical counter shows
 * as the numbers fly past, sharp again the instant they stop. It is a real
 * directional (y-only) Gaussian blur on the window, its amount animated on the
 * filter itself, so the digits stay crisp horizontally and only streak along the
 * axis they travel. The requested "numbers rolling up" look.
 *
 * Duration is the one number in the catalog that is not measured: salient's roll
 * renders pre-completed under automation, headed and headless alike, so it was
 * never captured. `MS.counter` is set by eye against the reference.
 *
 * The roll is triggered by observing the **root line**, which is one glyph tall
 * and never clipped — not the tape, which lives inside a one-glyph
 * `overflow-hidden` window and can therefore never report more than ~2% of
 * itself to an observer, which is why an earlier `whileInView` on the tape never
 * fired and every counter sat at zero.
 */
const GLYPHS = Array.from({ length: 50 }, (_, i) => i % 10);

/** Peak vertical blur (SVG stdDeviation on the y axis) at the fastest part of the roll. */
const PEAK_BLUR = 8;

/**
 * One rolling digit and its blur. A component of its own because each digit
 * needs its own filter id and its own animated blur value — hooks that cannot
 * live inside the parent's map.
 */
const Digit: React.FC<{ digit: number; delay: number; rolled: boolean }> = ({ digit, delay, rolled }) => {
  // A stable, CSS-safe id (useId returns ":r0:" — the colons are invalid in url(#…)).
  const id = `odo-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  // The y-only blur amount. `useMotionTemplate` feeds it to stdDeviation as
  // "0 <n>", so only the vertical axis blurs.
  const blur = useMotionValue(0);
  const std = useMotionTemplate`0 ${blur}`;

  useEffect(() => {
    if (!rolled) {
      blur.set(0);
      return;
    }
    // Peaks at ~18% and decays over the rest — the roll is fastest early
    // (easeOut), so the smear is heaviest then and gone by the time it lands.
    const controls = animate(blur, [0, PEAK_BLUR, 0], {
      duration: SEC.counter,
      ease: 'easeOut',
      times: [0, 0.18, 1],
      delay,
    });
    return () => controls.stop();
  }, [rolled, delay, blur]);

  return (
    <span className="relative inline-block overflow-hidden" style={{ filter: `url(#${id})` }}>
      <svg aria-hidden="true" className="pointer-events-none absolute h-0 w-0">
        <filter id={id} x="-20%" y="-40%" width="140%" height="180%" colorInterpolationFilters="sRGB">
          <motion.feGaussianBlur stdDeviation={std} edgeMode="duplicate" />
        </filter>
      </svg>
      <span className="invisible block">0</span>
      <motion.span
        className="absolute inset-x-0 top-0 block"
        initial={{ y: '0%' }}
        animate={rolled ? { y: `-${(10 + digit) * 2}%` } : { y: '0%' }}
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
};

interface OdometerProps {
  /** The finished number, e.g. `500+`. Non-digits render static. */
  value: string;
  /**
   * A second gate on top of visibility. The caller uses it to hold the roll until
   * a prior beat has finished — the milestones wait for the manifesto sweep — so
   * the numbers don't count up while something above them is still animating.
   * Defaults true, so an Odometer with no opinion just rolls when it is seen.
   */
  armed?: boolean;
}

const Odometer: React.FC<OdometerProps> = ({ value, armed = true }) => {
  const motionOn = useMotionEnabled();
  // Observe the root, not the tape (see the docblock). `once` so the roll never
  // rewinds; `amount: 0.5` so it fires as the line reaches the middle of the
  // screen — "the moment the user scrolls to it", as asked.
  const rootRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(rootRef, { once: true, amount: 0.5 });
  // Rolls only once it is both seen and armed by the caller.
  const rolled = inView && armed;

  // Nothing to roll for a visitor who asked for less motion, and no reason to
  // ship 50 glyphs per digit to them either.
  if (!motionOn) return <>{value}</>;

  const digitCount = [...value].filter((ch) => /[0-9]/.test(ch)).length;
  // The suffix lands after the last digit has stopped, so the number reads as
  // finished before anything is added to it.
  const suffixDelay = SEC.counter + (digitCount - 1) * SEC.counterStagger;
  let digitIndex = 0;

  return (
    <>
      <span className="sr-only">{value}</span>
      <span ref={rootRef} aria-hidden="true" className="inline-flex">
        {[...value].map((ch, i) => {
          if (!/[0-9]/.test(ch)) {
            return (
              <motion.span
                key={`${ch}-${i}`}
                className="inline-block"
                initial={{ scale: 0, opacity: 0 }}
                animate={rolled ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                transition={{ duration: SEC.suffixPop, ease: [...EASE.roll], delay: suffixDelay }}
              >
                {ch}
              </motion.span>
            );
          }
          const digit = Number(ch);
          const delay = digitIndex * SEC.counterStagger;
          digitIndex += 1;

          return <Digit key={`${ch}-${i}`} digit={digit} delay={delay} rolled={rolled} />;
        })}
      </span>
    </>
  );
};

export default Odometer;
