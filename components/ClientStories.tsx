import React from 'react';
import { Section } from './ui/Section';
import { ArrowRight } from 'lucide-react';

/*
 * People Trust Us Section - Full HD 1920x1080
 * 
 * Layout:
 * - Title & Description: Center aligned, no blue quote icon
 * - Cards Row: 1862px × 479px (scaled from 1400×360 × 1.33)
 * - Cards: Rectangle shape with testimonials
 * - Company logos: Scaled for Full HD
 * - CTA: White bg, hover → black bg with white text
 */

const testimonials = [
  {
    quote: "I really appreciate the teams availability & responsiveness.",
    name: "Mr. Leurette",
    role: "Program Director - Orange",
    image: "https://pub-e3bac769bc084adbae54275f1413ca66.r2.dev/P1.png"
  },
  {
    quote: "Officience had become our main partner and I don't regret it a single day.",
    name: "Dr. Jean Marcel Guillon",
    role: "FV Hospital",
    image: "https://pub-e3bac769bc084adbae54275f1413ca66.r2.dev/P2.png"
  },
  {
    quote: "Without you, I just could not work.",
    name: "L. Lemaire",
    role: "Director of Sales",
    image: "https://pub-e3bac769bc084adbae54275f1413ca66.r2.dev/P3.png"
  }
];

const ClientStories: React.FC = () => {
  return (
    <Section id="clients" className="relative py-16 md:py-32">
      {/* Title - Center aligned */}
      <div className="text-center mb-6 md:mb-8">
        <h2 
          className="font-sans font-semibold tracking-[-0.04em] text-gray-900 leading-[100%]"
          style={{ fontSize: '100px' }}
        >
          People Trust Us
        </h2>
      </div>

      {/* Description - Center aligned */}
      <div className="text-center mb-16 md:mb-20">
        <p 
          className="text-gray-600 font-body"
          style={{ fontSize: '28px' }}
        >
          Success stories across different domains
        </p>
      </div>

      {/* Testimonial Cards Row - 1800px width, space-between */}
      <div 
        className="hidden md:flex mx-auto"
        style={{ 
          width: '1800px',
          justifyContent: 'space-between',
          marginBottom: '80px'
        }}
      >
        {testimonials.map((testimonial, idx) => (
          <div 
            key={idx} 
            className="flex justify-center items-start"
            style={{ width: '500px' }}
          >
            <img 
              src={testimonial.image} 
              alt={`${testimonial.name} - ${testimonial.role}`}
              className="w-full h-auto object-contain"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* Mobile Testimonials - using original images */}
      <div className="md:hidden grid grid-cols-1 gap-6 mb-12 px-4">
        {testimonials.map((testimonial, idx) => (
          <div 
            key={idx} 
            className="flex justify-center items-start"
          >
            <img 
              src={testimonial.image} 
              alt={`${testimonial.name} - ${testimonial.role}`}
              className="w-full h-auto object-contain"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* Desktop: Company Logos with Text/CTA overlay */}
      <div className="hidden md:grid relative w-full mt-12 grid-cols-1 place-items-center">
        {/* Background Layer: Company Logos - reduced by 15% for Full HD */}
        <div className="col-start-1 row-start-1 w-full flex justify-center items-center z-0 px-4">
           <img 
            src="https://pub-e3bac769bc084adbae54275f1413ca66.r2.dev/Desktop.png" 
            alt="Our Network of Companies" 
            className="w-full h-auto object-contain"
            style={{ 
              maxHeight: '595px', 
              maxWidth: '1583px',
              imageRendering: 'crisp-edges'
            }}
            loading="lazy"
          />
        </div>

        {/* Foreground Layer: Text and CTA */}
        <div className="col-start-1 row-start-1 z-10 flex flex-col items-center justify-center text-center w-full px-4">
          <p 
            className="font-bold text-gray-900"
            style={{ fontSize: '40px', marginBottom: '32px' }}
          >
            You're in good company!
          </p>
          {/* CTA: White bg, hover → black bg + white text */}
          <a 
            href="https://www.linkedin.com/company/officience/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-4 bg-white text-gray-900 border-2 border-gray-900 hover:bg-gray-900 hover:text-white rounded-full font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            style={{
              paddingLeft: '40px',
              paddingRight: '40px',
              paddingTop: '18px',
              paddingBottom: '18px',
              fontSize: '20px'
            }}
          >
            Join our network
            <ArrowRight size={24} />
          </a>
        </div>
      </div>

      {/* Mobile: Side by Side Layout - unchanged */}
      <div className="md:hidden relative w-full mt-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 flex flex-col items-start justify-center">
            <p className="text-xl font-bold text-gray-900 mb-4">
              You're in good company!
            </p>
            <a 
              href="https://www.linkedin.com/company/officience/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-gray-900 border-2 border-gray-900 hover:bg-gray-900 hover:text-white px-5 py-3 rounded-full font-bold transition-all text-xs shadow-lg"
            >
              Join our network
              <ArrowRight size={14} />
            </a>
          </div>

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
