import React, { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { track } from '@vercel/analytics';
import Hero from '../components/Hero';
import FlowerDivider from '../components/FlowerDivider';
import AboutUs from '../components/AboutUs';
import Capabilities from '../components/Capabilities';
import HowWeEngage from '../components/HowWeEngage';
import ProvenResults from '../components/ProvenResults';
import ClientStories from '../components/ClientStories';
import LogoMarquee from '../components/LogoMarquee';
import WhyOfficience from '../components/WhyOfficience';
import Contact from '../components/Contact';
import { SECTION_IDS } from '../components/navigation';
import { usePageView } from '../lib/pageMeta';
import type { LayoutContext } from '../App';

// One entry per section, recorded at most once per page load.
const tracked = new Set<string>();

const HomePage: React.FC = () => {
  const { openSurvey, splashDone } = useOutletContext<LayoutContext>();

  // No argument: the home page keeps the title written in index.html.
  usePageView();

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

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Hero sits flush under the header, and the flower band supplies the
          separation before the next section — so neither takes the rhythm
          padding that the not-yet-rebuilt sections below still rely on. */}
      <Hero splashDone={splashDone} />
      <FlowerDivider />
      <AboutUs />
      <Capabilities />
      <HowWeEngage />
      <ProvenResults />
      <ClientStories />
      <LogoMarquee />

      {/* Figma order: Services → Approach → Proven Results → Testimonials → logo
          wall → Why Us → Contact → Footer. Every section above carries its own
          vertical padding now, so the clamp-gap wrapper the July build used for
          rhythm here is gone — stacking it on top would double each seam. */}
      <WhyOfficience />

      <Contact onOpenSurvey={openSurvey} />
    </>
  );
};

export default HomePage;
