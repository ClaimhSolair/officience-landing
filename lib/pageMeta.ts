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
