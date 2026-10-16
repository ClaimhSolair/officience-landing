import React from 'react';
import { Link } from 'react-router-dom';
import Container from './ui/Container';
import Reveal, { RevealChild } from './ui/Reveal';
import { MOTION, SEC, STAGGER } from '../lib/motion';
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
 * Figma 4028:6376 (1440, the desktop master) and 3153:14667 (390).
 *
 * Desktop sets the brand block against the link columns; 390 stacks every block in
 * one column on a flat 32px rhythm. The anniversary lockup and the watermark
 * band are unchanged from the July build — byte-identical files, still in the
 * bucket — so the footer still carries 20th-anniversary branding.
 *
 * The mail, phone and four social glyphs are all inlined (`ui/FooterIcons`), taken
 * from this footer's own frame. MenuOverlay still draws the bucket set from its own
 * frame.
 *
 * The two column headings are drawn in different styles at 390 — "Company" in
 * Montserrat Bold 14/22 and "Our friends" in Lexend Medium 16/24 — and the
 * Company links change colour between frames too. Both are reproduced.
 *
 * Desktop follows the 1440 frame 4028:6376 at every width (user, 2026-10-13),
 * in two steps (see the note above `Footer`). The 1920 frame 3151:2509 is
 * not used. Below lg the 390 structure stays.
 */
const EMAIL = 'engage@officience.com';
const PHONE_DISPLAY = '+84 28 3862 0055';
const PHONE_TEL = '+842838620055';
const COPYRIGHT = '© 2026 Officience, All rights reserved';

/** The partner sites, keyed by the name in `ASSETS.footer.partners` (user, 2026-10-16). */
const PARTNER_LINKS: Record<string, string> = {
  Offinity: 'https://diaries.offinity.io',
  Officonnect: 'https://offi-alumni.com',
  Rizlum: 'https://rizlum.ai',
  OpenReal: 'https://openreal.vn',
  Uniques: 'https://uniques.vn',
};

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
        <span className="sr-only"> (opens in a new tab)</span>
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

/*
 * The 1440 frame (4028:6376) is the desktop master (user, 2026-10-13). Its
 * values hold from lg to below fhd. From fhd (1880px, a maximised 1920 browser)
 * every value is 4/3 of the 1440 value, as fixed px. Type is fixed px per step.
 */
const Footer: React.FC = () => (
  <footer className="bg-bg-primary text-white">
    {/* The footer carries its own top padding so its content never sits jammed
        against the section above it — on the home page the Contact card supplies
        some gap, but the legal pages end in a plain white column, and there the
        blue block was butting straight up under the text. 64px of blue above the
        lockup gives the separation the 2026-08-27 review asked for, everywhere.
        It is a ruling, so it does not scale. */}
    <Container className="pt-fig-40 lg:pt-fig-64">
      {/* 1440: 32 from the brand row to the rule, 64 from the bottom row to the band. */}
      <div className="flex flex-col gap-fig-32 lg:gap-[32px] fhd:gap-[42.67px]">
        <Reveal
          as="div"
          y={28}
          duration={SEC.revealFast}
          enabled={MOTION.footer}
          amount={0.15}
          className="flex flex-col gap-fig-32 lg:flex-row lg:items-start lg:justify-between"
        >
          <div className="flex flex-col gap-fig-32 lg:gap-[32px] fhd:gap-[42.67px]">
            <img
              src={ASSETS.footer.logo}
              alt="Officience — 20 Years Anniversary"
              width={277}
              height={110}
              className="h-[63.36px] w-[160px] lg:h-[88.5px] fhd:h-[118px] lg:w-[223.5px] fhd:w-[298px]"
              decoding="async"
              referrerPolicy="no-referrer"
            />
            <address className="flex flex-col gap-[2px] not-italic lg:gap-0">
              {[
                { href: `mailto:${EMAIL}`, Icon: MailIcon, text: EMAIL },
                { href: `tel:${PHONE_TEL}`, Icon: PhoneIcon, text: PHONE_DISPLAY },
              ].map(({ href, Icon, text }) => (
                <a key={href} href={href} className={`flex items-center gap-px lg:gap-[1px] fhd:gap-[1.33px] ${LINK_HOVER}`}>
                  <span className="flex h-[32px] w-[32px] shrink-0 items-center justify-center drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)] lg:h-[32px] fhd:h-[42.67px] lg:w-[32px] fhd:w-[42.67px]">
                    <Icon className="h-[20px] w-[20px] lg:h-[20px] fhd:h-[26.67px] lg:w-[20px] fhd:w-[26.67px]" />
                  </span>
                  <span className="font-body text-[12px] leading-[20px] lg:text-[length:16px] fhd:text-[length:21.33px] lg:leading-[26px] fhd:leading-[34.67px]">
                    {text}
                  </span>
                </a>
              ))}
            </address>
          </div>

          {/* 636 wide at 1440, with Company (76) and Our friends (408) 100 apart,
              centred. Below 360 the two columns do not fit side by side, and the
              tiles overlap and widen the page (audit U-6). There, Company goes
              above Our friends, 32 apart. From 360 the layout does not change. */}
          <div className="flex gap-[53px] max-[359px]:flex-col max-[359px]:gap-fig-32 lg:w-[636px] fhd:w-[848px] lg:shrink-0 lg:justify-center lg:gap-[100px] fhd:gap-[133.33px]">
            <nav aria-label="Company" className="flex flex-col gap-fig-12 lg:gap-[24px] fhd:gap-[32px]">
              {/* Button-md at 1440: Lexend 500, 16/24. */}
              <h2 className="font-body font-bold text-[14px] leading-[22px] lg:font-sans lg:font-medium lg:text-[length:16px] fhd:text-[length:21.33px] lg:leading-[24px] fhd:leading-[32px]">
                Company
              </h2>
              <ul className="flex flex-col gap-[6px] lg:gap-[8px] fhd:gap-[10.67px]">
                {FOOTER_COMPANY.map((item) => (
                  <li key={item.label}>
                    {/* The invisible area makes the tap target 30px high at 390,
                        where the text is 20px. A row is 24px with a 6px gap, so
                        two areas touch and do not overlap. Body-lg-medium at
                        1440: Montserrat 500, 16/26. */}
                    <NavLink
                      item={item}
                      className={`relative inline-block font-body text-[12px] leading-[20px] text-pri-50 before:absolute before:-inset-y-[5px] before:inset-x-0 before:content-[''] lg:font-medium lg:text-[length:16px] fhd:text-[length:21.33px] lg:leading-[26px] fhd:leading-[34.67px] lg:text-white ${LINK_HOVER}`}
                    />
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex flex-col gap-fig-12 lg:w-[408px] fhd:w-[544px] lg:gap-[32px] fhd:gap-[42.67px]">
              <h2 className="font-sans font-medium text-[16px] leading-[24px] lg:text-[length:16px] fhd:text-[length:21.33px] lg:leading-[24px] fhd:leading-[32px]">
                Our friends
              </h2>
              {/* Each tile is a link to the partner site (user, 2026-10-16). The
                  link fills the tile, so its focus ring is inset: the tile
                  clips anything outside it. The logo sizes in assets.ts are
                  the 1920 frame's. The 1440 frame draws them at 0.9273 of that
                  (128 / 138.04), and 390 at 0.8136. `--partner-u` is the length
                  of one assets.ts px. Below 360 the list is full width, so the
                  two columns are the tile width and the tiles stay together. */}
              <Reveal
                as="ul"
                stagger={STAGGER.tight}
                enabled={MOTION.footer}
                amount={0.2}
                className="grid grid-cols-2 gap-[10.53px] [--partner-u:0.8136px] max-[359px]:grid-cols-[112px_112px] lg:w-fit lg:grid-cols-3 lg:gap-[12px] fhd:gap-[16px] lg:[--partner-u:0.92727px] fhd:[--partner-u:1.23636px]"
              >
                {ASSETS.footer.partners.map((partner) => (
                  <RevealChild
                    as="li"
                    key={partner.name}
                    y={16}
                    duration={SEC.revealFast}
                    className="flex h-[48px] w-[112px] items-center justify-center overflow-hidden rounded-[4px] border border-border-field lg:h-[54px] fhd:h-[72px] lg:w-[128px] fhd:w-[170.67px] lg:rounded-[4.8px] fhd:rounded-[6.4px]"
                  >
                    <a
                      href={PARTNER_LINKS[partner.name]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-full w-full items-center justify-center transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white motion-reduce:transition-none"
                    >
                      <img
                        src={partner.url}
                        alt={partner.name}
                        className="max-w-none"
                        style={{
                          width: `calc(${partner.w} * var(--partner-u))`,
                          height: `calc(${partner.h} * var(--partner-u))`,
                        }}
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                      />
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </RevealChild>
                ))}
              </Reveal>
            </div>
          </div>
        </Reveal>

        <div className="flex flex-col gap-fig-12 lg:gap-[16px] fhd:gap-[21.33px]">
          {/* Solid white, as both frames draw the rule and the separators. */}
          <hr className="w-full border-0 border-t border-white" />
          <div className="flex flex-col gap-fig-16">
            <div className="flex items-start justify-between lg:items-center">
              {/* Wraps as whole phrases from lg. At the scaled sizes the row fits
                  on one line, but a larger default font can make it wrap. */}
              <div className="flex flex-col font-body text-[12px] leading-[20px] lg:flex-row lg:flex-wrap lg:items-center lg:gap-[12px] fhd:gap-[16px] lg:text-[length:16px] fhd:text-[length:21.33px] lg:leading-[26px] fhd:leading-[34.67px]">
                {/* At 1440 the copyright joins this row between two rules; at 390 it
                    drops to its own line underneath. */}
                <span className="hidden whitespace-nowrap lg:inline">{COPYRIGHT}</span>
                <span aria-hidden="true" className="hidden w-px bg-white lg:block lg:h-[16px] fhd:h-[21.33px]" />
                <NavLink item={FOOTER_LEGAL[0]} className={`whitespace-nowrap ${LINK_HOVER}`} />
                <span aria-hidden="true" className="hidden w-px bg-white lg:block lg:h-[16px] fhd:h-[21.33px]" />
                <NavLink item={FOOTER_LEGAL[1]} className={`whitespace-nowrap ${LINK_HOVER}`} />
                <span aria-hidden="true" className="hidden w-px bg-white lg:block lg:h-[16px] fhd:h-[21.33px]" />
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

              <ul className="flex items-center lg:gap-[2px] fhd:gap-[2.67px]">
                {SOCIALS.map((social) => {
                  const Glyph = SOCIAL_ICONS[social.label];
                  return (
                    <li key={social.label}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        // The name says that the link opens a new tab (audit U-29).
                        aria-label={`${social.label} (opens in a new tab)`}
                        className={`flex items-center justify-center ${LINK_HOVER}`}
                      >
                        <Glyph className="h-[28.86px] w-[28.86px] lg:h-[38px] fhd:h-[50.67px] lg:w-[38px] fhd:w-[50.67px]" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
            <p className="font-body text-[12px] leading-[20px] lg:hidden">{COPYRIGHT}</p>
          </div>
        </div>

        {/* The anniversary band. Decorative. 1440 draws it 1388 wide, 2px in from
            each edge, and 64 under the bottom row (32 here plus the gap). */}
        <img
          src={ASSETS.footer.banner}
          alt=""
          aria-hidden="true"
          width={1792}
          height={215}
          className="h-auto w-full lg:mx-[2px] lg:mt-[32px] lg:w-[calc(100%-4px)] fhd:mx-[2.67px] fhd:mt-[42.67px] fhd:w-[calc(100%-5.33px)]"
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
        />
      </div>
    </Container>
  </footer>
);

export default Footer;
