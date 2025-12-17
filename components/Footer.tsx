import React from 'react';
import { Linkedin, Facebook, Youtube } from 'lucide-react';

// Direct link to the Officience Logo as requested
const LOGO_URL = "https://pub-e3bac769bc084adbae54275f1413ca66.r2.dev/logo_horizontal.png";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white/95 backdrop-blur-md border-t border-gray-200 py-16 px-8 relative z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] rounded-b-3xl md:rounded-b-[2.5rem]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
        
        <div className="text-center md:text-left">
          <img 
            src={LOGO_URL} 
            alt="Officience" 
            className="h-20 md:h-24 w-auto object-contain mx-auto md:mx-0"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="flex gap-8">
          <a href="https://www.linkedin.com/company/officience/" target="_blank" rel="noopener noreferrer" className="p-3 bg-gray-100 rounded-md text-gray-600 hover:bg-primary hover:text-white transition-all transform hover:scale-110">
            <Linkedin size={24} />
          </a>
          <a href="https://www.facebook.com/Officience" target="_blank" rel="noopener noreferrer" className="p-3 bg-gray-100 rounded-md text-gray-600 hover:bg-blue-600 hover:text-white transition-all transform hover:scale-110">
            <Facebook size={24} />
          </a>
          <a href="https://www.youtube.com/@officienceinvietnam" target="_blank" rel="noopener noreferrer" className="p-3 bg-gray-100 rounded-md text-gray-600 hover:bg-red-600 hover:text-white transition-all transform hover:scale-110">
            <Youtube size={24} />
          </a>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-16 pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center text-lg text-gray-400 gap-6">
        <span>© {new Date().getFullYear()} Officience, All rights reserved.</span>
        <div className="flex gap-6">
          <a href="#" className="hover:text-primary">Privacy Policy</a>
          <a href="#" className="hover:text-primary">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;