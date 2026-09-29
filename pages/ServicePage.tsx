import React, { useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { track } from '@vercel/analytics';
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

/**
 * A service page — the Figma "Brochure" template (Software 3707:3568 is the
 * reference), one route for all seven pages: `/services/:slug`.
 *
 * The page stacks the template's parts in the Figma order. A part that the
 * content does not have is left out (People & Talent has no Selected Work and
 * no quotes). Each part owns its own vertical rhythm. There is no contact band,
 * because no service page draws one. The shared Footer comes from `Layout`.
 *
 * An unknown slug goes to the Services hub.
 */

// One entry per page and section, recorded at most once per page load.
const tracked = new Set<string>();

/**
 * A section counts as seen when 30% of it is on screen, or 30% of the screen
 * shows it, whichever needs less. This is the About page rule: the pinned
 * Selected Work is several screens tall, and a plain `threshold: 0.3` would
 * never report it.
 */
const SEEN = 0.3;
const THRESHOLDS = Array.from({ length: 21 }, (_, i) => i / 20);

const ServiceBody: React.FC<{ page: ServicePageContent }> = ({ page }) => {
  usePageView(`${page.name} — Officience`);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const need = SEEN * Math.min(entry.boundingClientRect.height, window.innerHeight);
          const seen = entry.isIntersecting && entry.intersectionRect.height >= need;
          const key = `${page.slug}/${entry.target.id}`;
          if (seen && !tracked.has(key)) {
            tracked.add(key);
            // Vercel Analytics custom event — not GA4.
            track('section_view', { section: entry.target.id, page: page.slug });
          }
        });
      },
      { threshold: THRESHOLDS },
    );

    SERVICE_SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [page.slug]);

  return (
    <>
      <ServiceHero image={page.hero.image} title={page.hero.title} subtitle={page.hero.subtitle} pill={page.hero.pill} />
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
