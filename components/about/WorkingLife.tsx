import React from 'react';
import { ASSETS } from '../../assets';
import Container from '../ui/Container';
import Reveal, { RevealChild } from '../ui/Reveal';
import SectionBadge from '../ui/SectionBadge';
import { SEC } from '../../lib/motion';

/**
 * Our Working Life — Figma 3133:4640.
 *
 * Two blocks. A news list (403 wide) sits beside a white panel (987.6) holding
 * the anniversary banner; below them, two rows of photographs run as a marquee.
 *
 * **The marquee needs no assets of its own.** Both rows draw the same nine
 * pictures as Our Journey, at the same crops, and a tile's 330.222x239.663 box
 * is the same 1.378 ratio as a Journey card. The two rows are one set in two
 * orders, which is what Figma draws and what a loop needs anyway.
 *
 * Figma leaves a dashed connector inside three marquee tiles. They are copied
 * from the timeline cards, they render behind the pictures, and none is visible
 * in the artboard, so they are dropped rather than reproduced.
 *
 * The banner is rebuilt from its layers rather than flattened, so its two lines
 * of type stay crisp at any width. Its type scales with the banner through
 * container query units, since the banner's width follows the column.
 */

interface NewsItem {
  title: string;
  /** Only the open item carries a description in the artboard. */
  body?: string;
}

const NEWS: NewsItem[] = [
  {
    title: '2026 - Twenty Years. Still Going',
    body: 'Design the look and experience of your brand and digital products...',
  },
  { title: 'Virtual Race - We Have Our Winners' },
  { title: 'A Very Offy Friday: Learning, cooking, ...' },
  { title: 'The Real Secret Behind Long-Term Client ...' },
];

/** One tile of the photo marquee. A pair fills the same box as a single. */
type Tile = { kind: 'one'; src: string; alt: string } | { kind: 'pair'; a: [string, string]; alt: string };

const J = ASSETS.aboutPage.journey;

const ROW_TOP: Tile[] = [
  { kind: 'one', src: J.y2016, alt: 'Colleagues at the United States office.' },
  { kind: 'one', src: J.y2026, alt: 'The twentieth anniversary collage.' },
  { kind: 'one', src: J.y2006, alt: 'The founding team in 2006.' },
  { kind: 'one', src: J.y2013, alt: 'A team workshop.' },
  { kind: 'pair', a: [J.y2025a, J.y2025b], alt: 'A DIY Jam session and the brand launch.' },
  { kind: 'one', src: J.y2010, alt: 'The Singapore office.' },
  { kind: 'pair', a: [J.y2017b, J.y2017a], alt: 'Inside and outside the OffyPlex building.' },
];

const ROW_BOTTOM: Tile[] = [
  { kind: 'pair', a: [J.y2025a, J.y2025b], alt: 'A DIY Jam session and the brand launch.' },
  { kind: 'one', src: J.y2016, alt: 'Colleagues at the United States office.' },
  { kind: 'one', src: J.y2013, alt: 'A team workshop.' },
  { kind: 'one', src: J.y2006, alt: 'The founding team in 2006.' },
  { kind: 'one', src: J.y2010, alt: 'The Singapore office.' },
  { kind: 'one', src: J.y2026, alt: 'The twentieth anniversary collage.' },
  { kind: 'pair', a: [J.y2017b, J.y2017a], alt: 'Inside and outside the OffyPlex building.' },
];

const TileView: React.FC<{ tile: Tile; hidden?: boolean }> = ({ tile, hidden }) => (
  <li
    className="flex aspect-[330/240] w-[220px] shrink-0 gap-px sm:w-[280px] lg:w-[330px]"
    aria-hidden={hidden || undefined}
  >
    {tile.kind === 'one' ? (
      <img
        src={tile.src}
        alt={hidden ? '' : tile.alt}
        className="h-full w-full rounded-fig-xs object-cover"
        loading="lazy"
        decoding="async"
      />
    ) : (
      tile.a.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={hidden || i > 0 ? '' : tile.alt}
          className="h-full min-w-0 flex-1 rounded-fig-xs object-cover"
          loading="lazy"
          decoding="async"
        />
      ))
    )}
  </li>
);

/** The banner, rebuilt from the artboard's layers. Percentages of a 929.302x602.4 box. */
const Banner: React.FC = () => (
  <div className="relative aspect-[929/602] w-full overflow-hidden bg-primary [container-type:inline-size]">
    {/* Two photo textures at 38% on an overlay blend, exactly as drawn. */}
    <img
      src={ASSETS.aboutPage.banner.gridTop}
      alt=""
      aria-hidden="true"
      className="absolute inset-x-0 top-0 h-[62.67%] w-full object-cover object-bottom opacity-[0.38] mix-blend-overlay"
      loading="lazy"
      decoding="async"
    />
    <img
      src={ASSETS.aboutPage.banner.gridBottom}
      alt=""
      aria-hidden="true"
      className="absolute inset-x-0 bottom-0 h-[37.33%] w-full object-cover object-bottom opacity-[0.38] mix-blend-overlay"
      loading="lazy"
      decoding="async"
    />

    {/* The vertical lockup: the mark above the wordmark. */}
    <span className="absolute left-[5.19%] top-[8.00%] block h-[11.21%] w-[6.86%]">
      <img
        src={ASSETS.aboutPage.banner.logoMark}
        alt=""
        aria-hidden="true"
        className="absolute inset-x-[7.62%] top-0 bottom-[20%] w-auto max-w-none"
        loading="lazy"
      />
      <img
        src={ASSETS.aboutPage.banner.logoWord}
        alt=""
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 top-[85.03%] max-w-none"
        loading="lazy"
      />
    </span>

    <img
      src={ASSETS.aboutPage.banner.twentieth}
      alt=""
      aria-hidden="true"
      className="absolute left-[34.49%] top-[27.46%] h-[31.43%] w-[30.98%] max-w-none"
      loading="lazy"
      decoding="async"
    />

    {/* 57.056 of the banner's 929.302 width, so the type scales with the box. */}
    <p className="absolute left-1/2 top-[64.67%] w-full -translate-x-1/2 text-center font-sans font-medium uppercase leading-[1.05] tracking-[-0.06em] text-white [font-size:6.14cqw]">
      Officience
    </p>
    <p className="absolute left-1/2 top-[75.08%] w-full -translate-x-1/2 text-center font-sans font-medium uppercase leading-[1.05] tracking-[-0.06em] text-white [font-size:6.14cqw]">
      Anniversary
    </p>
  </div>
);

/**
 * One marquee row, following the LogoMarquee idiom already in the build: the
 * track holds the tiles twice and travels -50%, which loops seamlessly, and
 * `.marquee-track` pauses it under the pointer.
 *
 * Reduced motion stops the track and makes the row scrollable instead, which is
 * what keeps the second half of the pictures reachable.
 *
 * Only `animate-marquee` exists in the config — the reverse keyframe was
 * removed at cleanup — so the second row reverses the same animation rather
 * than adding a keyframe back.
 */
const MarqueeRow: React.FC<{ tiles: Tile[]; reverse?: boolean }> = ({ tiles, reverse }) => (
  <div className="menu-scroll flex overflow-hidden motion-reduce:overflow-x-auto">
    <ul
      className={`marquee-track flex w-max gap-fig-24 animate-marquee motion-reduce:animate-none ${
        reverse ? '[animation-direction:reverse]' : ''
      }`}
    >
      {tiles.map((t, i) => (
        <TileView key={`a-${i}`} tile={t} />
      ))}
      {/* The second copy only exists to close the loop, so it is never read. */}
      {tiles.map((t, i) => (
        <TileView key={`b-${i}`} tile={t} hidden />
      ))}
    </ul>
  </div>
);

const WorkingLife: React.FC = () => {
  return (
    <section id="working-life" className="overflow-hidden bg-background py-fig-64 lg:py-fig-120">
      <Container className="flex flex-col gap-fig-40 lg:gap-fig-100">
        <Reveal className="flex flex-col gap-fig-24 lg:flex-row lg:justify-between lg:gap-fig-32">
          <RevealChild y={24} duration={SEC.revealFast} className="lg:shrink-0">
            <SectionBadge as="h2">Our Working Life</SectionBadge>
          </RevealChild>
          <RevealChild y={24} duration={SEC.revealFast} className="lg:w-[801px] lg:shrink-0">
            <p className="font-sans font-medium text-h2 text-text-default lg:text-display-sm">
              Welcome to the Offy life. Here’s a glimpse into the world we’ve built together
            </p>
          </RevealChild>
        </Reveal>

        {/* The news list and the banner. The row starts at xl: the artboard's
            403 + 987.6 columns need 1390.6px, and 1024 leaves 976. */}
        <Reveal className="flex flex-col gap-fig-24 xl:flex-row xl:gap-0">
          <RevealChild
            y={24}
            duration={SEC.revealFast}
            className="flex flex-col justify-center xl:w-[403px] xl:shrink-0"
          >
            <ul className="flex flex-col">
              {NEWS.map((n) => (
                <li key={n.title} className={`flex flex-col gap-fig-24 p-fig-24 ${n.body ? 'bg-surface' : ''}`}>
                  <h3 className="font-sans text-h2 text-text-primary">{n.title}</h3>
                  {n.body && <p className="font-body text-body-lg text-subtitle">{n.body}</p>}
                </li>
              ))}
            </ul>
          </RevealChild>

          {/* Figma's white panel is 987.6 wide and insets the banner 29.5 from
              its right edge, centred vertically. */}
          <RevealChild
            y={24}
            duration={SEC.revealFast}
            className="flex items-center justify-end bg-surface p-fig-24 xl:min-w-0 xl:flex-1 xl:py-[28.8px] xl:pl-[28.8px] xl:pr-[29.5px]"
          >
            <Banner />
          </RevealChild>
        </Reveal>
      </Container>

      {/* The marquee bleeds past the content column, as the artboard's 2454px
          track does inside a 1440 frame. */}
      <div className="mt-fig-40 flex flex-col gap-fig-24 lg:mt-fig-100">
        <MarqueeRow tiles={ROW_TOP} />
        <MarqueeRow tiles={ROW_BOTTOM} reverse />
      </div>
    </section>
  );
};

export default WorkingLife;
