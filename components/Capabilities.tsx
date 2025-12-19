import React, { useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
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
    <Section id="capabilities" className="my-6 md:my-10 max-w-none px-2 md:px-10">
      <div className="max-w-[1600px] mx-auto">
        <SectionTitle>What we do</SectionTitle>

        {/* Desktop Grid View */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-12">
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

        {/* Mobile Swipeable Carousel */}
        <div className="md:hidden relative">
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
                      className={`p-6 rounded-2xl border ${service.border} bg-white shadow-lg flex flex-col mx-4`}
                    >
                      {/* Logo takes 30% of panel height */}
                      <div className="mb-4 h-[30%] min-h-[120px] flex items-center justify-center">
                        <img 
                          src={service.imageUrl} 
                          alt={service.title} 
                          className="w-32 h-32 object-contain drop-shadow-sm"
                          loading="lazy"
                        />
                      </div>
                      
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">{service.title}</h3>
                      
                      <p className="text-gray-600 font-body text-sm leading-relaxed mb-6 text-center flex-grow">
                        {service.desc}
                      </p>
                      
                      <div className="flex justify-center">
                        <a 
                          href={service.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 text-sm font-bold uppercase tracking-wide ${service.color} ${service.border}`}
                        >
                          Explore
                          <ArrowRight size={16} />
                        </a>
                      </div>
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
        </div>
      </div>
    </Section>
  );
};

export default Capabilities;
