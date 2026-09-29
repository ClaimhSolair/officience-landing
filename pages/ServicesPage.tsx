import React from 'react';
import { useOutletContext } from 'react-router-dom';
import type { LayoutContext } from '../App';
import Contact from '../components/Contact';
import ServiceHero from '../components/services/ServiceHero';
import HubServices from '../components/services/hub/HubServices';
import OurRoots from '../components/services/hub/OurRoots';
import TailorMade from '../components/services/hub/TailorMade';
import { serviceSources } from '../assets';
import { usePageView } from '../lib/pageMeta';
import { useSectionViews } from '../lib/sectionViews';

/**
 * The Services hub — Figma 3109:1851, a 1440 artboard. It points to the seven
 * service pages.
 *
 * The page stacks the hero, "Our Services", "Tailor-made solutions", "Born &
 * raised in Paris" and the contact band. The sections sit 120px apart on the
 * page's own BG/Secondary, as the artboard draws them. The contact band is the
 * home `Contact` with the hub's own blurb and without the offices
 * (3257:2582). The shared Footer comes from `Layout`.
 */

const HUB_SECTION_IDS = ['service-hero', 'our-services', 'tailor-made', 'our-roots', 'contact'] as const;

const HERO = {
  sources: serviceSources('hub', 'hero', [800, 1280, 1646]),
  w: 1646,
  h: 956,
  alt: 'Otter mascots in coloured hoodies work and talk in three open meeting booths, blue, orange and teal.',
};

const HUB_BLURB = (
  <>
    We’d love to hear your story.
    <br />
    Every great partnership starts with a conversation. Tell us what you&apos;re building — we&apos;ll figure out
    the rest together.
  </>
);

const ServicesPage: React.FC = () => {
  usePageView('Services — Officience');
  useSectionViews(HUB_SECTION_IDS, 'services');
  const { openSurvey } = useOutletContext<LayoutContext>();

  return (
    <>
      <ServiceHero
        image={HERO}
        title={'Officience\nThe full stack data company'}
        titleWidth={1189}
        centeredWidth={1189}
        scrim={0.4}
        back={false}
      />
      <HubServices />
      <TailorMade />
      <OurRoots />
      <Contact onOpenSurvey={openSurvey} showOffices={false} blurb={HUB_BLURB} />
    </>
  );
};

export default ServicesPage;
