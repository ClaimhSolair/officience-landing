import React from 'react';
import { Link } from 'react-router-dom';
import { srcSetOf } from '../../assets';
import { formatPosted, otherJobs } from '../../content/careers/jobs';
import { jobHref } from '../navigation';

/**
 * "Job Openings" on the job page — Figma 3878:18931. BG/Secondary, 8px radius,
 * 32px side padding. Each item is a 109x103 thumbnail, then a category pill and
 * the date on one line and the title under them, with a rule between items.
 *
 * Figma lists five industries here. The card lists the other open jobs instead
 * (ruling 21e). The title is Inter in Figma; it is Lexend here, the site's
 * heading font.
 */
const JobSidebarList: React.FC<{ slug: string }> = ({ slug }) => {
  const jobs = otherJobs(slug);
  if (!jobs.length) return null;

  return (
    <section
      aria-labelledby="job-list-title"
      className="flex flex-col gap-fig-40 rounded-fig-m bg-bg-secondary px-fig-16 py-fig-40 md:px-fig-32 md:py-fig-48"
    >
      <h2 id="job-list-title" className="font-sans text-h1 text-text-primary">
        Job Openings
      </h2>
      <ul className="flex flex-col">
        {jobs.map((job, i) => (
          <li key={job.slug} className={i ? 'mt-fig-16 border-t border-border-frame pt-fig-16' : ''}>
            <Link
              data-probe="other-job"
              to={jobHref(job.slug)}
              className="group flex items-center gap-fig-14 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <img
                src={job.thumb.sources[0].url}
                srcSet={srcSetOf(job.thumb.sources)}
                sizes="109px"
                alt=""
                width={109}
                height={103}
                className="h-[103px] w-[109px] shrink-0 rounded-fig-xs object-cover"
                loading="lazy"
                decoding="async"
              />
              <span className="flex min-w-0 flex-1 flex-col gap-fig-16">
                <span className="flex items-center justify-between gap-fig-8">
                  {/* Figma draws white on #63A4FC at 11px (2.55:1) and a 10px #A0A0A0
                      date. The audit sets 12px, white on #2D6DE0 (4.80:1), and
                      gray-quiet, so both reach 4.5:1. */}
                  <span className="rounded-fig-xs bg-[#2D6DE0] px-[10px] py-fig-2 font-body text-[12px] font-bold leading-[16px] text-white">
                    {job.category}
                  </span>
                  <span className="whitespace-nowrap font-body text-[12px] font-medium leading-[16px] text-gray-quiet">
                    {formatPosted(job.postedAt)}
                  </span>
                </span>
                <span className="font-sans text-[16px] font-semibold leading-[20px] tracking-[-0.02em] text-text-default group-hover:underline">
                  {job.title}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default JobSidebarList;
