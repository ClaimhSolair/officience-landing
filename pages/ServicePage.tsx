import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import ServiceHero from '../components/services/ServiceHero';
import ServiceRows from '../components/services/ServiceRows';
import ToolStrip from '../components/services/ToolStrip';
import SelectedWork from '../components/services/SelectedWork';
import Testimonials from '../components/services/Testimonials';
import TeamGrid from '../components/services/TeamGrid';
import { ROUTES, SERVICE_SECTION_IDS } from '../components/navigation';
import { SERVICE_PAGES } from '../content/services';
import type { ServicePageContent } from '../content/services/types';
import { usePageView } from '../lib/pageMeta';
import { useSectionViews } from '../lib/sectionViews';

/**
 * A service page — the Figma "Brochure" template (Software 3707:3568 is the
 * reference), one route for all seven pages: `/services/:slug`.
 *
 * The page stacks the template's parts in the Figma order. A part that the
 * content does not have is left out (People & Talent has no Selected Work and
 * no quotes). Each part owns its own vertical rhythm. There is no contact band,
 * because no service page draws one. The shared Footer comes from `Layout`.
 *
 * An unknown slug goes to the Services hub. `useSectionViews` reports the
 * section views, with the slug as the page key.
 */

const ServiceBody: React.FC<{ page: ServicePageContent }> = ({ page }) => {
  usePageView(`${page.name} — Officience`);

  useSectionViews(SERVICE_SECTION_IDS, page.slug);

  return (
    <>
      <ServiceHero
        image={page.hero.image}
        title={page.hero.title}
        subtitle={page.hero.subtitle}
        pill={page.hero.pill}
        titleWidth={page.hero.titleWidth}
        subtitleWidth={page.hero.subtitleWidth}
      />
      <ServiceRows rows={page.rows} />
      {page.tools && <ToolStrip logos={page.tools} label={`Tools we use for ${page.name}`} />}
      {page.work && <SelectedWork cards={page.work} label={`Selected ${page.name} work`} />}
      {page.quotes && <Testimonials quotes={page.quotes} />}
      <TeamGrid team={page.team} />
    </>
  );
};

const ServicePage: React.FC = () => {
  const { slug = '' } = useParams();
  const page = SERVICE_PAGES[slug];
  if (!page) return <Navigate to={ROUTES.services} replace />;
  // Keyed by slug, so a move between two service pages mounts a fresh page.
  return <ServiceBody key={page.slug} page={page} />;
};

export default ServicePage;
