import React, { useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { Section } from './ui/Section';
import { ArrowRight, Globe, Users, Truck, ChevronLeft, ChevronRight } from 'lucide-react';

const steps = [
  {
    icon: <Globe size={32} className="text-primary md:size-[48px]" strokeWidth={1.5} />,
    title: 'Engage',
    desc: "Roadmap together. We're COSMIC.",
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

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

const HowWeEngage: React.FC<HowWeEngageProps> = ({ onOpenSurvey }) => {
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
    if (newIndex >= 0 && newIndex < steps.length) {
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
          className="hidden md:block h-24 md:h-64 w-auto object-contain"
        />
      </div>

      {/* Desktop View */}
      <div className="hidden md:block relative mt-6 md:mt-12 mb-10 md:mb-20">
        <div className="absolute top-[44px] left-[16%] right-[16%] border-t-2 border-dashed border-off-red/60 z-0"></div>

        <div className="grid grid-cols-3 gap-12">
          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center relative z-10">
              <div className="mb-8 bg-[#EBF2FE] w-24 h-24 rounded-3xl flex items-center justify-center relative z-10 shadow-sm">
                {step.icon}
              </div>

              <div className="bg-white p-10 rounded-[2rem] shadow-sm flex flex-col h-full w-full border border-gray-50 hover:shadow-md transition-all duration-300">
                <h3 className="text-3xl font-bold mb-2 text-gray-900">{step.title}</h3>
                <p className="text-secondary font-body text-lg leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Swipeable Carousel */}
      <div className="md:hidden relative mt-6 mb-10">
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
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={handleDragEnd}
              className="w-full"
            >
              {(() => {
                const step = steps[currentIndex];
                return (
                  <div className="flex flex-col items-center mx-2">
                    {/* Icon */}
                    <div className="mb-4 bg-[#EBF2FE] w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm">
                      {step.icon}
                    </div>

                    {/* Card */}
                    <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col w-full border border-gray-50">
                      <h3 className="text-2xl font-bold mb-2 text-gray-900 text-center">{step.title}</h3>
                      <p className="text-secondary font-body text-sm leading-relaxed text-center">
                        {step.desc}
                      </p>
                    </div>

                    {/* Otty Logo below card on mobile */}
                    <img 
                      src="https://pub-e3bac769bc084adbae54275f1413ca66.r2.dev/Otty%20logo.png" 
                      alt="Otty Logo" 
                      className="h-20 w-auto object-contain mt-4"
                    />
                  </div>
                );
              })()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={() => paginate(-1)}
          disabled={currentIndex === 0}
          className={`absolute left-0 top-1/3 -translate-y-1/2 -translate-x-1 z-10 p-2 rounded-full bg-white shadow-lg ${currentIndex === 0 ? 'opacity-30' : 'opacity-100'}`}
        >
          <ChevronLeft size={24} className="text-gray-700" />
        </button>
        <button
          onClick={() => paginate(1)}
          disabled={currentIndex === steps.length - 1}
          className={`absolute right-0 top-1/3 -translate-y-1/2 translate-x-1 z-10 p-2 rounded-full bg-white shadow-lg ${currentIndex === steps.length - 1 ? 'opacity-30' : 'opacity-100'}`}
        >
          <ChevronRight size={24} className="text-gray-700" />
        </button>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-4">
          {steps.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDirection(idx > currentIndex ? 1 : -1);
                setCurrentIndex(idx);
              }}
              className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-off-red w-6' : 'bg-gray-300'}`}
            />
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
