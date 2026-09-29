import React from 'react';
import type { PhotoTile } from '../../assets';
import { srcSetOf } from '../../assets';
import Marquee from './Marquee';

/**
 * A row of photos that loops without stop, for the DIY Jam story page
 * (Figma 3842:15308 and 3842:15420).
 *
 * The loop itself is `Marquee` (the set drawn twice, one speed for every
 * row, and the pause off screen and under the pointer).
 *
 * Each tile has a fixed height (240, and 461 from lg, the artboard) and takes
 * its file's own ratio, so no tile crops or stretches at any width. Reduced
 * motion stops the loop and lets the row scroll, so every photo stays
 * reachable. The second copy of the set is hidden from assistive technology.
 */

/** Travel speed of every row, in CSS px per second. */
const SPEED = 60;
/** The artboard's gap between tiles. */
const GAP = 12;

const Tile: React.FC<{ tile: PhotoTile; hidden?: boolean }> = ({ tile, hidden }) => {
  const ratio = tile.w / tile.h;
  return (
    <li
      className="h-[240px] shrink-0 lg:h-[461px]"
      style={{ aspectRatio: `${tile.w} / ${tile.h}` }}
      aria-hidden={hidden || undefined}
    >
      <img
        src={tile.url}
        srcSet={srcSetOf(tile.sources)}
        sizes={`(min-width: 1024px) ${Math.round(461 * ratio)}px, ${Math.round(240 * ratio)}px`}
        alt={hidden ? '' : tile.alt}
        className="h-full w-full object-cover"
        loading="lazy"
        decoding="async"
        draggable={false}
      />
    </li>
  );
};

const PhotoMarquee: React.FC<{ tiles: PhotoTile[]; label: string }> = ({ tiles, label }) => (
  <Marquee
    items={tiles}
    itemKey={(t) => t.url}
    renderItem={(t, _i, hidden) => <Tile tile={t} hidden={hidden} />}
    label={label}
    speed={SPEED}
    gap={GAP}
  />
);

export default PhotoMarquee;
