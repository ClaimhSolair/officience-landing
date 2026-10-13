import React, { useMemo } from 'react';
import LegalDocument from '../components/LegalDocument';
import LegalToc from '../components/LegalToc';
import { PRIVACY_SECTIONS, TERMS_SECTIONS } from '../components/legalContent';
import type { LegalSection } from '../components/legalContent';
import { usePageView } from '../lib/pageMeta';
import type { LegalDoc } from '../types';

/**
 * Figma 2922:1887 (Terms) and 2927:3153 (Privacy) — both 1440 artboards, and the
 * only pages in the redesign with no 390 frame, so the mobile treatment here is
 * this file's own: the hero type steps down and the contents panel collapses.
 *
 * The heading is "Terms of Use", not the July build's "Terms & Conditions"; the
 * footer link was already relabelled to match in the footer step.
 *
 * `updated` is the date in the hero, where Figma prints it. It describes the copy
 * in `legalContent.ts`, so change it when that copy changes. The Privacy date
 * comes from its .docx ("1 June 2026"); the body no longer repeats it. The Terms
 * .docx gives no day, so Terms keeps the month that Figma prints.
 */
const DOCS = {
  terms: { label: 'Terms of Use', sections: TERMS_SECTIONS, updated: 'Last updated: June 2026' },
  privacy: { label: 'Privacy Policy', sections: PRIVACY_SECTIONS, updated: 'Last updated: 1 June 2026' },
} as const;

/** An untitled first section is the document's lead (the Privacy intro), not a section. */
const splitLead = (sections: readonly LegalSection[]) =>
  sections[0] && !sections[0].id && !sections[0].title
    ? { lead: sections[0], body: sections.slice(1) }
    : { lead: null, body: [...sections] };

/**
 * The legal content column. Below fhd it is `Container` (1392 at 1440, 1792 cap).
 * From fhd (1880) the page has no 1920 frame, so it steps up the 1440 frame by
 * x1.333 in fixed px (user decision 2026-10-13): the column is 1856 (1392 x
 * 1.333), which gives 32px margins at 1920 (24 x 1.333) and 12px at 1880. Past
 * 1920 the column holds at 1856 and the margins take the slack.
 */
const Column: React.FC<{ className?: string; children: React.ReactNode }> = ({ className = '', children }) => (
  <div className="w-full px-fig-16 lg:px-fig-24 fhd:px-[12px]">
    <div className={`mx-auto w-full max-w-content-2 fhd:max-w-[1856px] ${className}`}>{children}</div>
  </div>
);

const LegalPage: React.FC<{ doc: LegalDoc }> = ({ doc }) => {
  const { label, sections, updated } = DOCS[doc];
  const { lead, body } = useMemo(() => splitLead(sections), [sections]);

  // These pages carry X-Robots-Tag: noindex, so the title serves the reader's
  // tab, the history, and analytics. `usePageView` now also points the canonical
  // at this route, which agrees with noindex better than a canonical to "/".
  usePageView(`${label} — Officience`);

  return (
    <article className="flex flex-col">
      <header className="bg-bg-primary">
        {/* Figma puts the hero copy at x 42 at 1440, 18px inside the 24px gutter
            of the body below it. The build follows Figma (user decision D6,
            2026-10-13), so the copy no longer lines up with the contents card.
            From fhd every value is the 1440 value x1.333: the copy at x 56 at
            1920, the band 637 tall (165 above, 276 below). */}
        {/* Figma's band is 478 tall around 147 of copy — 124 above, 207 below. The
            slack under the title is deliberate in the artboard, so it is kept. */}
        <Column className="flex flex-col gap-fig-16 py-fig-40 lg:pb-[207px] lg:pl-[18px] lg:pt-[124px] fhd:gap-[21px] fhd:pb-[276px] fhd:pl-[24px] fhd:pt-[165px]">
          <h1 className="font-sans text-h1 text-white lg:text-display-xl fhd:text-[115px] fhd:leading-[127px]">{label}</h1>
          <p className="font-body text-body-lg text-white lg:text-subtitle-2 fhd:text-[37px] fhd:leading-[48px]">{updated}</p>
        </Column>
      </header>

      {/* Figma 2927:3566: the Privacy intro is a full-width lead between the hero
          and the body, Subtitle 24/36 #5A5A5A, upright. It sits at x 51 and is
          1338 wide at 1440 (27px inside the column on each side), 80px under the
          hero and 80px over the body. One empty line separates the paragraphs.
          Below lg the lead steps down to 16/26, as the hero date does (28/36 to
          16/26), so the lead stays no larger than the date. The grey keeps it
          apart from the body copy. The gaps scale with the width. From fhd the
          lead is the 1440 lead x1.333: 32/48, x 68 at 1920, 107px gaps. */}
      {lead && (
        <Column className="flex flex-col gap-[26px] pt-fig-32 font-body text-body-lg text-subtitle md:pt-fig-40 lg:gap-[36px] lg:px-[27px] lg:pt-fig-80 lg:text-subtitle-1 fhd:gap-[48px] fhd:px-[36px] fhd:pt-[107px] fhd:text-[32px] fhd:leading-[48px]">
          {lead.clauses.flatMap((clause) => clause.blocks).map((block, i) =>
            block.kind === 'p' ? <p key={i}>{block.text}</p> : null,
          )}
        </Column>
      )}

      {/* 1440 draws 448 / 140 / 804 across the 1392 content column, with the rule
          centred in the gap. Figma stops that rule after ~843px — about the height
          of the contents card — but with the panel sticky it runs the full column
          here, which is what a column divider is for. The rule is
          `Border/Outline Field` #C6C6C6, and the copy column inside it is 784.

          The body starts 120px under the hero (Terms), or 80px under the lead
          (Privacy). Below lg these gaps scale with the width: 64 / 40 at 768,
          32 / 24 at 390. From fhd every value is x1.333: 597 / 187 / 1045
          across the column, 160 / 107 top gaps.

          The bottom padding is a touch larger than the top: the artboard sets the
          body tight to the footer, and the 2026-08-27 review asked for air between
          the last block and the blue footer. Most of that separation now comes
          from the footer's own top padding; this keeps a little white gap on top.
          Divergence from Figma's spacing, on request. */}
      <Column
        className={`flex flex-col gap-fig-24 pb-fig-48 lg:flex-row lg:gap-0 lg:pb-fig-64 fhd:pb-[85px] ${
          lead
            ? 'pt-fig-24 md:pt-fig-40 lg:pt-fig-80 fhd:pt-[107px]'
            : 'pt-fig-32 md:pt-fig-64 lg:pt-fig-120 fhd:pt-[160px]'
        }`}
      >
        <div className="lg:mr-[70px] lg:w-[448px] lg:shrink-0 fhd:mr-[93px] fhd:w-[597px]">
          <LegalToc sections={body} />
        </div>
        <div className="min-w-0 lg:flex-1 lg:border-l lg:border-border-field lg:pl-[70px] fhd:pl-[93px]">
          <LegalDocument sections={body} />
        </div>
      </Column>
    </article>
  );
};

export default LegalPage;
