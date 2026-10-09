import React from 'react';
import { srcSetOf } from '../../assets';
import { BENEFITS, BENEFIT_PHOTOS, type BenefitGroup } from '../../content/careers/culture';
import Container from '../ui/Container';
import Reveal, { RevealChild } from '../ui/Reveal';

/**
 * The Benefits mosaic — Figma 3387:3287. Three rows of 447x367 tiles, 24px
 * apart across and 20px apart down: four pastel text tiles with a corner
 * illustration, three photo tiles, and one photo two tiles wide.
 *
 * Proportions (spec, derivation grid):
 * - Every tile keeps 447/367. The wide photo takes the height of its row. For
 *   a text tile the ratio is a minimum: below 375px its text needs more height,
 *   and the tile grows to fit it.
 * - Three columns from xl. At 1024 a third of the column is a 309px tile, too
 *   short for the drawn text, so lg keeps two columns. Below md, one column.
 *   With two columns or one, the wide photo is a single tile and crops to it.
 * - The corner illustrations are placed in % of the tile, from their drawn px
 *   box in the 447x367 tile, so they scale with it. The tile clips them, as
 *   Figma does.
 *
 * Figma sets the tiles in Be Vietnam Pro at 23.17/18.54px (a component scaled
 * by 1.1586). The site fonts take its place (spec, Figma slips): Heading-H3 for
 * the title and Montserrat 18/28 for the items. Figma's three rows are 367, 372
 * and 361px tall; all three use 367.
 */

const TILE = { w: 447, h: 367 };
const pct = (v: number, of: number) => `${(v / of) * 100}%`;

const TextTile: React.FC<{ group: BenefitGroup }> = ({ group }) => (
  <RevealChild
    as="div"
    y={28}
    className={`relative grid overflow-hidden rounded-fig-l ${group.bg}`}
    style={{ aspectRatio: `${TILE.w} / ${TILE.h}` }}
  >
    <img
      src={group.art.src}
      alt=""
      aria-hidden="true"
      className="pointer-events-none absolute max-w-none"
      style={{
        left: pct(group.art.left, TILE.w),
        top: pct(group.art.top, TILE.h),
        width: pct(group.art.w, TILE.w),
        transform: group.art.rotate ? `rotate(${group.art.rotate}deg)` : undefined,
      }}
      loading="lazy"
      decoding="async"
    />
    {/* The text block is in the flow, so the tile's ratio is a minimum: where
        the text does not fit (320px), the tile grows instead of cutting it.
        `mt-auto` keeps the text at the foot, as Figma draws it. */}
    <div data-probe="benefit-tile" className="relative flex flex-col p-fig-24 xl:p-[46px]">
      <div className="relative mt-auto flex flex-col gap-fig-16 xl:gap-fig-24">
        <h3 className="font-sans text-h3 text-[#11255D]">{group.title}</h3>
        <ul className="flex flex-col gap-fig-12">
          {group.items.map((item) => (
            <li key={item} className="flex items-center gap-fig-12 font-body text-[18px] leading-[28px] text-[#11255D]">
              <span aria-hidden="true" className={`h-[7px] w-[7px] shrink-0 rounded-full ${group.dot}`} />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </RevealChild>
);

const PhotoTile: React.FC<{ photo: { sources: { url: string; w: number }[]; alt: string }; wide?: boolean }> = ({
  photo,
  wide,
}) => (
  <RevealChild
    as="div"
    y={28}
    className={`relative overflow-hidden rounded-fig-l bg-bg-secondary ${wide ? 'xl:col-span-2 xl:!aspect-auto' : ''}`}
    style={{ aspectRatio: `${TILE.w} / ${TILE.h}` }}
  >
    <div data-probe={wide ? 'benefit-wide' : 'benefit-photo'} className="absolute inset-0">
      <img
        src={photo.sources[photo.sources.length - 1].url}
        srcSet={srcSetOf(photo.sources)}
        sizes={wide ? '(min-width: 1280px) 66vw, (min-width: 768px) 50vw, 100vw' : '(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw'}
        alt={photo.alt}
        className="h-full w-full object-cover"
        loading="lazy"
        decoding="async"
      />
    </div>
  </RevealChild>
);

const Benefits: React.FC = () => (
  <section id="benefits" className="py-fig-64 lg:py-fig-120" aria-labelledby="benefits-title">
    <h2 id="benefits-title" className="sr-only">
      Benefits
    </h2>
    <Container>
      <Reveal stagger className="grid grid-cols-1 gap-fig-16 md:grid-cols-2 md:gap-x-fig-24 md:gap-y-fig-20 xl:grid-cols-3">
        <TextTile group={BENEFITS.essential} />
        <PhotoTile photo={BENEFIT_PHOTOS.a} />
        <TextTile group={BENEFITS.health} />
        <PhotoTile photo={BENEFIT_PHOTOS.b} />
        <TextTile group={BENEFITS.worklife} />
        <PhotoTile photo={BENEFIT_PHOTOS.c} />
        <PhotoTile photo={BENEFIT_PHOTOS.wide} wide />
        <TextTile group={BENEFITS.learning} />
      </Reveal>
    </Container>
  </section>
);

export default Benefits;
