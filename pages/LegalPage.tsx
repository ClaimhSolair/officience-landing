import React from 'react';
import Container from '../components/ui/Container';
import LegalDocument from '../components/LegalDocument';
import LegalToc from '../components/LegalToc';
import { PRIVACY_SECTIONS, TERMS_SECTIONS } from '../components/legalContent';
import { usePageView } from '../lib/pageMeta';
import type { LegalDoc } from '../types';

/**
 * Figma 2922:1887 (Terms) and 2927:3153 (Privacy) — both 1440 artboards, and the
 * only pages in the redesign with no 390 frame, so the mobile treatment here is
 * this file's own: the hero type steps down and the contents panel collapses.
 *
 * The heading is "Terms of Use", not the July build's "Terms & Conditions"; the
 * footer link was already relabelled to match in the footer step.
 */
const DOCS = {
  terms: { label: 'Terms of Use', sections: TERMS_SECTIONS },
  privacy: { label: 'Privacy Policy', sections: PRIVACY_SECTIONS },
} as const;

/**
 * Figma prints this in the hero of both documents. It describes the copy in
 * `legalContent.ts`, so it belongs next to that copy's own provenance — if the
 * text is revised, this moves with it.
 */
const LAST_UPDATED = 'Last updated: June 2026';

const LegalPage: React.FC<{ doc: LegalDoc }> = ({ doc }) => {
  const { label, sections } = DOCS[doc];

  // These pages carry X-Robots-Tag: noindex and the canonical stays pinned to
  // "/", so the title is purely for the reader's tab, history, and analytics.
  usePageView(`${label} — Officience`);

  return (
    <article className="flex flex-col">
      <header className="bg-bg-primary">
        {/* Figma insets the hero copy 42px at 1440 where the body below it sits on
            the artboard's own 24px gutter. The content column wins, so the two
            line up. */}
        {/* Figma's band is 478 tall around 147 of copy — 124 above, 207 below. The
            slack under the title is deliberate in the artboard, so it is kept. */}
        <Container className="flex flex-col gap-fig-16 py-fig-40 lg:pb-[207px] lg:pt-[124px]">
          <h1 className="font-sans text-h1 text-white lg:text-display-xl">{label}</h1>
          <p className="font-body text-body-lg text-white lg:text-subtitle-2">{LAST_UPDATED}</p>
        </Container>
      </header>

      {/* 1440 draws 448 / 140 / 804 across the 1392 content column, with the rule
          centred in the gap. Figma stops that rule after ~843px — about the height
          of the contents card — but with the panel sticky it runs the full column
          here, which is what a column divider is for. */}
      <Container className="flex flex-col gap-fig-24 py-fig-32 lg:flex-row lg:gap-0 lg:py-fig-64">
        <div className="lg:mr-[70px] lg:w-[448px] lg:shrink-0">
          <LegalToc sections={sections} />
        </div>
        <div className="min-w-0 lg:flex-1 lg:border-l lg:border-border-frame lg:pl-[70px]">
          <LegalDocument sections={sections} />
        </div>
      </Container>
    </article>
  );
};

export default LegalPage;
