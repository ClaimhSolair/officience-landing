import React from 'react';
import { ASSETS } from '../assets';
import { useMotionEnabled } from '../lib/motion';

/**
 * The client logo row under Success Stories: frame 4229:4651 node 4382:7176
 * ("LOGO SLIDE", adapter 27e). The band is #F7F7F7, as the page, with 32px
 * padding at the top and bottom and the 24px column gutters. The logos are one
 * row with a 96px gap, clipped at the column edges.
 *
 * Figma draws a static row that the column clips. Ruling 27e keeps the moving
 * loop of the live build: the track moves to the left, new logos come in from
 * the right, and the track stops under the pointer so that a logo can be read.
 *
 * The logos are greyscale, and full colour is the hover state (`.client-logo`
 * in index.html). The frame sets a luminosity blend on some logos only. The
 * other logos are black artwork, so greyscale on all of them looks the same.
 *
 * Below lg there is no frame. The logo sizes, the gap and the padding there are
 * build choices in the frame's proportions: x0.5 below md and x0.7 at md.
 *
 * With motion off, the row does not move and does not scroll (U-8, build
 * choice). All eleven logos show in centred rows, with the 96 gap between the
 * logos and a 32 gap between the rows (x0.5 below md, x0.7 at md).
 */

/**
 * The logo widths of the 1440 frame, in the frame order. The height of each logo
 * comes from the aspect of its file in `assets.ts`. Each frame box has the same
 * aspect as the file, so the files show as drawn. The frame shows the twelfth
 * tile as a second copy of a logo. The track makes its own copy, so it has
 * eleven logos only.
 */
const FRAME_W: Record<string, number> = {
  Orange: 80,
  '50inTech': 140,
  Mailjet: 140,
  ENGIE: 120,
  'Passerelles Numeriques': 80,
  Alibaba: 100,
  Auchan: 150,
  Diana: 134.076,
  'b-process': 229.214,
  'saur Guadeloupe': 179,
  abaca: 164.8,
};

/** One frame pixel: 0.5px below md, 0.7px at md, and the home scale `--u` from lg. */
const UNIT = '[--logo-u:0.5px] md:[--logo-u:0.7px] lg:[--logo-u:var(--u)]';
const GAP = 'calc(96 * var(--logo-u))';
const ROW_GAP = 'calc(32 * var(--logo-u))';

/**
 * The two copies are the same. Only the first copy is in the accessibility tree.
 * `wrap` is the still state: one copy in centred rows.
 */
const Copy: React.FC<{ hidden?: boolean; wrap?: boolean }> = ({ hidden, wrap }) => (
  <ul
    aria-hidden={hidden || undefined}
    /* The copy has the gap after its last logo too. Then each copy is half the
       track, and a move of -50% puts the second copy where the first copy
       started. A gap on the outer row gives 21 gaps for the pair, and the loop
       moves out of position. The still rows have no end gap, so they stay
       centred. */
    className={wrap ? 'flex flex-wrap items-center justify-center' : 'flex shrink-0 items-center'}
    style={wrap ? { columnGap: GAP, rowGap: ROW_GAP } : { gap: GAP, paddingRight: GAP }}
  >
    {ASSETS.clients.map((logo) => {
      const w = FRAME_W[logo.name] ?? logo.w;
      const h = (w * logo.h) / logo.w;
      return (
        <li key={logo.name} className="shrink-0">
          <img
            src={logo.url}
            alt={hidden ? '' : logo.name}
            className="client-logo max-w-none"
            style={{
              width: `calc(${w} * var(--logo-u))`,
              height: `calc(${h.toFixed(3)} * var(--logo-u))`,
            }}
            /* The logos are small files (2-5 KB). An eager load has them ready
               before the band comes into view, so no logo shows blank (U-25). */
            loading="eager"
            decoding="async"
            referrerPolicy="no-referrer"
          />
        </li>
      );
    })}
  </ul>
);

const FADE =
  'linear-gradient(to right, transparent 0, #000 clamp(32px,8vw,96px), #000 calc(100% - clamp(32px,8vw,96px)), transparent 100%)';

const LogoMarquee: React.FC = () => {
  // Motion off (reduced motion, or `?motion=off`) stops the track. The CSS also
  // stops it for reduced motion, unless `?motion=on` starts it again (index.html).
  const still = !useMotionEnabled();

  return (
    <section
      aria-label="Clients we work with"
      className={`bg-bg-secondary px-fig-16 py-[16px] md:px-fig-24 md:py-[24px] lg:px-[calc(24*var(--u))] lg:py-[calc(32*var(--u))] ${UNIT}`}
    >
      {/* The window is the column, as the frame clips the row (4382:7177). A
          moving track fades into the band at the two edges, as the live build
          does. The still rows need no window: they wrap inside the column. */}
      {still ? (
        <Copy wrap />
      ) : (
        <div className="overflow-hidden" style={{ WebkitMaskImage: FADE, maskImage: FADE }}>
          <div className="marquee-track flex w-max animate-marquee motion-reduce:animate-none">
            <Copy />
            <Copy hidden />
          </div>
        </div>
      )}
    </section>
  );
};

export default LogoMarquee;
