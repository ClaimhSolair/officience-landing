import React from 'react';
import { Section, SectionTitle } from './ui/Section';
import { ArrowRight } from 'lucide-react';

const services = [
  {
    imageUrl: "https://pub-e3bac769bc084adbae54275f1413ca66.r2.dev/Property%204.png",
    title: 'Creative Tribe',
    desc: 'Simply design & present your business online. We handle identity, UX/UI, images, and motion.',
    color: 'text-primary',
    bg: 'bg-primary/5',
    border: 'border-primary/20',
    hoverBorder: 'group-hover:border-primary',
    url: 'https://demo.officience.com/brochure/creative-tribe'
  },
  {
    imageUrl: "https://pub-e3bac769bc084adbae54275f1413ca66.r2.dev/Property%202.png",
    title: 'IT Craft',
    desc: 'Leverage software & automation. We deliver websites, commerce, apps, and enterprise tools.',
    color: 'text-off-pink',
    bg: 'bg-off-pink/5',
    border: 'border-off-pink/20',
    hoverBorder: 'group-hover:border-off-pink',
    url: 'https://demo.officience.com/brochure/it-craft'
  },
  {
    imageUrl: "https://pub-e3bac769bc084adbae54275f1413ca66.r2.dev/Property%201.png",
    title: 'Crunch',
    desc: 'Build & scale your data factory. We digest, collect, and support your workflows.',
    color: 'text-off-yellow',
    bg: 'bg-off-yellow/5',
    border: 'border-off-yellow/20',
    hoverBorder: 'group-hover:border-off-yellow',
    url: 'https://demo.officience.com/brochure/crunch'
  },
  {
    imageUrl: "https://pub-e3bac769bc084adbae54275f1413ca66.r2.dev/Property%203.png",
    title: 'Analytics',
    desc: 'Let data perform. We standardize, analyze, and innovate with business intelligence.',
    color: 'text-off-red',
    bg: 'bg-off-red/5',
    border: 'border-off-red/20',
    hoverBorder: 'group-hover:border-off-red',
    url: 'https://demo.officience.com/brochure/analytics'
  }
];

const Capabilities: React.FC = () => {
  return (
    <Section id="capabilities" className="my-6 md:my-10 max-w-none px-2 md:px-10">
      <div className="max-w-[1600px] mx-auto">
        <SectionTitle>What we do</SectionTitle>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-12">
          {services.map((service, idx) => (
            <div 
              key={idx} 
              className={`p-5 md:p-14 rounded-2xl md:rounded-[3rem] border ${service.border} bg-white hover:shadow-2xl transition-all duration-300 group flex flex-col h-full hover:-translate-y-2`}
            >
              <div className="mb-4 md:mb-10 w-16 h-16 md:w-36 md:h-36 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                <img 
                  src={service.imageUrl} 
                  alt={service.title} 
                  className="w-full h-full object-contain drop-shadow-sm"
                  loading="lazy"
                />
              </div>
              
              <h3 className="text-xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-6">{service.title}</h3>
              
              {/* Reduced font size by 15% on desktop (from 20px/xl to approx 17px) */}
              <p className="text-gray-600 font-body text-sm md:text-[17px] leading-relaxed mb-4 md:mb-10 flex-grow">
                {service.desc}
              </p>
              
              <div className="mt-auto">
                <a 
                  href={service.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-4 md:px-10 py-2 md:py-5 rounded-full border-2 text-[10px] md:text-base font-bold uppercase tracking-wide transition-all transform hover:-translate-y-1 ${service.color} ${service.border} hover:bg-gray-50 hover:shadow-md ${service.hoverBorder}`}
                >
                  Explore
                  <ArrowRight size={14} className="md:size-[20px]" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default Capabilities;