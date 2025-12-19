import React from 'react';
import { Section, SectionTitle } from './ui/Section';
import { ArrowRight } from 'lucide-react';

const testimonialImages = [
  "https://pub-e3bac769bc084adbae54275f1413ca66.r2.dev/P1.png",
  "https://pub-e3bac769bc084adbae54275f1413ca66.r2.dev/P2.png",
  "https://pub-e3bac769bc084adbae54275f1413ca66.r2.dev/P3.png"
];

const ClientStories: React.FC = () => {
  return (
    <Section id="clients" className="relative py-16 md:py-24">
      <SectionTitle subtitle="Success stories across various industries">
        Clients Trust Us
      </SectionTitle>

      {/* Testimonials Images Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        {testimonialImages.map((imgUrl, idx) => (
          <div key={idx} className="flex justify-center items-start group">
            <img 
              src={imgUrl} 
              alt={`Client Story ${idx + 1}`} 
              className="w-full h-auto object-contain transition-transform duration-300 group-hover:-translate-y-2 drop-shadow-sm hover:drop-shadow-lg"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* Desktop: Stacked Layout - Text/CTA over Logos */}
      <div className="hidden md:grid relative w-full mt-10 grid-cols-1 place-items-center">
        {/* Background Layer: Company Logos */}
        <div className="col-start-1 row-start-1 w-full flex justify-center items-center z-0 px-4">
           <img 
            src="https://pub-e3bac769bc084adbae54275f1413ca66.r2.dev/Desktop.png" 
            alt="Our Network of Companies" 
            className="w-full h-auto object-contain max-h-[500px]"
            loading="lazy"
          />
        </div>

        {/* Foreground Layer: Text and CTA */}
        <div className="col-start-1 row-start-1 z-10 flex flex-col items-center justify-center text-center w-full px-4">
          <p className="text-3xl font-bold text-gray-900 mb-8">
            You're in good company!
          </p>
          <a 
            href="https://www.linkedin.com/company/officience/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-primary text-white hover:bg-blue-800 px-10 py-4 rounded-full font-bold transition-all uppercase tracking-wide text-base shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Join our network!
            <ArrowRight size={20} />
          </a>
        </div>
      </div>

      {/* Mobile: Side by Side Layout */}
      <div className="md:hidden relative w-full mt-6">
        <div className="flex items-center gap-4">
          {/* Left Side: Text and CTA */}
          <div className="flex-1 flex flex-col items-start justify-center">
            <p className="text-xl font-bold text-gray-900 mb-4">
              You're in good company!
            </p>
            <a 
              href="https://www.linkedin.com/company/officience/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary text-white hover:bg-blue-800 px-5 py-3 rounded-full font-bold transition-all uppercase tracking-wide text-xs shadow-lg"
            >
              Join our network!
              <ArrowRight size={14} />
            </a>
          </div>

          {/* Right Side: Company Logos (Mobile Image) */}
          <div className="flex-1 flex justify-center items-center">
            <img 
              src="https://pub-e3bac769bc084adbae54275f1413ca66.r2.dev/Mobile.png" 
              alt="Our Network of Companies" 
              className="w-full h-auto object-contain max-h-[200px]"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </Section>
  );
};

export default ClientStories;
