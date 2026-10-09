import React from 'react';
import { Building2, IdCard, ListChecks, type LucideIcon } from 'lucide-react';
import { ABOUT_COMPANY, type Job } from '../../content/careers/jobs';

/**
 * The job page's main column — Figma 3878:18827, 849px wide on the artboard.
 * Three blocks (About us, About the role, Qualifications), with a rule between
 * them and 77px of space above and below each rule.
 *
 * A block heading is a 40px icon and a Heading-H1 title in Text/Primary. The
 * icons are Lucide, not the drawn Iconly set (ruling 21i). A list item is a
 * 14px #FF9FAE dot in a 24px box, 24px in from the column edge.
 */

const Block: React.FC<{ icon: LucideIcon; title: string; children: React.ReactNode }> = ({
  icon: Icon,
  title,
  children,
}) => (
  <section className="flex flex-col gap-fig-16">
    <h2 className="flex items-center gap-fig-16 font-sans text-h2 text-text-primary lg:text-h1">
      <Icon className="h-[32px] w-[32px] shrink-0 lg:h-[40px] lg:w-[40px]" strokeWidth={1.75} aria-hidden="true" />
      {title}
    </h2>
    {children}
  </section>
);

const Bullets: React.FC<{ items: string[] }> = ({ items }) => (
  <ul className="flex flex-col gap-fig-16">
    {items.map((item) => (
      <li key={item} className="flex items-start gap-fig-8 pl-fig-24 font-body text-body-lg text-text-default lg:text-body-xl">
        <span aria-hidden="true" className="flex h-[26px] w-[24px] shrink-0 items-center justify-center lg:h-[28px]">
          <span className="h-[14px] w-[14px] rounded-full bg-sec-200" />
        </span>
        {item}
      </li>
    ))}
  </ul>
);

const Rule = () => <hr className="my-fig-40 border-0 border-t border-border-frame lg:my-[77px]" />;

const JobDetail: React.FC<{ job: Job }> = ({ job }) => (
  <div data-probe="job-main" className="flex min-w-0 flex-col">
    <Block icon={Building2} title="About us">
      <p className="font-body text-body-lg text-text-default lg:text-body-xl">{ABOUT_COMPANY}</p>
    </Block>
    <Rule />
    <Block icon={IdCard} title="About the role">
      <p className="font-body text-body-lg text-text-default lg:text-body-xl">{job.roleIntro}</p>
      <Bullets items={job.roleBullets} />
    </Block>
    <Rule />
    <Block icon={ListChecks} title="Qualifications">
      <Bullets items={job.qualifications} />
    </Block>
  </div>
);

export default JobDetail;
