import React from 'react';
import { srcSetOf } from '../../assets';
import { SEC } from '../../lib/motion';
import Container from '../ui/Container';
import Reveal, { RevealChild } from '../ui/Reveal';
import SectionBadge from '../ui/SectionBadge';
import type { ServiceRow } from '../../content/services/types';
import { TagChip } from './parts';

/**
 * "What We Do": one row for each service line. Software 3707:3581 is the
 * reference: 120px of section padding, 100px from the badge to the rows, and
 * 120px between rows.
 *
 * A row has its text on the left (a 549px column: the Display-md title in
 * Text/Primary, the Subtitle-2 line, then the tag chips 146px lower) and its
 * picture on the right. The rows never alternate sides.
 *
 * Each picture box takes the file's ratio, so no picture crops or stretches.
 * Figma draws each picture at a fixed width (659-707). That width does not fit
 * beside the 549px column at 1024, so the picture is fluid up to its drawn
 * width, and the free space goes between the two columns, as on the artboard.
 */

const Row: React.FC<{ row: ServiceRow }> = ({ row }) => {
  const img = row.image;
  const widest = img.sources[img.sources.length - 1];
  return (
    <Reveal
      as="li"
      stagger
      className="flex flex-col gap-fig-24 lg:flex-row lg:items-start lg:justify-between lg:gap-fig-32"
    >
      <RevealChild as="div" y={28} className="flex flex-col gap-fig-24 lg:w-[549px] lg:shrink-0 lg:gap-fig-146">
        <div className="flex flex-col gap-fig-12 lg:gap-fig-24">
          <h3 className="font-sans text-h1 text-text-primary lg:text-display-md">{row.title}</h3>
          {row.tagline && <p className="font-body text-body-xl text-text-default lg:text-subtitle-2">{row.tagline}</p>}
        </div>
        <ul className="flex flex-wrap gap-fig-8 lg:max-w-[518px] lg:gap-fig-12" aria-label={`${row.title}: what it covers`}>
          {row.tags.map((tag) => (
            <TagChip key={tag}>{tag}</TagChip>
          ))}
        </ul>
      </RevealChild>

      <RevealChild
        as="div"
        y={28}
        delay={0.1}
        duration={SEC.revealBase}
        className="w-full lg:min-w-0 lg:flex-1"
        style={{ maxWidth: img.w }}
      >
        <div className="relative w-full" style={{ aspectRatio: `${img.w} / ${img.h}` }}>
          <img
            src={widest.url}
            srcSet={srcSetOf(img.sources)}
            sizes={`(min-width: 1024px) ${Math.round(img.w)}px, calc(100vw - 32px)`}
            alt={img.alt}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>
      </RevealChild>
    </Reveal>
  );
};

const ServiceRows: React.FC<{ rows: ServiceRow[] }> = ({ rows }) => (
  <section id="what-we-do" className="bg-surface py-fig-64 lg:py-fig-120">
    <Container className="flex flex-col gap-fig-40 lg:gap-fig-100">
      <Reveal as="div" y={20} duration={SEC.revealFast}>
        <SectionBadge as="h2" size="sm">
          What We Do
        </SectionBadge>
      </Reveal>
      <ul className="flex flex-col gap-fig-64 lg:gap-fig-120">
        {rows.map((row) => (
          <Row key={row.title} row={row} />
        ))}
      </ul>
    </Container>
  </section>
);

export default ServiceRows;
