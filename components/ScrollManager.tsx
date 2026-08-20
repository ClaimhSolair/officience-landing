import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/** How long to keep looking for a hash target while a lazy route mounts. */
const HASH_RETRY_INTERVAL_MS = 50;
const HASH_RETRY_LIMIT = 20;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Puts the viewport where a new route expects it. Pageview reporting is not
 * here — it belongs with whichever page knows its own title (see
 * lib/pageMeta.ts).
 *
 * Renders nothing.
 */
const ScrollManager = () => {
  const location = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    // POP is the back/forward button: the browser restores the previous offset
    // itself, and scrolling here would fight it.
    if (navigationType === 'POP') return;

    if (!location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
      return;
    }

    // The target may live inside a lazy chunk that hasn't mounted yet. Poll for
    // it on a timer — rAF is the wrong tool here, since it stops firing in
    // backgrounded tabs and in the frozen-motion verification preview.
    const id = decodeURIComponent(location.hash.slice(1));
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let attempts = 0;
    let timer: number | undefined;

    const tryScroll = () => {
      const el = document.getElementById(id);
      if (el) {
        // Present on the first look means it's an anchor on the page already on
        // screen, so it can glide. Found only after a wait means we just landed
        // from another route — animating a full-page scroll there reads as jank.
        const smooth = attempts === 0 && !reduced;
        el.scrollIntoView({
          behavior: (smooth ? 'smooth' : 'instant') as ScrollBehavior,
          block: 'start',
        });
        return;
      }
      if (++attempts < HASH_RETRY_LIMIT) {
        timer = window.setTimeout(tryScroll, HASH_RETRY_INTERVAL_MS);
      }
    };
    tryScroll();

    return () => {
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [location.key, location.hash, navigationType]);

  return null;
};

export default ScrollManager;
