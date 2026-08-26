import { useLocation, useNavigate } from 'react-router-dom';
import type { SurveyBranch } from '../types';

/** Routes served by the SPA. `vercel.json` rewrites every non-api path to index.html. */
export const ROUTES = {
  home: '/',
  terms: '/terms-of-use',
  privacy: '/privacy-policy',
} as const;

/**
 * Anchor targets on the home page. These ids are also the keys Vercel Analytics
 * records as `section_view`, so renaming one breaks continuity in the dashboard.
 */
export const SECTION_IDS = [
  'about',
  'capabilities',
  'approach',
  'proven-results',
  'clients',
  'why-us',
  'contact',
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

const BROCHURE_URL = 'https://demo.officience.com/brochure';

export const EXTERNAL = {
  career: 'https://www.linkedin.com/company/officience/jobs/',
  linkedin: 'https://www.linkedin.com/company/officience/',
  /** Where the footer's "About us" has always pointed. */
  about: 'https://demo.officience.com/',
  /** The catch-all brochure index behind "View All Brochure". */
  brochureIndex: BROCHURE_URL,
  // Named after the brochure slug, not the menu label — the menu calls the
  // analytics unit "Data" and the data-engineering unit "Crunch", which is the
  // opposite pairing to what the slugs suggest.
  brochureCreativeTribe: `${BROCHURE_URL}/creative-tribe`,
  brochureItCraft: `${BROCHURE_URL}/it-craft`,
  brochureAnalytics: `${BROCHURE_URL}/analytics`,
  brochureCrunch: `${BROCHURE_URL}/crunch`,
} as const;

export type NavTarget =
  | { kind: 'section'; id: SectionId }
  | { kind: 'route'; to: string }
  | { kind: 'external'; href: string }
  | { kind: 'survey'; branch: SurveyBranch };

export interface NavItem {
  label: string;
  /** Second line under a service label in the overlay menu. */
  description?: string;
  target: NavTarget;
  /**
   * Set when the design points somewhere that doesn't exist yet. The item still
   * renders and still goes somewhere sensible; this records what it's waiting on
   * so a placeholder can't quietly ship as if it were final.
   */
  unresolved?: string;
  children?: NavItem[];
}

/**
 * The overlay menu, in the order and wording Figma node 3275:2328 draws.
 *
 * The service children fill two columns down-then-across: items 0/2/4/6 in the
 * left column, 1/3/5 in the right.
 */
export const MENU: NavItem[] = [
  {
    label: 'Services',
    target: { kind: 'section', id: 'capabilities' },
    children: [
      {
        label: 'Design',
        description: 'Design & Digital Experience',
        target: { kind: 'external', href: EXTERNAL.brochureCreativeTribe },
      },
      {
        label: 'Tech',
        description: 'Software & Web Development',
        target: { kind: 'external', href: EXTERNAL.brochureItCraft },
      },
      {
        label: 'Data',
        description: 'Business Intelligence & Analytics',
        target: { kind: 'external', href: EXTERNAL.brochureAnalytics },
      },
      {
        label: 'Crunch',
        description: 'Data Engineering & Processing',
        target: { kind: 'external', href: EXTERNAL.brochureCrunch },
      },
      {
        label: 'Rizlum',
        description: 'Trusted AI for business',
        target: { kind: 'section', id: 'capabilities' },
        unresolved: 'No Rizlum destination exists yet — the team will supply one.',
      },
      {
        label: 'HR',
        description: 'People Operations',
        target: { kind: 'section', id: 'capabilities' },
        unresolved: 'No HR destination exists yet — the team will supply one.',
      },
      {
        label: 'ITS',
        description: 'Offy IT Super',
        target: { kind: 'section', id: 'capabilities' },
        unresolved: 'No ITS destination exists yet — the team will supply one.',
      },
    ],
  },
  { label: 'Work', target: { kind: 'section', id: 'proven-results' } },
  { label: 'Career', target: { kind: 'external', href: EXTERNAL.career } },
  { label: 'About Us', target: { kind: 'section', id: 'about' } },
];

/** Social links in the overlay menu footer, in the order Figma draws them. */
export const SOCIALS = [
  { label: 'LinkedIn', href: EXTERNAL.linkedin },
  { label: 'Facebook', href: 'https://www.facebook.com/Officience' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@officience' },
  { label: 'YouTube', href: 'https://www.youtube.com/@officienceinvietnam' },
] as const;

/** The About Us section's text link. */
export const DISCOVER_OUR_STORY: NavItem = {
  label: 'Discover Our Story',
  target: { kind: 'external', href: EXTERNAL.about },
  unresolved: 'No dedicated story page exists — points at the legacy about site for now.',
};

/** "View All Work" on the Proven Results deck. */
export const VIEW_ALL_WORK: NavItem = {
  label: 'View All Work',
  target: { kind: 'section', id: 'proven-results' },
  unresolved: 'There is no work archive page — destination pending from the team.',
};

/** Footer "Company" column. */
export const FOOTER_COMPANY: NavItem[] = [
  { label: 'About us', target: { kind: 'section', id: 'about' } },
  { label: 'Services', target: { kind: 'section', id: 'capabilities' } },
  { label: 'Work', target: { kind: 'section', id: 'proven-results' } },
  { label: 'Career', target: { kind: 'external', href: EXTERNAL.career } },
];

/**
 * Footer legal row. The Sept-2026 footer draws both entries and labels the first
 * "Terms of Use", where the July build said "Terms & Conditions" — the route is
 * unchanged, only the wording.
 */
export const FOOTER_LEGAL: NavItem[] = [
  { label: 'Terms of Use', target: { kind: 'route', to: ROUTES.terms } },
  { label: 'Privacy Policy', target: { kind: 'route', to: ROUTES.privacy } },
];

/** Scrolls to a home-page section, honouring a reduced-motion preference. */
export const scrollToSection = (id: SectionId) => {
  const el = document.getElementById(id);
  if (!el) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
};

/** A home-page section as a URL, for anything that has to work from another route. */
export const sectionHref = (id: SectionId) => `${ROUTES.home}#${id}`;

/**
 * Reaches a home-page section from wherever the reader currently is.
 *
 * `scrollToSection` alone only works on `/` — off the home page its
 * `getElementById` finds nothing and the click silently does nothing at all,
 * which is what the header CTA and the overlay menu's section items used to do
 * on the two legal routes. Away from home this navigates to `/#id` instead and
 * lets `ScrollManager` land the scroll once the page has mounted.
 */
export const useGoToSection = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (id: SectionId) => {
    if (pathname === ROUTES.home) scrollToSection(id);
    else navigate(sectionHref(id));
  };
};
