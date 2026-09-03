import React, { useEffect } from 'react';
import { track } from '@vercel/analytics';
import AboutHero from '../components/about/AboutHero';
import { ABOUT_SECTION_IDS } from '../components/navigation';
import { usePageView } from '../lib/pageMeta';

/**
 * The About Us page — Figma 3133:4423, a 1440 artboard.
 *
 * The file draws no 390 frame and no 1920 frame for this page, so the mobile
 * treatment and the widths above 1440 are this build's own. Mobile follows the
 * home page idiom; above 1440 the content column caps at 1792 like every other
 * page.
 *
 * Each section owns its own vertical rhythm, the same contract the home page
 * uses. This file only stacks them and reports the analytics.
 */

// One entry per section, recorded at most once per page load.
const tracked = new Set<string>();

const AboutPage: React.FC = () => {
  usePageView('About Us — Officience');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !tracked.has(entry.target.id)) {
            tracked.add(entry.target.id);
            // Vercel Analytics custom event — not GA4.
            track('section_view', { section: entry.target.id });
          }
        });
      },
      { threshold: 0.3 },
    );

    ABOUT_SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <AboutHero />
    </>
  );
};

export default AboutPage;
