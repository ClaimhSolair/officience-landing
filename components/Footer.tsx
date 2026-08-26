import React from 'react';
import { Link } from 'react-router-dom';
import Container from './ui/Container';
import { ASSETS } from '../assets';
import { FOOTER_COMPANY, FOOTER_LEGAL, ROUTES, SOCIALS, type NavItem } from './navigation';
import {
  FacebookIcon,
  LinkedInIcon,
  MailIcon,
  PhoneIcon,
  TikTokIcon,
  YouTubeIcon,
} from './ui/FooterIcons';

/**
 * Figma 3151:2509 (1920) and 3153:14667 (390).
 *
 * 1920 sets the brand block against the link columns; 390 stacks every block in
 * one column on a flat 32px rhythm. The anniversary lockup and the watermark
 * band are unchanged from the July build — byte-identical files, still in the
 * bucket — so the footer still carries 20th-anniversary branding, consistent
 * with the decision to leave the splash art alone.
 *
 * The mail, phone and four social glyphs are all inlined (`ui/FooterIcons`), taken
 * from this footer's own frame. MenuOverlay still draws the bucket set from its own
 * frame.
 *
 * The two column headings are drawn in different styles at 390 — "Company" in
 * Montserrat Bold 14/22 and "Our friends" in Lexend Medium 16/24 — and the
 * Company links change colour between frames too. Both are reproduced.
 */
const EMAIL = 'engage@officience.com';
const PHONE_DISPLAY = '+84 28 3862 0055';
const PHONE_TEL = '+842838620055';
const COPYRIGHT = '© 2026 Officience, All rights reserved';

/** The footer's own Figma glyphs, keyed by the label in `SOCIALS`. */
const SOCIAL_ICONS: Record<string, React.FC<{ className?: string }>> = {
  LinkedIn: LinkedInIcon,
  Facebook: FacebookIcon,
  TikTok: TikTokIcon,
  YouTube: YouTubeIcon,
};

/** Every footer destination already lives in `navigation.ts`; this just renders one. */
const NavLink: React.FC<{ item: NavItem; className?: string }> = ({ item, className = '' }) => {
  const { target, label } = item;
  if (target.kind === 'external') {
    return (
      <a href={target.href} target="_blank" rel="noopener noreferrer" className={className}>
        {label}
      </a>
    );
  }
  // No footer entry opens the survey, but NavTarget allows it, so it is handled
  // rather than cast away.
  if (target.kind === 'survey') return <span className={className}>{label}</span>;
  const to = target.kind === 'route' ? target.to : `${ROUTES.home}#${target.id}`;
  return (
    <Link to={to} className={className}>
      {label}
    </Link>
  );
};

const LINK_HOVER =
  'transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none';

const Footer: React.FC = () => (
  <footer className="bg-bg-primary text-white">
    {/* 390 opens with 40px of air above the lockup; at 1920 the Contact card's
        own bottom padding already supplies the gap Figma draws. */}
    <Container className="flex flex-col gap-fig-32 pt-fig-40 lg:pt-0">
      <div className="flex flex-col gap-fig-32 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-fig-32">
          <img
            src={ASSETS.footer.logo}
            alt="Officience — 20 Years Anniversary"
            width={277}
            height={110}
            className="h-[63.36px] w-[160px] lg:h-[109.69px] lg:w-[277px]"
            decoding="async"
            referrerPolicy="no-referrer"
          />
          <address className="flex flex-col gap-[2px] not-italic lg:gap-0">
            <a href={`mailto:${EMAIL}`} className={`flex items-center gap-px ${LINK_HOVER}`}>
              <span className="flex h-[32px] w-[32px] shrink-0 items-center justify-center drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
                <MailIcon className="h-[20px] w-[20px]" />
              </span>
              <span className="font-body text-[12px] leading-[20px] lg:text-body-xl">{EMAIL}</span>
            </a>
            <a href={`tel:${PHONE_TEL}`} className={`flex items-center gap-px ${LINK_HOVER}`}>
              <span className="flex h-[32px] w-[32px] shrink-0 items-center justify-center drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
                <PhoneIcon className="h-[20px] w-[20px]" />
              </span>
              <span className="font-body text-[12px] leading-[20px] lg:text-body-xl">
                {PHONE_DISPLAY}
              </span>
            </a>
          </address>
        </div>

        <div className="flex gap-[53px] lg:w-[636px] lg:shrink-0 lg:justify-center lg:gap-[100px]">
          <nav aria-label="Company" className="flex flex-col gap-fig-12 lg:gap-fig-24">
            <h2 className="font-body font-bold text-[14px] leading-[22px] lg:font-sans lg:text-[20px] lg:font-semibold lg:leading-[24px]">
              Company
            </h2>
            <ul className="flex flex-col gap-[6px] lg:gap-fig-8">
              {FOOTER_COMPANY.map((item) => (
                <li key={item.label}>
                  <NavLink
                    item={item}
                    className={`font-body text-[12px] leading-[20px] text-pri-50 lg:text-body-xl lg:text-white ${LINK_HOVER}`}
                  />
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-fig-12 lg:w-[440px] lg:gap-fig-32">
            <h2 className="font-sans font-medium text-[16px] leading-[24px] lg:text-[20px] lg:font-semibold">
              Our friends
            </h2>
            {/* Figma gives no destinations for these, so they are images, not
                links — see the adapter backlog. */}
            <ul
              className="grid grid-cols-2 gap-[10.53px] [--partner-scale:0.8136] lg:w-fit lg:grid-cols-3 lg:gap-[12.94px] lg:[--partner-scale:1]"
            >
              {ASSETS.footer.partners.map((partner) => (
                <li
                  key={partner.name}
                  className="flex h-[48px] w-[112px] items-center justify-center overflow-hidden rounded-[4px] border border-border-field lg:h-[58.24px] lg:w-[138.04px] lg:rounded-[5.18px]"
                >
                  <img
                    src={partner.url}
                    alt={partner.name}
                    className="max-w-none"
                    style={{
                      width: `calc(${partner.w}px * var(--partner-scale))`,
                      height: `calc(${partner.h}px * var(--partner-scale))`,
                    }}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-fig-12 lg:gap-fig-16">
        <hr className="w-full border-0 border-t border-white/30" />
        <div className="flex flex-col gap-fig-16">
          <div className="flex items-start justify-between lg:items-center">
            {/* Wraps as whole phrases from lg. The four items plus the socials need
                ~1029px and the content column only offers 976 at 1024, so without
                `flex-wrap` the copyright breaks mid-sentence instead. From xl there
                is room for the single line the artboard draws. */}
            <div className="flex flex-col font-body text-[12px] leading-[20px] lg:flex-row lg:flex-wrap lg:items-center lg:gap-fig-12 lg:text-body-xl">
              {/* At 1920 the copyright joins this row between two rules; at 390 it
                  drops to its own line underneath. */}
              <span className="hidden whitespace-nowrap lg:inline">{COPYRIGHT}</span>
              <span aria-hidden="true" className="hidden h-[16px] w-px bg-white/30 lg:block" />
              <NavLink item={FOOTER_LEGAL[0]} className={`whitespace-nowrap ${LINK_HOVER}`} />
              <span aria-hidden="true" className="hidden h-[16px] w-px bg-white/30 lg:block" />
              <NavLink item={FOOTER_LEGAL[1]} className={`whitespace-nowrap ${LINK_HOVER}`} />
              <span aria-hidden="true" className="hidden h-[16px] w-px bg-white/30 lg:block" />
              {/* Not drawn by Figma, and deliberately kept: consent has to be as
                  easy to withdraw as it was to give, and this is the only way back
                  to the banner once a choice is stored. CookieConsent listens for
                  this exact event name. */}
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event('officience:cookie-settings'))}
                className={`whitespace-nowrap text-left ${LINK_HOVER}`}
              >
                Cookie Settings
              </button>
            </div>

            <ul className="flex items-center lg:gap-[2.13px]">
              {SOCIALS.map((social) => {
                const Glyph = SOCIAL_ICONS[social.label];
                return (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className={`flex items-center justify-center ${LINK_HOVER}`}
                    >
                      <Glyph className="h-[28.86px] w-[28.86px] lg:h-[40.49px] lg:w-[40.49px]" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
          <p className="font-body text-[12px] leading-[20px] lg:hidden">{COPYRIGHT}</p>
        </div>
      </div>

      {/* The anniversary band. Decorative, and 64px clear of the bar at 1920. */}
      <img
        src={ASSETS.footer.banner}
        alt=""
        aria-hidden="true"
        width={1792}
        height={215}
        className="h-auto w-full lg:mt-fig-32"
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
      />
    </Container>
  </footer>
);

export default Footer;
