import React from 'react';
import { ArrowRight } from 'lucide-react';

/*
 * SCALING: 1.33x from 1440px base to 1920px Full HD
 * 
 * Original → Scaled:
 * Cards Row: 1400×360 → 1862×479
 * Each Card: 330×360 → 439×479
 * Padding: 40/35/40/35 → 53/47/53/47
 * Gap: 44 → 59
 * Icon: 70×70 → 93×93
 * Title: 22px → 29px
 * Description: 16px → 21px
 * Section Title: 75px → 100px
 */

const services = [
  {
    imageUrl: "https://pub-e3bac769bc084adbae54275f1413ca66.r2.dev/Property%204.png",
    title: 'Creative Tribe',
    desc: 'Simply design & present your business online. We handle your brand identity, UX/UI, images, and motion graphics.',
    url: 'https://demo.officience.com/brochure/creative-tribe'
  },
  {
    imageUrl: "https://pub-e3bac769bc084adbae54275f1413ca66.r2.dev/Property%202.png",
    title: 'IT Craft',
    desc: 'Leverage your business with software & automation. We deliver websites, easy-commerce, mobile apps, and enterprise tools.',
    url: 'https://demo.officience.com/brochure/it-craft'
  },
  {
    imageUrl: "https://pub-e3bac769bc084adbae54275f1413ca66.r2.dev/Property%201.png",
    title: 'Crunch',
    desc: 'Build, process & scale your data factory. We digest, collect, and support your workflows.',
    url: 'https://demo.officience.com/brochure/crunch'
  },
  {
    imageUrl: "https://pub-e3bac769bc084adbae54275f1413ca66.r2.dev/Property%203.png",
    title: 'Analytics',
    desc: 'Streamline operations and let your data perform. We standardize, analyze, and innovate with business intelligence.',
    url: 'https://demo.officience.com/brochure/analytics'
  }
];

const Capabilities: React.FC = () => {
  return (
    <section id="capabilities" className="rounded-3xl md:rounded-[3rem] my-6 md:my-10 py-12 md:py-24 overflow-hidden" style={{ backgroundColor: '#F7F7F7' }}>
      <div className="w-full max-w-[1600px] mx-auto flex flex-col items-center px-5">
        
        {/* Title - 40px mobile, 70px desktop */}
        <div className="mb-4 md:mb-6">
          <h2 
            className="font-sans font-semibold tracking-[-0.04em] text-gray-900 leading-[100%] text-center"
            style={{ fontSize: 'clamp(40px, 5vw, 70px)' }}
          >
            What We Do
          </h2>
        </div>

        {/* Description - 20px mobile, 24px desktop */}
        <div className="mb-12 md:mb-16">
          <p 
            className="text-gray-600 font-body text-center"
            style={{ fontSize: 'clamp(20px, 1.5vw, 24px)' }}
          >
            Comprehensive solutions tailored to your needs
          </p>
        </div>

        {/* Desktop Cards Row - Flexible height, constrained width */}
        <div 
          className="hidden md:grid w-full gap-4 lg:gap-5"
          style={{ 
            gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          }}
        >
          {services.map((service, idx) => (
            <div 
              key={idx} 
              className="bg-white flex flex-col items-center text-center"
              style={{ 
                borderRadius: '20px',
                padding: 'clamp(20px, 2vw, 32px)',
              }}
            >
              {/* Icon - centered */}
              <div className="flex-shrink-0 mb-4">
                <img 
                  src={service.imageUrl} 
                  alt={service.title} 
                  className="object-contain"
                  style={{ width: 'clamp(60px, 5vw, 90px)', height: 'clamp(60px, 5vw, 90px)' }}
                  loading="lazy"
                />
              </div>
              
              {/* Title - keep same size */}
              <h3 
                className="font-sans text-gray-900 leading-tight"
                style={{ 
                  fontSize: 'clamp(18px, 1.5vw, 26px)',
                  fontWeight: 600,
                  marginBottom: 'clamp(8px, 0.8vw, 12px)'
                }}
              >
                {service.title}
              </h3>
              
              {/* Description - keep same size */}
              <p 
                className="font-body text-gray-600 leading-relaxed"
                style={{ 
                  fontSize: 'clamp(13px, 1vw, 18px)',
                  fontWeight: 400
                }}
              >
                {service.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Desktop Explore Button */}
        <div className="hidden md:flex justify-center" style={{ marginTop: 'clamp(40px, 4vw, 80px)' }}>
          <a 
            href="https://demo.officience.com/brochure"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-4 rounded-full border-2 border-gray-900 text-gray-900 font-bold transition-all hover:text-white hover:border-[#1F49BF]"
            style={{ 
              paddingLeft: 'clamp(24px, 2vw, 36px)',
              paddingRight: 'clamp(24px, 2vw, 36px)',
              paddingTop: 'clamp(12px, 1vw, 18px)',
              paddingBottom: 'clamp(12px, 1vw, 18px)',
              fontSize: 'clamp(14px, 1.2vw, 20px)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#1F49BF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            Explore
            <ArrowRight style={{ width: 'clamp(16px, 1.2vw, 22px)', height: 'clamp(16px, 1.2vw, 22px)' }} />
          </a>
        </div>

        {/* Mobile Cards - Vertical scroll, no aspect-square */}
        <div className="md:hidden w-full flex flex-col gap-4">
          {services.map((service, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-[20px] p-6 flex flex-col items-center text-center mx-2"
            >
              <div className="mb-4">
                <img 
                  src={service.imageUrl} 
                  alt={service.title} 
                  className="object-contain"
                  style={{ width: '70px', height: '70px' }}
                  loading="lazy"
                />
              </div>
              
              <h3 className="font-sans text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
              
              <p className="text-gray-600 font-body text-sm leading-relaxed">
                {service.desc}
              </p>
            </div>
          ))}

          {/* Mobile Explore Button */}
          <div className="flex justify-center mt-4">
            <a 
              href="https://demo.officience.com/brochure"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-gray-900 text-gray-900 font-bold text-sm hover:bg-gray-900 hover:text-white transition-all"
            >
              Explore
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Capabilities;
