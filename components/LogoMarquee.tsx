import React from 'react';
import { ASSETS } from '../assets';

/**
 * Figma 3137:2138 (1920) and 3153:8647 (390) — the client wall under People
 * Trust Us. A white band, full-bleed, with the logos centred in it: 312px tall
 * at 1920 around a 140.5px row, 160px tall at 390 around a 58.2px row.
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
 * Every size derives from `--logo-scale`, the one number separating the two
 * artboards (58.204 / 140.499 = 0.4143, and the 118.8px gap scales with it), so
 * the eleven logo sizes are stated once in `assets.ts` and never per breakpoint.
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

const LogoMarquee: React.FC = () => (
  <section
    aria-label="Clients we work with"
    /* Reduced motion stops the track, which would otherwise strand ten of the
       eleven logos off-screen — so the band becomes a plain scrollable row. */
    className="flex h-[160px] items-center overflow-hidden bg-bg-default [--logo-scale:0.4143] motion-reduce:overflow-x-auto lg:h-[312px] lg:[--logo-scale:1]"
    style={{
      // Figma clips the track dead at the artboard edge. The live build dissolves
      // it into the band instead, and that is the treatment being carried over.
      WebkitMaskImage:
        'linear-gradient(to right, transparent 0, #000 clamp(32px,8vw,96px), #000 calc(100% - clamp(32px,8vw,96px)), transparent 100%)',
      maskImage:
        'linear-gradient(to right, transparent 0, #000 clamp(32px,8vw,96px), #000 calc(100% - clamp(32px,8vw,96px)), transparent 100%)',
    }}
  >
    <div className="marquee-track flex w-max animate-marquee motion-reduce:animate-none">
      <Copy />
      <Copy hidden />
    </div>
  </section>
);

export default LogoMarquee;
