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
  brochureDesign: `${BROCHURE_URL}/creative-tribe`,
  brochureTech: `${BROCHURE_URL}/it-craft`,
  brochureData: `${BROCHURE_URL}/crunch`,
  brochureCrunch: `${BROCHURE_URL}/analytics`,
} as const;

export type NavTarget =
  | { kind: 'section'; id: SectionId }
  | { kind: 'route'; to: string }
  | { kind: 'external'; href: string }
  | { kind: 'survey'; branch: SurveyBranch };

export interface NavItem {
  label: string;
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
 * The overlay menu, as one table. Built in step 1 against Figma node 3275:2328.
 */
export const MENU: NavItem[] = [
  { label: 'About Us', target: { kind: 'section', id: 'about' } },
  {
    label: 'Services',
    target: { kind: 'section', id: 'capabilities' },
    children: [
      { label: 'Design & Digital Experience', target: { kind: 'external', href: EXTERNAL.brochureDesign } },
      { label: 'Software & Web Development', target: { kind: 'external', href: EXTERNAL.brochureTech } },
      { label: 'Data Engineering & Processing', target: { kind: 'external', href: EXTERNAL.brochureData } },
      { label: 'Business Intelligence & Analytics', target: { kind: 'external', href: EXTERNAL.brochureCrunch } },
      {
        label: 'Rizlum',
        target: { kind: 'section', id: 'capabilities' },
        unresolved: 'No Rizlum page or brochure exists yet — destination pending from the team.',
      },
      {
        label: 'HR Services',
        target: { kind: 'section', id: 'capabilities' },
        unresolved: 'No HR Services destination exists yet — pending from the team.',
      },
      {
        label: 'ITS',
        target: { kind: 'section', id: 'capabilities' },
        unresolved: 'No ITS destination exists yet — pending from the team.',
      },
    ],
  },
  { label: 'Work', target: { kind: 'section', id: 'proven-results' } },
  { label: 'Career', target: { kind: 'external', href: EXTERNAL.career } },
];

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

/** Footer legal row. Figma omits Privacy Policy; kept for compliance. */
export const FOOTER_LEGAL: NavItem[] = [
  { label: 'Terms & Conditions', target: { kind: 'route', to: ROUTES.terms } },
  { label: 'Privacy Policy', target: { kind: 'route', to: ROUTES.privacy } },
];

/** Scrolls to a home-page section, honouring a reduced-motion preference. */
export const scrollToSection = (id: SectionId) => {
  const el = document.getElementById(id);
  if (!el) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
};
