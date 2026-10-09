import React, { useEffect, useRef, useState } from 'react';

/**
 * A row (or a column) that loops without stop. PhotoMarquee, the service-page
 * tool strips and the service-page quotes use it.
 *
 * It follows the marquee idiom of LogoMarquee and WorkingLife: the track holds
 * the set twice and a keyframe moves it -50%, so the loop has no seam. Three
 * additions:
 *  - The track ends with one gap of padding. With `gap` alone the track is one
 *    gap short of two full sets, so -50% stops half a gap early and the loop
 *    jumps.
 *  - The duration comes from the set size, so every marquee moves at one speed
 *    (`speed`, in CSS px per second), whatever its length. The config's fixed
 *    40s would move a long row four times faster than a short one.
 *  - Off screen, the track pauses with an inline `paused`. On screen, the inline
 *    value is cleared, so the hover pause in index.html still works. An inline
 *    `running` would override that rule.
 *
 * `direction="x"` moves left. Reduced motion stops the loop and lets the row
 * scroll, so every item stays reachable. `direction="y"` moves up, inside a box
 * whose height the caller sets. It has no reduced-motion fallback of its own:
 * the caller shows a fixed list instead.
 *
 * `reverse` runs the loop the other way (right, or down). It is an inline
 * style, because the `?motion=on` rule in index.html sets the animation
 * shorthand, and that shorthand resets a direction that a class sets.
 *
 * `renderItem` gets `hidden` for the second copy of the set. The caller must
 * hide that copy from assistive technology and give it no alt text.
 */

interface MarqueeProps<T> {
  items: T[];
  renderItem: (item: T, index: number, hidden: boolean) => React.ReactNode;
  itemKey: (item: T, index: number) => string;
  /** The accessible name of the list. */
  label: string;
  direction?: 'x' | 'y';
  /** CSS px per second. */
  speed?: number;
  /** CSS px between items, and after the last one. */
  gap: number;
  /** Classes for the outer window, e.g. the height of a vertical marquee. */
  className?: string;
  /** Classes for the track, e.g. `items-center`. */
  trackClassName?: string;
  /** Run the loop the other way: right, or down. */
  reverse?: boolean;
}

function Marquee<T>({
  items,
  renderItem,
  itemKey,
  label,
  direction = 'x',
  speed = 60,
  gap,
  className = '',
  trackClassName = '',
  reverse = false,
}: MarqueeProps<T>) {
  const rowRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const vertical = direction === 'y';

  // One set is half the track, padding included. Measured again whenever the
  // track changes size (a breakpoint step, the styles arriving, a resize). The
  // resize listener is a second path, as in lib/pinnedTrack.ts.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => {
      const set = (vertical ? track.scrollHeight : track.scrollWidth) / 2;
      if (set > 0) setDuration(set / speed);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [vertical, speed]);

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

  const windowCls = vertical
    ? `overflow-hidden ${className}`
    : `menu-scroll flex overflow-hidden motion-reduce:overflow-x-auto ${className}`;
  const trackCls = vertical
    ? `marquee-track-y flex h-max flex-col animate-marquee-y motion-reduce:animate-none ${trackClassName}`
    : `marquee-track flex w-max animate-marquee motion-reduce:animate-none ${trackClassName}`;

  return (
    // The window carries the name. With reduced motion it scrolls, and the
    // browser puts a scroll box in the tab order. Without a name a screen reader
    // announced an empty stop there.
    <div ref={rowRef} role="group" aria-label={label} className={windowCls.trim()}>
      <ul
        ref={trackRef}
        className={trackCls.trim()}
        style={{
          gap,
          ...(vertical ? { paddingBottom: gap } : { paddingRight: gap }),
          ...(duration ? { animationDuration: `${duration.toFixed(2)}s` } : {}),
          ...(reverse ? { animationDirection: 'reverse' as const } : {}),
        }}
      >
        {items.map((item, i) => (
          <React.Fragment key={`a-${itemKey(item, i)}`}>{renderItem(item, i, false)}</React.Fragment>
        ))}
        {items.map((item, i) => (
          <React.Fragment key={`b-${itemKey(item, i)}`}>{renderItem(item, i, true)}</React.Fragment>
        ))}
      </ul>
    </div>
  );
}

export default Marquee;
