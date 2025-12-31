import React, { useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
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

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

const Capabilities: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  };

  const paginate = (newDirection: number) => {
    const newIndex = currentIndex + newDirection;
    if (newIndex >= 0 && newIndex < services.length) {
      setDirection(newDirection);
      setCurrentIndex(newIndex);
    }
  };

  const handleDragEnd = (e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipe = swipePower(info.offset.x, info.velocity.x);
    if (swipe < -swipeConfidenceThreshold) {
      paginate(1);
    } else if (swipe > swipeConfidenceThreshold) {
      paginate(-1);
    }
  };

  return (
    <section id="capabilities" className="rounded-3xl md:rounded-[3rem] my-6 md:my-10 py-12 md:py-24" style={{ backgroundColor: '#F7F7F7' }}>
      <div className="w-full max-w-[1880px] mx-auto flex flex-col items-center px-5">
        
        {/* Title - responsive font size */}
        <div className="mb-16 md:mb-24">
          <h2 
            className="font-sans font-semibold tracking-[-0.04em] text-gray-900 leading-[100%] text-center"
            style={{ fontSize: 'clamp(48px, 6vw, 100px)' }}
          >
            What We Do
          </h2>
        </div>

        {/* Desktop Cards Row - responsive width */}
        <div 
          className="hidden md:grid w-full gap-5"
          style={{ 
            gridTemplateColumns: 'repeat(4, 1fr)',
          }}
        >
          {services.map((service, idx) => (
            <div 
              key={idx} 
              className="bg-white flex flex-col"
              style={{ 
                borderRadius: '20px',
                padding: 'clamp(30px, 3vw, 53px)',
              }}
            >
              {/* Icon - 2x larger */}
              <div style={{ marginBottom: 'clamp(30px, 3vw, 59px)' }}>
                <img 
                  src={service.imageUrl} 
                  alt={service.title} 
                  className="object-contain"
                  style={{ width: 'clamp(120px, 10vw, 180px)', height: 'clamp(120px, 10vw, 180px)' }}
                  loading="lazy"
                />
              </div>
              
              {/* Title - responsive font */}
              <h3 
                className="font-sans text-gray-900 leading-tight"
                style={{ 
                  fontSize: 'clamp(20px, 1.8vw, 29px)',
                  fontWeight: 600,
                  marginBottom: 'clamp(12px, 1.2vw, 21px)'
                }}
              >
                {service.title}
              </h3>
              
              {/* Description - responsive font */}
              <p 
                className="font-body text-gray-600 leading-relaxed"
                style={{ 
                  fontSize: 'clamp(14px, 1.2vw, 21px)',
                  fontWeight: 400
                }}
              >
                {service.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Desktop Explore Button */}
        <div className="hidden md:flex justify-center" style={{ marginTop: 'clamp(60px, 6vw, 106px)' }}>
          <a 
            href="https://demo.officience.com/brochure"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-4 rounded-full border-2 border-gray-900 text-gray-900 font-bold transition-all hover:text-white hover:border-[#1F49BF]"
            style={{ 
              paddingLeft: 'clamp(28px, 2.5vw, 43px)',
              paddingRight: 'clamp(28px, 2.5vw, 43px)',
              paddingTop: 'clamp(14px, 1.3vw, 21px)',
              paddingBottom: 'clamp(14px, 1.3vw, 21px)',
              fontSize: 'clamp(16px, 1.4vw, 24px)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#1F49BF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            Explore
            <ArrowRight style={{ width: 'clamp(18px, 1.5vw, 27px)', height: 'clamp(18px, 1.5vw, 27px)' }} />
          </a>
        </div>

        {/* Mobile Swipeable Carousel - unchanged */}
        <div className="md:hidden relative w-full">
          <div className="overflow-hidden">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 200, damping: 25 },
                  opacity: { duration: 0.3 }
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.5}
                onDragEnd={handleDragEnd}
                className="w-full cursor-grab active:cursor-grabbing"
              >
                {(() => {
                  const service = services[currentIndex];
                  return (
                    <div 
                      className="bg-white rounded-[20px] p-6 flex flex-col mx-2"
                      style={{ minHeight: '300px' }}
                    >
                      <div className="mb-6">
                        <img 
                          src={service.imageUrl} 
                          alt={service.title} 
                          className="object-contain"
                          style={{ width: '60px', height: '60px' }}
                          loading="lazy"
                        />
                      </div>
                      
                      <h3 className="font-sans text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
                      
                      <p className="text-gray-600 font-body text-sm leading-relaxed">
                        {service.desc}
                      </p>
                    </div>
                  );
                })()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {services.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setDirection(idx > currentIndex ? 1 : -1);
                  setCurrentIndex(idx);
                }}
                className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-primary w-6' : 'bg-gray-300'}`}
              />
            ))}
          </div>

          {/* Mobile Explore Button */}
          <div className="flex justify-center mt-8">
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
