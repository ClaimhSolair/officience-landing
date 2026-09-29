import React from 'react';
import { srcSetOf } from '../../assets';
import { SEC, STAGGER } from '../../lib/motion';
import Container from '../ui/Container';
import Reveal, { RevealChild } from '../ui/Reveal';
import SectionBadge from '../ui/SectionBadge';
import type { ServicePageContent, TeamMember } from '../../content/services/types';
import { LinkedInIcon } from './parts';

/**
 * "Meet the Team" — Software 3707:5524.
 *
 * The badge and the Display-lg heading on the left, the stat line in Subtitle
 * grey on the right, and 100px below them the portrait cards: 428x479 on the
 * Gray/200 ground (the ground is baked into each file), with a Secondary name
 * plate 360px from the top.
 *
 * Three cards share the row. The AI Insurance page has four people, so it takes
 * four columns (user, 2026-09-29). Every card keeps the 428:479 ratio at every
 * width, and the plate stays at the same place in proportion.
 *
 * A LinkedIn icon shows only when the team gives the URL. None exists yet.
 */

/**
 * The plate's bottom edge, as a share of the card height. Figma ends the plate
 * at 450 of 478.66 (a 90px plate at 360). A taller plate (Linh Ngo on IT Ops, 142px
 * at 311) ends at the same place, so the plate grows upward.
 */
const PLATE_BOTTOM = `${((478.659 - 450) / 478.659) * 100}%`;

const Card: React.FC<{ person: TeamMember }> = ({ person }) => {
  const img = person.photo;
  const widest = img.sources[img.sources.length - 1];
  return (
    <RevealChild as="li" y={28} className="relative overflow-hidden rounded-fig-xs bg-[#D9D9D9]">
      <div className="relative w-full" style={{ aspectRatio: '428 / 479' }}>
        <img
          src={widest.url}
          srcSet={srcSetOf(img.sources)}
          sizes="(min-width: 1024px) 428px, calc(100vw - 32px)"
          alt={img.alt}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div
        className="absolute inset-x-[5.1%] flex items-center justify-between gap-fig-12 rounded-fig-xs bg-bg-secondary px-fig-20 py-fig-12"
        style={{ bottom: PLATE_BOTTOM }}
      >
        <div className="flex min-w-0 flex-col text-text-primary">
          <p className="font-sans text-h3 lg:text-h2">{person.name}</p>
          <p className="font-body text-body-md font-normal lg:text-body-lg">{person.role}</p>
        </div>
        {person.linkedin && (
          <a
            href={person.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <LinkedInIcon />
            <span className="sr-only">{person.name} on LinkedIn</span>
          </a>
        )}
      </div>
    </RevealChild>
  );
};

const TeamGrid: React.FC<{ team: ServicePageContent['team'] }> = ({ team }) => {
  const four = team.people.length >= 4;
  return (
    <section id="our-team" className="bg-surface py-fig-64 lg:py-fig-120">
      <Container className="flex flex-col gap-fig-40 lg:gap-fig-100">
        <Reveal
          as="div"
          stagger={STAGGER.base}
          className="flex flex-col gap-fig-16 lg:flex-row lg:items-end lg:justify-between lg:gap-fig-32"
        >
          <div className="flex flex-col items-start gap-fig-8 lg:gap-fig-16">
            <RevealChild as="span" y={20} duration={SEC.revealFast}>
              <SectionBadge size="sm">Meet the Team</SectionBadge>
            </RevealChild>
            {team.title && (
              <RevealChild as="span" y={28}>
                <h2 className="font-sans text-h1 font-semibold text-text-default lg:text-display-lg">{team.title}</h2>
              </RevealChild>
            )}
          </div>
          {team.statement && (
            <RevealChild as="p" y={28} className="font-sans text-h2 font-medium text-text-default lg:max-w-[801px] lg:text-display-sm">
              {team.statement}
            </RevealChild>
          )}
          {team.stat && (
            <RevealChild as="p" y={20} duration={SEC.revealFast} className="whitespace-pre-wrap font-body text-body-xl text-subtitle lg:w-[572px] lg:text-subtitle-1">
              {team.stat}
            </RevealChild>
          )}
        </Reveal>

        <Reveal
          as="ul"
          stagger={STAGGER.loose}
          className={`grid grid-cols-1 gap-fig-24 md:grid-cols-2 ${four ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} lg:gap-[54px]`}
        >
          {team.people.map((p) => (
            <Card key={p.name} person={p} />
          ))}
        </Reveal>
      </Container>
    </section>
  );
};

export default TeamGrid;
