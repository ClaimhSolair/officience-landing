import React from 'react';
import { ASSETS } from '../assets';

const MASCOT_URL = ASSETS.approach.mascot;

const steps = [
  {
    num: '01',
    title: 'Engage',
    desc: 'Meet our engagers to understand your pain points, find solutions, and build a roadmap together. We are COSMIC - guided by our core values of Caring, Openness & Sincerity, Merit, Innovation, Commitment.',
  },
  {
    num: '02',
    title: 'Collaborate',
    desc: 'Execute your project in agile mode - with proximity, transparency, and productivity. Small teams, people magic.',
  },
  {
    num: '03',
    title: 'Run',
    desc: 'Roll-out in production, adopt the products, and support your users.\nPeople first, tech second.',
  },
];

// onOpenSurvey kept for API compatibility (Figma has no CTA in this section).
interface HowWeEngageProps {
  onOpenSurvey?: () => void;
}

const HowWeEngage: React.FC<HowWeEngageProps> = () => {
  return (
    <section id="approach" className="w-full max-w-content mx-auto px-[clamp(24px,7vw,100px)]">
      {/* Figma: flex gap-80, items-start */}
      <div className="flex flex-col lg:flex-row gap-[clamp(40px,5vw,80px)] items-start">

        {/* Left: header + mascot image (Figma 600px column) */}
        <div className="w-full lg:w-[600px] shrink-0 flex flex-col gap-[clamp(32px,4vw,48px)]">
          <div className="flex flex-col gap-[20px]">
            <h2 className="t-display-xl text-text-default">Our Approach</h2>
            <p className="t-subtitle text-subtitle">This is how we work</p>
          </div>
          <img
            src={MASCOT_URL}
            alt="Officience mascots"
            width={600}
            height={312}
            className="w-full max-w-[600px] h-auto object-contain"
            loading="lazy"
          />
        </div>

        {/* Right: 3 step cards (Figma: gap-40, rounded-8, px-40 py-32) */}
        <div className="w-full lg:flex-1 flex flex-col gap-[clamp(24px,3vw,40px)]">
          {steps.map((step) => (
            <div
              key={step.num}
              className="bg-bg-default rounded-fig-m shadow-fig-xs flex flex-col gap-[16px] px-[clamp(24px,3vw,40px)] py-[32px]"
            >
              <h3 className="t-h2 text-text-primary">
                {step.num}. {step.title}
              </h3>
              <p className="t-body-lg text-text-default whitespace-pre-line">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowWeEngage;
