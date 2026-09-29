import { useEffect } from 'react';
import { track } from '@vercel/analytics';

/**
 * Reports a `section_view` for each section id, at most once per page load.
 * The Services hub and the service pages use it. The event carries the page
 * key, so several pages can share one set of ids.
 *
 * A section counts as seen when 30% of it is on screen, or 30% of the screen
 * shows it, whichever needs less. This is the About page rule: a pinned
 * Selected Work is several screens tall, and a plain `threshold: 0.3` would
 * never report it.
 */

const tracked = new Set<string>();
const SEEN = 0.3;
const THRESHOLDS = Array.from({ length: 21 }, (_, i) => i / 20);

export const useSectionViews = (ids: readonly string[], page: string) => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const need = SEEN * Math.min(entry.boundingClientRect.height, window.innerHeight);
          const seen = entry.isIntersecting && entry.intersectionRect.height >= need;
          const key = `${page}/${entry.target.id}`;
          if (seen && !tracked.has(key)) {
            tracked.add(key);
            // Vercel Analytics custom event — not GA4.
            track('section_view', { section: entry.target.id, page });
          }
        });
      },
      { threshold: THRESHOLDS },
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
    // The ids are a constant list for each page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);
};
