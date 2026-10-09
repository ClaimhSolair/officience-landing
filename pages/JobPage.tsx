import React from 'react';
import { Link, Navigate, useOutletContext, useParams } from 'react-router-dom';
import type { LayoutContext } from '../App';
import { srcSetOf } from '../assets';
import JobDetail from '../components/career/JobDetail';
import JobOverview from '../components/career/JobOverview';
import JobSidebarList from '../components/career/JobSidebarList';
import { ROUTES } from '../components/navigation';
import Container from '../components/ui/Container';
import { formatPosted, jobBySlug } from '../content/careers/jobs';
import { usePageView } from '../lib/pageMeta';

/**
 * One job — Figma 3864:16770, drawn for Senior PHP Developer. Every job in
 * `content/careers/jobs.ts` uses this template. An unknown slug goes back to the
 * hub.
 *
 * The artboard has two rows. The top row is the breadcrumb, the title and the
 * meta line in an 801px column, 130px of space, and the 461x398 picture. The
 * second row is the 849px main column, 80px of space, and the 463px sidebar
 * (Overview, then the other openings). Both rows split by those ratios from xl.
 *
 * Below xl the 849 + 463 columns do not fit (1312px against a 976px column at
 * 1024), so the page stacks: the Overview card with "Apply" comes first, then
 * the details, then the other openings (spec, derivation grid).
 *
 * The picture is Figma's stretch of a portrait file into 461x398 (a flagged
 * slip). The file is baked at that ratio, so CSS distorts nothing more.
 */
const JobPage: React.FC = () => {
  const { slug } = useParams();
  const job = jobBySlug(slug);
  const { openApply } = useOutletContext<LayoutContext>();
  usePageView(job ? `${job.title} — Career — Officience` : 'Career — Officience');

  if (!job) return <Navigate to={ROUTES.career} replace />;

  return (
    <article data-probe="job-page" className="bg-surface pb-fig-64 pt-fig-32 lg:pb-fig-80 lg:pt-fig-80">
      <Container className="flex flex-col gap-fig-40 xl:gap-fig-32">
        <div className="flex flex-col gap-fig-24 xl:flex-row xl:items-start xl:gap-[130px]">
          <div className="flex min-w-0 flex-col gap-fig-32 lg:gap-fig-64 xl:flex-[801_1_0%]">
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center font-body text-body-lg text-text-default lg:px-fig-16 lg:py-fig-8 lg:text-body-xl">
                <li className="flex items-center">
                  <Link to={ROUTES.home} className="hover:underline">
                    Home
                  </Link>
                  <span aria-hidden="true" className="w-[16px] text-center text-[16px] text-[#A1AEBE]">
                    /
                  </span>
                </li>
                <li className="flex items-center">
                  <Link to={ROUTES.career} className="hover:underline">
                    Career
                  </Link>
                  <span aria-hidden="true" className="w-[16px] text-center text-[16px] text-[#A1AEBE]">
                    /
                  </span>
                </li>
                <li aria-current="page" className="font-bold text-text-primary">
                  {job.title}
                </li>
              </ol>
            </nav>
            <div className="flex flex-col gap-fig-24">
              <h1 className="font-sans text-h1 font-semibold text-text-default lg:text-display-md lg:font-semibold xl:text-display-lg">
                {job.title}
              </h1>
              {/* The rule runs 849px under an 801px column, as drawn. */}
              <div className="flex flex-col gap-[15px] border-t border-border-frame pt-[15px] xl:w-[106%]">
                <p className="flex items-center gap-fig-12 font-body text-body-lg text-subtitle lg:text-body-xl">
                  <span>{job.category}</span>
                  <span aria-hidden="true" className="h-[5px] w-[5px] rounded-full bg-sec-200" />
                  <time dateTime={job.postedAt}>{formatPosted(job.postedAt)}</time>
                </p>
              </div>
            </div>
          </div>
          <div
            className="relative w-full max-w-[461px] overflow-hidden rounded-fig-m bg-bg-secondary xl:max-w-none xl:flex-[461_1_0%]"
            style={{ aspectRatio: '461 / 398' }}
          >
            <img
              src={job.image.sources[job.image.sources.length - 1].url}
              srcSet={srcSetOf(job.image.sources)}
              sizes="(min-width: 1280px) 33vw, 461px"
              alt={job.image.alt}
              className="absolute inset-0 h-full w-full object-cover"
              loading="eager"
              decoding="async"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-y-fig-40 xl:grid-cols-[minmax(0,849fr)_minmax(0,463fr)] xl:grid-rows-[auto_1fr] xl:items-start xl:gap-x-fig-80">
          <div data-probe="job-side" className="xl:col-start-2 xl:row-start-1">
            <JobOverview job={job} onApply={() => openApply(job.slug)} />
          </div>
          <div className="xl:col-start-1 xl:row-span-2 xl:row-start-1">
            <JobDetail job={job} />
          </div>
          <div className="xl:col-start-2 xl:row-start-2">
            <JobSidebarList slug={job.slug} />
          </div>
        </div>
      </Container>
    </article>
  );
};

export default JobPage;
