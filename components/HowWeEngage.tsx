import React from 'react';
import { Section } from './ui/Section';
import { ArrowRight, Globe, Users, Truck, Search } from 'lucide-react';

/*
 * SCALING: 1.33x from 1440px base to 1920px Full HD
 * 
 * Original → Scaled:
 * Section Title: 60px → 80px
 * Subtitle: 24px → 32px
 * Otty image: 200px → 266px
 * Icon box: 80px → 106px
 * Icon size: 32px → 43px
 * Card padding: 24px → 32px
 * Card title: 20px → 27px
 * Card description: 14px → 19px
 * Grid gap: 24px → 32px
 * Button padding: 40/16 → 53/21
 * Button text: 16px → 21px
 */

const steps = [
  {
    icon: (
      <div className="relative">
        <Globe size={24} className="text-primary" strokeWidth={1.5} />
        <Search size={12} className="absolute -bottom-1 -right-1 text-primary" strokeWidth={2} />
      </div>
    ),
    iconDesktop: (
      <div className="relative">
        <Globe size={43} className="text-primary" strokeWidth={1.5} />
        <Search size={19} className="absolute -bottom-1 -right-1 text-primary" strokeWidth={2} />
      </div>
    ),
    title: 'Engage',
    desc: "Meet our engagers to understand your pain points, find solutions, and build a roadmap together. We're COSMIC.",
  },
  {
    icon: <Users size={24} className="text-primary" strokeWidth={1.5} />,
    iconDesktop: <Users size={43} className="text-primary" strokeWidth={1.5} />,
    title: 'Collaborate',
    desc: 'Execute your project in agile mode — with proximity, transparency, and productivity. Small teams, people magic.',
  },
  {
    icon: <Truck size={24} className="text-primary" strokeWidth={1.5} />,
    iconDesktop: <Truck size={43} className="text-primary" strokeWidth={1.5} />,
    title: 'Run',
    desc: 'Roll-out in production, adopt the products, and support your users. People first, tech second.',
  },
];

interface HowWeEngageProps {
  onOpenSurvey?: () => void;
}

const HowWeEngage: React.FC<HowWeEngageProps> = ({ onOpenSurvey }) => {
  return (
    <Section id="approach" className="relative my-4 md:my-12">
      {/* Desktop Header - Title and Otty on same line */}
      <div className="hidden md:flex flex-row items-center justify-between gap-8 mb-16">
        <div className="flex-shrink-0">
          {/* Title: 70px, not uppercase */}
          <h2 
            className="font-bold tracking-tight mb-5 text-gray-900"
            style={{ fontSize: 'clamp(36px, 5vw, 70px)' }}
          >
            Our approach
          </h2>
          {/* Subtitle: 24px */}
          <p 
            className="text-secondary font-light font-body max-w-4xl"
            style={{ fontSize: 'clamp(16px, 1.5vw, 24px)' }}
          >
            This is how we work
          </p>
        </div>
        {/* Otty image: increased by 25% */}
        <img 
          src="https://pub-e3bac769bc084adbae54275f1413ca66.r2.dev/Otty%20logo.png" 
          alt="Otty Logo" 
          className="object-contain flex-shrink-0"
          style={{ width: 'clamp(375px, 44vw, 830px)', height: 'auto' }}
        />
      </div>

      {/* Mobile Header */}
      <div className="md:hidden mb-6">
        <h2 className="text-3xl font-bold tracking-tight mb-4 text-gray-900">
          Our approach
        </h2>
        <p className="text-secondary text-lg font-light font-body max-w-3xl">
          This is how we work
        </p>
        <div className="flex justify-center mt-6">
          <img 
            src="https://pub-e3bac769bc084adbae54275f1413ca66.r2.dev/Otty%20logo.png" 
            alt="Otty Logo" 
            className="h-32 w-auto object-contain"
          />
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block relative mt-10 mb-20">
        {/* Icons Row with connecting dotted line */}
        <div className="relative flex justify-between items-center mb-10 px-[8.33%]">
          {/* Dotted line - color #FD941D, thickness reduced by 25% (3px → 2px) */}
          <div 
            className="absolute top-1/2 left-[calc(8.33%+53px)] right-[calc(8.33%+53px)] border-t-[2px] border-dashed -translate-y-1/2 z-0"
            style={{ borderColor: '#FD941D' }}
          ></div>
          
          {/* Icons - responsive */}
          {steps.map((step, idx) => (
            <div 
              key={idx} 
              className="relative z-10 bg-[#EBF2FE] flex items-center justify-center shadow-sm"
              style={{ 
                width: 'clamp(70px, 6vw, 106px)', 
                height: 'clamp(70px, 6vw, 106px)', 
                borderRadius: 'clamp(14px, 1.2vw, 21px)' 
              }}
            >
              {step.iconDesktop}
            </div>
          ))}
        </div>

        {/* Cards Grid - responsive */}
        <div className="grid grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {steps.map((step, idx) => (
            <div 
              key={idx} 
              className="bg-gray-50 flex flex-col h-full hover:shadow-md transition-all duration-300"
              style={{ 
                padding: 'clamp(20px, 2vw, 32px)', 
                borderRadius: 'clamp(14px, 1.2vw, 21px)' 
              }}
            >
              {/* Card title: responsive */}
              <h3 
                className="font-bold text-gray-900"
                style={{ fontSize: 'clamp(18px, 1.6vw, 27px)', marginBottom: 'clamp(10px, 1vw, 16px)' }}
              >
                {step.title}
              </h3>
              {/* Card description: responsive */}
              <p 
                className="text-secondary font-body leading-relaxed"
                style={{ fontSize: 'clamp(14px, 1.1vw, 19px)' }}
              >
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Cards - Vertical scroll, 1 card per row, center aligned */}
      <div className="md:hidden mt-6 mb-8 flex flex-col gap-4 px-4">
        {steps.map((step, idx) => (
          <div 
            key={idx}
            className="bg-gray-50 p-6 rounded-2xl flex flex-col items-center text-center w-full"
          >
            <div className="bg-[#EBF2FE] w-10 h-10 rounded-xl flex items-center justify-center mb-3">
              {step.icon}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
            <p className="text-secondary font-body text-sm leading-relaxed">
              {step.desc}
            </p>
          </div>
        ))}
      </div>

      {/* CTA Button - White bg, hover → black bg + white text */}
      <div className="text-center">
        <button 
          onClick={onOpenSurvey}
          className="inline-flex items-center gap-3 bg-white text-gray-900 border-2 border-gray-900 hover:bg-gray-900 hover:text-white rounded-full font-bold transition-all uppercase tracking-wide shadow-md"
          style={{
            paddingLeft: 'clamp(32px, 3vw, 53px)',
            paddingRight: 'clamp(32px, 3vw, 53px)',
            paddingTop: 'clamp(14px, 1.3vw, 21px)',
            paddingBottom: 'clamp(14px, 1.3vw, 21px)',
            fontSize: 'clamp(14px, 1.3vw, 21px)'
          }}
        >
          Check how we match
          <ArrowRight style={{ width: 'clamp(18px, 1.5vw, 24px)', height: 'clamp(18px, 1.5vw, 24px)' }} />
        </button>
      </div>
    </Section>
  );
};

export default HowWeEngage;
