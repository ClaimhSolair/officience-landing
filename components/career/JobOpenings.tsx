import React from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { LayoutContext } from '../../App';
import { JOBS, type Job } from '../../content/careers/jobs';
import { jobHref } from '../navigation';
import Button from '../ui/Button';
import Container from '../ui/Container';
import Reveal, { RevealChild } from '../ui/Reveal';
import SectionBadge from '../ui/SectionBadge';

/**
 * "Job Openings" — Figma 3325:2946. A header row (badge and Display-lg title on
 * the left, the job count on the right), then one ruled row per job.
 *
 * A row has the title and the excerpt on the left, 100px apart, and a 253px
 * column on the right: the place and the tags, right-aligned, then the outlined
 * "Apply" button at the foot. The title opens the job page; "Apply" opens the
 * apply form with the job's role chip selected (ruling 21g).
 *
 * Proportions (spec, derivation grid): the right column stays 253px and the
 * title column takes the rest, with a 48px minimum gap. The drawn gap is 442px,
 * so the row fits at 1024 (a 675px title column). Below md the row stacks.
 *
 * The count comes from the data. Figma draws "(06 jobs available)" over three
 * rows, a slip flagged in the spec.
 */

const Row: React.FC<{ job: Job; onApply: () => void }> = ({ job, onApply }) => (
  <Reveal as="li" stagger className="border-t border-border-frame py-fig-32 lg:py-fig-48">
    <div data-probe="job-row" className="flex flex-col gap-fig-24 md:flex-row md:justify-between md:gap-fig-48">
      <RevealChild
        as="div"
        y={28}
        className="flex min-w-0 flex-col gap-fig-16 md:flex-1 lg:max-w-[697px] lg:justify-between lg:gap-fig-100"
      >
        <h3 data-probe="job-title" className="font-sans text-h1 text-text-primary lg:text-display-md">
          <Link
            to={jobHref(job.slug)}
            className="hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {job.title}
          </Link>
        </h3>
        <p className="max-w-[549px] font-body text-body-xl text-text-default lg:text-subtitle-2">{job.excerpt}</p>
      </RevealChild>

      <RevealChild
        as="div"
        y={28}
        delay={0.1}
        className="flex flex-col gap-fig-20 md:w-[253px] md:shrink-0 md:items-end md:justify-between"
      >
        <ul
          className="flex flex-wrap gap-x-fig-12 gap-y-fig-2 font-body text-body-lg text-subtitle md:flex-col md:items-end md:text-right"
          aria-label={`${job.title}: place and skills`}
        >
          {[job.where, ...job.tags].map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <div data-probe="apply" className="w-full md:w-[253px]">
          <Button
            variant="secondary"
            size="xl"
            onClick={onApply}
            className="w-full !gap-fig-8"
            icon={<ArrowRight className="h-[20px] w-[20px] shrink-0" strokeWidth={2} aria-hidden="true" />}
          >
            Apply<span className="sr-only">: {job.title}</span>
          </Button>
        </div>
      </RevealChild>
    </div>
  </Reveal>
);

const JobOpenings: React.FC = () => {
  const { openApply } = useOutletContext<LayoutContext>();
  const count = String(JOBS.length).padStart(2, '0');

  return (
    <section id="job-openings" className="pt-fig-64 lg:pt-fig-120" aria-labelledby="job-openings-title">
      <Container className="flex flex-col gap-fig-40 lg:gap-fig-100">
        <Reveal stagger className="flex flex-col gap-fig-16 md:flex-row md:items-end md:justify-between">
          <RevealChild as="div" y={20} className="flex flex-col gap-fig-16">
            <SectionBadge size="sm">List (Job Openings)</SectionBadge>
            <h2 id="job-openings-title" className="font-sans text-h1 text-text-default lg:text-display-lg">
              Job Openings
            </h2>
          </RevealChild>
          <RevealChild
            as="p"
            y={20}
            className="font-body text-body-xl text-subtitle lg:text-subtitle-1"
          >
            <span data-probe="job-count" data-count={JOBS.length}>
              ({count} jobs available)
            </span>
          </RevealChild>
        </Reveal>

        <ul data-probe="rows" className="flex flex-col pb-fig-16 lg:pb-0">
          {JOBS.map((job) => (
            <Row key={job.slug} job={job} onApply={() => openApply(job.slug)} />
          ))}
        </ul>
      </Container>
    </section>
  );
};

export default JobOpenings;
