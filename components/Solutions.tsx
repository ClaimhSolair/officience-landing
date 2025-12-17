import React from 'react';
import { Section, SectionTitle } from './ui/Section';
import { Asterisk } from 'lucide-react';

interface SolutionsProps {
  onSelect?: (interest: string) => void;
}

const Solutions: React.FC<SolutionsProps> = ({ onSelect }) => {
  
  const handleSelect = (category: string) => {
    if (onSelect) {
      onSelect(category);
      // Find contact section and scroll
      const element = document.getElementById('contact');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <Section id="solutions" className="relative">
      <SectionTitle subtitle="Select your area of interest to see how we can build your team.">
        CHECK YOUR FIT
      </SectionTitle>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mt-12">
        
        {/* DATA - Yellow Circle */}
        <button 
          onClick={() => handleSelect('Data')}
          className="group flex flex-col items-center gap-6 text-center focus:outline-none"
        >
          <div className="relative w-32 h-32 md:w-40 md:h-40 transition-transform duration-300 group-hover:scale-105">
            {/* Main yellow circle */}
             <div className="absolute inset-0 rounded-full bg-[#FFD700] mix-blend-multiply opacity-90"></div>
             {/* Offset circle for effect */}
             <div className="absolute inset-0 rounded-full border-2 border-[#FFD700] translate-x-1 translate-y-1"></div>
             <div className="absolute inset-0 rounded-full bg-white scale-[0.6]"></div>
          </div>
          <span className="text-2xl md:text-3xl font-body font-normal text-gray-900 group-hover:text-primary transition-colors">Data</span>
        </button>

        {/* IT - Striped Circle */}
        <button 
           onClick={() => handleSelect('IT')}
           className="group flex flex-col items-center gap-6 text-center focus:outline-none"
        >
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-black overflow-hidden flex flex-col justify-center items-center gap-2 transition-transform duration-300 group-hover:scale-105 shadow-xl">
             <div className="w-full h-3 bg-white"></div>
             <div className="w-full h-3 bg-white"></div>
             <div className="w-full h-3 bg-white"></div>
             <div className="w-full h-3 bg-white"></div>
          </div>
          <span className="text-2xl md:text-3xl font-body font-normal text-gray-900 group-hover:text-primary transition-colors">IT</span>
        </button>

        {/* DESIGN - Star Shape */}
        <button 
           onClick={() => handleSelect('Design')}
           className="group flex flex-col items-center gap-6 text-center focus:outline-none"
        >
          <div className="w-32 h-32 md:w-40 md:h-40 bg-black transition-transform duration-300 group-hover:scale-105 flex items-center justify-center shadow-xl" style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)', borderRadius: '20%' }}>
            {/* Inner star detail */}
             <div className="w-16 h-16 bg-white rotate-45" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
             <div className="absolute w-16 h-16 bg-white -rotate-45" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
          </div>
          <span className="text-2xl md:text-3xl font-body font-normal text-gray-900 group-hover:text-primary transition-colors">Design</span>
        </button>

        {/* MORE - Asterisk */}
        <button 
           onClick={() => handleSelect('More')}
           className="group flex flex-col items-center gap-6 text-center focus:outline-none"
        >
          <div className="w-32 h-32 md:w-40 md:h-40 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
            <Asterisk size={140} strokeWidth={40} className="text-black drop-shadow-lg" />
          </div>
          <span className="text-2xl md:text-3xl font-body font-normal text-gray-900 group-hover:text-primary transition-colors">& More</span>
        </button>

      </div>
    </Section>
  );
};

export default Solutions;