import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Confirmed with the GA4 admin on 2026-08-20: Enhanced Measurement's
 * "Page changes based on browser history events" is **ON**, so GA4 already
 * reports every SPA navigation itself. Sending our own page_view too would
 * double-count every one of them — exactly one mechanism may be active.
 *
 * Flip this only if that toggle is ever switched off.
 */
const GA4_NEEDS_MANUAL_PAGE_VIEW = false;

/**
 * The title in index.html, captured before anything can change it. Using this
 * rather than a second copy of the string keeps the home page's title exactly
 * what the team signed off on in the markup.
 */
export const INITIAL_TITLE = document.title;

/**
 * The first pageview of a visit is not ours to send. index.html already reports
 * it — `gtag('config', …)` for GA4, and `_paq.push(['trackPageView'])` inside
 * __loadMatomo, which runs either on load (stored consent) or the moment the
 * visitor accepts. Sending it again here double-counts every landing.
 *
 * What was actually missing is everything after that: Matomo never watches
 * history, so SPA navigations went unreported. Those are what this module adds.
 */
let initialPageViewHandledElsewhere = true;

declare global {
  interface Window {
    _paq?: unknown[][];
  }
}

/**
 * The site origin, taken from the canonical tag that index.html ships. Reading
 * it keeps one copy of the domain in the project.
 */
const canonicalTag = (): HTMLLinkElement | null =>
  document.querySelector<HTMLLinkElement>('link[rel="canonical"]');

const SITE_ORIGIN = (() => {
  const href = canonicalTag()?.href;
  if (!href) return '';
  try {
    return new URL(href).origin;
  } catch {
    return '';
  }
})();

/**
 * Points the canonical tag at the route the reader is on.
 *
 * index.html pins the canonical to `/`, which is correct while the site has one
 * indexable page. A second indexable route needs its own value: a canonical that
 * says `/` tells a crawler that About Us is a copy of the home page.
 *
 * `og:url` stays static. A scraper does not run JavaScript, so a social card
 * always shows the home URL. Only a server render can correct that.
 */
const setCanonical = (path: string) => {
  const tag = canonicalTag();
  if (!tag || !SITE_ORIGIN) return;
  tag.href = path === '/' ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${path}`;
};

/**
 * Sets the document title for a route and reports the pageview, in that order
 * and in the same pass — so the two can never disagree.
 *
 * It lives in the page rather than in a router listener on purpose: a lazy
 * route's title is not known until its chunk has loaded, and a global listener
 * firing on the URL change would report every page under the previous page's
 * title.
 */
export const usePageView = (title: string = INITIAL_TITLE) => {
  const location = useLocation();
  const lastKey = useRef<string | null>(null);

  useEffect(() => {
    // StrictMode runs mount effects twice for the same history entry. Comparing
    // against only the previous key skips that repeat while still counting a
    // genuine return to this page via the back button.
    if (lastKey.current === location.key) return;
    lastKey.current = location.key;

    document.title = title;

    // The canonical belongs to the route, so it is set on the first page too —
    // before the early return that skips the duplicate first pageview.
    setCanonical(location.pathname);

    if (initialPageViewHandledElsewhere) {
      initialPageViewHandledElsewhere = false;
      return;
    }

    const url = location.pathname + location.search + location.hash;

    // Matomo does not watch history at all — its snippet fires a single
    // pageview on load. Before consent `_paq` is undefined and this is a no-op.
    window._paq?.push(['setCustomUrl', url], ['setDocumentTitle', title], ['trackPageView']);

    if (GA4_NEEDS_MANUAL_PAGE_VIEW) {
      window.gtag?.('event', 'page_view', {
        page_location: window.location.href,
        page_path: url,
        page_title: title,
      });
    }

    // Clarity and Vercel Analytics both hook history themselves — nothing to do.
  }, [location.key, location.pathname, location.search, location.hash, title]);
};
