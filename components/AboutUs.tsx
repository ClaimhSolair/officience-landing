import React from 'react';
import { ArrowRight } from 'lucide-react';
import { ASSETS } from '../assets';
import Container from './ui/Container';
import SectionBadge from './ui/SectionBadge';
import { DISCOVER_OUR_STORY, EXTERNAL } from './navigation';

/**
 * Figma 3144:3187 (1920) and 3187:4452 (390).
 *
 * Three parts: a manifesto with an eyebrow, a row of milestones, and three
 * full-width photo cards. The desktop cards lay the caption over the photo in
 * an inset tinted band; at 390 the same band sits below the image instead,
 * because a 358px-wide overlay would bury the picture.
 */

/** Emphasised opening, then the remainder in grey. */
const MANIFESTO_LEAD = "We don't just build software. We architect";
const MANIFESTO_REST = ' the future by empowering units of specialized technical talents.';

const MILESTONES = [
  { value: '6', label: 'Global Offices' },
  { value: '200', label: 'Special Talents' },
  { value: '20', label: 'Years milestone' },
  { value: '500+', label: 'Projects Done' },
];

interface StoryCard {
  title: string;
  body: string;
  /** Band tint. Each card gets its own. */
  tint: string;
  /** object-position for the crop the artboard draws. */
  focus: string;
  alt: string;
}

const STORY_CARDS: StoryCard[] = [
  {
    title: '20 Years of Delivery',
    body: "Since 2006, we've completed hundreds of projects for clients across Europe, Asia and beyond",
    tint: 'bg-pri-100',
    focus: 'object-[49%_64%]',
    alt: 'Officience team members gathered around a meeting-room table',
  },
  {
    title: 'Shared Value',
    body: "Our model is built on mutual growth. We empower our technical units so they can empower your vision. It's a cosmic cycle of technical excellence.",
    tint: 'bg-green-100',
    focus: 'object-bottom',
    alt: 'Officience colleagues working together',
  },
  {
    title: 'Global Reach',
    body: 'Connect with our teams in Vietnam, France, USA, Japan, Singapore.',
    tint: 'bg-sec-100',
    focus: 'object-bottom',
    alt: 'Officience team collaborating across offices',
  },
];

const AboutUs: React.FC = () => (
  <section id="about" className="bg-bg-secondary">
    <Container className="flex flex-col gap-fig-64 py-fig-64 lg:gap-fig-100 lg:py-fig-100">
      {/* Manifesto. The badge hugs the left edge while the text block sits on
          the right at desktop; they stack in reading order below xl. */}
      <div className="flex flex-col gap-fig-24 xl:flex-row xl:items-start xl:justify-between xl:gap-fig-64">
        <SectionBadge as="h2">About Us</SectionBadge>

        <div className="flex flex-col items-start gap-fig-24 xl:w-[1018px]">
          <p className="font-sans font-semibold text-h3 text-text-default lg:font-medium lg:text-display-sm">
            {MANIFESTO_LEAD}
            <span className="text-subtitle">{MANIFESTO_REST}</span>
          </p>
          <a
            href={DISCOVER_OUR_STORY.target.kind === 'external' ? DISCOVER_OUR_STORY.target.href : EXTERNAL.about}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center gap-fig-8 px-fig-24 font-sans font-semibold text-btn-lg text-text-primary transition-colors hover:text-[#000086] motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {DISCOVER_OUR_STORY.label}
            <ArrowRight className="h-[20px] w-[20px] shrink-0" strokeWidth={2} aria-hidden="true" />
          </a>
        </div>
      </div>

      {/* Milestones — two columns at 390, four from lg. */}
      <ul className="grid grid-cols-2 gap-x-fig-20 gap-y-fig-20 lg:grid-cols-4 lg:gap-x-fig-32">
        {MILESTONES.map(({ value, label }) => (
          <li key={label} className="flex flex-col items-center gap-fig-16 lg:gap-fig-8">
            <span className="font-sans font-medium text-display-sm text-text-primary lg:font-semibold lg:text-[86px] lg:leading-[74px] lg:tracking-[-0.03em]">
              {value}
            </span>
            <span className="text-center font-body text-body-lg text-subtitle lg:text-body-xl">{label}</span>
          </li>
        ))}
      </ul>

      {/* Story cards */}
      <div className="flex flex-col gap-fig-56 lg:gap-fig-64">
        {STORY_CARDS.map((card, i) => {
          const img = ASSETS.about.cards[i];
          return (
            <article
              key={card.title}
              className="overflow-hidden rounded-fig-xs bg-bg-secondary lg:rounded-fig-l"
            >
              <div className="relative">
                <img
                  src={img.large}
                  srcSet={`${img.small} 900w, ${img.large} ${img.largeWidth}w`}
                  sizes="(min-width: 1920px) 1792px, (min-width: 1024px) calc(100vw - 48px), calc(100vw - 32px)"
                  alt={card.alt}
                  className={`h-[220px] w-full object-cover ${card.focus} lg:h-[860px]`}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                />

                {/* One band, two positions: stacked under the photo at 390,
                    floating over it from lg — inset 200px each side and 60px
                    from the bottom, as the artboard draws it. */}
                <div
                  className={`flex flex-col gap-fig-8 p-fig-16 lg:absolute lg:bottom-[60px] lg:left-[200px] lg:right-[200px] lg:h-[176px] lg:flex-row lg:items-center lg:justify-between lg:gap-fig-32 lg:rounded-fig-xs lg:p-0 lg:px-fig-64 ${card.tint}`}
                >
                  <h3 className="font-sans font-semibold text-btn-lg text-text-primary lg:whitespace-nowrap lg:font-medium lg:text-h1">
                    {card.title}
                  </h3>
                  <p className="font-body text-caption text-text-primary lg:w-[405px] lg:text-right lg:font-sans lg:font-medium lg:text-btn-md">
                    {card.body}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </Container>
  </section>
);

export default AboutUs;
