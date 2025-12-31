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
    avatar: "https://ui-avatars.com/api/?name=M+L&background=0D8ABC&color=fff&size=100"
  },
  {
    quote: "Officience had become our main partner and I don't regret it a single day.",
    name: "Dr. Jean Marcel Guillon",
    role: "FV Hospital",
    avatar: "https://ui-avatars.com/api/?name=J+G&background=2E7D32&color=fff&size=100"
  },
  {
    quote: "Without you, I just could not work.",
    name: "L. Lemaire",
    role: "Director of Sales",
    avatar: "https://ui-avatars.com/api/?name=L+L&background=C62828&color=fff&size=100"
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

      {/* Testimonial Cards Row - 1862px × 479px, space-between */}
      <div 
        className="hidden md:flex mx-auto"
        style={{ 
          width: '1862px',
          minHeight: '250px',
          justifyContent: 'space-between',
          marginBottom: '80px'
        }}
      >
        {testimonials.map((testimonial, idx) => (
          <div 
            key={idx} 
            className="bg-[#F5F5F5] flex flex-col justify-between"
            style={{ 
              width: '580px',
              padding: '40px',
              borderRadius: '20px'
            }}
          >
            {/* Quote Icon */}
            <div className="mb-6">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 24H8C8 17.373 13.373 12 20 12V16C15.582 16 12 19.582 12 24V24H14C16.209 24 18 25.791 18 28V32C18 34.209 16.209 36 14 36H10C7.791 36 6 34.209 6 32V28C6 25.791 7.791 24 10 24H14ZM38 24H32C32 17.373 37.373 12 44 12V16C39.582 16 36 19.582 36 24V24H38C40.209 24 42 25.791 42 28V32C42 34.209 40.209 36 38 36H34C31.791 36 30 34.209 30 32V28C30 25.791 31.791 24 34 24H38Z" fill="#CBD5E1"/>
              </svg>
            </div>

            {/* Quote Text */}
            <p 
              className="text-gray-700 font-body italic leading-relaxed mb-8"
              style={{ fontSize: '20px' }}
            >
              "{testimonial.quote}"
            </p>

            {/* Author Info */}
            <div className="flex items-center gap-4 mt-auto">
              <img 
                src={testimonial.avatar} 
                alt={testimonial.name}
                className="rounded-full object-cover"
                style={{ width: '56px', height: '56px' }}
              />
              <div>
                <h4 
                  className="font-bold text-gray-900"
                  style={{ fontSize: '20px' }}
                >
                  {testimonial.name}
                </h4>
                <p 
                  className="text-gray-500 font-body"
                  style={{ fontSize: '16px' }}
                >
                  {testimonial.role}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Testimonials - unchanged */}
      <div className="md:hidden space-y-4 mb-12">
        {testimonials.map((testimonial, idx) => (
          <div 
            key={idx} 
            className="bg-[#F5F5F5] p-6 rounded-2xl"
          >
            <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-4">
              <path d="M14 24H8C8 17.373 13.373 12 20 12V16C15.582 16 12 19.582 12 24V24H14C16.209 24 18 25.791 18 28V32C18 34.209 16.209 36 14 36H10C7.791 36 6 34.209 6 32V28C6 25.791 7.791 24 10 24H14ZM38 24H32C32 17.373 37.373 12 44 12V16C39.582 16 36 19.582 36 24V24H38C40.209 24 42 25.791 42 28V32C42 34.209 40.209 36 38 36H34C31.791 36 30 34.209 30 32V28C30 25.791 31.791 24 34 24H38Z" fill="#CBD5E1"/>
            </svg>
            <p className="text-gray-700 font-body italic text-sm leading-relaxed mb-4">
              "{testimonial.quote}"
            </p>
            <div className="flex items-center gap-3">
              <img 
                src={testimonial.avatar} 
                alt={testimonial.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h4 className="font-bold text-gray-900 text-sm">{testimonial.name}</h4>
                <p className="text-gray-500 font-body text-xs">{testimonial.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: Company Logos with Text/CTA overlay */}
      <div className="hidden md:grid relative w-full mt-12 grid-cols-1 place-items-center">
        {/* Background Layer: Company Logos - scaled for Full HD */}
        <div className="col-start-1 row-start-1 w-full flex justify-center items-center z-0 px-4">
           <img 
            src="https://pub-e3bac769bc084adbae54275f1413ca66.r2.dev/Desktop.png" 
            alt="Our Network of Companies" 
            className="w-full h-auto object-contain"
            style={{ maxHeight: '700px', maxWidth: '1862px' }}
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
