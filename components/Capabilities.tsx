import React, { useRef } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { ASSETS } from '../assets';
import CarouselDots from './ui/CarouselDots';

const BROCHURE_URL = 'https://demo.officience.com/brochure';

const services = [
  {
    imageUrl: ASSETS.services.design,
    iconSize: 70,
    title: 'Design & Digital Experience',
    desc: 'Design the look and experience of your brand and digital products.',
    bullets: ['UX/UI design', 'Web design', 'Branding & visual identity', 'Product design'],
    url: `${BROCHURE_URL}/creative-tribe`,
  },
  {
    imageUrl: ASSETS.services.software,
    iconSize: 70,
    title: 'Software & Web Development',
    desc: 'Build the technology behind your business.',
    bullets: ['Web applications', 'Mobile apps', 'SaaS platforms', 'E-commerce platforms', 'Enterprise tools', 'System integration'],
    url: `${BROCHURE_URL}/it-craft`,
  },
  {
    imageUrl: ASSETS.services.data,
    iconSize: 64,
    title: 'Data Engineering & Processing',
    desc: 'Manage & process data to support your business operations.',
    bullets: ['Data entry and processing', 'Data cleaning and enrichment', 'Process outsourcing', 'Workflow support', 'CRM and operational data management'],
    url: `${BROCHURE_URL}/crunch`,
  },
  {
    imageUrl: ASSETS.services.bi,
    iconSize: 70,
    title: 'Business Intelligence & Analytics',
    desc: 'Turn your data into business insights.',
    bullets: ['Business intelligence dashboards', 'Data analytics', 'Forecasting models', 'AI & machine learning', 'Automation solutions'],
    url: `${BROCHURE_URL}/analytics`,
  },
];

const Capabilities: React.FC = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  return (
    <section id="capabilities" className="w-full max-w-content mx-auto px-[clamp(24px,7vw,100px)]">
      {/* Services Section: gap-48 between header and list */}
      <div className="flex flex-col gap-[clamp(32px,4vw,48px)]">

        {/* Header — title+subtitle (left), General Brochure CTA (right) */}
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-[20px] md:max-w-[578px]">
            <h2 className="t-display-xl text-text-default">What We Do</h2>
            <p className="t-subtitle text-subtitle">
              Comprehensive solutions tailored to your needs
            </p>
          </div>

          <a
            href={BROCHURE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="self-start inline-flex items-center gap-[8px] bg-[#1F49BF] hover:bg-[#000086] active:bg-[#000050] text-white px-[24px] py-[16px] shadow-fig-xs transition-colors whitespace-nowrap shrink-0"
          >
            <span className="t-button text-[clamp(15px,4.5vw,20px)]">View General Brochure</span>
            <ArrowUpRight size={24} strokeWidth={2} />
          </a>
        </div>

        {/* Service cards — mobile: scroll-snap swipe carousel (peek + dots); sm+: restore exact 2-up/4-up grid */}
        <div
          ref={trackRef}
          className="flex overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] gap-[clamp(20px,2vw,32px)] items-stretch sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-4"
        >
          {services.map((service, idx) => (
            <div
              key={idx}
              className="snap-center shrink-0 w-[82%] sm:w-auto sm:shrink bg-bg-default rounded-fig-xs shadow-fig-xs p-[24px] sm:p-[32px] flex flex-col justify-between gap-[32px] sm:h-full"
            >
              <div className="flex flex-col gap-[32px]">
                {/* Icon — 70px (Data 64px) */}
                <img
                  src={service.imageUrl}
                  alt={service.title}
                  width={service.iconSize}
                  height={service.iconSize}
                  className="object-contain shrink-0"
                  style={{ width: service.iconSize, height: service.iconSize }}
                  loading="lazy"
                />

                {/* Content */}
                <div className="flex flex-col gap-[16px]">
                  <div className="flex flex-col gap-[12px]">
                    <h3 className="t-h2 text-text-default">{service.title}</h3>
                    <p className="t-body-lg text-text-default">{service.desc}</p>
                  </div>

                  <ul className="t-body-lg text-text-default list-disc pl-[24px] space-y-0">
                    {service.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Per-card brochure text link */}
              <a
                href={service.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-[8px] py-3 sm:py-0 font-sans font-semibold text-[16px] leading-[24px] text-[#1F49BF] hover:text-[#63A4FC] active:text-[#000086] hover:gap-[12px] transition-all"
              >
                View brochure
                <ArrowRight size={20} strokeWidth={2} />
              </a>
            </div>
          ))}
        </div>

        {/* Mobile pagination dots (hidden once the grid is restored at sm) */}
        <CarouselDots containerRef={trackRef} count={services.length} className="sm:hidden -mt-2" />
      </div>
    </section>
  );
};

export default Capabilities;
