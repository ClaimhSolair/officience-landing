import React, { useEffect, useState } from 'react';

interface CarouselDotsProps {
  /** Ref to the horizontal scroll-snap container whose direct children are the slides. */
  containerRef: React.RefObject<HTMLElement>;
  /** Number of slides (must match the container's direct child count). */
  count: number;
  /** Extra classes on the dot row — e.g. `sm:hidden` / `md:hidden` to hide once the grid is restored. */
  className?: string;
  /**
   * `pill` — the 20th-anniversary indicator: the active slide stretches into a bar.
   * `dot` — the Sept-2026 one (Figma 3153:8411): equal circles, the active one
   * 10px and blue against 8px grey, 16px apart.
   */
  variant?: 'pill' | 'dot';
  /** The word for one slide in the dot names: "Show <itemName> 2 of 4". */
  itemName?: string;
  /** The name of the dot group. */
  label?: string;
}

// Page indicators for the mobile scroll-snap carousels (services, testimonials).
// Swipe is the primary interaction; dots are a secondary indicator + tap-to-jump.
// Tracks the active slide by finding the child whose centre is nearest the viewport centre.
const CarouselDots: React.FC<CarouselDotsProps> = ({
  containerRef,
  count,
  className = '',
  variant = 'pill',
  itemName = 'slide',
  label = 'Slide navigation',
}) => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const children = Array.from(el.children) as HTMLElement[];
      if (children.length === 0) return;
      const center = el.scrollLeft + el.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      children.forEach((child, i) => {
        const childCenter = child.offsetLeft + child.offsetWidth / 2;
        const dist = Math.abs(childCenter - center);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      setActive(best);
    };

    el.addEventListener('scroll', update, { passive: true });
    update();
    return () => el.removeEventListener('scroll', update);
  }, [containerRef, count]);

  const goTo = (i: number) => {
    const el = containerRef.current;
    if (!el) return;
    const child = el.children[i] as HTMLElement | undefined;
    if (!child) return;
    const left = child.offsetLeft - (el.clientWidth - child.offsetWidth) / 2;
    el.scrollTo({ left, behavior: 'smooth' });
  };

  // The dots are plain buttons in a named group (U-27). The tab pattern needs tab
  // panels and arrow keys, and this row has neither. The active dot has
  // `aria-current`. Each dot is a Tab stop, as a button usually is.
  return (
    <div
      className={`flex items-center justify-center ${variant === 'dot' ? 'gap-fig-8' : 'gap-1'} ${className}`}
      role="group"
      aria-label={label}
    >
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          type="button"
          aria-current={active === i ? 'true' : undefined}
          aria-label={`Show ${itemName} ${i + 1} of ${count}`}
          onClick={() => goTo(i)}
          /* 44px tall so the tap target clears the guideline even though the
             dot itself is 8–10px. */
          className={`flex h-[44px] items-center justify-center ${variant === 'dot' ? 'w-[24px]' : 'w-6'}`}
        >
          {variant === 'dot' ? (
            <span
              className={`block rounded-full transition-all duration-300 motion-reduce:transition-none ${
                active === i ? 'h-[10px] w-[10px] bg-primary' : 'h-[8px] w-[8px] bg-[#D9D9D9]'
              }`}
            />
          ) : (
            <span
              className={`block h-2 rounded-full transition-all duration-300 ${
                active === i ? 'w-6 bg-[#1F49BF]' : 'w-2 bg-gray-300'
              }`}
            />
          )}
        </button>
      ))}
    </div>
  );
};

export default CarouselDots;
