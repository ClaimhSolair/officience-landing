import React, { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { track } from '@vercel/analytics';
import Hero from '../components/Hero';
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
      <Hero onOpenSurvey={openSurvey} />

      {/* Frame 4229:4651 stacks the sections with a 120px gap (adapter 27). The gap
          is on this column, so a section carries only the padding that the frame
          draws inside it. Why Us and Contact share one blue band, so they sit
          outside the column and nothing separates them. */}
      <div className="flex flex-col gap-[64px] py-[64px] md:gap-[96px] md:py-[96px] lg:gap-[calc(120*var(--u))] lg:py-[calc(120*var(--u))]">
        <AboutUs />
        <Capabilities />
        {/* Success Stories and the client wall are one block in the frame
            (4382:7135), 24px apart, so the wall does not take the section gap. */}
        <div className="flex flex-col gap-fig-24 lg:gap-[calc(24*var(--u))]">
          <ProvenResults />
          <LogoMarquee />
        </div>
        <HowWeEngage />
        <ClientStories />
      </div>

      <WhyOfficience />
      <Contact onOpenSurvey={openSurvey} showEyebrow={false} />
    </>
  );
};

export default HomePage;
