import React, { useEffect } from 'react';
import { track } from '@vercel/analytics';
import AboutHero from '../components/about/AboutHero';
import OurStory from '../components/about/OurStory';
import OurJourney from '../components/about/OurJourney';
import OurValues from '../components/about/OurValues';
import DiyJam from '../components/about/DiyJam';
import OurTeam from '../components/about/OurTeam';
import WorkingLife from '../components/about/WorkingLife';
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

/**
 * A section counts as seen when 30% of it is on screen, or 30% of the screen
 * shows it, whichever needs less. The pinned Our Journey is about 4,000px tall,
 * so 30% of the section never fits on any screen, and a plain `threshold: 0.3`
 * never reported it. The home page keeps its own plain threshold.
 */
const SEEN = 0.3;
const THRESHOLDS = Array.from({ length: 21 }, (_, i) => i / 20);

const AboutPage: React.FC = () => {
  usePageView('About Us — Officience');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const need = SEEN * Math.min(entry.boundingClientRect.height, window.innerHeight);
          const seen = entry.isIntersecting && entry.intersectionRect.height >= need;
          if (seen && !tracked.has(entry.target.id)) {
            tracked.add(entry.target.id);
            // Vercel Analytics custom event — not GA4.
            track('section_view', { section: entry.target.id });
          }
        });
      },
      { threshold: THRESHOLDS },
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
      <OurStory />
      <OurJourney />
      <OurValues />
      <DiyJam />
      <OurTeam />
      <WorkingLife />
    </>
  );
};

export default AboutPage;
