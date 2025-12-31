import React from 'react';
import { Linkedin, Facebook, Youtube } from 'lucide-react';

// Direct link to the Officience Logo as requested
const LOGO_URL = "https://pub-e3bac769bc084adbae54275f1413ca66.r2.dev/logo_horizontal.png";
const PATTERN_URL = "https://pub-e3bac769bc084adbae54275f1413ca66.r2.dev/Footer.png";

const Footer: React.FC = () => {
  return (
    <footer className="relative bg-[#1F49BF] py-8 md:py-16 px-4 md:px-8 z-50 overflow-hidden">
      {/* Pattern Background - full width */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-full bg-bottom bg-no-repeat pointer-events-none opacity-50"
        style={{ 
          backgroundImage: `url(${PATTERN_URL})`,
          backgroundSize: '100% auto',
          backgroundPosition: 'center bottom'
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 md:gap-10">
        
        <div className="text-center md:text-left">
          <img 
            src={LOGO_URL} 
            alt="Officience" 
            className="h-12 md:h-24 w-auto object-contain mx-auto md:mx-0 brightness-0 invert"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="flex gap-4 md:gap-8">
          <a href="https://www.linkedin.com/company/officience/" target="_blank" rel="noopener noreferrer" className="p-2 md:p-3 bg-white/20 rounded-md text-white hover:bg-white hover:text-primary transition-all transform hover:scale-110">
            <Linkedin size={18} className="md:w-6 md:h-6" />
          </a>
          <a href="https://www.facebook.com/Officience" target="_blank" rel="noopener noreferrer" className="p-2 md:p-3 bg-white/20 rounded-md text-white hover:bg-white hover:text-blue-600 transition-all transform hover:scale-110">
            <Facebook size={18} className="md:w-6 md:h-6" />
          </a>
          <a href="https://www.youtube.com/@officienceinvietnam" target="_blank" rel="noopener noreferrer" className="p-2 md:p-3 bg-white/20 rounded-md text-white hover:bg-white hover:text-red-600 transition-all transform hover:scale-110">
            <Youtube size={18} className="md:w-6 md:h-6" />
          </a>
        </div>
      </div>
      
      {/* Mobile Footer Bottom */}
      <div className="md:hidden relative z-10 max-w-7xl mx-auto mt-6 pt-4 border-t border-white/20 flex flex-col gap-3 text-xs text-white/80">
        <span className="text-center">© {new Date().getFullYear()} Officience, All rights reserved.</span>
        <div className="flex justify-center gap-4">
          <a href="https://demo.officience.com/brochure" target="_blank" rel="noopener noreferrer" className="hover:text-white whitespace-nowrap">About us</a>
          <a href="#capabilities" className="hover:text-white whitespace-nowrap">Our service</a>
          <a href="https://www.linkedin.com/company/officience/jobs/" target="_blank" rel="noopener noreferrer" className="hover:text-white whitespace-nowrap">Hiring</a>
        </div>
      </div>

      {/* Desktop Footer Bottom */}
      <div className="hidden md:flex relative z-10 max-w-7xl mx-auto mt-16 pt-10 border-t border-white/20 flex-row justify-between items-center text-lg text-white/80">
        <span>© {new Date().getFullYear()} Officience, All rights reserved.</span>
        <div className="flex gap-6">
          <a href="https://demo.officience.com/brochure" target="_blank" rel="noopener noreferrer" className="hover:text-white">About us</a>
          <a href="#capabilities" className="hover:text-white">Our service</a>
          <a href="https://www.linkedin.com/company/officience/jobs/" target="_blank" rel="noopener noreferrer" className="hover:text-white">Hiring</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
