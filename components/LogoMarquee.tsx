import React from 'react';
import { useReducedMotion } from 'framer-motion';
import { ASSETS } from '../assets';
import { useMotionEnabled } from '../lib/motion';

/**
 * Figma 3137:2138 (1920) and 3153:8647 (390) — the client wall under People
 * Trust Us. A white band, full-bleed, with the logos centred in it: 240px tall
 * at 1920 around a 120px row, 160px tall at 390 around a 58.2px row. The team
 * changed the 1920 frame from 312px / 140.5px (tracker row 26, 2026-10-12).
 * The 390 frame did not change.
 *
 * Figma draws it as a track far wider than the artboard and clips — the layout
 * way of saying "this scrolls" — so the movement itself comes from the live
 * site, which is the reference the redesign was signed off against: the track
 * travels leftward, new logos entering from the right, looping continuously and
 * pausing under the pointer so a logo can actually be read.
 *
 * Both artboards leave the logos desaturated (Figma does it with a luminosity
 * blend, `.client-logo` does it with a greyscale filter) and full colour is the
 * hover state. That state is pointer-only by nature, so touch visitors see the
 * greyscale band throughout — which is exactly the resting state Figma draws.
 *
 * Every size derives from `--logo-scale`. The sizes in `assets.ts` are the old
 * 140.5px row. The 1920 frame now draws a 120px row (120 / 140.499 = 0.8541) and
 * 390 draws a 58.2px row (58.204 / 140.499 = 0.4143). The 118.8px gap scales with
 * it, so the eleven logo sizes are stated once and never per breakpoint.
 */
const GAP = 'calc(118.8px * var(--logo-scale))';

/** Both copies are identical; only the first is exposed to assistive tech. */
const Copy: React.FC<{ hidden?: boolean }> = ({ hidden }) => (
  <ul
    aria-hidden={hidden || undefined}
    /* The trailing gap belongs to the copy, not to the flex row between them.
       With 11 items and 11 gaps each copy measures exactly half the track, so
       translating -50% lands the second copy where the first began. A `gap` on
       the outer row would leave 21 gaps across the pair and drift every loop. */
    className="flex shrink-0 items-center"
    style={{ gap: GAP, paddingRight: GAP }}
  >
    {ASSETS.clients.map((logo) => (
      <li key={logo.name} className="shrink-0">
        <img
          src={logo.url}
          alt={hidden ? '' : logo.name}
          className="client-logo max-w-none"
          style={{
            width: `calc(${logo.w}px * var(--logo-scale))`,
            height: `calc(${logo.h}px * var(--logo-scale))`,
          }}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
        />
      </li>
    ))}
  </ul>
);

const FADE =
  'linear-gradient(to right, transparent 0, #000 clamp(32px,8vw,96px), #000 calc(100% - clamp(32px,8vw,96px)), transparent 100%)';

const LogoMarquee: React.FC = () => {
  // The CSS stops the track when the visitor asks for reduced motion, unless
  // `?motion=on` turns it on again (index.html). This is the same test in script.
  const reduced = useReducedMotion();
  const motionOn = useMotionEnabled();
  const still = !!reduced && !motionOn;

  return (
    <section
      aria-label="Clients we work with"
      /* Reduced motion stops the track, which would otherwise strand ten of the
         eleven logos off-screen — so the band becomes a plain scrollable row. */
      className="flex h-[160px] items-center overflow-hidden bg-bg-default [--logo-scale:0.4143] motion-reduce:overflow-x-auto lg:h-[240px] lg:[--logo-scale:0.8541]"
      // A moving track dissolves into the band at both edges, as the live build
      // does. Figma clips the track at the artboard edge. A still row uses the
      // Figma clip: with the fade, the first logo was half faded at x 0.
      style={still ? undefined : { WebkitMaskImage: FADE, maskImage: FADE }}
    >
      {/* A still row starts on the content column, as Figma draws it (x 64 at
          1920). The padding repeats the `Container` rule: 16, then 24 with the
          1792px cap from lg. */}
      <div
        className={`marquee-track flex w-max animate-marquee motion-reduce:animate-none ${
          still ? 'pl-fig-16 lg:pl-[max(24px,calc((100%_-_1792px)/2))]' : ''
        }`}
      >
        <Copy />
        <Copy hidden />
      </div>
    </section>
  );
};

export default LogoMarquee;
