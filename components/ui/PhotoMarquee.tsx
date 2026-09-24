import React, { useEffect, useRef, useState } from 'react';
import type { PhotoTile } from '../../assets';
import { srcSetOf } from '../../assets';

/**
 * A row of photos that loops without stop, for the DIY Jam story page
 * (Figma 3842:15308 and 3842:15420).
 *
 * It follows the marquee idiom of LogoMarquee and WorkingLife: the track holds
 * the set twice and the `marquee` keyframe moves it -50%, so the loop has no
 * seam. Three differences:
 *  - The track ends with one gap of padding. With `gap` alone the track is one
 *    gap short of two full sets, so -50% stops half a gap early and the loop
 *    jumps.
 *  - The duration comes from the set width, so every row moves at one speed
 *    (`SPEED`), whatever its length. The config's fixed 40s would move a long
 *    row four times faster than a short one.
 *  - Off screen, the row pauses with an inline `paused`. On screen, the inline
 *    value is cleared, so the `.marquee-track:hover` pause (index.html) still
 *    works. An inline `running` would override that rule.
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

const PhotoMarquee: React.FC<{ tiles: PhotoTile[]; label: string }> = ({ tiles, label }) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const [duration, setDuration] = useState<number | null>(null);

  // One set is half the track, padding included. Measured again whenever the
  // track changes size (the lg step, the styles arriving, a resize). The resize
  // listener is a second path, as in lib/pinnedTrack.ts.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => {
      const set = track.scrollWidth / 2;
      if (set > 0) setDuration(set / SPEED);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  useEffect(() => {
    const row = rowRef.current;
    const track = trackRef.current;
    if (!row || !track) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        track.style.animationPlayState = entry.isIntersecting ? '' : 'paused';
      },
      { threshold: 0 },
    );
    io.observe(row);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={rowRef} className="menu-scroll flex overflow-hidden motion-reduce:overflow-x-auto">
      <ul
        ref={trackRef}
        aria-label={label}
        className="marquee-track flex w-max animate-marquee motion-reduce:animate-none"
        style={{
          gap: GAP,
          paddingRight: GAP,
          ...(duration ? { animationDuration: `${duration.toFixed(2)}s` } : {}),
        }}
      >
        {tiles.map((t) => (
          <Tile key={`a-${t.url}`} tile={t} />
        ))}
        {tiles.map((t) => (
          <Tile key={`b-${t.url}`} tile={t} hidden />
        ))}
      </ul>
    </div>
  );
};

export default PhotoMarquee;
