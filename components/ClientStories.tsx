import React from 'react';
import { Section } from './ui/Section';
import { ArrowRight } from 'lucide-react';

/*
 * SCALING: 1.33x from 1440px base to 1920px Full HD
 * 
 * Original → Scaled:
 * Section Title: 60px → 80px
 * Subtitle: 24px → 32px
 * Grid gap: 32px → 43px
 * Margin bottom: 80px → 106px
 * Text: 30px → 40px
 * Button padding: 40/16 → 53/21
 * Button text: 16px → 21px
 */

const testimonialImages = [
  "https://pub-e3bac769bc084adbae54275f1413ca66.r2.dev/P1.png",
  "https://pub-e3bac769bc084adbae54275f1413ca66.r2.dev/P2.png",
  "https://pub-e3bac769bc084adbae54275f1413ca66.r2.dev/P3.png"
];

const ClientStories: React.FC = () => {
  return (
    <Section id="clients" className="relative py-16 md:py-32">
      {/* Section Title - scaled */}
      <div className="mb-8 md:mb-20">
        <h2 
          className="font-bold tracking-tight mb-4 md:mb-5 uppercase text-gray-900"
          style={{ fontSize: 'clamp(30px, 5vw, 80px)' }}
        >
          People Trust Us
        </h2>
        <p 
          className="text-secondary font-light font-body max-w-4xl border-l-4 border-primary pl-4 md:pl-8"
          style={{ fontSize: 'clamp(18px, 2vw, 32px)' }}
        >
          Success stories across various industries
        </p>
      </div>

      {/* Testimonials Images Grid - gap: 32→43px, mb: 80→106px */}
      <div 
        className="grid grid-cols-1 md:grid-cols-3 mb-16"
        style={{ gap: '43px', marginBottom: '106px' }}
      >
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
      <div className="hidden md:grid relative w-full mt-12 grid-cols-1 place-items-center">
        {/* Background Layer: Company Logos */}
        <div className="col-start-1 row-start-1 w-full flex justify-center items-center z-0 px-4">
           <img 
            src="https://pub-e3bac769bc084adbae54275f1413ca66.r2.dev/Desktop.png" 
            alt="Our Network of Companies" 
            className="w-full h-auto object-contain"
            style={{ maxHeight: '665px' }}
            loading="lazy"
          />
        </div>

        {/* Foreground Layer: Text and CTA */}
        <div className="col-start-1 row-start-1 z-10 flex flex-col items-center justify-center text-center w-full px-4">
          {/* Text: 30→40px */}
          <p 
            className="font-bold text-gray-900"
            style={{ fontSize: '40px', marginBottom: '32px' }}
          >
            You're in good company!
          </p>
          {/* Button padding: 40/16→53/21, text: 16→21px */}
          <a 
            href="https://www.linkedin.com/company/officience/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-4 bg-primary text-white hover:bg-blue-800 rounded-full font-bold transition-all uppercase tracking-wide shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            style={{
              paddingLeft: '53px',
              paddingRight: '53px',
              paddingTop: '21px',
              paddingBottom: '21px',
              fontSize: '21px'
            }}
          >
            Join our network!
            <ArrowRight size={27} />
          </a>
        </div>
      </div>

      {/* Mobile: Side by Side Layout - unchanged */}
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
