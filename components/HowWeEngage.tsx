import React from 'react';
import { Section } from './ui/Section';
import { ArrowRight, Globe, Users, Truck } from 'lucide-react';

const steps = [
  {
    icon: <Globe size={32} className="text-primary md:size-[48px]" strokeWidth={1.5} />,
    title: 'Engage',
    desc: 'Roadmap together. We’re COSMIC.',
  },
  {
    icon: <Users size={32} className="text-primary md:size-[48px]" strokeWidth={1.5} />,
    title: 'Collaborate',
    desc: 'Agile mode with transparency.',
  },
  {
    icon: <Truck size={32} className="text-primary md:size-[48px]" strokeWidth={1.5} />,
    title: 'Run',
    desc: 'Support your users. People first.',
  },
];

interface HowWeEngageProps {
  onOpenSurvey?: () => void;
}

const HowWeEngage: React.FC<HowWeEngageProps> = ({ onOpenSurvey }) => {
  return (
    <Section id="approach" className="relative my-4 md:my-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 mb-8 md:mb-16">
        <div>
          <h2 className="text-3xl md:text-6xl font-bold tracking-tight uppercase text-gray-900">
            Our approach
          </h2>
          <p className="text-lg md:text-2xl text-secondary mt-1 md:mt-2 font-body font-light">
            This is how we work
          </p>
        </div>
        <img 
          src="https://pub-e3bac769bc084adbae54275f1413ca66.r2.dev/Otty%20logo.png" 
          alt="Otty Logo" 
          className="h-24 md:h-64 w-auto object-contain"
        />
      </div>

      <div className="relative mt-6 md:mt-12 mb-10 md:mb-20">
        <div className="hidden md:block absolute top-[44px] left-[16%] right-[16%] border-t-2 border-dashed border-off-red/60 z-0"></div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-12">
          {steps.map((step, idx) => (
            <div key={idx} className={`flex flex-col items-center relative z-10 ${idx === steps.length - 1 ? 'col-span-2 md:col-span-1' : ''}`}>
              
              <div className="mb-4 md:mb-8 bg-[#EBF2FE] w-16 h-16 md:w-24 md:h-24 rounded-2xl md:rounded-3xl flex items-center justify-center relative z-10 shadow-sm">
                {step.icon}
              </div>

              <div className="bg-white p-4 md:p-10 rounded-2xl md:rounded-[2rem] shadow-sm flex flex-col h-full w-full border border-gray-50 hover:shadow-md transition-all duration-300">
                <h3 className="text-xl md:text-3xl font-bold mb-2 text-gray-900">{step.title}</h3>
                <p className="text-secondary font-body text-sm md:text-lg leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <button 
          onClick={onOpenSurvey}
          className="inline-flex items-center gap-2 md:gap-3 bg-off-red text-white hover:bg-red-700 px-8 md:px-10 py-3 md:py-4 rounded-full font-bold transition-all uppercase tracking-wide text-sm md:text-base shadow-md"
        >
          Check how we match
          <ArrowRight size={18} />
        </button>
      </div>
    </Section>
  );
};

export default HowWeEngage;