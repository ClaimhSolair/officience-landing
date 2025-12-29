import React, { useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

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
    <section id="capabilities" className="bg-white rounded-3xl md:rounded-[3rem] my-6 md:my-10 py-12 md:py-20">
      {/* Container for 1920px viewport with 20px padding = 1880px content */}
      <div className="w-full max-w-[1880px] mx-auto px-5">
        
        {/* Title Row - Gap 107px to cards (scaled from 80px) */}
        <div style={{ marginBottom: '107px' }}>
          <h2 
            className="font-sans font-semibold tracking-[-0.04em] text-gray-900 leading-[100%] text-center"
            style={{ fontSize: '100px' }}
          >
            What We Do
          </h2>
        </div>

        {/* Desktop Cards Row - Width: Fill (1880px), Height: 484px, Justify: space-between */}
        <div 
          className="hidden md:flex w-full"
          style={{ 
            justifyContent: 'space-between',
            height: '484px',
            marginBottom: '107px'
          }}
        >
          {services.map((service, idx) => (
            <div 
              key={idx} 
              className="bg-white flex flex-col"
              style={{ 
                width: '443px',
                height: '484px',
                borderRadius: '27px',
                paddingTop: '54px',
                paddingRight: '47px',
                paddingBottom: '54px',
                paddingLeft: '47px',
              }}
            >
              {/* Icon - 94px x 94px (scaled from 70px) */}
              <div style={{ marginBottom: '59px' }}>
                <img 
                  src={service.imageUrl} 
                  alt={service.title} 
                  className="object-contain"
                  style={{ width: '94px', height: '94px' }}
                  loading="lazy"
                />
              </div>
              
              {/* Title - scaled from 22px */}
              <h3 
                className="font-bold text-gray-900 leading-tight"
                style={{ fontSize: '30px', marginBottom: '16px' }}
              >
                {service.title}
              </h3>
              
              {/* Description - scaled from 15px */}
              <p 
                className="text-gray-600 font-body leading-relaxed"
                style={{ fontSize: '20px' }}
              >
                {service.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Desktop Explore Button */}
        <div className="hidden md:flex justify-center">
          <a 
            href="https://demo.officience.com/brochure"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-4 rounded-full border-2 border-gray-900 text-gray-900 font-bold hover:bg-gray-900 hover:text-white transition-all"
            style={{ 
              paddingLeft: '40px',
              paddingRight: '40px',
              paddingTop: '20px',
              paddingBottom: '20px',
              fontSize: '20px'
            }}
          >
            Explore
            <ArrowRight size={24} />
          </a>
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
                      className="bg-white rounded-[20px] p-6 flex flex-col mx-2"
                      style={{ minHeight: '300px' }}
                    >
                      <div className="mb-4">
                        <img 
                          src={service.imageUrl} 
                          alt={service.title} 
                          className="object-contain"
                          style={{ width: '60px', height: '60px' }}
                          loading="lazy"
                        />
                      </div>
                      
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
                      
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
