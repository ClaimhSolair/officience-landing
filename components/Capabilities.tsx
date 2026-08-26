import React from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import Container from './ui/Container';
import Reveal from './ui/Reveal';
import Button from './ui/Button';
import SectionBadge from './ui/SectionBadge';
import { MOTION } from '../lib/motion';
import { EXTERNAL } from './navigation';

/**
 * Figma 3137:1931 (1920) and 3187:4345 (390).
 *
 * Four services on a shared rule. Desktop splits each row in two: the name and
 * its one-line promise on the left, the offering list and the brochure link
 * right-aligned in a 350px rail. At 390 those four pieces stack in one column
 * and the type drops a whole step — 64px titles become 24px, the promise turns
 * grey, the offerings shrink to 12px.
 *
 * The rules differ between the two frames: 1920 draws one above every row, so a
 * rule also separates the header from the first service; 390 draws them only
 * between rows. Both are reproduced.
 */

interface Service {
  title: string;
  /** The single line under the name. */
  promise: string;
  offerings: string[];
  brochure: string;
}

/**
 * Copy follows the 1920 artboard, which wins wherever the two frames disagree —
 * and they disagree in several places, all listed in the Step 4 checkpoint.
 * Order is the artboards': analytics comes before data engineering, the reverse
 * of the 20th-anniversary build.
 */
const SERVICES: Service[] = [
  {
    title: 'Design & Digital Experience',
    promise: 'Design the look and experience of your brand and digital products.',
    offerings: ['Product design', 'Branding & visual identity', 'UX/UI design', 'Web design'],
    brochure: EXTERNAL.brochureCreativeTribe,
  },
  {
    title: 'Software & Web Development',
    promise: 'Build the technology behind your business.',
    offerings: [
      'Web applications',
      'E-commerce platforms',
      'SaaS platforms',
      'Mobile apps',
      'System integrations',
    ],
    brochure: EXTERNAL.brochureItCraft,
  },
  {
    title: 'Business Intelligence & Analytics',
    promise: 'Turn your data into business insights.',
    offerings: [
      'Data analytics',
      'Business intelligence dashboards',
      'Automation solutions',
      'AI & Machine Learning',
    ],
    brochure: EXTERNAL.brochureAnalytics,
  },
  {
    title: 'Data Engineering & Processing',
    promise: 'Manage and process data to support your business operations.',
    offerings: [
      'Data entry & processing',
      'Data cleaning and enrichment',
      'CRM management',
      'Process outsourcing',
    ],
    brochure: EXTERNAL.brochureCrunch,
  },
];

const Capabilities: React.FC = () => (
  <section id="capabilities" className="bg-bg-secondary">
    <Container className="flex flex-col gap-fig-40 py-fig-32 lg:gap-fig-100 lg:py-fig-100">
      {/* Header. Two columns from lg — name on the left, the promise and the
          catch-all brochure right-aligned on the right. */}
      <div className="flex flex-col gap-fig-24 lg:flex-row lg:items-start lg:justify-between lg:gap-fig-32">
        <div className="flex flex-col items-start gap-fig-8 lg:gap-fig-16">
          <SectionBadge>What We Do</SectionBadge>
          {/* 86px over a 74px line box, which is Display-xl's size on Display-md's
              leading — an override the artboard draws directly, not a named style. */}
          <h2 className="font-sans text-h1 text-text-default lg:whitespace-nowrap lg:text-[86px] lg:font-semibold lg:leading-[74px] lg:tracking-[-0.03em]">
            Our Services
          </h2>
        </div>

        <div className="flex flex-col gap-fig-24 lg:items-end lg:gap-fig-32">
          <p className="font-body text-body-md text-subtitle lg:text-right lg:text-subtitle-1">
            Comprehensive solutions tailored to your needs
          </p>

          <Button
            href={EXTERNAL.brochureIndex}
            size="lg"
            radius="none"
            className="w-[336px] max-w-full self-center shadow-fig-xs lg:w-auto lg:self-auto lg:gap-fig-14 lg:rounded-fig-m lg:text-btn-lg"
            icon={
              <>
                {/* The artboards use different arrows for the same button: a
                    straight one at 390, a diagonal at 1920. */}
                <ArrowRight
                  className="h-[24px] w-[24px] shrink-0 lg:hidden"
                  strokeWidth={2}
                  aria-hidden="true"
                />
                <ArrowUpRight
                  className="hidden h-[24px] w-[24px] shrink-0 lg:block"
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </>
            }
          >
            View All Brochure
          </Button>
        </div>
      </div>

      <ul className="flex flex-col">
        {SERVICES.map((service, i) => {
          const first = i === 0;
          const last = i === SERVICES.length - 1;
          return (
          <Reveal
            as="li"
            key={service.title}
            enabled={MOTION.services}
            delay={i * 0.06}
            /* 1920 rules every row, including the first; 390 only rules between. */
            className={`border-border-field ${first ? 'border-t-0 lg:border-t' : 'border-t'}`}
          >
            {/* At 390 a rule sits in 32px of air — the row's own 16px of padding
                plus the 16px the artboard's list puts between row and rule — so
                only the two outer edges of the list get the bare 16. */}
            <div
              className={`flex flex-col gap-fig-20 px-fig-16 lg:flex-row lg:items-start lg:justify-between lg:gap-fig-32 lg:px-0 lg:pb-fig-48 lg:pt-fig-64 ${
                first ? 'pt-fig-16' : 'pt-fig-32'
              } ${last ? 'pb-fig-16' : 'pb-fig-32'}`}
            >
              {/* Name + promise. The column takes the slack up to 800px, which
                  leaves the artboard's 642px trough at 1920 and closes it as the
                  viewport narrows. */}
              <div className="flex flex-col gap-fig-12 lg:flex-1 lg:gap-fig-100 lg:max-w-[800px]">
                <h3 className="font-sans text-h3 text-text-primary lg:text-display-md">
                  {service.title}
                </h3>
                <p className="font-body text-body-md text-subtitle lg:text-subtitle-2 lg:text-text-default">
                  {service.promise}
                </p>
              </div>

              {/* Offerings + brochure link, in a fixed rail so the four buttons
                  line up down the section. */}
              <div className="flex flex-col gap-fig-12 lg:w-[350px] lg:shrink-0 lg:gap-fig-100">
                <ul className="flex flex-col gap-fig-2 font-body text-caption text-subtitle lg:gap-fig-4 lg:text-right lg:text-body-xl">
                  {service.offerings.map((offering) => (
                    <li key={offering}>{offering}</li>
                  ))}
                </ul>

                <Button
                  href={service.brochure}
                  variant="secondary"
                  size="lg"
                  radius="m"
                  className="w-full shadow-fig-xs lg:w-[350px] lg:text-btn-lg"
                  icon={
                    <ArrowRight
                      className="h-[20px] w-[20px] shrink-0"
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  }
                >
                  View Brochure
                  {/* All four links read "View Brochure"; name the service for
                      anyone listing links out of context. */}
                  <span className="sr-only"> — {service.title}</span>
                </Button>
              </div>
            </div>
          </Reveal>
          );
        })}
      </ul>
    </Container>
  </section>
);

export default Capabilities;
