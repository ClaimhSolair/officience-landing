import React from 'react';
import { Clock, Folder, MapPin, Users, Wallet, type LucideIcon } from 'lucide-react';
import type { Job } from '../../content/careers/jobs';
import Button from '../ui/Button';

/**
 * The Overview card — Figma 3878:18909. BG/Secondary, 8px radius, 80px of side
 * padding and 48px top and bottom on the 463px artboard column. Five facts, each
 * a 24px icon and a Body-lg-medium line, then the 306px "Apply for a job" and
 * "Save for later".
 *
 * "Save for later" is a drawn placeholder with no behaviour (ruling 21f). It
 * renders as Figma draws it, and it is marked disabled for assistive tech.
 */

const Fact: React.FC<{ icon: LucideIcon; children: React.ReactNode }> = ({ icon: Icon, children }) => (
  <li className="flex items-center gap-fig-12">
    <Icon className="h-[24px] w-[24px] shrink-0 text-gray-fig-400" strokeWidth={1.75} aria-hidden="true" />
    <span className="font-body text-body-lg font-medium text-text-default">{children}</span>
  </li>
);

const JobOverview: React.FC<{ job: Job; onApply: () => void }> = ({ job, onApply }) => (
  <section
    data-probe="job-overview"
    aria-labelledby="job-overview-title"
    className="flex flex-col gap-fig-40 rounded-fig-m bg-bg-secondary px-fig-24 py-fig-40 md:px-fig-80 md:py-fig-48"
  >
    <div className="flex flex-col gap-fig-40">
      <h2 id="job-overview-title" className="font-sans text-h1 text-text-primary">
        Overview
      </h2>
      <ul className="flex flex-col gap-fig-20">
        <Fact icon={Wallet}>{job.salary}</Fact>
        <Fact icon={MapPin}>{job.location}</Fact>
        <Fact icon={Folder}>{job.category}</Fact>
        <Fact icon={Clock}>
          <span className="block">{job.employment.type}</span>
          {/* gray-quiet, not the drawn #A0A0A0: small text needs 4.5:1 on #F7F7F7. */}
          <span className="block text-body-md text-gray-quiet">{job.employment.term}</span>
        </Fact>
        <Fact icon={Users}>{job.teamSize}</Fact>
      </ul>
    </div>
    <div className="flex w-full flex-col md:w-[306px]">
      <Button variant="primary" size="lg" onClick={onApply} className="w-full">
        Apply for a job
      </Button>
      <span
        role="button"
        aria-disabled="true"
        className="flex h-[56px] cursor-default items-center justify-center font-sans text-btn-md text-gray-fig-400"
      >
        Save for later
      </span>
    </div>
  </section>
);

export default JobOverview;
