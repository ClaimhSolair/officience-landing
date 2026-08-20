import React, { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { track } from '@vercel/analytics';
import Hero from '../components/Hero';
import FlowerDivider from '../components/FlowerDivider';
import AboutUs from '../components/AboutUs';
import Capabilities from '../components/Capabilities';
import HowWeEngage from '../components/HowWeEngage';
import ClientStories from '../components/ClientStories';
import WhyOfficience from '../components/WhyOfficience';
import Contact from '../components/Contact';
import { SECTION_IDS } from '../components/navigation';
import { usePageView } from '../lib/pageMeta';
import type { LayoutContext } from '../App';

// One entry per section, recorded at most once per page load.
const tracked = new Set<string>();

const HomePage: React.FC = () => {
  const { openSurvey } = useOutletContext<LayoutContext>();

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
      <Hero />
      <FlowerDivider />
      <AboutUs />

      {/* Figma order: Services → Approach → Testimonials → Why Us → Contact → Footer.
          120px vertical rhythm between top-region sections (clamp-anchored). Lives here
          rather than on the layout's <main> so legal pages don't inherit the padding. */}
      <div className="flex flex-col gap-[clamp(56px,9vw,120px)]">
        <Capabilities />
        <HowWeEngage onOpenSurvey={openSurvey} />
        <ClientStories />

        {/* Blue background wrapper for bottom sections (Figma: Why Us frame contains Why Us + Contact + Footer) */}
        <div style={{ backgroundColor: '#1F49BF' }}>
          <WhyOfficience />
          <Contact onOpenSurvey={openSurvey} />
        </div>
      </div>
    </>
  );
};

export default HomePage;
