import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { sectionAnchor, sectionHeading } from './LegalDocument';
import type { LegalSection } from './legalContent';

/**
 * The legal pages' contents panel — Figma 2923:2493, inside TERMS OF USE
 * 2922:1887 (a 1440 artboard; there is no 390 frame for these pages).
 *
 * A white card of 24px Lexend rows, the current one filled blue. It sticks
 * beside the document on desktop and collapses to a single disclosure row at
 * 390, where a twelve-item list ahead of the copy would bury the document.
 *
 * Which row is "current" is decided by scroll position rather than by
 * IntersectionObserver: legal sections run to several screens each, so at most
 * times NO section boundary is intersecting anything, and an observer would
 * simply stop reporting. Taking the last section whose top has passed under the
 * header always has an answer.
 */
interface LegalTocProps {
  sections: LegalSection[];
  /** Distance from the top that counts as "current" — clears the sticky header. */
  offset?: number;
}

const LegalToc: React.FC<LegalTocProps> = ({ sections, offset = 140 }) => {
  const items = useMemo(
    () =>
      sections
        .map((section, i) => ({ id: sectionAnchor(section, i), label: sectionHeading(section) }))
        .filter((item) => item.label),
    [sections],
  );

  const [active, setActive] = useState(() => items[0]?.id ?? '');
  const [open, setOpen] = useState(false);

  const sync = useCallback(() => {
    let current = items[0]?.id ?? '';
    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el && el.getBoundingClientRect().top <= offset) current = item.id;
    }
    setActive(current);
  }, [items, offset]);

  useEffect(() => {
    // No rAF wrapper: scroll already fires at most once a frame, so wrapping it
    // only adds a frame of lag and one more thing that can stall.
    sync();
    window.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    return () => {
      window.removeEventListener('scroll', sync);
      window.removeEventListener('resize', sync);
    };
  }, [sync]);

  const activeLabel = items.find((item) => item.id === active)?.label ?? items[0]?.label ?? '';

  const list = (
    <ol className="flex flex-col gap-[14px]">
      {items.map((item) => {
        const isActive = item.id === active;
        return (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              /* Claim the row on click rather than waiting for the scroll to
                 settle. Otherwise whether your click highlights the section you
                 asked for depends on where it lands against the spy's line, and
                 a section that stops a pixel low would highlight its
                 predecessor. Scrolling takes over again from the next event. */
              onClick={() => {
                setActive(item.id);
                setOpen(false);
              }}
              aria-current={isActive ? 'true' : undefined}
              className={`block px-fig-20 py-fig-12 font-sans text-h3 transition-colors motion-reduce:transition-none ${
                isActive ? 'bg-bg-primary text-white' : 'text-subtitle hover:text-text-primary'
              }`}
            >
              {item.label}
            </a>
          </li>
        );
      })}
    </ol>
  );

  return (
    <nav aria-label="On this page" className="bg-bg-default lg:sticky lg:top-[140px]">
      {/* 390 has no frame of its own, so the panel becomes a disclosure naming the
          section you are in. The trigger disappears from lg up, but the list is
          rendered ONCE for both: two copies would put twelve duplicate anchors in
          the document and leave the two states free to disagree. */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="legal-toc-list"
        className="flex min-h-[56px] w-full items-center justify-between gap-fig-12 px-fig-16 py-fig-12 text-left lg:hidden"
      >
        <span className="flex min-w-0 flex-col">
          <span className="font-body text-[10px] uppercase leading-[14px] tracking-[0.04em] text-subtitle">
            On this page
          </span>
          <span className="truncate font-sans text-h4 text-text-default">{activeLabel}</span>
        </span>
        <ChevronDown
          size={20}
          aria-hidden="true"
          className={`shrink-0 text-text-primary transition-transform motion-reduce:transition-none ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      <div
        id="legal-toc-list"
        className={`px-fig-16 pb-fig-12 lg:block lg:p-fig-32 ${open ? 'block' : 'hidden'}`}
      >
        {list}
      </div>
    </nav>
  );
};

export default LegalToc;
