import React from 'react';
import { Navigate, useOutletContext, useParams } from 'react-router-dom';
import type { LayoutContext } from '../App';
import Contact from '../components/Contact';
import { ROUTES, workHref } from '../components/navigation';
import SelectedWork from '../components/services/SelectedWork';
import ServiceHero from '../components/services/ServiceHero';
import CaseLayout from '../components/work/case/CaseLayout';
import { Challenge, Feedback, Impact, Solution, Team, TechStack } from '../components/work/case/CaseSections';
import { WORK_CASES } from '../content/work';
import type { WorkCase } from '../content/work/types';
import { usePageView } from '../lib/pageMeta';
import { useSectionViews } from '../lib/sectionViews';

/**
 * A case study — the IOGA frame 3770:4574 is the template, one route for all
 * of them: `/work/:slug`.
 *
 * The page stacks the hero (3779:4995), the body (the fact sidebar and the main
 * column, 120px under the hero), "Discover Other Works" (3816:7868) and the
 * contact band (3816:8130). The shared Footer comes from `Layout`.
 *
 * An unknown slug, or a project without a case study, goes to the Work listing.
 */

const CASE_SECTION_IDS = [
  'case-hero',
  'challenge',
  'solution',
  'impact',
  'tech-stack',
  'our-team',
  'feedback',
  'other-work',
  'contact',
] as const;

/** The contact blurb: 3816:8144 draws the hub's text (3257:2599). */
const CASE_BLURB = (
  <>
    We’d love to hear your story.
    <br />
    Every great partnership starts with a conversation. Tell us what you&apos;re building — we&apos;ll figure out
    the rest together.
  </>
);

const CaseBody: React.FC<{ data: WorkCase }> = ({ data }) => {
  usePageView(`${data.name} — Officience`, data.hero.subtitle);
  useSectionViews(CASE_SECTION_IDS, `work/${data.slug}`);
  const { openSurvey } = useOutletContext<LayoutContext>();

  return (
    <>
      <ServiceHero
        id="case-hero"
        titleId="case-hero-title"
        image={data.hero.image}
        title={data.hero.title}
        subtitle={data.hero.subtitle}
        tags={data.hero.tags}
        titleWidth={data.hero.titleWidth}
        subtitleWidth={data.hero.subtitleWidth}
        // As drawn (3816:7991). The label is the service-page copy; flagged.
        back={{ label: 'Back to All Brochure', to: ROUTES.work }}
      />
      <CaseLayout facts={data.facts}>
        <Challenge data={data.challenge} />
        <Solution steps={data.solution} />
        <Impact items={data.impact} />
        <TechStack groups={data.stack} />
        <Team people={data.team} />
        <Feedback quotes={data.quotes} />
      </CaseLayout>
      <SelectedWork
        id="other-work"
        cards={data.related}
        label="Other work"
        heading="Discover Other Works"
        viewAll={{ label: 'View All Work', to: ROUTES.work }}
      />
      <Contact onOpenSurvey={openSurvey} showOffices={false} blurb={CASE_BLURB} />
    </>
  );
};

const WorkCasePage: React.FC = () => {
  const { slug = '' } = useParams();
  const data = Object.prototype.hasOwnProperty.call(WORK_CASES, slug) ? WORK_CASES[slug] : undefined;
  // Slugs are lower case. A typed or shared "/work/IOGA" goes to the real URL,
  // not to the listing.
  const lower = slug.toLowerCase();
  if (!data && lower !== slug && Object.prototype.hasOwnProperty.call(WORK_CASES, lower)) {
    return <Navigate to={workHref(lower)} replace />;
  }
  if (!data) return <Navigate to={ROUTES.work} replace />;
  // Keyed by slug, so a move between two case studies mounts a fresh page.
  return <CaseBody key={data.slug} data={data} />;
};

export default WorkCasePage;
