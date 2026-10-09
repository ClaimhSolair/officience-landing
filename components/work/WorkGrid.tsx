import React from 'react';
import { Link } from 'react-router-dom';
import { srcSetOf } from '../../assets';
import { SEC, STAGGER } from '../../lib/motion';
import { hasCase } from '../../content/work';
import type { WorkProject } from '../../content/work/types';
import { workHref } from '../navigation';
import Reveal, { RevealChild } from '../ui/Reveal';

/**
 * The card grid of the Work listing — Figma 3353:3341 and 3403:3521.
 *
 * Two columns from md, 24px apart, with rows 96px apart from lg. A card is the
 * picture at the drawn 684:398 box (4px radius), and 20px below it the title in
 * Heading-H1 with the two chips on the right. The chips are Form Input Chips:
 * 36px high, white, a 1px Outline Field border, Body-md in Subtitle grey.
 *
 * The picture box is a share of the column at every width, so the box ratio is
 * the same everywhere. The title and the chips share one line where they fit,
 * and the chips go under the title where they do not (ruling 20g). Figma draws
 * one line at 1440. At 1280 only "Passerelles Numériques" needs two lines.
 *
 * Only a project with a case study is a link (ruling 20a).
 */

export const WorkChip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <li className="inline-flex h-[36px] items-center whitespace-nowrap rounded-fig-xs border border-border-field bg-white px-fig-12 py-fig-6 font-body text-body-md text-subtitle">
    {children}
  </li>
);

const CardBody: React.FC<{ project: WorkProject; linked: boolean }> = ({ project, linked }) => {
  const img = project.image;
  const widest = img.sources[img.sources.length - 1];
  return (
    <>
      <div
        data-aspect={`${img.w}/${img.h}`}
        className="relative w-full overflow-hidden rounded-fig-xs bg-gray-fig-100"
        style={{ aspectRatio: `${img.w} / ${img.h}` }}
      >
        <img
          src={widest.url}
          srcSet={srcSetOf(img.sources)}
          sizes="(min-width: 768px) calc(50vw - 36px), calc(100vw - 32px)"
          alt={img.alt}
          className={`absolute inset-0 h-full w-full object-cover ${linked ? 'transition-transform duration-500 ease-out group-hover:scale-[1.03]' : ''}`}
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="mt-fig-16 flex flex-wrap items-center justify-between gap-x-fig-24 gap-y-fig-12 lg:mt-fig-20">
        <h2
          id={`work-card-${project.slug}`}
          data-fit="2"
          className={`font-sans text-h2 font-medium text-text-primary lg:text-h1 ${linked ? 'group-hover:underline group-hover:underline-offset-4' : ''}`}
        >
          {project.title}
        </h2>
        <ul className="flex flex-wrap gap-fig-12" aria-label="Services">
          {project.tags.map((tag) => (
            <WorkChip key={tag}>{tag}</WorkChip>
          ))}
        </ul>
      </div>
    </>
  );
};

const WorkGrid: React.FC<{ projects: WorkProject[] }> = ({ projects }) => (
  <Reveal
    as="ul"
    stagger={STAGGER.base}
    className="grid grid-cols-1 gap-x-fig-24 gap-y-fig-48 md:grid-cols-2 lg:gap-y-fig-96"
  >
    {projects.map((project) => {
      const linked = hasCase(project.slug);
      return (
        <RevealChild as="li" key={project.slug} y={28} duration={SEC.revealFast}>
          {linked ? (
            <Link
              to={workHref(project.slug)}
              // The title names the link. Without this, the name starts with the
              // picture's long alt text and ends with the chips.
              aria-labelledby={`work-card-${project.slug}`}
              className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              <CardBody project={project} linked />
            </Link>
          ) : (
            <CardBody project={project} linked={false} />
          )}
        </RevealChild>
      );
    })}
  </Reveal>
);

export default WorkGrid;
