import React, { useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { Section } from './ui/Section';
import { ArrowRight, Globe, Users, Truck } from 'lucide-react';

const steps = [
  {
    icon: <Globe size={24} className="text-primary" strokeWidth={1.5} />,
    iconDesktop: <Globe size={36} className="text-primary" strokeWidth={1.5} />,
    title: 'Engage',
    desc: "Roadmap together. We're COSMIC.",
  },
  {
    icon: <Users size={24} className="text-primary" strokeWidth={1.5} />,
    iconDesktop: <Users size={36} className="text-primary" strokeWidth={1.5} />,
    title: 'Collaborate',
    desc: 'Agile mode with transparency.',
  },
  {
    icon: <Truck size={24} className="text-primary" strokeWidth={1.5} />,
    iconDesktop: <Truck size={36} className="text-primary" strokeWidth={1.5} />,
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
      {/* Desktop Header - matching SectionTitle style */}
      <div className="hidden md:flex flex-row items-start justify-between gap-6 mb-12">
        <div className="mb-8 md:mb-16">
          <h2 className="text-3xl md:text-6xl font-bold tracking-tight mb-4 uppercase text-gray-900">
            Our approach
          </h2>
          <p className="text-secondary text-lg md:text-2xl font-light font-body max-w-3xl border-l-4 border-primary pl-4 md:pl-6">
            This is how we work
          </p>
        </div>
        <img 
          src="https://pub-e3bac769bc084adbae54275f1413ca66.r2.dev/Otty%20logo.png" 
          alt="Otty Logo" 
          className="h-[294px] w-auto object-contain"
        />
      </div>

      {/* Mobile Header - matching SectionTitle style */}
      <div className="md:hidden mb-6">
        <h2 className="text-3xl font-bold tracking-tight mb-4 uppercase text-gray-900">
          Our approach
        </h2>
        <p className="text-secondary text-lg font-light font-body max-w-3xl border-l-4 border-primary pl-4">
          This is how we work
        </p>
        {/* Otty image below title on mobile */}
        <div className="flex justify-center mt-6">
          <img 
            src="https://pub-e3bac769bc084adbae54275f1413ca66.r2.dev/Otty%20logo.png" 
            alt="Otty Logo" 
            className="h-32 w-auto object-contain"
          />
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block relative mt-8 mb-16">
        {/* Dotted line - positioned at exact center of icons (icon is h-20 = 80px, center at 40px) */}
        <div className="absolute top-10 left-[16.67%] right-[16.67%] border-t-2 border-dashed border-off-red/60 z-0"></div>

        <div className="grid grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center relative z-10">
              <div className="mb-6 bg-[#EBF2FE] w-20 h-20 rounded-2xl flex items-center justify-center relative z-10 shadow-sm">
                {step.iconDesktop}
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col h-full w-full border border-gray-50 hover:shadow-md transition-all duration-300">
                <h3 className="text-xl font-bold mb-2 text-gray-900">{step.title}</h3>
                <p className="text-secondary font-body text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Swipeable Carousel */}
      <div className="md:hidden relative mt-6 mb-8">
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
                const step = steps[currentIndex];
                return (
                  <div className="flex flex-col items-center mx-4">
                    {/* Card with icon inside */}
                    <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col w-full border border-gray-50">
                      {/* Title row with icon */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-[#EBF2FE] w-10 h-10 rounded-xl flex items-center justify-center">
                          {step.icon}
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">{step.title}</h3>
                      </div>
                      <p className="text-secondary font-body text-sm leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </AnimatePresence>
        </div>

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
