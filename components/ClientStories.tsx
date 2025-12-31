import React, { useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
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

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

const ClientStories: React.FC = () => {
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
    if (newIndex >= 0 && newIndex < testimonials.length) {
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
    <Section id="clients" className="relative py-16 md:py-32">
      {/* Title - 40px mobile, 70px desktop */}
      <div className="text-center mb-4 md:mb-6">
        <h2 
          className="font-sans font-semibold tracking-[-0.04em] text-gray-900 leading-[100%]"
          style={{ fontSize: 'clamp(40px, 5vw, 70px)' }}
        >
          People Trust Us
        </h2>
      </div>

      {/* Description - 20px mobile, 24px desktop */}
      <div className="text-center mb-12 md:mb-16">
        <p 
          className="text-gray-600 font-body"
          style={{ fontSize: 'clamp(20px, 1.5vw, 24px)' }}
        >
          Success stories across different domains
        </p>
      </div>

      {/* Testimonial Cards Row - responsive grid */}
      <div 
        className="hidden md:grid w-full max-w-[1800px] mx-auto px-5 gap-5 mb-16 md:mb-20"
        style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}
      >
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

      {/* Mobile Testimonials - Swipe left/right carousel */}
      <div className="md:hidden relative mb-8 px-4">
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
              <div className="flex justify-center items-start">
                <img 
                  src={testimonials[currentIndex].image} 
                  alt={`${testimonials[currentIndex].name} - ${testimonials[currentIndex].role}`}
                  className="w-full h-auto object-contain"
                  loading="lazy"
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-4">
          {testimonials.map((_, idx) => (
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

      {/* Desktop: Company Logos with Text/CTA overlay */}
      <div className="hidden md:grid relative w-full mt-12 grid-cols-1 place-items-center">
        {/* Background Layer: Company Logos - responsive */}
        <div className="col-start-1 row-start-1 w-full flex justify-center items-center z-0 px-5">
           <img 
            src="https://pub-e3bac769bc084adbae54275f1413ca66.r2.dev/Desktop.png" 
            alt="Our Network of Companies" 
            className="w-full h-auto object-contain"
            style={{ 
              maxHeight: '50vh', 
              maxWidth: '100%',
              imageRendering: 'crisp-edges'
            }}
            loading="lazy"
          />
        </div>

        {/* Foreground Layer: Text and CTA */}
        <div className="col-start-1 row-start-1 z-10 flex flex-col items-center justify-center text-center w-full px-4">
          <p 
            className="font-bold text-gray-900"
            style={{ fontSize: 'clamp(24px, 2.5vw, 40px)', marginBottom: 'clamp(20px, 2vw, 32px)' }}
          >
            You're in good company!
          </p>
          {/* CTA: White bg, hover → black bg + white text */}
          <a 
            href="https://www.linkedin.com/company/officience/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white text-gray-900 border-2 border-gray-900 hover:bg-gray-900 hover:text-white rounded-full font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            style={{
              paddingLeft: 'clamp(24px, 2.5vw, 40px)',
              paddingRight: 'clamp(24px, 2.5vw, 40px)',
              paddingTop: 'clamp(12px, 1.2vw, 18px)',
              paddingBottom: 'clamp(12px, 1.2vw, 18px)',
              fontSize: 'clamp(14px, 1.3vw, 20px)'
            }}
          >
            Join our network
            <ArrowRight style={{ width: 'clamp(16px, 1.5vw, 24px)', height: 'clamp(16px, 1.5vw, 24px)' }} />
          </a>
        </div>
      </div>

      {/* Mobile: Text centered above logo, CTA below logo */}
      <div className="md:hidden relative w-full mt-6 flex flex-col items-center px-4">
        {/* Text centered */}
        <p className="text-2xl font-bold text-gray-900 mb-6 text-center">
          You're in good company!
        </p>
        
        {/* Company logo - 25% larger */}
        <div className="w-full flex justify-center items-center mb-6">
          <img 
            src="https://pub-e3bac769bc084adbae54275f1413ca66.r2.dev/Mobile.png" 
            alt="Our Network of Companies" 
            className="w-full h-auto object-contain"
            style={{ maxHeight: '250px', transform: 'scale(1.25)' }}
            loading="lazy"
          />
        </div>
        
        {/* CTA button centered */}
        <a 
          href="https://www.linkedin.com/company/officience/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-white text-gray-900 border-2 border-gray-900 hover:bg-gray-900 hover:text-white px-6 py-3 rounded-full font-bold transition-all text-sm shadow-lg"
        >
          Join our network
          <ArrowRight size={16} />
        </a>
      </div>
    </Section>
  );
};

export default ClientStories;
