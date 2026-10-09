import React from 'react';
import CareerHero from '../components/career/CareerHero';
import OurCulture from '../components/career/OurCulture';
import JobOpenings from '../components/career/JobOpenings';
import Benefits from '../components/career/Benefits';
import { CAREER_SECTION_IDS } from '../components/navigation';
import { JOBS } from '../content/careers/jobs';
import { usePageView } from '../lib/pageMeta';
import { useSectionViews } from '../lib/sectionViews';

/**
 * The Career hub — Figma 3297:2342, a 1440 artboard. No other artboard exists,
 * so every other width comes from the derivation grid in
 * docs/superpowers/specs/2026-10-09-career-page-design.md.
 *
 * The page stacks the hero, "Our Culture", "Job Openings" and the Benefits
 * mosaic on BG/Default. The sections sit 120px apart, as the artboard draws them.
 * The shared Footer comes from `Layout`.
 */
const CareerPage: React.FC = () => {
  usePageView('Career — Officience');
  useSectionViews(CAREER_SECTION_IDS, 'career');

  return (
    <div data-probe="career-page" data-count={JOBS.length} className="flex flex-col bg-surface">
      <CareerHero />
      <OurCulture />
      <JobOpenings />
      <Benefits />
    </div>
  );
};

export default CareerPage;
