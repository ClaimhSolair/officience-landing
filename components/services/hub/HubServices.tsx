import React from 'react';
import { SEC, STAGGER } from '../../../lib/motion';
import { serviceHref, type ServiceSlug } from '../../navigation';
import Button from '../../ui/Button';
import Container from '../../ui/Container';
import Reveal, { RevealChild } from '../../ui/Reveal';
import SectionBadge from '../../ui/SectionBadge';
import { ArrowRightIcon } from '../parts';

/**
 * "What We Do / Our Services" on the Services hub — Figma 3109:1854.
 *
 * Seven rows on a rule, each with 48px above and below. A row has the
 * Display-md name in Text/Primary and, 100px lower, its Subtitle-2 line on the
 * left; on the right a right-aligned list in Body-lg grey and a 253px "View
 * Brochure" button that opens the service page.
 *
 * **No deck (user, 2026-09-29).** The home page stacks its four rows as a
 * deck with a 248px peek. Seven rows would pin the last one at 1,601px, below
 * every screen, so the hub rows only reveal.
 *
 * This is its own component, not a variant of the home `Capabilities`: the hub
 * draws a smaller heading, no header button, smaller lists, a narrower rail and
 * a narrower button. The name and line widths are Figma's text boxes, so the
 * lines wrap where the artboard wraps them.
 */

interface HubRow {
  slug: ServiceSlug;
  title: string;
  titleW: number;
  line: string;
  lineW: number;
  items: string[];
}

// Copy is verbatim from 3109:1869. "AI Platform & Solutions" is the hub's own
// name for the Trusted AI page (flagged in adapter section 19).
const ROWS: HubRow[] = [
  {
    slug: 'design-digital',
    title: 'Design & Digital Experience',
    titleW: 801,
    line: 'Design the look and experience of your brand and digital products.',
    lineW: 549,
    items: ['Product design', 'Branding & visual identity', 'UX/UI design', 'Web design'],
  },
  {
    slug: 'software-web-development',
    title: 'Software & Web Development',
    titleW: 527,
    line: 'Build the technology behind your business.',
    lineW: 607,
    items: ['Web applications', 'E-commerce platforms', 'SaaS platforms', 'Mobile apps', 'Enterprise tools', 'System integrations'],
  },
  {
    slug: 'business-intelligence-analytics',
    title: 'Business Intelligence & Analytics',
    titleW: 643,
    line: 'Turn your data into business insights.',
    lineW: 784,
    items: ['Data analytics', 'Business intelligence dashboards', 'Automation solutions', 'Forecasting models', 'AI & machine learning'],
  },
  {
    slug: 'data-engineering-processing',
    title: 'Data Engineering & Processing',
    titleW: 705,
    line: 'Manage and process data to support your business operations.',
    lineW: 605,
    items: ['Data entry & processing', 'Data cleaning and enrichment', 'Workflow support', 'Process outsourcing', 'CRM and operational data management'],
  },
  {
    slug: 'it-operations-support',
    title: 'IT Operations & Support',
    titleW: 705,
    line: 'Keep your systems stable, secure, and always running.',
    lineW: 605,
    items: ['System monitoring & supervision', 'Technical support & helpdesk', 'Infrastructure management', 'Service continuity & maintenance'],
  },
  {
    slug: 'people-talent-solutions',
    title: 'People & Talent Solutions',
    titleW: 705,
    // Figma breaks the line after "for".
    line: 'Find and grow the right talent for\nyour team.',
    lineW: 605,
    items: ['HR operations & administration', 'Vietnam talent sourcing & hiring', 'Recruitment support', 'Culture & onboarding'],
  },
  {
    slug: 'trusted-ai-insurance',
    title: 'AI Platform & Solutions',
    titleW: 600,
    line: "Sovereign AI built for businesses that can't compromise on security or compliance.",
    lineW: 605,
    items: [
      'On-premise AI deployment',
      'Small Language Models (SLM) fine-tuning',
      'AI agents for regulated industries',
      'Document intelligence & extraction',
      'GDPR-compliant AI infrastructure',
    ],
  },
];

const HubServices: React.FC = () => (
  <section id="our-services" className="pt-fig-64 lg:pt-fig-120">
    <Container className="flex flex-col gap-fig-40 lg:gap-fig-100">
      <Reveal
        as="div"
        stagger={STAGGER.base}
        className="flex flex-col gap-fig-16 lg:flex-row lg:items-end lg:justify-between lg:gap-fig-32"
      >
        <div className="flex flex-col items-start gap-fig-8 lg:gap-fig-16">
          <RevealChild as="span" y={20} duration={SEC.revealFast}>
            <SectionBadge size="sm">What We Do</SectionBadge>
          </RevealChild>
          <RevealChild as="span" y={28}>
            <h2 className="font-sans text-h1 font-semibold text-text-default lg:whitespace-nowrap lg:text-display-lg">
              Our Services
            </h2>
          </RevealChild>
        </div>
        <RevealChild as="p" y={20} duration={SEC.revealFast} className="font-body text-body-xl text-subtitle lg:text-subtitle-1">
          Comprehensive solutions tailored to your needs
        </RevealChild>
      </Reveal>

      <ul className="flex flex-col border-b border-border-field lg:border-b-0">
        {ROWS.map((row) => (
          <Reveal
            key={row.slug}
            as="li"
            stagger={STAGGER.base}
            className="flex flex-col gap-fig-20 border-t border-border-field py-fig-32 lg:flex-row lg:items-start lg:justify-between lg:gap-fig-32 lg:py-fig-48"
          >
            <RevealChild as="div" y={28} className="flex min-w-0 flex-col gap-fig-12 lg:gap-fig-100">
              <h3 className="font-sans text-h3 text-text-primary lg:text-display-md" style={{ maxWidth: row.titleW }}>
                {row.title}
              </h3>
              <p className="font-body text-body-md text-subtitle lg:whitespace-pre-line lg:text-subtitle-2 lg:text-text-default" style={{ maxWidth: row.lineW }}>
                {row.line}
              </p>
            </RevealChild>

            <RevealChild
              as="div"
              y={24}
              delay={0.1}
              duration={SEC.revealFast}
              className="flex flex-col gap-fig-12 lg:w-[349px] lg:shrink-0 lg:items-end lg:gap-fig-48"
            >
              <ul className="flex flex-col gap-fig-2 font-body text-caption text-subtitle lg:text-right lg:text-body-lg">
                {row.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <Button
                to={serviceHref(row.slug)}
                variant="secondary"
                size="lg"
                className="w-full shadow-fig-xs lg:w-[253px] lg:text-btn-lg"
                icon={<ArrowRightIcon />}
              >
                View Brochure
                {/* All seven links read "View Brochure"; name the service for
                    anyone listing links out of context. */}
                <span className="sr-only"> — {row.title}</span>
              </Button>
            </RevealChild>
          </Reveal>
        ))}
      </ul>
    </Container>
  </section>
);

export default HubServices;
