import React from 'react';
import LegalDocument from '../components/LegalDocument';
import { TERMS_SECTIONS, PRIVACY_SECTIONS } from '../components/legalContent';
import { usePageView } from '../lib/pageMeta';
import type { LegalDoc } from '../types';

const DOCS = {
  terms: { label: 'Terms & Conditions', sections: TERMS_SECTIONS },
  privacy: { label: 'Privacy Policy', sections: PRIVACY_SECTIONS },
} as const;

interface LegalPageProps {
  doc: LegalDoc;
}

/**
 * Interim layout: correct copy, routes and semantics, styled from the existing
 * tokens. The Figma treatment (blue hero band, sticky scroll-spy contents) lands
 * with the legal-pages step.
 */
const LegalPage: React.FC<LegalPageProps> = ({ doc }) => {
  const { label, sections } = DOCS[doc];

  // These pages carry X-Robots-Tag: noindex and the canonical stays pinned to
  // "/", so the title is purely for the reader's tab, history, and analytics.
  usePageView(`${label} — Officience`);

  return (
    <article className="flex flex-col">
      <header className="bg-bg-primary px-[clamp(16px,4vw,64px)] py-[clamp(32px,5vw,64px)]">
        <div className="mx-auto w-full max-w-[900px]">
          <h1 className="t-display-md text-white">{label}</h1>
        </div>
      </header>
      <div className="px-[clamp(16px,4vw,64px)] py-[clamp(32px,4vw,64px)]">
        <div className="mx-auto w-full max-w-[900px]">
          <LegalDocument sections={sections} />
        </div>
      </div>
    </article>
  );
};

export default LegalPage;
