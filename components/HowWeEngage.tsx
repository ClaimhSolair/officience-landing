import React, { useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { Section } from './ui/Section';
import { ArrowRight, Globe, Users, Truck, Search } from 'lucide-react';

/*
 * SCALING: 1.33x from 1440px base to 1920px Full HD
 * 
 * Original → Scaled:
 * Section Title: 60px → 80px
 * Subtitle: 24px → 32px
 * Otty image: 200px → 266px
 * Icon box: 80px → 106px
 * Icon size: 32px → 43px
 * Card padding: 24px → 32px
 * Card title: 20px → 27px
 * Card description: 14px → 19px
 * Grid gap: 24px → 32px
 * Button padding: 40/16 → 53/21
 * Button text: 16px → 21px
 */

const steps = [
  {
    icon: (
      <div className="relative">
        <Globe size={24} className="text-primary" strokeWidth={1.5} />
        <Search size={12} className="absolute -bottom-1 -right-1 text-primary" strokeWidth={2} />
      </div>
    ),
    iconDesktop: (
      <div className="relative">
        <Globe size={43} className="text-primary" strokeWidth={1.5} />
        <Search size={19} className="absolute -bottom-1 -right-1 text-primary" strokeWidth={2} />
      </div>
    ),
    title: 'Engage',
    desc: "Meet our engagers to understand your pain points, find solutions, and build a roadmap together. We're COSMIC.",
  },
  {
    icon: <Users size={24} className="text-primary" strokeWidth={1.5} />,
    iconDesktop: <Users size={43} className="text-primary" strokeWidth={1.5} />,
    title: 'Collaborate',
    desc: 'Execute your project in agile mode — with proximity, transparency, and productivity. Small teams, people magic.',
  },
  {
    icon: <Truck size={24} className="text-primary" strokeWidth={1.5} />,
    iconDesktop: <Truck size={43} className="text-primary" strokeWidth={1.5} />,
    title: 'Run',
    desc: 'Roll-out in production, adopt the products, and support your users. People first, tech second.',
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
    <Section id="approach" className="relative my-4 md:my-12">
      {/* Desktop Header - Title and Otty on same line */}
      <div className="hidden md:flex flex-row items-center justify-between gap-8 mb-16">
        <div>
          {/* Title: 60→80px */}
          <h2 
            className="font-bold tracking-tight mb-5 uppercase text-gray-900"
            style={{ fontSize: '80px' }}
          >
            Our approach
          </h2>
          {/* Subtitle: 32px, no border */}
          <p 
            className="text-secondary font-light font-body max-w-4xl"
            style={{ fontSize: '32px' }}
          >
            This is how we work
          </p>
        </div>
        {/* Otty image: 499×259.79 × 1.33 = 664×346 */}
        <img 
          src="https://pub-e3bac769bc084adbae54275f1413ca66.r2.dev/Otty%20logo.png" 
          alt="Otty Logo" 
          style={{ width: '664px', height: '346px' }}
          className="object-contain"
        />
      </div>

      {/* Mobile Header */}
      <div className="md:hidden mb-6">
        <h2 className="text-3xl font-bold tracking-tight mb-4 uppercase text-gray-900">
          Our approach
        </h2>
        <p className="text-secondary text-lg font-light font-body max-w-3xl">
          This is how we work
        </p>
        <div className="flex justify-center mt-6">
          <img 
            src="https://pub-e3bac769bc084adbae54275f1413ca66.r2.dev/Otty%20logo.png" 
            alt="Otty Logo" 
            className="h-32 w-auto object-contain"
          />
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block relative mt-10 mb-20">
        {/* Icons Row with connecting dotted line */}
        <div className="relative flex justify-between items-center mb-10 px-[8.33%]">
          {/* Dotted line - color #FD941D */}
          <div 
            className="absolute top-1/2 left-[calc(8.33%+53px)] right-[calc(8.33%+53px)] border-t-[3px] border-dashed -translate-y-1/2 z-0"
            style={{ borderColor: '#FD941D' }}
          ></div>
          
          {/* Icons - box: 80→106px, rounded: 16→21px */}
          {steps.map((step, idx) => (
            <div 
              key={idx} 
              className="relative z-10 bg-[#EBF2FE] flex items-center justify-center shadow-sm"
              style={{ 
                width: '106px', 
                height: '106px', 
                borderRadius: '21px' 
              }}
            >
              {step.iconDesktop}
            </div>
          ))}
        </div>

        {/* Cards Grid - gap: 24→32px */}
        <div className="grid grid-cols-3" style={{ gap: '32px' }}>
          {steps.map((step, idx) => (
            <div 
              key={idx} 
              className="bg-gray-50 flex flex-col h-full hover:shadow-md transition-all duration-300"
              style={{ 
                padding: '32px', 
                borderRadius: '21px' 
              }}
            >
              {/* Card title: 20→27px */}
              <h3 
                className="font-bold text-gray-900"
                style={{ fontSize: '27px', marginBottom: '16px' }}
              >
                {step.title}
              </h3>
              {/* Card description: 14→19px */}
              <p 
                className="text-secondary font-body leading-relaxed"
                style={{ fontSize: '19px' }}
              >
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Swipeable Carousel - unchanged */}
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
                    <div className="bg-gray-50 p-6 rounded-2xl flex flex-col w-full">
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

      {/* CTA Button - White bg, hover → black bg + white text */}
      <div className="text-center">
        <button 
          onClick={onOpenSurvey}
          className="inline-flex items-center gap-4 bg-white text-gray-900 border-2 border-gray-900 hover:bg-gray-900 hover:text-white rounded-full font-bold transition-all uppercase tracking-wide shadow-md"
          style={{
            paddingLeft: '53px',
            paddingRight: '53px',
            paddingTop: '21px',
            paddingBottom: '21px',
            fontSize: '21px'
          }}
        >
          Check how we match
          <ArrowRight size={24} />
        </button>
      </div>
    </Section>
  );
};

export default HowWeEngage;
