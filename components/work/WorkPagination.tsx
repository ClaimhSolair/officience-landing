import React, { useEffect, useRef } from 'react';

/**
 * The pagination of the Work listing — Figma 3426:3756: 30px cells 6px apart,
 * page numbers in Body-md grey, the current page white on Primary with a 4px
 * radius, an ellipsis cell, and a blue chevron at each end.
 *
 * Figma draws five pages with page 2 current. The listing has twelve projects
 * at six on a page, so it shows two (flagged in adapter section 20). With more
 * than five pages the row keeps the first, the last and the pages next to the
 * current one, with an ellipsis for each gap.
 */

const CHEVRON =
  'M2.26218 5.00013L5.69968 8.53584C5.766 8.60173 5.81891 8.68055 5.8553 8.7677C5.8917 8.85484 5.91086 8.94857 5.91166 9.04341C5.91246 9.13826 5.89489 9.23231 5.85997 9.3201C5.82505 9.40788 5.77349 9.48763 5.70829 9.5547C5.64308 9.62176 5.56555 9.6748 5.4802 9.71072C5.39486 9.74663 5.30341 9.7647 5.2112 9.76388C5.119 9.76306 5.02787 9.74335 4.94315 9.70592C4.85842 9.66848 4.78179 9.61407 4.71773 9.54584L0.789261 5.50513C0.659073 5.37118 0.585938 5.18953 0.585938 5.00013C0.585938 4.81073 0.659073 4.62908 0.789261 4.49513L4.71773 0.454415C4.84871 0.324302 5.02413 0.252306 5.20621 0.253933C5.38829 0.255561 5.56246 0.330681 5.69122 0.463116C5.81997 0.59555 5.89301 0.774702 5.89459 0.961985C5.89617 1.14927 5.82618 1.3297 5.69968 1.46441L2.26218 5.00013Z';

const Chevron: React.FC<{ right?: boolean }> = ({ right }) => (
  <svg aria-hidden="true" width="6.25" height="10" viewBox="0 0 6.25 10" fill="none" className={right ? '-scale-x-100' : ''}>
    <path d={CHEVRON} fill="currentColor" />
  </svg>
);

const CELL =
  'inline-flex h-[30px] min-w-[30px] items-center justify-center rounded-fig-xs px-fig-8 font-body text-body-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';

// The tap area of a button. The cell shows 30x30, and this invisible area makes
// the target 36x44. The 3px at each side fills the 6px gap, so two areas touch
// and do not overlap.
const HIT = "relative before:absolute before:-inset-x-[3px] before:-inset-y-[7px] before:content-['']";

/** The page numbers to show, with `null` for an ellipsis. */
const cells = (page: number, pages: number): (number | null)[] => {
  if (pages <= 5) return Array.from({ length: pages }, (_, i) => i + 1);
  const keep = [...new Set([1, page - 1, page, page + 1, pages])].filter((p) => p >= 1 && p <= pages).sort((a, b) => a - b);
  return keep.flatMap((p, i) => (i > 0 && p - keep[i - 1] > 1 ? [null, p] : [p]));
};

interface WorkPaginationProps {
  page: number;
  pages: number;
  onPage: (page: number) => void;
}

const WorkPagination: React.FC<WorkPaginationProps> = ({ page, pages, onPage }) => {
  const nav = useRef<HTMLElement>(null);
  const keepFocus = useRef(false);

  // Previous is off on the first page and Next is off on the last. A button
  // that turns off loses the focus, so the focus goes to the current page.
  useEffect(() => {
    if (!keepFocus.current) return;
    keepFocus.current = false;
    nav.current?.querySelector<HTMLElement>('[aria-current="page"]')?.focus({ preventScroll: true });
  }, [page]);

  const step = (to: number) => {
    keepFocus.current = to === 1 || to === pages;
    onPage(to);
  };

  if (pages <= 1) return null;
  return (
    <nav ref={nav} aria-label="Work pages" className="flex justify-center">
      <ul className="flex items-center gap-fig-6">
        <li>
          <button
            type="button"
            className={`${CELL} ${HIT} text-text-primary disabled:opacity-40`}
            onClick={() => step(page - 1)}
            disabled={page === 1}
            aria-label="Previous page"
          >
            <Chevron />
          </button>
        </li>
        {cells(page, pages).map((p, i) =>
          p === null ? (
            <li key={`gap-${i}`} className={`${CELL} text-gray-fig-400`} aria-hidden="true">
              …
            </li>
          ) : (
            <li key={p}>
              <button
                type="button"
                className={`${CELL} ${HIT} ${p === page ? 'bg-primary text-white' : 'text-gray-fig-400 hover:text-text-primary'}`}
                // The current page does nothing. A new entry for the same URL
                // added a Back step and sent the view to the top.
                onClick={() => p !== page && onPage(p)}
                aria-current={p === page ? 'page' : undefined}
                aria-label={`Page ${p}`}
              >
                {p}
              </button>
            </li>
          ),
        )}
        <li>
          <button
            type="button"
            className={`${CELL} ${HIT} text-text-primary disabled:opacity-40`}
            onClick={() => step(page + 1)}
            disabled={page === pages}
            aria-label="Next page"
          >
            <Chevron right />
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default WorkPagination;
