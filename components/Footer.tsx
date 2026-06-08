import React from 'react';
import { ASSETS } from '../assets';

const LOGO_URL = ASSETS.footer.logo;
const BANNER_URL = ASSETS.footer.banner;

const CAREER_URL = 'https://www.linkedin.com/company/officience/jobs/';
const ABOUT_URL = 'https://demo.officience.com/';

interface FooterProps {
  onOpenTerms: () => void;
}

const Footer: React.FC<FooterProps> = ({ onOpenTerms }) => {
  const socials = [
    { href: 'https://www.facebook.com/Officience', label: 'Facebook', icon: ASSETS.footer.facebook },
    { href: 'https://www.youtube.com/@officienceinvietnam', label: 'YouTube', icon: ASSETS.footer.youtube },
    { href: 'https://www.linkedin.com/company/officience/', label: 'LinkedIn', icon: ASSETS.footer.linkedin },
  ];

  return (
    <footer className="relative bg-bg-primary flex flex-col gap-[32px] overflow-hidden">
      {/* Footer Content */}
      <div className="w-full max-w-content mx-auto px-[clamp(24px,7vw,100px)] pt-[clamp(40px,5vw,64px)] flex flex-col gap-[32px]">

        {/* Top: logo + social icons */}
        <div className="flex flex-col gap-6 sm:flex-row items-center justify-between">
          <img
            src={LOGO_URL}
            alt="Officience — 20 Years Anniversary"
            width={223.5}
            height={88.5}
            className="h-[clamp(56px,7vw,88.5px)] w-auto object-contain"
            referrerPolicy="no-referrer"
          />

          <div className="flex gap-[20px] items-center">
            {socials.map(({ href, label, icon }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                 className="hover:opacity-80 transition-opacity">
                <img src={icon} alt={label} width={45} height={45} className="w-[45px] h-[45px]" />
              </a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/30" />

        {/* Bottom: copyright + links */}
        <div className="flex flex-col gap-4 md:flex-row items-center justify-between font-body text-white text-[18px]">
          <span className="text-center md:text-left">© {new Date().getFullYear()} Officience, All rights reserved</span>
          <div className="flex flex-wrap justify-center gap-[clamp(20px,2vw,40px)]">
            <button onClick={onOpenTerms} className="hover:opacity-80 transition-opacity whitespace-nowrap">
              Terms &amp; Conditions
            </button>
            <a href={ABOUT_URL} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity whitespace-nowrap">
              About us
            </a>
            <a href="#capabilities" className="hover:opacity-80 transition-opacity whitespace-nowrap">
              Our Services
            </a>
            <a href={CAREER_URL} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity whitespace-nowrap">
              We’re Hiring
            </a>
          </div>
        </div>
      </div>

      {/* Decorative banner — Figma aspect 2880/346, full width */}
      <img
        src={BANNER_URL}
        alt=""
        aria-hidden="true"
        className="w-full h-auto object-cover block"
        style={{ aspectRatio: '2880 / 346' }}
        loading="lazy"
      />
    </footer>
  );
};

export default Footer;
