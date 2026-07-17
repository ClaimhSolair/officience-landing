import React from 'react';
import { Mail, Phone } from 'lucide-react';
import { ASSETS } from '../assets';

const LOGO_URL = ASSETS.footer.logo;
const BANNER_URL = ASSETS.footer.banner;

const CAREER_URL = 'https://www.linkedin.com/company/officience/jobs/';
const ABOUT_URL = 'https://demo.officience.com/';

const EMAIL = 'engage@officience.com';
const PHONE_DISPLAY = '+84 28 3862 0055';
const PHONE_TEL = '+842838620055';

interface FooterProps {
  onOpenTerms: () => void;
}

const Footer: React.FC<FooterProps> = ({ onOpenTerms }) => {
  // Order matches Figma footer (2933:2080): LinkedIn, Facebook, TikTok, YouTube.
  const socials = [
    { href: 'https://www.linkedin.com/company/officience/', label: 'LinkedIn', icon: ASSETS.footer.linkedin },
    { href: 'https://www.facebook.com/Officience', label: 'Facebook', icon: ASSETS.footer.facebook },
    { href: 'https://www.tiktok.com/@officience', label: 'TikTok', icon: ASSETS.footer.tiktok },
    { href: 'https://www.youtube.com/@officienceinvietnam', label: 'YouTube', icon: ASSETS.footer.youtube },
  ];

  return (
    <footer className="relative bg-bg-primary flex flex-col gap-[32px] overflow-hidden">
      {/* Mobile footer (<768px) — logo, links + copyright row, then a full-width
          socials + contact block (a 4th social icon no longer fits the narrow right
          column, so contact info stacks full-width below).
          Faint full-bleed watermark is rendered as a footer-level sibling below. */}
      <div className="md:hidden w-full max-w-content mx-auto px-[clamp(24px,7vw,100px)] pt-[40px] flex flex-col gap-[24px] font-body text-white">
        <img
          src={LOGO_URL}
          alt="Officience — 20 Years Anniversary"
          width={223.5}
          height={88.5}
          className="h-[56px] w-auto object-contain"
          referrerPolicy="no-referrer"
        />
        <div className="w-full h-px bg-white/30" />
        <div className="flex justify-between gap-4 items-start">
          {/* Links — left-aligned stack, ≥44px tap rows */}
          <div className="flex flex-col text-[15px]">
            <button onClick={onOpenTerms} className="inline-flex items-center min-h-[44px] text-left hover:opacity-80 transition-opacity">
              Terms &amp; Conditions
            </button>
            <a href={ABOUT_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center min-h-[44px] hover:opacity-80 transition-opacity">
              About us
            </a>
            <a href="#capabilities" className="inline-flex items-center min-h-[44px] hover:opacity-80 transition-opacity">
              Our Services
            </a>
            <a href={CAREER_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center min-h-[44px] hover:opacity-80 transition-opacity">
              We’re Hiring
            </a>
          </div>
          {/* Copyright — right-aligned, wraps on narrow screens */}
          <span className="text-[12px] text-right">© {new Date().getFullYear()} Officience, All rights reserved</span>
        </div>
        {/* Socials (top) + contact info (below), full width */}
        <div className="flex flex-col gap-4">
          <div className="flex gap-[16px] items-center">
            {socials.map(({ href, label, icon }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                 className="hover:opacity-80 transition-opacity">
                <img src={icon} alt={label} width={28} height={28} className="w-[28px] h-[28px]" />
              </a>
            ))}
          </div>
          <div className="flex flex-col gap-[8px] text-[14px] leading-[22px]">
            <a href={`mailto:${EMAIL}`} className="inline-flex items-center gap-[8px] hover:opacity-80 transition-opacity">
              <Mail className="w-[18px] h-[18px] shrink-0" strokeWidth={1.5} aria-hidden="true" />
              <span>{EMAIL}</span>
            </a>
            <a href={`tel:${PHONE_TEL}`} className="inline-flex items-center gap-[8px] hover:opacity-80 transition-opacity">
              <Phone className="w-[18px] h-[18px] shrink-0" strokeWidth={1.5} aria-hidden="true" />
              <span>{PHONE_DISPLAY}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Footer Content (≥768px) */}
      <div className="hidden md:flex w-full max-w-content mx-auto px-[clamp(24px,7vw,100px)] pt-[clamp(40px,5vw,64px)] flex-col gap-[32px]">

        {/* Top: logo (left) + socials & contact info (right) */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start justify-between">
          <img
            src={LOGO_URL}
            alt="Officience — 20 Years Anniversary"
            width={223.5}
            height={88.5}
            className="h-[clamp(56px,7vw,88.5px)] w-auto object-contain"
            referrerPolicy="no-referrer"
          />

          <div className="flex flex-col items-center sm:items-end gap-[28px]">
            <div className="flex gap-[14px] items-center">
              {socials.map(({ href, label, icon }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                   className="hover:opacity-80 transition-opacity flex items-center justify-center">
                  <img src={icon} alt={label} width={45} height={45} className="w-[48px] h-[48px] md:w-[45px] md:h-[45px]" />
                </a>
              ))}
            </div>
            <div className="flex flex-col items-center sm:items-end gap-[8px] font-body text-white text-[16px] leading-[26px]">
              <a href={`mailto:${EMAIL}`} className="inline-flex items-center gap-[8px] hover:opacity-80 transition-opacity">
                <Mail className="w-[20px] h-[20px] shrink-0" strokeWidth={1.5} aria-hidden="true" />
                <span>{EMAIL}</span>
              </a>
              <a href={`tel:${PHONE_TEL}`} className="inline-flex items-center gap-[8px] hover:opacity-80 transition-opacity">
                <Phone className="w-[20px] h-[20px] shrink-0" strokeWidth={1.5} aria-hidden="true" />
                <span>{PHONE_DISPLAY}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/30" />

        {/* Bottom: copyright + links */}
        <div className="flex flex-col gap-4 md:flex-row items-center justify-between font-body text-white text-[18px]">
          <span className="text-center md:text-left">© {new Date().getFullYear()} Officience, All rights reserved</span>
          <div className="flex flex-wrap justify-center gap-x-[clamp(20px,2vw,40px)]">
            <button onClick={onOpenTerms} className="inline-flex items-center min-h-[44px] md:min-h-0 px-2 md:px-0 hover:opacity-80 transition-opacity whitespace-nowrap">
              Terms &amp; Conditions
            </button>
            <a href={ABOUT_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center min-h-[44px] md:min-h-0 px-2 md:px-0 hover:opacity-80 transition-opacity whitespace-nowrap">
              About us
            </a>
            <a href="#capabilities" className="inline-flex items-center min-h-[44px] md:min-h-0 px-2 md:px-0 hover:opacity-80 transition-opacity whitespace-nowrap">
              Our Services
            </a>
            <a href={CAREER_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center min-h-[44px] md:min-h-0 px-2 md:px-0 hover:opacity-80 transition-opacity whitespace-nowrap">
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
        className="w-full h-auto object-cover hidden md:block"
        style={{ aspectRatio: '2880 / 346' }}
        loading="lazy"
      />

      {/* Mobile watermark — same banner, faded, full-bleed at the footer bottom */}
      <img
        src={BANNER_URL}
        alt=""
        aria-hidden="true"
        className="w-full h-auto object-cover opacity-20 md:hidden"
        style={{ aspectRatio: '2880 / 346' }}
        loading="lazy"
      />
    </footer>
  );
};

export default Footer;
